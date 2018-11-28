/**
 * Seeds.js
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */

import { Cli } from "fastpanel-core";

/**
 * 
 */
export class Seeds extends Cli.CommandDefines {
  
  /**
   * Initialize a commands provider.
   */
  async initialize () : Promise<any> {
    this.cli
    .command('seeds', 'Seeding database test data.')
    .action((args: any) => {
      return new Promise((resolve, reject) => {
        this.events.emit('db:seeds', this.db);
        resolve();
      });
    });
  }

}

/* End of file Seeds.js */