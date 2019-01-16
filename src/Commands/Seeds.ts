/**
 * Seeds.js
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */

import Winston from 'winston';
import { Cli } from "@fastpanel/core";
import { concat, trim, toLower, merge } from 'lodash';

/**
 * 
 */
export class Seeds extends Cli.CommandDefines {
  
  /**
   * Initialize a commands provider.
   */
  public initialize () {
    this.cli
    .command('mongo seeds', 'Seeding database data.')
    .option('-f, --fresh', 'Clear the base before filling.')
    .action((args: {[k: string]: any}, options: {[k: string]: any}, logger: Winston.Logger) => {
      return new Promise(async (resolve, reject) => {
        /* Get ext list. */
        let list = concat(['@fastpanel/core'], this.extensions.list);

        /* Find and run commands. */
        for (const name of list) {
          /* Clear ext name. */
          let clearName = toLower(trim(name, './\\@'));
          let commandName = `${clearName} seeds`;

          /* Find command by name. */
          if (
            this.cli.getCommands().filter(
              (c: any) => (c.name() === commandName || c.getAlias() === commandName)
            )[0]
          ) {
            try {
              /* Run command. */
              await this.cli.exec(
                [commandName],
                options
              );
            } catch (error) {
              /* Stop command by error. */
              reject(error);
            }
          }
        }
        
        /* Command complete. */
        resolve();
      });
    });
  }

}

/* End of file Seeds.js */