import { Roll20ObjectInterface } from '../Roll20Object'
import { Id } from '../Roll20Object/types'

export interface CustomTableInterface<T> {
    getAllItems(): T[]
    getAtKey(key: any): T[]
}

export interface CustomTableConstructor<T> {
    new (table: Roll20ObjectInterface<'rollabletable'>): CustomTableInterface<T>
}

export type CustomTableParser<T> = (
    obj: Roll20ObjectInterface<'tableitem'>,
    index: number
) => T
export type CustomTableGetter<T, K> = (items: T[], key: K) => T[]

export type CustomTableClassCreator = <T>(obj: {
    parser: CustomTableParser<T>
}) => CustomTableConstructor<T>

export type RankedTableItem = {
    tableItemId: Id
    tableIndex: number
    rollableTableId: Id
    minValue: number
    result: string
    weight: string
}
export type RankedTableItemKey = number
