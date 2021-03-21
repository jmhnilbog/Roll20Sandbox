import { LOG_LEVEL, LogLevel } from './LOG_LEVEL';
import { getLogger } from './getLogger';
export declare type Logger = ReturnType<typeof getLogger>;
export declare type LoggerConfiguration = Parameters<typeof getLogger>[0];
export declare type LoggerCreator = (cfg: LoggerConfiguration) => Logger;
export { getLogger, LOG_LEVEL, LogLevel };
//# sourceMappingURL=index.d.ts.map