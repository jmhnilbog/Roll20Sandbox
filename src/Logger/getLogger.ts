import getTopLevelScope from "../util/getTopLevelScope";
import { inspect } from "util";

import { LoggerConfiguration, LOG_LEVEL } from "./types";

/**
 * Returns a basic logger.
 */
export const getLogger = ({
    logLevel = "INFO",
    logName = "LOG",
    emissionFn,
}: Partial<LoggerConfiguration> = {}) => {
    let outFn =
        emissionFn ||
        getTopLevelScope().log ||
        getTopLevelScope().console?.log ||
        (() => {});

    const logLevelAsNumber = isNaN(Number(logLevel))
        ? LOG_LEVEL[logLevel as keyof typeof LOG_LEVEL]
        : Number(logLevel);
    const level =
        logLevelAsNumber === undefined ? LOG_LEVEL.INFO : logLevelAsNumber;

    const _emit = (msgLevel: keyof typeof LOG_LEVEL, ...rest: any[]) => {
        if (level <= LOG_LEVEL[msgLevel]) {
            // @ts-ignore
            return outFn(`${logName} [${msgLevel}]: ${inspect(rest)}`);
        }
    };

    return {
        trace: (...rest: any[]) => _emit("TRACE", ...rest),
        debug: (...rest: any[]) => _emit("DEBUG", ...rest),
        info: (...rest: any[]) => _emit("INFO", ...rest),
        warn: (...rest: any[]) => _emit("WARN", ...rest),
        error: (...rest: any[]) => _emit("ERROR", ...rest),
        fatal: (...rest: any[]) => _emit("FATAL", ...rest),
        child: (obj: Partial<LoggerConfiguration> = {}) => {
            return getLogger({
                logName: `${logName}::${obj.logName || "(child)"}`,
                logLevel: obj.logLevel || logLevel,
                emissionFn: obj.emissionFn || outFn,
            });
        },
    } as const;
};

export type Logger = ReturnType<typeof getLogger>;
