/**
 * Extension.ts
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */

import Caporal from 'caporal';
import Mongoose from 'mongoose';
import { MONGODB_CONFIG } from './Const';
import { Di, Extensions } from '@fastpanel/core';

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
    /* Register connection object. */
    this.di.set('db', (di: Di.Container) => {
      return Mongoose.connection;
    }, true);

    /* --------------------------------------------------------------------- */
    
    /* Registered cli commands. */
    this.events.once('cli:getCommands', (cli: Caporal) => {
      const { Seeds } = require('./Commands/Seeds');
      (new Seeds(this.di)).initialize();

      const { Setup } = require('./Commands/Setup');
      (new Setup(this.di)).initialize();
    });
  }
  
  /**
   * Startup a service provider.
   */
  async startup () : Promise<any> {
    /* Forming the connection address. */
    let url = "mongodb://"
    + (process.env.MONGODB_HOST)
    ? process.env.MONGODB_HOST
    : this.config.get('Ext/MongoDB.host', MONGODB_CONFIG.host)
    + ":" + (process.env.MONGODB_PORT)
    ? process.env.MONGODB_PORT
    : this.config.get('Ext/MongoDB.port', MONGODB_CONFIG.port);

    /* Connect to database. */
    await Mongoose.connect(url, {
      /*  */
      user: (process.env.MONGODB_USER)
      ? process.env.MONGODB_USER
      : this.config.get('Ext/MongoDB.user', MONGODB_CONFIG.user),
      /*  */
      pass: (process.env.MONGODB_PASS)
      ? process.env.MONGODB_PASS
      : this.config.get('Ext/MongoDB.pass', MONGODB_CONFIG.pass),
      /*  */
      dbName: (process.env.MONGODB_DBNAME)
      ? process.env.MONGODB_DBNAME
      : this.config.get('Ext/MongoDB.dbName', MONGODB_CONFIG.dbName),
      /*  */
      autoReconnect: (process.env.MONGODB_AUTO_RECONNECT)
      ? process.env.MONGODB_AUTO_RECONNECT
      : this.config.get('Ext/MongoDB.autoReconnect', MONGODB_CONFIG.autoReconnect),
      /*  */
      reconnectTries: (process.env.MONGODB_RECONNECT_TRIES)
      ? process.env.MONGODB_RECONNECT_TRIES
      : this.config.get('Ext/MongoDB.reconnectTries', MONGODB_CONFIG.reconnectTries),
      /*  */
      reconnectInterval: (process.env.MONGODB_RECONNECT_INTERVAL)
      ? process.env.MONGODB_RECONNECT_INTERVAL
      : this.config.get('Ext/MongoDB.reconnectInterval', MONGODB_CONFIG.reconnectInterval),
      /*  */
      poolSize: (process.env.MONGODB_POOL_SIZE)
      ? process.env.MONGODB_POOL_SIZE
      : this.config.get('Ext/MongoDB.poolSize', MONGODB_CONFIG.poolSize),
      /*  */
      promiseLibrary: global.Promise,
      useCreateIndex: true,
      useNewUrlParser: true
    });

    /* Fire event. */
    this.events.emit('db:getModels', this.db);
    this.events.emit('db:startup', this.db);
  }

}

/* End of file Extension.ts */