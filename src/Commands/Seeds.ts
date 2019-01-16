/**
 * Seeds.js
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */

import ora from 'ora';
import Winston from 'winston';
import { EOL } from 'os';
import { Cli } from "@fastpanel/core";
import { concat, trim, toLower } from 'lodash';

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
    .option('-d, --demo', 'Fill demo data.')
    .action((args: {[k: string]: any}, options: {[k: string]: any}, logger: Winston.Logger) => {
      return new Promise(async (resolve, reject) => {
        /* Get ext list. */
        let list = concat(['@fastpanel/core'], this.extensions.list);

        /* Info message. */
        let spinner = ora('Seeding database data...').start();

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

              /* Info message. */
              spinner.text = `Seeding data for: ${commandName}`;
            } catch (error) {
              /* Info message. */
              spinner.fail('Seeding error.');

              /* Stop command by error. */
              reject(error);
            }
          }
        }
        
        /* Info message. */
        spinner.succeed('Seeding complete.');

        /* Command complete. */
        resolve();
      });
    });
  }

}

/* End of file Seeds.js */