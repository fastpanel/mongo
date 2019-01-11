"use strict";
/**
 * Seeds.js
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@fastpanel/core");
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
                logger.debug('mongo seeds');
                logger.debug(args);
                logger.debug(options);
                resolve();
            });
        });
    }
}
exports.Seeds = Seeds;
/* End of file Seeds.js */ 
