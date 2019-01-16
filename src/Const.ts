/**
 * Const.ts
 * 
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2019 Desionlab
 * @license   MIT
 */

/**
 * Default mongodb config.
 */
export const MONGODB_CONFIG = {
  host              : "localhost",
  port              : 27017,
  user              : "",
  pass              : "",
  dbName            : "fastPanel",
  autoReconnect     : true,
  reconnectTries    : 9999,
  reconnectInterval : 500,
  poolSize          : 10
};

/* End of file Const.ts */