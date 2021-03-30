import createCustomTableConstructor from "./createCustomTableConstructor";
import { KeyedTableItem, KeyedTableItemKey } from "./types";

import { Logger } from "../Logger";
import { Id } from "../Roll20Object";
import { Sandbox } from "../Roll20Sandbox";

/**
 * Creates a KeyedTable constructor.
 */
export const createKeyedTableConstructor = ({
    sandbox,
    logger,
}: {
    sandbox?: Sandbox;
    logger?: Logger;
} = {}) => {
    const KeyedTable = createCustomTableConstructor<
        KeyedTableItem,
        KeyedTableItemKey
    >({
        logger,
        sandbox,
        /**
         * The KeyedTable parser splits a TableItem's name by the first
         * instance of the supplied delimiter, into a key ("key")
         * and a string ("result").
         * @param obj - a tableitem
         * @param index - the index at which the tableitem was found within the associated table.
         * @param options.delimiter - a string, which must be escaped for RegExps.
         */
        parser: (
            obj,
            index,
            {
                delimiter = "=",
            }: {
                delimiter?: string;
            } = {}
        ) => {
            logger?.trace(
                `parser(${JSON.stringify(
                    obj
                )}, ${index}, { delimiter: ${delimiter} })`
            );
            const weight = obj.get("weight");
            const name = obj.get("name");
            const tmp = new RegExp(`^(.+?)${delimiter}(.+)$`).exec(name);
            const [key, result] = tmp ? [tmp[1], tmp[2]] : ["", name];
            const parsed = {
                tableItemId: obj.id,
                tableIndex: index,
                rollableTableId: obj.get("_rollabletableid") as Id,
                key,
                result,
                weight,
            } as const;

            logger?.trace(
                `parser(${JSON.stringify(
                    obj
                )}, ${index}, { delimiter: ${delimiter} }) : ${JSON.stringify(
                    parsed
                )}`
            );
            return parsed;
        },
        /**
         * The KeyedTable getter finds the item with the least minValue equal to
         * or less than the supplied key.
         * @param items
         * @param key
         * @param options
         */
        getter: (items, key, options: any = {}) => {
            logger?.trace(`getter(${items}, ${key}, ${options})`);
            const pickable = items.filter((item) => item.key === key);
            logger?.info(`${pickable.length} items picked`);

            logger?.trace(`getter(${items}, ${key}, ${options}): ${pickable}`);
            return pickable;
        },
    });
    return KeyedTable;
};
