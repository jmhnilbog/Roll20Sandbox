export const LOG_LEVEL = {
    TRACE: 1,
    DEBUG: 5,
    INFO: 10,
    WARN: 20,
    ERROR: 40,
    FATAL: 100,
} as const

export type LogLevel = keyof typeof LOG_LEVEL
