/**
 * Seeds.js
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2014 - 2018 Desionlab
 * @license   MIT
 */
import { CommandInstance } from "vorpal";
import { Cli } from "@fastpanel/core";
/**
 * Definition method a resolve setup task.
 */
export declare type SeedsTaskDefinesMethod = (command: CommandInstance, args?: any) => Promise<any>;
/**
 *
 */
export declare class Seeds extends Cli.CommandDefines {
    /**
     * Initialize a commands provider.
     */
    initialize(): Promise<any>;
}
