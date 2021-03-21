// import { LoggerCreator } from '.'

// // @ts-ignore
// const console = console || {
//     trace: (...rest: any[]) => {},
//     debug: (...rest: any[]) => {},
//     info: (...rest: any[]) => {},
//     warn: (...rest: any[]) => {},
//     error: (...rest: any[]) => {},
// }

// export const getMockLogger: LoggerCreator = (cfg) => {
//     const logger = {
//         ...{console,
//         fatal: (...rest: any[]) => {
//             logger.error(...rest)
//             throw new Error(...rest)
//         },
//         child: () => logger,
//     }
//     return logger
// }
