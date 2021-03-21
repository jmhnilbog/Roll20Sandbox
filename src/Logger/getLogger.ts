import { LogLevel, LOG_LEVEL } from './LOG_LEVEL'

export type LoggerConfiguration = {
    logLevel: LogLevel
    logName: string
    emissionFn: Function
}

export const getLogger = (
    config: Partial<{
        logLevel: LogLevel
        logName: string
        emissionFn: Function
    }> = {}
) => {
    const {
        logLevel = 'INFO',
        logName = 'LOG',
        // @ts-ignore
        emissionFn = log || console?.log || (() => {}),
    } = config

    const logLevelAsNumber = isNaN(Number(logLevel))
        ? LOG_LEVEL[logLevel as keyof typeof LOG_LEVEL]
        : Number(logLevel)
    const level =
        logLevelAsNumber === undefined ? LOG_LEVEL.INFO : logLevelAsNumber

    const _emit = (msgLevel: keyof typeof LOG_LEVEL, ...rest: any[]) => {
        if (level <= LOG_LEVEL[msgLevel]) {
            // @ts-ignore
            return emissionFn(
                `${logName} [${msgLevel}]: ${JSON.stringify(rest)}`
            )
        }
    }

    return {
        trace: (...rest: any[]) => _emit('TRACE', ...rest),
        debug: (...rest: any[]) => _emit('DEBUG', ...rest),
        info: (...rest: any[]) => _emit('INFO', ...rest),
        warn: (...rest: any[]) => _emit('WARN', ...rest),
        error: (...rest: any[]) => _emit('ERROR', ...rest),
        fatal: (...rest: any[]) => _emit('FATAL', ...rest),
        child: (
            obj: Partial<{
                logLevel: LogLevel
                logName: string
                emissionFn: Function
            }> = {}
        ) => {
            return getLogger({
                logName: `${logName}::${obj.logName || '(child)'}`,
                logLevel: obj.logLevel || logLevel,
                emissionFn: obj.emissionFn || emissionFn,
            })
        },
    }
}
