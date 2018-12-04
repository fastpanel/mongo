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
    async initialize() {
        this.cli
            .command('db seeds', 'Seeding database data.')
            .action((args) => {
            return new Promise(async (resolve, reject) => {
                /*  */
                let list = [];
                /*  */
                this.events.emit('db:getSeedsTasks', this.db, list);
                /*  */
                for (const task of list) {
                    if (task instanceof Promise) {
                        try {
                            await task;
                        }
                        catch (error) {
                            this.cli.log(error);
                        }
                    }
                }
                resolve();
            });
        });
    }
}
exports.Seeds = Seeds;
/* End of file Seeds.js */ 
