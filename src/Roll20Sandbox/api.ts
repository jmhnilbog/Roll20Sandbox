import { Logger } from '../Logger'
import {
    Roll20Object,
    Roll20ObjectConstructor,
    Roll20ObjectInterface,
    createRoll20ObjectCreator,
} from '../Roll20Object'
import {
    EventGenerator,
    Id,
    PlayerId,
    Roll20ObjectType,
} from '../Roll20Object/types'
import {
    ChatMessage,
    Coord2D,
    FxBetweenNames,
    FxNames,
    Roll20EventName,
} from './types'

import _ from 'underscore'
import getTopLevelScope from '../util/getTopLevelScope'

export const createRoll20Sandbox = ({
    campaign,
    state,
    logger,
    pool = {},
    idGenerator,
    // @ts-ignore
    scope = getTopLevelScope(),
    wrappers = {},
}: {
    campaign?: Roll20ObjectInterface<'campaign'>
    state?: Record<string, any>
    logger?: Logger
    idGenerator: () => Id
    pool?: Record<string, any>
    scope?: Record<string, any>
    wrappers?: Record<string, Function>
}) => {
    // private variables for things handled behind the scenes
    // by the sandbox.
    const _private: {
        _campaign?: Roll20ObjectInterface<'campaign'>
        _pool: Record<string, any>
        _readyEventEmitted: boolean
        _handlers: Record<Roll20EventName, Function[]>
        _GM?: PlayerId
        _withinSandbox: boolean
    } = {
        _campaign: undefined,
        _pool: pool,
        _readyEventEmitted: false,
        _handlers: {} as Record<Roll20EventName, Function[]>,
        _GM: undefined,
        _withinSandbox: true,
    }

    const _fireEvent = (eventName: Roll20EventName, ...rest: any) => {
        logger?.trace(`_fireEvent('${eventName}').`, ...rest)
        if (eventName === 'sheetWorkerCompleted') {
            // Unlike other events, this one clears out each queued
            // handler as it is called.
            const handlers = _private._handlers[eventName] || []
            handlers.forEach((handler) => handler(...rest))
            _private._handlers[eventName] = []
            return
        }
        if (eventName === 'ready') {
            // Unlike other events, we only fire this once.
            if (!_private._readyEventEmitted) {
                const handlers = _private._handlers[eventName] || []
                handlers.forEach((handler) => handler(...rest))
                _private._readyEventEmitted = true
            }
            return
        }
        const subEvents = eventName.split(':')
        while (subEvents.length) {
            const n = subEvents.join(':')
            logger?.info(`_fireEvent: Firing event '${n}'.`, ...rest)
            const handlers = _private._handlers[n as Roll20EventName] || []
            handlers.forEach((handler) => handler(...rest))
            subEvents.pop()
        }
    }

    const Roll20Object = createRoll20ObjectCreator({
        logger,
        idGenerator,
        pool,
        eventGenerator: _fireEvent,
    })

    const sandbox = {
        // @ts-ignore
        _: _,
        state: state || {},
        Campaign: () => {
            if (!_private._campaign) {
                const cmp =
                    campaign ||
                    (new Roll20Object(
                        'campaign'
                    ) as Roll20ObjectInterface<'campaign'>)
                _private._campaign = cmp
                _private._pool[cmp.id] = cmp
            }
            return _private._campaign
        },
        createObj: <T extends Roll20ObjectType>(_type: T, obj: any) => {
            logger?.trace(`createObj(${_type}, ${JSON.stringify(obj)})`)
            // console.log(new Roll20Object(_type, obj))
            // console.log('XXX')
            const r = new Roll20Object(_type, obj)
            _private._pool[r.id] = r
            return r
        },
        filterObjs: (cb: (obj: any) => boolean) => {
            logger?.trace(`filterObjs()`)
            return Object.keys(_private._pool)
                .map((key) => _private._pool[key])
                .filter(cb)
        },
        findObjs: (
            obj: any,
            { caseInsensitive = false }: { caseInsensitive?: boolean } = {}
        ) => {
            logger?.trace(
                `findObjs(${JSON.stringify(
                    obj
                )}, { caseInsensitive: ${caseInsensitive} })`
            )
            // @ts-ignore
            const filterObjs = filterObjs || sandbox.filterObjs
            return filterObjs((testObj: any) => {
                let found = true
                Object.keys(testObj).forEach((key) => {
                    const testValue = testObj[key]
                    const objValue = obj[key]

                    if (found && caseInsensitive) {
                        if (
                            typeof objValue === 'string' ||
                            typeof testValue === 'string'
                        ) {
                            if (
                                testValue.toString().toLowerCase() !=
                                objValue.toString().toLowerCase()
                            ) {
                                found = false
                            }
                        }
                    }
                    if (found && testObj[key] != obj[key]) {
                        found = false
                    }
                })
                return found
            })
        },
        getAllObjs: () => {
            logger?.trace(`getAllObjs()`)
            return Object.keys(_private._pool).map((key) => _private._pool[key])
        },
        getAttrByName: (
            id: string,
            name: string,
            curOrMax: 'current' | 'max' = 'current'
        ) => {
            logger?.trace(`getAttrByName(${id}, ${name}, ${curOrMax})`)
            // @ts-ignore
            const findObjs = findObjs || sandbox.findObjs
            const char = findObjs({ type: 'character', id })[0]
            if (!char) {
                throw new Error(`Can't find character with id "${id}".`)
            }
            return char.get(`${name}_${curOrMax}`)
        },
        log: (...rest: any[]) =>
            (logger ? logger : console ? console : null)?.info(...rest),
        on: (eventName: Roll20EventName, handler: Function) => {
            logger?.trace(`on(${eventName})`)
            const subEvents = eventName.split(':')
            if (subEvents[0] === 'ready') {
                // If we've emitted a "ready" event already, immediately
                // call additional on("ready") handlers.
                logger?.info('Ready event', _private._readyEventEmitted)
                if (_private._readyEventEmitted) {
                    logger?.info(
                        `on(${eventName}) handler set after initial "ready" event. Immediately calling it.`
                    )
                    handler()
                    return
                }
                // handler()
            } else if (subEvents[0] === 'change') {
                // handler(obj, prev)
                // prev is a regular obj, not a Roll20Object.
                // async fields will have ids, not data, in prev
            } else if (subEvents[0] === 'add') {
                // handler(obj)
            } else if (subEvents[0] === 'destroy') {
                // handler(obj)
            } else if (subEvents[0] === 'chat') {
                // handler(msg)
            }
            _private._handlers[eventName] = _private._handlers[eventName] || []
            _private._handlers[eventName].push(handler)

            logger?.info(`on(${eventName}) handler set.`)
        },
        onSheetWorkerCompleted: (cb: () => void) => {
            logger?.trace(`onSheetWorkerCompleted()`)
            _private._handlers['sheetWorkerCompleted'] =
                _private._handlers['sheetWorkerCompleted'] || []
            _private._handlers['sheetWorkerCompleted'].push(cb)
        },
        playerIsGM: (playerId: string) => {
            logger?.trace(`playerIsGM(${playerId})`)
            return _private._GM === playerId
        },
        playJukeboxPlaylist: () => {
            logger?.trace(`playJukeboxPlaylist()`)
        },
        randomInteger: (max: number) => {
            logger?.trace(`randomInteger(${max})`)
            return Math.floor(Math.random() * max) + 1
        },
        sendChat: (
            speakingAs: ChatMessage['who'],
            message: ChatMessage['content'],
            cb?: (msgs: ChatMessage[]) => void,
            { noarchive = false, use3d = false } = {}
        ) => {
            logger?.info(`sendChat(${speakingAs}, ${message})`)
            cb && cb([])

            if (_private._withinSandbox) {
                // TODO: find additional message info
                _fireEvent('chat:message', {
                    who: speakingAs,
                    content: message,
                } as ChatMessage)
            }
        },
        sendPing: (
            left: number,
            top: number,
            pageId: string,
            playerId?: string,
            moveAll: boolean = false,
            visibleTo?: string | string[]
        ) => {
            logger?.trace(
                `sendPing(${left}, ${top}, ${pageId}, ${playerId}, ${moveAll}, ${visibleTo})`
            )
        },
        spawnFx: (
            left: number,
            top: number,
            typeColor: FxNames,
            pageId: string
        ) => {
            logger?.trace(`spawnFx(${left}, ${top}, ${typeColor}, ${pageId})`)
        },
        spawnFxBetweenPoints: (
            start: Coord2D,
            end: Coord2D,
            typeColor: FxBetweenNames,
            pageId: string
        ) => {
            logger?.trace(
                `spawnFxBetweenPoints(${JSON.stringify(
                    start
                )}, ${JSON.stringify(end)}, ${typeColor}, ${pageId})`
            )
        },
        spawnFxWithDefinition: (
            left: string,
            top: string,
            definition: Record<string, any>,
            pageId: string
        ) => {
            logger?.trace(
                `spawnFxWithDefinition(${left}, ${top}, ${JSON.stringify(
                    definition
                )}, ${pageId})`
            )
        },
        /**
         * Mocked version of stopJukeboxPlaylist(), which does nothing.
         */
        stopJukeboxPlaylist: () => {
            logger?.trace(`stopJukeboxPlaylist()`)
        },
        /**
         * Mocked version of toBack(), which does nothing.
         */
        toBack: (obj: Roll20ObjectInterface) => {
            // TODO: mock zindex
            logger?.trace(`toBack(${JSON.stringify(obj)})`)
        },
        /**
         * Mocked version of toFront(), which does nothing.
         */
        toFront: (obj: InstanceType<typeof Roll20Object>) => {
            logger?.trace(`toFront(${JSON.stringify(obj)})`)
        },
    } as const

    type SandboxAPI = typeof sandbox

    // We look at the environment. If the functions defined in the sandbox object
    // also exist in the global scope, we'll use those instead.
    // If wrappers were passed in, we wrap whichever function we've found to use with them.
    const realSandbox = {} as Mutable<SandboxAPI>
    Object.keys(sandbox).forEach((k) => {
        const topLevelScope = scope
        const key = k as keyof SandboxAPI
        if (typeof topLevelScope[key] !== 'undefined') {
            logger?.info(`Found Roll20's "${key}". Copying to Roll20Api.`)
            realSandbox[key] = topLevelScope[key]
        } else {
            logger?.info(`Roll20 "${key}" not found. Installing mock.`)
            _private._withinSandbox = false
            if (typeof sandbox[key] === 'undefined') {
                logger?.info(`No mock found for "${key}"`)
            }
            // @ts-ignore
            realSandbox[key] = sandbox[key]
            logger?.info(`Using mocked "${key}": ${sandbox[key]?.toString()}.`)
        }
        if ((wrappers as Record<string, any>)[key]) {
            logger?.info(`Custom wrapper found for "${key}". Applying.`)
            realSandbox[key] = (wrappers as Record<string, any>)[key](
                realSandbox[key]
            )
        }
    })

    return {
        ...realSandbox,
        _fireEvent,
    } as typeof sandbox & {
        _fireEvent: typeof _fireEvent
    }
}

export type Sandbox = ReturnType<typeof createRoll20Sandbox>

export const promoteSandbox = (
    sandbox: Sandbox,
    keys: (keyof Sandbox)[],
    // @ts-ignore
    scope: Record<string, any> = getTopLevelScope()
) => {
    let promotionKeys: (keyof Sandbox)[] =
        keys || (Object.keys(sandbox) as (keyof Sandbox)[])
    promotionKeys.forEach((key) => {
        const k = key as keyof Sandbox
        scope[k] = sandbox[k]
    })
    return scope
}
