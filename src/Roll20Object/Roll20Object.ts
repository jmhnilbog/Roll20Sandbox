import { getShapeDefaults } from "./shapes";
import {
    Roll20ObjectType,
    Roll20ObjectShapeTypeMap,
    Roll20ObjectInterface,
    EventGenerator,
    IdGenerator,
    Id,
} from "./types";

import { Logger } from "../Logger";
import { Roll20EventName } from "../Roll20Sandbox";

// Fields that can't be changed in the normal ways.
const ImmutableFields = ["_id", "_type"];

// Additional rules applied to certain subtypes.
const Rules: {
    [K in Roll20ObjectType]?: {
        creatable?: boolean;
        maySetWithWorker?: boolean;
        asyncFields?: Partial<keyof Roll20ObjectShapeTypeMap[K]>[];
    };
} = {
    ability: {
        creatable: true,
    },
    attribute: {
        maySetWithWorker: true,
        creatable: true,
    },
    character: {
        asyncFields: ["gmnotes", "bio"],
        creatable: true,
    },
    handout: {
        asyncFields: ["notes", "gmnotes"],
        creatable: true,
    },
    macro: {
        creatable: true,
    },
    rollabletable: {
        creatable: true,
    },
    path: {
        creatable: true,
    },
    tableitem: {
        creatable: true,
    },
    text: {
        creatable: true,
    },
};

/**
 * Get a Roll20Object constructor.
 */
export const createRoll20ObjectConstructor = ({
    logger,
    idGenerator,
    pool,
    eventGenerator,
}: {
    logger?: Logger;
    idGenerator: IdGenerator;
    pool?: Record<string, any>;
    eventGenerator: EventGenerator;
}) => {
    const shapeDefaults = getShapeDefaults({ idGenerator });

    const Roll20Object = class Roll20Object<T extends Roll20ObjectType>
        implements
            Roll20ObjectInterface<
                T,
                Roll20ObjectShapeTypeMap[T],
                keyof Roll20ObjectShapeTypeMap[T]
            > {
        static _createShape = <T extends Roll20ObjectType>(
            type: T,
            obj: Partial<Roll20ObjectShapeTypeMap[T]>
        ) => {
            return shapeDefaults[type](obj) as Roll20ObjectShapeTypeMap[T];
        };

        _obj: Roll20ObjectShapeTypeMap[T];
        constructor(type: T, obj: Partial<Roll20ObjectShapeTypeMap[T]> = {}) {
            logger?.trace(
                `Creating Roll20Object from: ${type}", ${JSON.stringify(obj)}".`
            );
            this._obj = Roll20Object._createShape<T>(
                type,
                obj
            ) as Roll20ObjectShapeTypeMap[T];
        }

        get<K extends keyof Roll20ObjectShapeTypeMap[T]>(
            key: K,
            cb?: (x: any) => Roll20ObjectShapeTypeMap[T][K]
        ): Roll20ObjectShapeTypeMap[T][K] {
            logger?.trace(`get(${key})`);
            if (Rules[this._obj._type]?.asyncFields?.includes(key as any)) {
                if (!cb) {
                    throw new Error(`Callback required to get key "#{key}".`);
                }
            }
            const value: Roll20ObjectShapeTypeMap[T][K] = this._obj[key];

            logger?.trace(`get(${key}) found "${value}".`);

            // TODO: allow a delay before callback is called.
            //return (cb ? cb(value) : value) as S[K]
            return value;
        }

        get id() {
            return this._obj._id as Id;
        }

        /**
         * Mutator for a Roll20Object property. The immutability of
         * some keys is enforced.
         */
        set<K extends keyof Roll20ObjectShapeTypeMap[T]>(
            changes: Partial<Roll20ObjectShapeTypeMap[T]>
        ): void;
        set<K extends keyof Roll20ObjectShapeTypeMap[T]>(
            key: K,
            value: Roll20ObjectShapeTypeMap[T][K]
        ): void;
        set<K extends keyof Roll20ObjectShapeTypeMap[T]>(
            changesOrKey: Partial<Roll20ObjectShapeTypeMap[T]> | K,
            value?: Roll20ObjectShapeTypeMap[T][K]
        ): void {
            const allChanges =
                typeof changesOrKey !== "object"
                    ? ({ [changesOrKey]: value } as Partial<
                          Roll20ObjectShapeTypeMap[T]
                      >)
                    : changesOrKey;

            logger?.trace(`set(${JSON.stringify(allChanges)})`);

            Object.keys(allChanges).forEach((key) => {
                if (ImmutableFields.includes(key as any)) {
                    logger?.error(`You may not set key "${key}".`);
                } else {
                    // @ts-ignore
                    this._obj[key] =
                        allChanges[key as keyof Roll20ObjectShapeTypeMap[T]];

                    eventGenerator(
                        `change:${this._obj._type}:${key}` as Roll20EventName
                    );
                }
            });
        }

        /**
         * Makes a set of changes to a Roll20Object via webworker. To receive
         * notice that the change has completed, you must register an
         * @param changes
         */
        setWithWorker(changes: Partial<Roll20ObjectShapeTypeMap[T]>) {
            logger?.trace(`setWithWorkers(${JSON.stringify(changes)})`);
            if (this._obj._type !== "attribute") {
                throw new Error(
                    `Can't call setWithWorker on non-attribute objects.`
                );
            }

            Object.keys(changes).forEach((key) => {
                if (ImmutableFields.includes(key as any)) {
                    logger?.error(`You may not set key "${key}".`);
                } else {
                    // @ts-ignore
                    this._obj[key] = changes[key];
                }
            });

            eventGenerator("sheetWorkerCompleted");
        }
        remove() {
            logger?.trace(`remove()`);

            if (pool) {
                if (pool[this.id] !== this) {
                    logger?.warn(
                        `Can't remove obj; id ${this._obj._id} not found in pool.`
                    );
                }
                delete pool[this.id];
            }

            eventGenerator(`remove:${this._obj._type}` as Roll20EventName);
            return this;
        }
    };
    return Roll20Object;
};
