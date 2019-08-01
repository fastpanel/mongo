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
    /* Check config. */
    if (this.config.get('Ext/MongoDB', false) ||
      this.config.get('Env.MONGODB_HOST', false)) {
      /* Register connection object. */
      this.di.set('db', (di: Di.Container) => {
        return Mongoose.connection;
      }, true);
    } else {
      this.logger.warn('Component "MongoDB" is not configured correctly!');
    }

    /* --------------------------------------------------------------------- */
    
    /* Registered cli commands. */
    this.events.once('cli:getCommands', (cli: Caporal) => {
      /* Add setup command. */
      const { Setup } = require('./Commands/Setup');
      (new Setup(this.di)).initialize();

      /* Check config. */
      if (this.config.get('Ext/MongoDB', false) ||
        this.config.get('Env.MONGODB_HOST', false)) {
        /* Add seeds command. */
        const { Seeds } = require('./Commands/Seeds');
        (new Seeds(this.di)).initialize();
      }
    });
  }
  
  /**
   * Startup a service provider.
   */
  async startup () : Promise<any> {
    /* Check config. */
    if (this.config.get('Ext/MongoDB', false) ||
      this.config.get('Env.MONGODB_HOST', false)) {
      /* Forming the connection address. */
      let url = "mongodb://"
      + this.config.get('Env.MONGODB_HOST', this.config.get('Ext/MongoDB.host', MONGODB_CONFIG.host))
      + ":" + this.config.get('Env.MONGODB_PORT', this.config.get('Ext/MongoDB.port', MONGODB_CONFIG.port));

      /* Connect to database. */
      await Mongoose.connect(url, {
        user: this.config.get('Env.MONGODB_USER', this.config.get('Ext/MongoDB.user', MONGODB_CONFIG.user)),
        pass: this.config.get('Env.MONGODB_PASS', this.config.get('Ext/MongoDB.pass', MONGODB_CONFIG.pass)),
        dbName: this.config.get('Env.MONGODB_DBNAME', this.config.get('Ext/MongoDB.dbName', MONGODB_CONFIG.dbName)),
        autoReconnect: this.config.get('Env.MONGODB_AUTO_RECONNECT', this.config.get('Ext/MongoDB.autoReconnect', MONGODB_CONFIG.autoReconnect)),
        reconnectTries: this.config.get('Env.MONGODB_RECONNECT_TRIES', this.config.get('Ext/MongoDB.reconnectTries', MONGODB_CONFIG.reconnectTries)),
        reconnectInterval: this.config.get('Env.MONGODB_RECONNECT_INTERVAL', this.config.get('Ext/MongoDB.reconnectInterval', MONGODB_CONFIG.reconnectInterval)),
        poolSize: this.config.get('Env.MONGODB_POOL_SIZE', this.config.get('Ext/MongoDB.poolSize', MONGODB_CONFIG.poolSize)),
        useCreateIndex: true,
        useNewUrlParser: true
      });

      /* Fire event. */
      this.events.emit('db:getModels', this.db);
      this.events.emit('db:startup', this.db);
    }
  }

}

/* End of file Extension.ts */