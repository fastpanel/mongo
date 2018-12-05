"use strict";
/**
 * Seeds.js
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const progress_1 = __importDefault(require("progress"));
const core_1 = require("@fastpanel/core");
/**
 *
 */
class Seeds extends core_1.Cli.CommandDefines {
    /**
     * Initialize a commands provider.
     */
    async initialize() {
        this.cli
            .command('db seeds', 'Seeding database data.')
            .action((args) => {
            return new Promise(async (resolve, reject) => {
                let list = [];
                this.events.emit('db:getSeedsTasks', list);
                let bar = new progress_1.default(' :bar :percent :etas ', {
                    complete: '\u25A0',
                    incomplete: ' ',
                    width: 60,
                    total: list.length
                });
                for (const task of list) {
                    if (task instanceof Promise) {
                        try {
                            await task;
                        }
                        catch (error) {
                            this.cli.log(error);
                        }
                    }
                    bar.tick();
                }
                resolve();
            });
        });
    }
}
exports.Seeds = Seeds;
/* End of file Seeds.js */ 
