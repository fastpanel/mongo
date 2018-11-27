"use strict";
/**
 * Seeds.js
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Cli_1 = require("fastpanel-core/build/Cli");
/**
 *
 */
class Seeds extends Cli_1.CommandDefines {
    /**
     * Initialize a commands provider.
     */
    initialize() {
        this.cli
            .command('seeds', 'Seeding database test data.')
            .action((args, callback) => {
            this.events.emit('db:seeds', this.db);
        });
    }
}
exports.Seeds = Seeds;
/* End of file Seeds.js */ 
