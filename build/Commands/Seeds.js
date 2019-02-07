"use strict";
/**
 * Seeds.js
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
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
            .option('-d, --demo', 'Fill demo data.')
            .action((args, options, logger) => {
            return new Promise(async (resolve, reject) => {
                /* Get ext list. */
                let list = lodash_1.concat(['@fastpanel/core'], this.extensions.list);
                /* Info message. */
                let spinner = ora_1.default('Seeding database data...').start();
                /* Find and run commands. */
                for (const name of list) {
                    /* Clear ext name. */
                    let clearName = lodash_1.toLower(lodash_1.trim(name, './\\@'));
                    let commandName = `${clearName} seeds`;
                    /* Find command by name. */
                    if (this.cli.getCommands().filter((c) => (c.name() === commandName || c.getAlias() === commandName))[0]) {
                        try {
                            /* Info message. */
                            spinner.text = `Seeding data for: ${commandName}`;
                            /* Run command. */
                            await this.cli.exec([commandName], options);
                        }
                        catch (error) {
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
exports.Seeds = Seeds;
/* End of file Seeds.js */ 
