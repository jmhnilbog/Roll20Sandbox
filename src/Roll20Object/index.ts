export {
    Roll20ObjectConstructor,
    Roll20ObjectInterface,
    Roll20ObjectShapeTypeMap,
    Roll20ObjectType,
    PlayerId,
    Id,
    IdGenerator,
} from "./types";
export { getShapeDefaults } from "./shapes";

import { createRoll20ObjectConstructor } from "./Roll20Object";
export type Roll20Object = ReturnType<typeof createRoll20ObjectConstructor>;
export { createRoll20ObjectConstructor };
