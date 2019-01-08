/**
 * Extension.ts
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */

import Vorpal from 'vorpal';
import Mongoose from 'mongoose';
import { MONGODB_CONFIG } from './Const';
import { Cli, Di, Extensions } from '@fastpanel/core';

/* Set mongoose options. */
Mongoose.Promise = global.Promise;

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
    + this.config.get('Ext/MongoDB.host', MONGODB_CONFIG.host)
    + ":" + this.config.get('Ext/MongoDB.port', MONGODB_CONFIG.port);

    /* Connect to database. */
    await Mongoose.connect(url, {
      /*  */
      user              : this.config.get('Ext/MongoDB.user', MONGODB_CONFIG.user),
      pass              : this.config.get('Ext/MongoDB.pass', MONGODB_CONFIG.pass),
      dbName            : this.config.get('Ext/MongoDB.dbName', MONGODB_CONFIG.dbName),
      /*  */
      autoReconnect     : this.config.get('Ext/MongoDB.autoReconnect', MONGODB_CONFIG.autoReconnect),
      reconnectTries    : this.config.get('Ext/MongoDB.reconnectTries', MONGODB_CONFIG.reconnectTries),
      reconnectInterval : this.config.get('Ext/MongoDB.reconnectInterval', MONGODB_CONFIG.reconnectInterval),
      poolSize          : this.config.get('Ext/MongoDB.poolSize', MONGODB_CONFIG.poolSize),
      /*  */
      promiseLibrary    : global.Promise,
      useCreateIndex    : true,
      useNewUrlParser   : true
    });

    /* Register connection object. */
    this.di.set('db', (di: Di.Container) => {
      return Mongoose.connection;
    }, true);

    /* --------------------------------------------------------------------- */
    
    /* Registered cli commands. */
    this.events.once('cli:getCommands', async (cli: Vorpal) => {
      const { Seeds } = require('./Commands/Seeds');
      await (new Seeds(this.di)).initialize();
    });

    /* Install and configure the basic components of the system. */
    this.events.on('app:getSetupSubscriptions', (list: Array<Cli.CommandSubscriptionDefines>) => {
      list.push(async (command: Vorpal.CommandInstance, args?: any) => {
        /* Check and create default config file. */
        if (!this.config.get('Ext/MongoDB', false)) {
          this.config.set('Ext/MongoDB', MONGODB_CONFIG);
          this.config.save('Ext/MongoDB', true);
        }
      });
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