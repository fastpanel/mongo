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
const Const_1 = require("./Const");
const core_1 = require("@fastpanel/core");
/* Set mongoose options. */
mongoose_1.default.Promise = global.Promise;
/**
 * Class Extension
 *
 * Initialization of the extension.
 *
 * @version 1.0.0
 */
class Extension extends core_1.Extensions.ExtensionDefines {
    /**
     * Registers a service provider.
     */
    async register() {
        /* Forming the connection address. */
        let url = "mongodb://"
            + this.config.get('Extensions/MongoDB.host', Const_1.MONGODB_CONFIG.host)
            + ":" + this.config.get('Extensions/MongoDB.port', Const_1.MONGODB_CONFIG.port);
        /* Connect to database. */
        await mongoose_1.default.connect(url, {
            /*  */
            user: this.config.get('Extensions/MongoDB.user', Const_1.MONGODB_CONFIG.user),
            pass: this.config.get('Extensions/MongoDB.pass', Const_1.MONGODB_CONFIG.pass),
            dbName: this.config.get('Extensions/MongoDB.dbName', Const_1.MONGODB_CONFIG.dbName),
            /*  */
            autoReconnect: this.config.get('Extensions/MongoDB.autoReconnect', Const_1.MONGODB_CONFIG.autoReconnect),
            reconnectTries: this.config.get('Extensions/MongoDB.reconnectTries', Const_1.MONGODB_CONFIG.reconnectTries),
            reconnectInterval: this.config.get('Extensions/MongoDB.reconnectInterval', Const_1.MONGODB_CONFIG.reconnectInterval),
            poolSize: this.config.get('Extensions/MongoDB.poolSize', Const_1.MONGODB_CONFIG.poolSize),
            /*  */
            promiseLibrary: global.Promise,
            useCreateIndex: true,
            useNewUrlParser: true
        });
        /* Register connection object. */
        this.di.set('db', (di) => {
            return mongoose_1.default.connection;
        }, true);
        /* --------------------------------------------------------------------- */
        /* Install and configure the basic components of the system. */
        this.events.on('app:getSetupTasks', async () => {
            /* Check and create default config file. */
            if (!this.config.get('Extensions/MongoDB', false)) {
                this.config.set('Extensions/MongoDB', Const_1.MONGODB_CONFIG);
                this.config.save('Extensions/MongoDB', true);
            }
        });
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
