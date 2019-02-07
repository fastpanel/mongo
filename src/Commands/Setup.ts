/**
 * Setup.js
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */

import Winston from 'winston';
import { EOL } from 'os';
import { Cli } from '@fastpanel/core';
import { MONGODB_CONFIG } from '../Const';

/**
 * Class Setup
 * 
 * @version 1.0.0
 */
export class Setup extends Cli.CommandDefines {
  
  /**
   * Initialize a commands provider.
   */
  public initialize () {
    this.cli
    .command('fastpanel/mongo setup', 'Configure mongo components.')
    .option('-e, --env', 'Save as current environment settings.')
    .option('-f, --force', 'Forced reconfiguration of components.')
    .visible(false)
    .action((args: {[k: string]: any}, options: {[k: string]: any}, logger: Winston.Logger) => {
      return new Promise(async (resolve, reject) => {
        /* Info message. */
        logger.info(`${EOL}Configure mongo components.`);

        if (!this.config.get('Ext/MongoDB', false) || options.force) {
          /* Prompts list. */
          let questions = [
            /* Host. */
            {
              type: 'input',
              name: 'host',
              message: 'MongoDB host?',
              default: this.config.get('Ext/MongoDB.host', MONGODB_CONFIG.host)
            },
            /* Port. */
            {
              type: 'input',
              name: 'port',
              message: 'MongoDB port?',
              default: this.config.get('Ext/MongoDB.port', MONGODB_CONFIG.port)
            },
            /* User. */
            {
              type: 'input',
              name: 'user',
              message: 'MongoDB user?',
              default: this.config.get('Ext/MongoDB.user', MONGODB_CONFIG.user)
            },
            /* Password. */
            {
              type: 'input',
              name: 'pass',
              message: 'MongoDB password?',
              default: this.config.get('Ext/MongoDB.pass', MONGODB_CONFIG.pass)
            },
            /* Db name. */
            {
              type: 'input',
              name: 'dbName',
              message: 'MongoDB database name?',
              default: this.config.get('Ext/MongoDB.dbName', MONGODB_CONFIG.dbName)
            },
            /* Auto reconnect. */
            {
              type: 'confirm',
              name: 'autoReconnect',
              message: 'MongoDB connection auto reconnect?',
              default: this.config.get('Ext/MongoDB.autoReconnect', MONGODB_CONFIG.autoReconnect)
            },
            /* Reconnect tries. */
            {
              type: 'input',
              name: 'reconnectTries',
              message: 'MongoDB connection reconnect tries?',
              default: this.config.get('Ext/MongoDB.reconnectTries', MONGODB_CONFIG.reconnectTries)
            },
            /* Reconnect interval. */
            {
              type: 'input',
              name: 'reconnectInterval',
              message: 'MongoDB connection reconnect interval?',
              default: this.config.get('Ext/MongoDB.reconnectInterval', MONGODB_CONFIG.reconnectInterval)
            },
            /* Pool size. */
            {
              type: 'input',
              name: 'poolSize',
              message: 'MongoDB connection pool size?',
              default: this.config.get('Ext/MongoDB.poolSize', MONGODB_CONFIG.poolSize)
            }
          ];

          /* Show prompts to user. */
          let config = await this.prompt(questions);
          
          /* Save data. */
          this.config.set('Ext/MongoDB', config);
          this.config.save('Ext/MongoDB', !(options.env));

          /* Info message. */
          logger.info(`${EOL}Applied:`);
          logger.info('', this.config.get('Ext/MongoDB'));
        } else {
          /* Info message. */
          logger.info(` Everything is already configured. ${EOL}`);
        }

        /* Command complete. */
        resolve();
      });
    });
  }

}

/* End of file Setup.js */