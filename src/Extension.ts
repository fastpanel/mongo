/**
 * Extension.ts
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */

import Vorpal from 'vorpal';
import MongoSE from 'mongoose';
import { MONGODB_CONFIG } from './Const';
import { Di, Extensions } from '@fastpanel/core';
import { SetupTaskDefinesMethod } from '@fastpanel/core/build/Commands';

/* Set mongoose options. */
MongoSE.Promise = global.Promise;

/**
 * Class Extension
 * 
 * Initialization of the extension.
 * 
 * @version 1.0.0
 */
export class Extension extends Extensions.ExtensionDefines {
  
  /**
   * Registers a service provider.
   */
  async register () : Promise<any> {
    /* Forming the connection address. */
    let url = "mongodb://"
    + this.config.get('Extensions/MongoDB.host', MONGODB_CONFIG.host)
    + ":" + this.config.get('Extensions/MongoDB.port', MONGODB_CONFIG.port);

    /* Connect to database. */
    await MongoSE.connect(url, {
      /*  */
      user              : this.config.get('Extensions/MongoDB.user', MONGODB_CONFIG.user),
      pass              : this.config.get('Extensions/MongoDB.pass', MONGODB_CONFIG.pass),
      dbName            : this.config.get('Extensions/MongoDB.dbName', MONGODB_CONFIG.dbName),
      /*  */
      autoReconnect     : this.config.get('Extensions/MongoDB.autoReconnect', MONGODB_CONFIG.autoReconnect),
      reconnectTries    : this.config.get('Extensions/MongoDB.reconnectTries', MONGODB_CONFIG.reconnectTries),
      reconnectInterval : this.config.get('Extensions/MongoDB.reconnectInterval', MONGODB_CONFIG.reconnectInterval),
      poolSize          : this.config.get('Extensions/MongoDB.poolSize', MONGODB_CONFIG.poolSize),
      /*  */
      promiseLibrary    : global.Promise,
      useCreateIndex    : true,
      useNewUrlParser   : true
    });

    /* Register connection object. */
    this.di.set('db', (di: Di.Container) => {
      return MongoSE.connection;
    }, true);

    /* --------------------------------------------------------------------- */
    
    /* Install and configure the basic components of the system. */
    this.events.on('app:getSetupTasks', async (list: Array<SetupTaskDefinesMethod>) => {
      list.push(async (command: Vorpal.CommandInstance) => {
        /* Check and create default config file. */
        if (!this.config.get('Extensions/MongoDB', false)) {
          this.config.set('Extensions/MongoDB', MONGODB_CONFIG);
          this.config.save('Extensions/MongoDB', true);
        }
      });
    });
    
    /* Registered cli commands. */
    this.events.once('cli:getCommands', async (cli: Vorpal) => {
      const { Seeds } = require('./Commands/Seeds');
      await (new Seeds(this.di)).initialize();
    });
  }
  
  /**
   * Startup a service provider.
   */
  async startup () : Promise<any> {
    /* Fire event. */
    this.events.emit('db:getModels', this.db);
    this.events.emit('db:startup', this.db);
  }

}

/* End of file Extension.ts */