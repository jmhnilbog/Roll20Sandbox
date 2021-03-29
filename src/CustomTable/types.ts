import { Id, Roll20ObjectInterface } from "../Roll20Object";

export type RankedTableItem = {
    tableItemId: Id;
    tableIndex: number;
    rollableTableId: Id;
    minValue: number;
    result: string;
    weight: string;
};
export type RankedTableItemKey = number;

export interface CustomTableInterface<T> {
    getAllItems(): T[];
    getAtKey(key: any): T[];
}

export interface CustomTableConstructor<T> {
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

export type CustomTableClassCreator = <T>(obj: {
    parser: CustomTableParser<T>;
}) => CustomTableConstructor<T>;
