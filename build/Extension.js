"use strict";
/**
 * Extension.ts
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fastpanel_core_1 = require("fastpanel-core");
/* Set mongoose options. */
mongoose_1.default.Promise = global.Promise;
/**
 * Class Extension
 *
 * Initialization of the extension.
 *
 * @version 1.0.0
 */
class Extension extends fastpanel_core_1.Extensions.ExtensionDefines {
    /**
     * Registers a service provider.
     */
    async register() {
        /* Forming the connection address. */
        let url = "mongodb://"
            + this.config.get('Extensions/MongoDB.host', '127.0.0.1')
            + ":" + this.config.get('Extensions/MongoDB.port', 27017);
        /* Connect to database. */
        await mongoose_1.default.connect(url, {
            /*  */
            user: this.config.get('Extensions/MongoDB.user', null),
            pass: this.config.get('Extensions/MongoDB.pass', null),
            dbName: this.config.get('Extensions/MongoDB.dbName', 'fastPanel'),
            /*  */
            autoReconnect: this.config.get('Extensions/MongoDB.autoReconnect', true),
            reconnectTries: this.config.get('Extensions/MongoDB.reconnectTries', Number.MAX_VALUE),
            reconnectInterval: this.config.get('Extensions/MongoDB.reconnectInterval', 500),
            poolSize: this.config.get('Extensions/MongoDB.poolSize', 10),
            /*  */
            promiseLibrary: global.Promise,
            useCreateIndex: true,
            useNewUrlParser: true
        });
        /* Register connection object. */
        this.di.set('db', (di) => {
            return mongoose_1.default.connection;
        }, true);
        /* Registered cli commands. */
        this.events.once('cli:getCommands', async (cli) => {
            /* Registered seeding database test data command. */
            const { Seeds } = require('./Commands/Seeds');
            await (new Seeds(this.di)).initialize();
        });
    }
    /**
     * Startup a service provider.
     */
    async startup() {
        /* Fire event. */
        this.events.emit('db:getModels', this.db);
        this.events.emit('db:startup', this.db);
    }
}
exports.Extension = Extension;
/* End of file Extension.ts */ 
