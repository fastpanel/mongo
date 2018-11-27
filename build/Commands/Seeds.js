"use strict";
/**
 * Seeds.js
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fastpanel_core_1 = require("fastpanel-core");
/**
 *
 */
class Seeds extends fastpanel_core_1.Cli.CommandDefines {
    /**
     * Initialize a commands provider.
     */
    initialize() {
        this.cli
            .command('seeds', 'Seeding database test data.')
            .action((args) => {
            return new Promise((resolve, reject) => {
                this.events.emit('db:seeds', this.db);
                resolve();
            });
        });
    }
}
exports.Seeds = Seeds;
/* End of file Seeds.js */ 
