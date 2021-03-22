import { Logger } from '../Logger'
import { Id } from '../Roll20Object/types'
import { Sandbox } from '../Roll20Sandbox/api'
import createCustomTableConstructor from './createCustomTableConstructor'
import { RankedTableItem, RankedTableItemKey } from './types'

export const createRankedTableConstructor = ({
    sandbox,
    logger,
}: {
    sandbox: Sandbox
    logger?: Logger
}) => {
    const RankedTable = createCustomTableConstructor<
        RankedTableItem,
        RankedTableItemKey
    >({
        logger,
        sandbox,
        parser: (obj, index) => {
            const weight = obj.get('weight')
            const name = obj.get('name')
            const tmp = /^(.+)\^(.+)$/.exec(name)
            const [minValue, result] = tmp
                ? [tmp[1], tmp[2]]
                : [undefined, name]
            const asNumber = Number(minValue)
            const parsed = {
                tableItemId: obj.id,
                tableIndex: index,
                rollableTableId: obj.get('_rollabletableid') as Id,
                minValue: asNumber,
                result,
                weight,
            }

            logger?.info(`Parsed ${JSON.stringify(obj)}`)
            logger?.info(`into: ${JSON.stringify(parsed)}`)
            return parsed
        },
        getter: (items, key) => {
            logger?.info(`${items.length} items`)
            const pickable = items.filter(
                (item) => typeof item.minValue !== 'undefined'
            )
            logger?.info(`${pickable.length} pickable items`)
            const sorted = pickable.sort(
                (a: any, b: any) => a.minValue - b.minValue
            )
            logger?.info(sorted)
            let smallest = items[0]
            let picked = smallest
            let largest = items[items.length - 1]
            sorted.forEach((item) => {
                if (item.minValue <= key) {
                    picked = item
                }
            })
            return [picked]
        },
    })
    return RankedTable
}
