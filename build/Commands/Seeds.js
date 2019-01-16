"use strict";
/**
 * Seeds.js
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@fastpanel/core");
const lodash_1 = require("lodash");
/**
 *
 */
class Seeds extends core_1.Cli.CommandDefines {
    /**
     * Initialize a commands provider.
     */
    initialize() {
        this.cli
            .command('mongo seeds', 'Seeding database data.')
            .option('-f, --fresh', 'Clear the base before filling.')
            .action((args, options, logger) => {
            return new Promise(async (resolve, reject) => {
                /* Get ext list. */
                let list = lodash_1.concat(['@fastpanel/core'], this.extensions.list);
                /* Find and run commands. */
                for (const name of list) {
                    /* Clear ext name. */
                    let clearName = lodash_1.toLower(lodash_1.trim(name, './\\@'));
                    let commandName = `${clearName} seeds`;
                    /* Find command by name. */
                    if (this.cli.getCommands().filter((c) => (c.name() === commandName || c.getAlias() === commandName))[0]) {
                        try {
                            /* Run command. */
                            await this.cli.exec([commandName], options);
                        }
                        catch (error) {
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
exports.Seeds = Seeds;
/* End of file Seeds.js */ 
