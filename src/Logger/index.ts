import { LOG_LEVEL, LogLevel } from './LOG_LEVEL'

import { getLogger } from './getLogger'

export type Logger = ReturnType<typeof getLogger>

export type LoggerConfiguration = Parameters<typeof getLogger>[0]

export type LoggerCreator = (cfg: LoggerConfiguration) => Logger

export { getLogger, LOG_LEVEL, LogLevel }
//export { getMockLogger } from './getMockLogger'
