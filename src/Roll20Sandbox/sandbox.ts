import { Logger } from "../Logger";
import {
    Roll20ObjectInterface,
    IdGenerator,
    createRoll20ObjectConstructor,
    Id,
    PlayerId,
    Roll20ObjectType,
    Roll20ObjectShapeTypeMap,
} from "../Roll20Object";

import { getTopLevelScope } from "../util";

import "../../lib/splitArgs";

import {
    ChatMessage,
    Coord2D,
    FxBetweenNames,
    FxNames,
    Roll20EventName,
    Roll20ObjectPool,
    Roll20ObjectTypedShape,
} from "./types";

// TODO: type wrappers
type Wrappers = Record<string, (fn: Function) => Function>;

export const createRoll20Sandbox = async ({
    campaign,
    state,
    logger,
    pool = {},
    idGenerator,
    // @ts-ignore
    scope = getTopLevelScope(),
    wrappers = {},
}: {
    campaign?: Roll20ObjectInterface<"campaign">;
    state?: Record<string, any>;
    logger?: Logger;
    idGenerator: IdGenerator;
    pool?: Roll20ObjectPool;
    scope?: Record<string, any>;
    wrappers?: Wrappers;
}) => {
    // private variables for things handled behind the scenes
    // by the sandbox.
    const _private: {
        _campaign?: Roll20ObjectInterface<"campaign">;
        _pool: Roll20ObjectPool;
        _readyEventEmitted: boolean;
        _handlers: Record<Roll20EventName, Function[]>;
        _GM?: PlayerId;
        _withinSandbox: boolean;
        _readyTimeout?: number;
        _disposed: boolean;
        _zindexes: Record<number, Roll20ObjectInterface<"graphic">>;
        _selection: Roll20ObjectInterface[];
    } = {
        _campaign: undefined,
        _pool: pool,
        _readyEventEmitted: false,
        _handlers: {} as Record<Roll20EventName, Function[]>,
        _GM: undefined,
        _withinSandbox: true,
        _readyTimeout: undefined,
        _disposed: true,
        // TODO: z index management
        _zindexes: {} as Record<number, Roll20ObjectInterface<"graphic">>,
        // TODO: selection management
        _selection: [],
    };

    const _fireEvent = (eventName: Roll20EventName, ...rest: any) => {
        logger?.trace(`_fireEvent('${eventName}').`, ...rest);
        if (eventName === "sheetWorkerCompleted") {
            // Unlike other events, this one clears out each queued
            // handler as it is called.
            const handlers = _private._handlers[eventName] || [];
            handlers.forEach((handler) => handler(...rest));
            _private._handlers[eventName] = [];
            return;
        }
        if (eventName === "ready") {
            // Unlike other events, we only fire this once.
            if (!_private._readyEventEmitted) {
                const handlers = _private._handlers[eventName] || [];
                handlers.forEach((handler) => handler(...rest));
                _private._readyEventEmitted = true;
            }
            return;
        }
        const subEvents = eventName.split(":");
        while (subEvents.length) {
            const n = subEvents.join(":");
            if (n === "add" || n === "remove" || "change") {
                subEvents.pop();
                return;
            }
            logger?.info(`_fireEvent: Firing event '${n}'.`, ...rest);
            const handlers = _private._handlers[n as Roll20EventName] || [];
            handlers.forEach((handler) => handler(...rest));
            subEvents.pop();
        }
    };

    const Roll20Object = createRoll20ObjectConstructor({
        logger: logger?.child({
            logName: "Roll20Object",
        }),
        idGenerator,
        eventGenerator: _fireEvent,
    });

    const getAllObjs = () => {
        logger?.trace(`getAllObjs()`);
        return Object.values(_private._pool) as Roll20ObjectInterface[];
    };

    const filterObjs = (cb: (obj: any) => boolean) => {
        logger?.trace(`filterObjs()`);

        return Object.keys(_private._pool)
            .map((key) => _private._pool[key])
            .filter(cb) as Roll20ObjectInterface[];
    };

    type FindObjs = {
        <T extends Roll20ObjectType = Roll20ObjectType>(
            obj: Roll20ObjectTypedShape<T>,
            options?: {
                caseInsensitive?: boolean;
            }
        ): Roll20ObjectInterface<T>[];
        <T extends Roll20ObjectType = Roll20ObjectType>(
            obj: Partial<Values<Roll20ObjectShapeTypeMap>>,
            options?: {
                caseInsensitive?: boolean;
            }
        ): Roll20ObjectInterface<T>[];
    };

    const findObjs: FindObjs = <T extends Roll20ObjectType = Roll20ObjectType>(
        obj:
            | Partial<Values<Roll20ObjectShapeTypeMap>>
            | Roll20ObjectTypedShape<T>,
        { caseInsensitive = false }: { caseInsensitive?: boolean } = {}
    ) => {
        logger?.trace(
            `findObjs(${JSON.stringify(
                obj
            )}, { caseInsensitive: ${caseInsensitive} })`
        );
        const found = filterObjs((testObj: any) => {
            let found = true;
            Object.keys(testObj).forEach((key) => {
                const testValue = testObj[key];
                // @ts-ignore
                const objValue = obj[key];

                if (found && caseInsensitive) {
                    if (
                        typeof objValue === "string" ||
                        typeof testValue === "string"
                    ) {
                        if (
                            testValue.toString().toLowerCase() !=
                            objValue.toString().toLowerCase()
                        ) {
                            found = false;
                        }
                    }
                }
                // @ts-ignore
                if (found && testObj[key] != obj[key]) {
                    found = false;
                }
            });
            return found;
        });
        logger?.trace(
            `findObjs(${JSON.stringify(
                obj
            )}, { caseInsensitive: ${caseInsensitive} }): ${found}`
        );
        return found as Roll20ObjectInterface<T>[];
    };

    const sandbox = {
        _: (undefined as unknown) as typeof import("underscore"),
        state: state || getTopLevelScope().state || {},
        Campaign: () => {
            logger?.trace(`Campaign()`);
            if (!_private._campaign) {
                const cmp =
                    campaign ||
                    (new Roll20Object(
                        "campaign"
                    ) as Roll20ObjectInterface<"campaign">);
                _private._campaign = cmp;
                _private._pool[cmp.id] = cmp;
            }
            logger?.trace(`Campaign(): ${_private._campaign}`);
            return _private._campaign;
        },
        createObj: <T extends Roll20ObjectType>(
            _type: T,
            obj: Partial<Roll20ObjectShapeTypeMap[T]>
        ) => {
            logger?.trace(`createObj(${_type}, ${JSON.stringify(obj)})`);
            const r = new Roll20Object(_type, obj);
            _private._pool[r.id] = r;
            logger?.trace(
                `createObj(${_type}, ${JSON.stringify(obj)}): ${JSON.stringify(
                    r
                )}`
            );
            return r;
        },
        filterObjs,
        findObjs,
        getObj: <T extends Roll20ObjectType>(
            type: Roll20ObjectShapeTypeMap[T],
            id: Id
        ): Roll20ObjectInterface<T> | undefined => {
            logger?.trace(`getObj(${type}, ${id})`);
            const obj = _private._pool[id];

            // TODO: possibly add to _zindex;

            logger?.trace(`getObj(${type}, ${id}): ${JSON.stringify(obj)}`);
            return obj;
        },
        getAttrByName: (
            id: string,
            name: string,
            curOrMax: "current" | "max" = "current"
        ) => {
            logger?.trace(`getAttrByName(${id}, ${name}, ${curOrMax})`);
            // @ts-ignore
            const findObjs = findObjs || sandbox.findObjs;
            const char = findObjs({ type: "character", id })[0];
            if (!char) {
                throw new Error(`Can't find character with id "${id}".`);
            }
            return char.get(`${name}_${curOrMax}`);
        },
        log: (...rest: any[]) => {
            if (!logger) {
                throw new Error("Please just use a logger.");
            }
            logger.info(...rest);
        },

        on: (eventName: Roll20EventName, handler: Function) => {
            logger?.trace(`on(${eventName})`);
            const subEvents = eventName.split(":");
            if (subEvents[0] === "ready") {
                // If we've emitted a "ready" event already, immediately
                // call additional on("ready") handlers.
                logger?.info("Ready event", _private._readyEventEmitted);
                if (_private._readyEventEmitted) {
                    logger?.info(
                        `on(${eventName}) handler set after initial "ready" event. Immediately calling it.`
                    );
                    handler();
                    return;
                }
                // handler()
            } else if (subEvents[0] === "change") {
                // handler(obj, prev)
                // prev is a regular obj, not a Roll20Object.
                // async fields will have ids, not data, in prev
            } else if (subEvents[0] === "add") {
                // handler(obj)
            } else if (subEvents[0] === "destroy") {
                // handler(obj)
            } else if (subEvents[0] === "chat") {
                // handler(msg)
            }
            _private._handlers[eventName] = _private._handlers[eventName] || [];
            _private._handlers[eventName].push(handler);

            logger?.info(`on(${eventName}) handler set.`);
        },
        onSheetWorkerCompleted: (cb: () => void) => {
            logger?.trace(`onSheetWorkerCompleted()`);
            _private._handlers["sheetWorkerCompleted"] =
                _private._handlers["sheetWorkerCompleted"] || [];
            _private._handlers["sheetWorkerCompleted"].push(cb);
        },
        playerIsGM: (playerId: string) => {
            logger?.trace(`playerIsGM(${playerId})`);
            return _private._GM === playerId;
        },
        playJukeboxPlaylist: () => {
            logger?.trace(`playJukeboxPlaylist()`);
        },
        randomInteger: (max: number) => {
            logger?.trace(`randomInteger(${max})`);
            return Math.floor(Math.random() * max) + 1;
        },
        sendChat: (
            speakingAs: ChatMessage["who"],
            message: ChatMessage["content"],
            cb?: (msgs: ChatMessage[]) => void,
            { noarchive = false, use3d = false } = {}
        ) => {
            logger?.info(`sendChat(${speakingAs}, ${message})`);
            cb && cb([]);

            // TODO: player management

            if (!_private._withinSandbox) {
                const type = message.indexOf("!") === 0 ? "api" : "general";

                const msg: ChatMessage = {
                    who: speakingAs,
                    content: message,
                    playerid: "GM" as PlayerId,
                    type,
                    target_name: "",
                    selected: [],
                };

                // TODO: find additional message info
                _fireEvent("chat:message", msg);
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
            );
        },
        spawnFx: (
            left: number,
            top: number,
            typeColor: FxNames,
            pageId: string
        ) => {
            logger?.trace(`spawnFx(${left}, ${top}, ${typeColor}, ${pageId})`);
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
            );
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
            );
        },
        /**
         * Mocked version of stopJukeboxPlaylist(), which does nothing.
         */
        stopJukeboxPlaylist: () => {
            logger?.trace(`stopJukeboxPlaylist()`);
        },
        /**
         * Mocked version of toBack(), which does nothing.
         */
        toBack: (obj: Roll20ObjectInterface) => {
            logger?.trace(`toBack(${JSON.stringify(obj)})`);

            // TODO: move obj to lowest _zindex.
        },
        /**
         * Mocked version of toFront(), which does nothing.
         */
        toFront: (obj: InstanceType<typeof Roll20Object>) => {
            logger?.trace(`toFront(${JSON.stringify(obj)})`);

            // TODO: move obj to highest _zindex.
        },
    } as const;

    type SandboxAPI = typeof sandbox;

    // We look at the environment. If the functions defined in the sandbox object
    // also exist in the global scope, we'll use those instead.
    // If wrappers were passed in, we wrap whichever function we've found to use with them.
    const realSandbox = {} as Mutable<SandboxAPI>;
    await Promise.all(
        Object.keys(sandbox).map(async (k) => {
            const topLevelScope = scope;
            const key = k as keyof SandboxAPI;

            if (typeof topLevelScope[key] !== "undefined") {
                logger?.info(
                    `Found Roll20's "${key}". Copying to Roll20Sandbox.`
                );
                realSandbox[key] = topLevelScope[key];
            } else {
                logger?.info(`Roll20 "${key}" not found. Installing mock.`);
                _private._withinSandbox = false;

                // The underscore library is an outlier here. We only want to include the library
                // if necessary, and other libraries expect it available globally from the jump.
                if (key === "_") {
                    logger?.info("Dynamically importing underscore library.");
                    const { default: myDefault, ...rest } = await import(
                        "underscore"
                    );
                    const _ = Object.assign(myDefault, rest);
                    logger?.info("Imported as", _);

                    topLevelScope._ = _;
                    realSandbox._ = _;
                } else {
                    if (typeof sandbox[key] === "undefined") {
                        logger?.info(`No mock found for "${key}"`);
                    }
                    // @ts-ignore
                    realSandbox[key] = sandbox[key];
                    logger?.info(
                        `Using mocked "${key}": ${sandbox[key]?.toString()}.`
                    );
                }
            }
        })
    );

    // const _applyWrappers = (wrappers: Wrappers = {}) => {
    //     logger?.trace(`_applyWrappers(${wrappers})`);
    //     Object.keys(wrappers).forEach((key) => {
    //         _wrap(key as keyof SandboxAPI, wrappers[key]);
    //     });
    //     _wrap("getObj", () => realSandbox.getObj);
    // };

    // const _wrap = <T extends keyof SandboxAPI>(
    //     key: T,
    //     wrapper: (fn: SandboxAPI[T]) => SandboxAPI[T]
    // ) => {
    //     logger?.trace(`_wrap(${key}, ${wrapper.toString()})`);
    //     const sandboxFn = realSandbox[key];
    //     if (sandboxFn && typeof sandboxFn === "function") {
    //         logger?.info(
    //             `Wrapped sandbox "${key}" ("${realSandbox[key]}") with "${wrapper}."`
    //         );
    //         realSandbox[key] = wrapper(realSandbox[key]);
    //     } else {
    //         logger?.warn(`Cannot wrap sandbox "${key}": not a function.`);
    //     }
    // };
    // wrappers && _applyWrappers(wrappers);

    const _registerCommand = (name: string, handler: Function) => {
        logger?.trace(`_registerCommand(${name}, ${handler.toString()})`);
        logger?.info("registering command " + name);

        const cmdLogger = logger?.child({
            logName: name,
            logLevel: "TRACE",
        });
        realSandbox.on("chat:message", (msg: ChatMessage) => {
            cmdLogger?.trace(`(${JSON.stringify(msg)})`);
            if (msg.type !== "api") {
                cmdLogger?.debug(`Ignoring non-api message.`);
                return;
            }
            if (msg.content.indexOf(name) !== 1) {
                cmdLogger?.debug(`Ignoring api message: not for this handler.`);
                return;
            }

            const [command, ...args] = msg.content.splitArgs();
            cmdLogger?.info(`Command invoked: ${command} (${args})`);

            handler(...args);
        });
    };

    const _isWithinSandbox = () => {
        logger?.trace(`_isWithinSandbox()`);
        const r = _private._withinSandbox;
        logger?.trace(`_isWithinSandbox(): ${r}`);
        return r;
    };

    if (!_isWithinSandbox()) {
        /**
         * If, after a full second, we're not within the real Roll20 sandbox, fire a ready event.
         */
        // @ts-ignore
        _private._readyTimeout = setTimeout(() => {
            if (_isWithinSandbox()) {
                logger?.info(
                    `Within real sandbox, so ignoring need to fire ready event.`
                );
                if (_private._readyEventEmitted) {
                    logger?.info(`Ready event was already heard, anyway.`);
                }
                return;
            }
            if (_private._readyEventEmitted) {
                logger?.info(
                    `Outside of real sandbox, but ready event already fired. Huh. Not firing again.`
                );
                return;
            }
            logger?.info(
                `Outside of real sandbox and ready event not fired within 1 second, so firing ready event manually.`
            );
            _fireEvent("ready");
        }, 1000);
    }

    const _promote = (
        keys?: (keyof SandboxAPI)[],
        // @ts-ignore
        scope: Record<string, any> = getTopLevelScope()
    ) => {
        logger?.trace("_promote(${keys}, ${scope})");
        let promotionKeys =
            keys || (Object.keys(realSandbox) as (keyof SandboxAPI)[]);
        logger?.info(`_PROMOTING: ${promotionKeys}`);
        promotionKeys.forEach((key) => {
            if (realSandbox[key] !== scope[key]) scope[key] = realSandbox[key];
            logger?.info(`Promoted sandbox '${key}' to new scope.`);
        });
        return scope;
    };

    const _setAsGM = (playerId?: Id) => {
        logger?.trace(`_setAsGM(${playerId})`);
        _private._GM = playerId;
    };

    const _dispose = () => {
        logger?.trace(`_dispose()`);
        if (!_private._disposed) {
            logger?.fatal(`Sandbox already disposed of.`);
        }
        clearTimeout(_private._readyTimeout);
        Object.keys(pool).forEach((key) => {
            // @ts-ignore
            const obj: Roll20ObjectInterface = pool[key];
            obj.remove();
        });
        _private._disposed = true;
    };

    const _select = (selected: Roll20ObjectInterface[]) => {
        // TODO: implement selection
    };

    return {
        ...realSandbox,
        _fireEvent,
        _registerCommand,
        _isWithinSandbox,
        _global: getTopLevelScope(),
        _promote,
        _setAsGM,
        _dispose,
        _select,
        //_applyWrappers,
    } as Immutable<typeof realSandbox> & {
        _fireEvent: typeof _fireEvent;
        _registerCommand: typeof _registerCommand;
        _isWithinSandbox: typeof _isWithinSandbox;
        _global: any;
        _promote: typeof _promote;
        _setAsGM: typeof _setAsGM;
        _dispose: typeof _dispose;
        _select: typeof _select;
        //_applyWrappers: typeof _applyWrappers;
    };
};

export type Sandbox = Unwrap<ReturnType<typeof createRoll20Sandbox>>;
