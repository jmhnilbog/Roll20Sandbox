import { createRoll20Sandbox } from '../Roll20Sandbox'
import { Id } from '../Roll20Object/types'
import { getLogger } from '../Logger'

const sandbox = createRoll20Sandbox({
    idGenerator: () => Math.random().toString() as Id,
    logger: getLogger({
        logLevel: 'INFO',
        // @ts-ignore
        emissionFn: log || console?.log,
    }),
})

// note: the build needs __dirname, window, and global all defined.
// it needs module.exports removed from the top after build as well
sandbox.on('ready', () => {
    sandbox.log('READY BABY!')
})

// //var global = global
// var window = window
// var __dirname = ''

//module.exports =
