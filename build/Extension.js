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
        /* Check config. */
        if (this.config.get('Ext/MongoDB', false) ||
            this.config.get('Env.MONGODB_HOST', false)) {
            /* Register connection object. */
            this.di.set('db', (di) => {
                return mongoose_1.default.connection;
            }, true);
        }
        else {
            this.logger.warn('Component "MongoDB" is not configured correctly!');
        }
        /* --------------------------------------------------------------------- */
        /* Registered cli commands. */
        this.events.once('cli:getCommands', (cli) => {
            /* Add setup command. */
            const { Setup } = require('./Commands/Setup');
            (new Setup(this.di)).initialize();
            /* Check config. */
            if (this.config.get('Ext/MongoDB', false) ||
                this.config.get('Env.MONGODB_HOST', false)) {
                /* Add seeds command. */
                const { Seeds } = require('./Commands/Seeds');
                (new Seeds(this.di)).initialize();
            }
        });
    }
    /**
     * Startup a service provider.
     */
    async startup() {
        /* Check config. */
        if (this.config.get('Ext/MongoDB', false) ||
            this.config.get('Env.MONGODB_HOST', false)) {
            /* Forming the connection address. */
            let url = "mongodb://"
                + this.config.get('Env.MONGODB_HOST', this.config.get('Ext/MongoDB.host', Const_1.MONGODB_CONFIG.host))
                + ":" + this.config.get('Env.MONGODB_PORT', this.config.get('Ext/MongoDB.port', Const_1.MONGODB_CONFIG.port));
            /* Connect to database. */
            await mongoose_1.default.connect(url, {
                user: this.config.get('Env.MONGODB_USER', this.config.get('Ext/MongoDB.user', Const_1.MONGODB_CONFIG.user)),
                pass: this.config.get('Env.MONGODB_PASS', this.config.get('Ext/MongoDB.pass', Const_1.MONGODB_CONFIG.pass)),
                dbName: this.config.get('Env.MONGODB_DBNAME', this.config.get('Ext/MongoDB.dbName', Const_1.MONGODB_CONFIG.dbName)),
                autoReconnect: this.config.get('Env.MONGODB_AUTO_RECONNECT', this.config.get('Ext/MongoDB.autoReconnect', Const_1.MONGODB_CONFIG.autoReconnect)),
                reconnectTries: this.config.get('Env.MONGODB_RECONNECT_TRIES', this.config.get('Ext/MongoDB.reconnectTries', Const_1.MONGODB_CONFIG.reconnectTries)),
                reconnectInterval: this.config.get('Env.MONGODB_RECONNECT_INTERVAL', this.config.get('Ext/MongoDB.reconnectInterval', Const_1.MONGODB_CONFIG.reconnectInterval)),
                poolSize: this.config.get('Env.MONGODB_POOL_SIZE', this.config.get('Ext/MongoDB.poolSize', Const_1.MONGODB_CONFIG.poolSize)),
                useCreateIndex: true,
                useNewUrlParser: true
            });
            /* Fire event. */
            this.events.emit('db:getModels', this.db);
            this.events.emit('db:startup', this.db);
        }
    }
}
exports.Extension = Extension;
/* End of file Extension.ts */ 
