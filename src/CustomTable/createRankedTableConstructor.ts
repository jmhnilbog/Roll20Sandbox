import createCustomTableConstructor from "./createCustomTableConstructor";
import { RankedTableItem, RankedTableItemKey } from "./types";

import { Logger } from "../Logger";
import { Id } from "../Roll20Object";
import { Sandbox } from "../Roll20Sandbox";

/**
 * Creates a RankedTable constructor.
 */
export const createRankedTableConstructor = ({
    sandbox,
    logger,
}: {
    sandbox?: Sandbox;
    logger?: Logger;
} = {}) => {
    const RankedTable = createCustomTableConstructor<
        RankedTableItem,
        RankedTableItemKey
    >({
        logger,
        sandbox,
        /**
         * The RankedTable parser splits a TableItem's name by the first
         * instance of the supplied delimiter, into a number ("minValue")
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
            const weight = obj.get("weight");
            const name = obj.get("name");
            const tmp = new RegExp(`^(.+?)${delimiter}(.+)$`).exec(name);
            const [minValue, result] = tmp
                ? [tmp[1], tmp[2]]
                : [undefined, name];
            const asNumber = Number(minValue);
            const parsed = {
                tableItemId: obj.id,
                tableIndex: index,
                rollableTableId: obj.get("_rollabletableid") as Id,
                minValue: asNumber,
                result,
                weight,
            } as const;

            logger?.info(`Parsed ${JSON.stringify(obj)}`);
            logger?.info(`into: ${JSON.stringify(parsed)}`);
            return parsed;
        },
        /**
         * The RankedTable getter finds the item with the least minValue equal to
         * or less than the supplied key.
         * @param items
         * @param key
         * @param options
         */
        getter: (items, key, options: any = {}) => {
            logger?.info(`${items.length} items`);
            const pickable = items.filter(
                (item) => typeof item.minValue !== "undefined"
            );
            logger?.info(`${pickable.length} pickable items`);
            const sorted = pickable.sort(
                (a: any, b: any) => a.minValue - b.minValue
            );
            logger?.info(sorted);
            let smallest = items[0];
            let picked = smallest;
            // let largest = items[items.length - 1];
            sorted.forEach((item) => {
                if (item.minValue <= key) {
                    picked = item;
                }
            });
            return [picked];
        },
    });
    return RankedTable;
};
