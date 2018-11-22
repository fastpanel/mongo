/**
 * Extension.ts
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */

import MongoSE from 'mongoose';
import { Di, Extensions } from 'fastpanel-core';

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
    + this.config.get('Extensions/MongoDB.host', '127.0.0.1')
    + ":" + this.config.get('Extensions/MongoDB.port', 27017);

    /* Connect to database. */
    await MongoSE.connect(url, {
      /*  */
      user              : this.config.get('Extensions/MongoDB.user', null),
      pass              : this.config.get('Extensions/MongoDB.pass', null),
      dbName            : this.config.get('Extensions/MongoDB.dbName', 'fastPanel'),
      /*  */
      autoReconnect     : this.config.get('Extensions/MongoDB.autoReconnect', true),
      reconnectTries    : this.config.get('Extensions/MongoDB.reconnectTries', Number.MAX_VALUE),
      reconnectInterval : this.config.get('Extensions/MongoDB.reconnectInterval', 500),
      poolSize          : this.config.get('Extensions/MongoDB.poolSize', 10),
      /*  */
      promiseLibrary    : global.Promise,
      useNewUrlParser   : true
    });

    /* Register connection object. */
    this.di.set('db', (container: Di.Container) => {
      return MongoSE.connection;
    }, true);
  }
  
  /**
   * Startup a service provider.
   */
  async startup () : Promise<any> {
    /* Fire db startup event. */
    this.events.emit('db:startup');
  }

}

/* End of file Extension.ts */