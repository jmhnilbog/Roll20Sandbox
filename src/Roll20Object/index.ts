export {
    Roll20ObjectConstructor,
    Roll20ObjectInterface,
    Roll20ObjectShapeTypeMap,
    Roll20ObjectType,
    PlayerId,
    Id,
} from "./types";
export { getShapeDefaults } from "./shapes";
export { createRoll20ObjectConstructor as createRoll20ObjectCreator } from "./Roll20Object";

import { createRoll20ObjectConstructor } from "./Roll20Object";
export type Roll20Object = ReturnType<typeof createRoll20ObjectConstructor>;
