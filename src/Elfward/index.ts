import { createRoll20Sandbox } from '../Roll20Sandbox'
import { Id, Roll20ObjectShapeTypeMap } from '../Roll20Object/types'
import { getLogger } from '../Logger'
import { createRankedTableConstructor } from '../CustomTable'

const logger = getLogger({
    logLevel: 'INFO',
    // @ts-ignore
    emissionFn: log || console?.log,
})

const sandbox = createRoll20Sandbox({
    idGenerator: () => Math.random().toString() as Id,
    logger,
})

// note: the build needs __dirname, window, and global all defined.
// it needs module.exports removed from the top after build as well
sandbox.on('ready', () => {
    sandbox.log('READY BABY!')
    logger.info('ready baby')

    const { _registerCommand } = sandbox

    const RankedTable = createRankedTableConstructor({
        sandbox,
        logger,
    })

    const spellTablesByName = {} as Record<
        string,
        InstanceType<typeof RankedTable>
    >

    const SPELL_MARKER = '%%SPELL%%'

    sandbox
        .filterObjs((obj) => {
            const _type: keyof Roll20ObjectShapeTypeMap = obj.get('_type')
            const name: string = obj.get('name') || ''
            logger.info(`Checking "${_type}" "${name}"`)
            const match =
                _type === 'rollabletable' &&
                typeof name === 'string' &&
                name.indexOf(SPELL_MARKER) === 0
            logger.info(match ? 'MATCH' : 'no match')
            return match
        })
        .forEach((roll20Obj) => {
            const name: string = roll20Obj.get('name') || ''
            const rollableTableId: string = roll20Obj.id
            logger.info(`Examining "${name}" "${rollableTableId}"`)

            const spellName: string = name.split(SPELL_MARKER)[1]
            spellTablesByName[spellName] = new RankedTable(roll20Obj)
        })

    // !cast spell-name (rank or roll)
    _registerCommand('cast', (name: string, roll: string) => {
        const rollAsNumber = Number(roll)
        if (isNaN(rollAsNumber)) {
            logger.error(`Roll "${roll}" could not be parsed into a number.`)
            return
        }
        logger.info(`Casting ${name} with roll of ${roll}`)
        logger.info(`Spells: ${Object.keys(spellTablesByName)}`)
        const spellTable = spellTablesByName[name]
        logger.info(`SpellTable: ${spellTable}`)
        const value = spellTable?.getAtKey(rollAsNumber)
        if (value.length !== 1) {
            logger.error(
                `Expected a result, but found ${
                    value.length === 0 ? 'none' : 'more than one.'
                }`
            )
            return
        }
        // TODO: use rt command to perform nested rolls
        // TODO: nested ranked rolls: use cast command to perform nested rank
        sandbox.sendChat('', `poof! ${value[0].result}`)

        return value
    })
})

// //var global = global
// var window = window
// var __dirname = ''

//module.exports =
