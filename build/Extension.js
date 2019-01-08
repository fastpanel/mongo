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
            + this.config.get('Ext/MongoDB.host', Const_1.MONGODB_CONFIG.host)
            + ":" + this.config.get('Ext/MongoDB.port', Const_1.MONGODB_CONFIG.port);
        /* Connect to database. */
        await mongoose_1.default.connect(url, {
            /*  */
            user: this.config.get('Ext/MongoDB.user', Const_1.MONGODB_CONFIG.user),
            pass: this.config.get('Ext/MongoDB.pass', Const_1.MONGODB_CONFIG.pass),
            dbName: this.config.get('Ext/MongoDB.dbName', Const_1.MONGODB_CONFIG.dbName),
            /*  */
            autoReconnect: this.config.get('Ext/MongoDB.autoReconnect', Const_1.MONGODB_CONFIG.autoReconnect),
            reconnectTries: this.config.get('Ext/MongoDB.reconnectTries', Const_1.MONGODB_CONFIG.reconnectTries),
            reconnectInterval: this.config.get('Ext/MongoDB.reconnectInterval', Const_1.MONGODB_CONFIG.reconnectInterval),
            poolSize: this.config.get('Ext/MongoDB.poolSize', Const_1.MONGODB_CONFIG.poolSize),
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
        /* Registered cli commands. */
        this.events.once('cli:getCommands', async (cli) => {
            const { Seeds } = require('./Commands/Seeds');
            await (new Seeds(this.di)).initialize();
        });
        /* Install and configure the basic components of the system. */
        this.events.on('app:getSetupSubscriptions', (list) => {
            list.push(async (command, args) => {
                /* Check and create default config file. */
                if (!this.config.get('Ext/MongoDB', false)) {
                    this.config.set('Ext/MongoDB', Const_1.MONGODB_CONFIG);
                    this.config.save('Ext/MongoDB', true);
                }
            });
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
