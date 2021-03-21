import { Logger } from '../Logger';
import { Roll20ObjectShapeTypeMap, EventGenerator, IdGenerator, Id } from './types';
export declare const createRoll20ObjectCreator: ({ logger, idGenerator, pool, eventGenerator, }: {
    logger?: {
        trace: (...rest: any[]) => any;
        debug: (...rest: any[]) => any;
        info: (...rest: any[]) => any;
        warn: (...rest: any[]) => any;
        error: (...rest: any[]) => any;
        fatal: (...rest: any[]) => any;
        child: (obj?: Partial<{
            logLevel: "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";
            logName: string;
            emissionFn: Function;
        }>) => any;
    } | undefined;
    idGenerator: IdGenerator;
    pool?: Record<string, any> | undefined;
    eventGenerator: EventGenerator;
}) => {
    new <T extends keyof Roll20ObjectShapeTypeMap>(type: T, obj?: Partial<Roll20ObjectShapeTypeMap[T]>): {
        _obj: Roll20ObjectShapeTypeMap[T];
        get<K extends keyof Roll20ObjectShapeTypeMap[T]>(key: K, cb?: ((x: any) => Roll20ObjectShapeTypeMap[T][K]) | undefined): Roll20ObjectShapeTypeMap[T][K];
        readonly id: Id;
        /**
         * Mutator for a Roll20Object property. The immutability of
         * some keys is enforced.
         */
        set<K_2 extends keyof Roll20ObjectShapeTypeMap[T]>(changes: Partial<Roll20ObjectShapeTypeMap[T]>): void;
        /**
         * Mutator for a Roll20Object property. The immutability of
         * some keys is enforced.
         */
        set<K_3 extends keyof Roll20ObjectShapeTypeMap[T]>(key: K_3, value: Roll20ObjectShapeTypeMap[T][K_3]): void;
        /**
         * Makes a set of changes to a Roll20Object via webworker. To receive
         * notice that the change has completed, you must register an
         * @param changes
         */
        setWithWorker(changes: Partial<Roll20ObjectShapeTypeMap[T]>): void;
        remove(): any;
    };
    _createShape: <T_1 extends keyof Roll20ObjectShapeTypeMap>(type: T_1, obj: Partial<Roll20ObjectShapeTypeMap[T_1]>) => Roll20ObjectShapeTypeMap[T_1];
};
//# sourceMappingURL=Roll20Object.d.ts.map