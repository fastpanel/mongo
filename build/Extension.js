"use strict";
/**
 * Extension.ts
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
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
        /* Register connection object. */
        this.di.set('db', (di) => {
            return mongoose_1.default.connection;
        }, true);
        /* --------------------------------------------------------------------- */
        /* Registered cli commands. */
        this.events.once('cli:getCommands', (cli) => {
            const { Seeds } = require('./Commands/Seeds');
            (new Seeds(this.di)).initialize();
            const { Setup } = require('./Commands/Setup');
            (new Setup(this.di)).initialize();
        });
    }
    /**
     * Startup a service provider.
     */
    async startup() {
        /* Forming the connection address. */
        let url = "mongodb://"
            + (process.env.MONGODB_HOST)
            ? process.env.MONGODB_HOST
            : this.config.get('Ext/MongoDB.host', Const_1.MONGODB_CONFIG.host)
                + ":" + (process.env.MONGODB_PORT)
                ? process.env.MONGODB_PORT
                : this.config.get('Ext/MongoDB.port', Const_1.MONGODB_CONFIG.port);
        /* Connect to database. */
        await mongoose_1.default.connect(url, {
            /*  */
            user: (process.env.MONGODB_USER)
                ? process.env.MONGODB_USER
                : this.config.get('Ext/MongoDB.user', Const_1.MONGODB_CONFIG.user),
            /*  */
            pass: (process.env.MONGODB_PASS)
                ? process.env.MONGODB_PASS
                : this.config.get('Ext/MongoDB.pass', Const_1.MONGODB_CONFIG.pass),
            /*  */
            dbName: (process.env.MONGODB_DBNAME)
                ? process.env.MONGODB_DBNAME
                : this.config.get('Ext/MongoDB.dbName', Const_1.MONGODB_CONFIG.dbName),
            /*  */
            autoReconnect: (process.env.MONGODB_AUTO_RECONNECT)
                ? process.env.MONGODB_AUTO_RECONNECT
                : this.config.get('Ext/MongoDB.autoReconnect', Const_1.MONGODB_CONFIG.autoReconnect),
            /*  */
            reconnectTries: (process.env.MONGODB_RECONNECT_TRIES)
                ? process.env.MONGODB_RECONNECT_TRIES
                : this.config.get('Ext/MongoDB.reconnectTries', Const_1.MONGODB_CONFIG.reconnectTries),
            /*  */
            reconnectInterval: (process.env.MONGODB_RECONNECT_INTERVAL)
                ? process.env.MONGODB_RECONNECT_INTERVAL
                : this.config.get('Ext/MongoDB.reconnectInterval', Const_1.MONGODB_CONFIG.reconnectInterval),
            /*  */
            poolSize: (process.env.MONGODB_POOL_SIZE)
                ? process.env.MONGODB_POOL_SIZE
                : this.config.get('Ext/MongoDB.poolSize', Const_1.MONGODB_CONFIG.poolSize),
            /*  */
            promiseLibrary: global.Promise,
            useCreateIndex: true,
            useNewUrlParser: true
        });
        /* Fire event. */
        this.events.emit('db:getModels', this.db);
        this.events.emit('db:startup', this.db);
    }
}
exports.Extension = Extension;
/* End of file Extension.ts */ 
