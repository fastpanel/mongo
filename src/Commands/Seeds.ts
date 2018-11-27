/**
 * Seeds.js
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */

import { CommandDefines } from "fastpanel-core/build/Cli";

/**
 * 
 */
export class Seeds extends CommandDefines {
  
  /**
   * Initialize a commands provider.
   */
  initialize () : void  {
    this.cli
    .command('seeds', 'Seeding database test data.')
    .action((args: any) => {
      this.events.emit('db:seeds', this.db);
    });
  }

}

/* End of file Seeds.js */