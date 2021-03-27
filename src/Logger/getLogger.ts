import _ from "underscore";

import { LoggerConfiguration, LOG_LEVEL } from "./types";

// store log messages if we don't have a place to emit them yet.
let logArchive: any[];
const fallbackEmissionFn = (...rest: any[]) => {
    logArchive = logArchive || [];
    logArchive.push(rest);
};

let defaultEmissionFnForEnvironment: typeof fallbackEmissionFn;
try {
    defaultEmissionFnForEnvironment = log;
} catch (err) {
    //
    true;
}
try {
    if (console && console?.log) {
        defaultEmissionFnForEnvironment = (...rest: any[]) => {
            console.log(...rest);
        };
    }
} catch (err) {
    //
    true;
}

/**
 * Returns a basic logger.
 */
export const getLogger = ({
    logLevel = "INFO",
    logName = "LOG",
    emissionFn = defaultEmissionFnForEnvironment || fallbackEmissionFn,
}: Partial<LoggerConfiguration> = {}) => {
    const logLevelAsNumber = isNaN(Number(logLevel))
        ? LOG_LEVEL[logLevel as keyof typeof LOG_LEVEL]
        : Number(logLevel);
    const level =
        logLevelAsNumber === undefined ? LOG_LEVEL.INFO : logLevelAsNumber;

    const _emit = (msgLevel: keyof typeof LOG_LEVEL, ...rest: any[]) => {
        if (level <= LOG_LEVEL[msgLevel]) {
            return emissionFn(`${logName} [${msgLevel}]: ${rest}`);
        }
    };

    return {
        trace: (...rest: any[]) => {
            // get a stack trace
            const err = new Error();
            const stack = err.stack?.split("\n")[2];
            const cleanStack = stack || "";
            _emit("TRACE", ...rest, cleanStack);
        },
        debug: (...rest: any[]) => _emit("DEBUG", ...rest),
        info: (...rest: any[]) => _emit("INFO", ...rest),
        warn: (...rest: any[]) => _emit("WARN", ...rest),
        error: (...rest: any[]) => _emit("ERROR", ...rest),
        fatal: (...rest: any[]) => {
            const err =
                rest[0] instanceof Error ? rest.shift() : new Error(`${rest}`);
            _emit("FATAL", err, ...rest);
            throw err;
        },
        child: (obj: Partial<LoggerConfiguration> = {}) => {
            _emit("TRACE", `child(${JSON.stringify(obj)})`);
            return getLogger({
                logName: `${logName}::${obj.logName || "(child)"}`,
                logLevel: obj.logLevel || logLevel,
                emissionFn: obj.emissionFn || emissionFn,
            });
        },
    } as const;
};

export type Logger = ReturnType<typeof getLogger>;
