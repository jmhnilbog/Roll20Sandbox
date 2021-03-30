import { Id, Roll20ObjectInterface } from "../Roll20Object";

export type RankedTableItem = {
    tableItemId: Id;
    tableIndex: number;
    rollableTableId: Id;
    minValue: RankedTableItemKey;
    result: string;
    weight: string;
};
export type RankedTableItemKey = number;

export type KeyedTableItem = {
    tableItemId: Id;
    tableIndex: number;
    rollableTableId: Id;
    key: KeyedTableItemKey;
    result: string;
    weight: string;
};
export type KeyedTableItemKey = number | string;

export interface CustomTableInterface<T> {
    getAllItems(): T[];
    getAtKey(key: any): T[];
}

export interface CustomTableConstructor<T = {}> {
    new (
        table: Roll20ObjectInterface<"rollabletable">,
        options?: any
    ): CustomTableInterface<T>;
    getTable(
        table: Roll20ObjectInterface<"rollabletable">,
        options?: any
    ): CustomTableInterface<T>;
}

export type CustomTableParser<T> = (
    obj: Roll20ObjectInterface<"tableitem">,
    index: number,
    options?: any
) => T;
export type CustomTableGetter<T, K> = (
    items: T[],
    key: K,
    options?: any
) => T[];
