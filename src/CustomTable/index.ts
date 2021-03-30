export { createCustomTableConstructor } from "./createCustomTableConstructor";
export { createCustomTableMessageHandler } from "./createCustomTableMessageHandler";

import { createRankedTableConstructor } from "./createRankedTableConstructor";
export const RankedTable = createRankedTableConstructor();
export { createRankedTableConstructor };

import { createKeyedTableConstructor } from "./createKeyedTableConstructor";
export const KeyedTable = createKeyedTableConstructor();
export { createKeyedTableConstructor };

export { CustomTableConstructor } from "./types";
