import { Logger } from '../Logger'
import { Roll20ObjectInterface } from '../Roll20Object'
import { Id } from '../Roll20Object/types'
import { Sandbox } from '../Roll20Sandbox/api'
import {
    CustomTableParser,
    CustomTableGetter,
    CustomTableInterface,
} from './types'

export const createCustomTableConstructor = <T, K>({
    parser,
    getter,
    sandbox,
    logger,
}: {
    parser: CustomTableParser<T>
    getter: CustomTableGetter<T, K>
    sandbox: Sandbox
    logger?: Logger
}) => {
    const CustomTable = class CustomTable implements CustomTableInterface<T> {
        private _rollabletableid: Id
        private _logger?: Logger
        constructor(table: Roll20ObjectInterface<'rollabletable'>) {
            this._rollabletableid = table.get('_id') as Id
            this._logger = logger
        }
        getAllItems() {
            const rawTableItems: Roll20ObjectInterface<'tableitem'>[] = sandbox.findObjs(
                {
                    _type: 'tableitem',
                    _rollabletableid: this._rollabletableid,
                }
            )
            return rawTableItems.map(parser)
        }
        getAtKey(key: K) {
            const picked = getter(this.getAllItems(), key)
            return picked
        }
    }
    return CustomTable
}

export default createCustomTableConstructor
