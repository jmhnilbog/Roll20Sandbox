import { LogLevel } from './LOG_LEVEL';
export declare type LoggerConfiguration = {
    logLevel: LogLevel;
    logName: string;
    emissionFn: Function;
};
export declare const getLogger: (config?: Partial<{
    logLevel: LogLevel;
    logName: string;
    emissionFn: Function;
}>) => {
    trace: (...rest: any[]) => any;
    debug: (...rest: any[]) => any;
    info: (...rest: any[]) => any;
    warn: (...rest: any[]) => any;
    error: (...rest: any[]) => any;
    fatal: (...rest: any[]) => any;
    child: (obj?: Partial<{
        logLevel: LogLevel;
        logName: string;
        emissionFn: Function;
    }>) => any;
};
//# sourceMappingURL=getLogger.d.ts.map