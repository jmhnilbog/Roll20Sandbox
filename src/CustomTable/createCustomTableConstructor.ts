import {
    CustomTableParser,
    CustomTableGetter,
    CustomTableInterface,
    CustomTableConstructor,
} from "./types";

import { Logger } from "../Logger";
import { Roll20ObjectInterface, Id } from "../Roll20Object";
import { Sandbox } from "../Roll20Sandbox";
import getTopLevelScope from "../util/getTopLevelScope";

/**
 * Creates a typed CustomTable constructor.
 *
 * NOTE: while you can use this without a supplied sandbox object, it is only guaranteed
 * to actually work within the actual Roll20 sandbox environment.
 */
export const createCustomTableConstructor = <T, K>({
    parser,
    getter,
    sandbox,
    logger,
}: {
    parser: CustomTableParser<T>;
    getter: CustomTableGetter<T, K>;
    sandbox?: Sandbox;
    logger?: Logger;
}) => {
    const _instances = {} as Record<string, CustomTableInterface<T>>;
    const CustomTable = class CustomTable implements CustomTableInterface<T> {
        private _rollabletableid: Id;

        static getTable(
            table: Roll20ObjectInterface<"rollabletable">,
            options: any = {}
        ) {
            logger?.trace(`getTable(${table.id}, ${options})`);
            const key = `${table.get("name")}_${JSON.stringify(options)}`;
            if (!_instances[key]) {
                _instances[key] = new CustomTable(table, options);
            }
            return _instances[key];
        }

        /**
         * @param table - a rollabletable object 'backing' this table.
         * @param options - options specific to the parser/getters.
         */
        constructor(
            table: Roll20ObjectInterface<"rollabletable">,
            options: any = {}
        ) {
            logger?.trace(`constructor(${table.id}, ${options})`);
            this._rollabletableid = table.id as Id;
        }
        /**
         * Get all custom table items as understood by the supplied parser.
         */
        getAllItems() {
            logger?.trace(`getAllItems()`);
            const { findObjs } = sandbox || getTopLevelScope();
            if (!findObjs) {
                throw new Error(`No findObjs() function found.`);
            }
            const rawTableItems: Roll20ObjectInterface<"tableitem">[] = findObjs(
                {
                    _type: "tableitem",
                    _rollabletableid: this._rollabletableid,
                }
            );
            return rawTableItems.map(parser);
        }
        /**
         *
         * @param key  - a key as interpreted by the supplied getter.
         */
        getAtKey(key: K): T[] {
            logger?.trace(`getAtKey(${key})`);
            const picked = getter(this.getAllItems(), key);
            logger?.trace(`getAtKey(${key}): ${picked}`);
            return picked;
        }
    };
    return CustomTable as CustomTableConstructor<T>;
};

export default createCustomTableConstructor;
