import {
    RankedTable as RankedTableConstructor,
    CustomTableConstructor,
    KeyedTable as KeyedTableConstructor,
} from "../CustomTable";
import { getLogger, Logger } from "../Logger";
import {
    Roll20ObjectInterface,
    Roll20ObjectShapeTypeMap,
    Roll20ObjectType,
} from "../Roll20Object";
import { createRoll20Sandbox, Sandbox } from "../Roll20Sandbox";
import { Roll20ObjectTypedShape } from "../Roll20Sandbox/types";

const createDCCSpellConstructor = ({
    logger,
    sandbox,
    RankedTable = RankedTableConstructor,
    KeyedTable = KeyedTableConstructor,
}: {
    logger?: Logger;
    sandbox: Sandbox;
    RankedTable?: typeof RankedTableConstructor;
    KeyedTable?: typeof KeyedTableConstructor;
}) => {
    const ensureObj = <T extends Roll20ObjectType>(
        shape: Roll20ObjectTypedShape<T>,
        options: any = {}
    ) => {
        const obj =
            sandbox.findObjs<T>(shape, options)[0] ||
            sandbox.createObj(shape._type, shape as any);
        return obj;
    };
    const spellRegistry = ensureObj({
        _type: "rollabletable",
        name: "DCC-SPELL-REGISTRY",
    });

    const getDCCSpellTables = (
        name: string
    ): Roll20ObjectInterface<"rollabletable">[] => {
        const tables = sandbox.filterObjs((obj) => {
            return (
                obj._type === "rollabletable" &&
                obj.get("name").indexOf(`DCC-SPELL-${name.toUpperCase()}-`) ===
                    0
            );
        });
        logger?.info(`Found ${tables.length} tables.`);
        return tables;
    };

    const getDCCSpellTable = (
        name: string,
        subtable: string = "CAST"
    ): Roll20ObjectInterface<"rollabletable"> => {
        return sandbox.findObjs({
            _type: "rollabletable",
            name: `DCC-SPELL-${name.toUpperCase()}-${subtable.toUpperCase()}`,
        })[0];
    };

    /**
     * There is a keyed table used by the overall library, DCC-SPELL-REGISTRY. name=[data::about]
     *
     * There is a ranked table, DCC-SPELL-[SPELL-NAME]-CAST, with minimum required check result and description.
     * There is a corruption table specific to the spell, DCC-SPELL-[SPELL-NAME]-CORRUPTION.
     * There is a misfire table specific to the spell, DCC-SPELL-[SPELL-NAME]-MISFIRE.
     * There is a  table specific to the spell, DCC-SPELL-[SPELL-NAME]-CORRUPTION.
     */

    const enscribe = (spellName: string, data: string) => {
        // accept input to import tables making up a spell.
        // register the spell.

        ensureObj({
            _type: "tableitem",
            _rollabletableid: spellRegistry.id,
            name: `${spellName}=${data}`,
        });
    };

    const eradicate = (spellName: string) => {
        // delete all references to a spell
        const registration = sandbox.filterObjs((obj) => {
            return (
                obj.get("_type") === "tableitem" &&
                obj.get("_rollabletableid") === spellRegistry.id &&
                obj.get("name").indexOf(`${spellName}=`) === 0
            );
        });
        registration.map((obj) => obj.remove());
    };

    const manifest = () => {
        //
    };

    const describe = () => {};

    const spellburn = () => {};

    const corrupt = () => {};

    const misfire = () => {};

    const cast = (name: string, roll: string) => {
        logger?.info(`Casting a spell! "${name}" "${roll}"`);
        const rank = Number(roll);

        if (isNaN(rank)) {
            logger?.error(`Roll "${roll}" could not be parsed into a number.`);
            return;
        }

        const castTable = RankedTable.getTable(getDCCSpellTable(name, "CAST"));
        const value = castTable?.getAtKey(rank);
        if (value.length !== 1) {
            logger?.error(
                `Expected a result, but found ${
                    value.length === 0 ? "none" : "more than one."
                }`
            );
            return;
        }

        sandbox.sendChat("**_magic!_**", `!rt ${value[0].result}`);
        return;
    };

    // const describe = (name: string) => {
    //     // read entry
    // }
};

// // Add a spell (using Table Export script)
// const importDCCSpell = _registerCommand(
//     // !import-dcc-spell [data]
//     "import-dcc-spell",
//     (...rest: any[]) => {
//         logger.info("Importing DCC spell.");
//         sandbox.sendChat("", rest.join("\n"), undefined, {
//             noarchive: true,
//         });
//     }
// );

// // Export a spell (using Table Export script)
// const exportDCCSpell = _registerCommand(
//     // !export-dcc-spell name
//     "export-dcc-spell",
//     (name: string) => {
//         logger.info(`Exporting DCC spell: "${name}"`);
//         // find all the tables related to the spell.
//         const tables = getDCCSpellTables(name);
//         tables.forEach((table) => {
//             sandbox.sendChat("", `!export-table ${table.get("name")}`);
//         });
//     }
// );

// // Remove all of a spell's tables
// const deleteDCCSpell = _registerCommand(
//     // !remove-dcc-spell name
//     "delete-dcc-spell",
//     (name: string) => {
//         logger.info(`Removing DCC spell: "${name}"`);
//         // find all the tables related to the spell.
//         const tables = getDCCSpellTables(name);
//         tables.forEach((table) => {
//             // TODO: do we need to remove the items as well?
//             table.remove();
//         });
//     }
// );

// const castDCCSpell = _registerCommand(
//     // !cast NAME ROLL_OR_RANK
//     "cast",
//     (name: string, roll: string) => {
//         logger.info(`Casting a spell! "${name}" "${roll}"`);
//         const rollAsNumber = Number(roll);
//         if (isNaN(rollAsNumber)) {
//             logger.error(`Roll "${roll}" could not be parsed into a number.`);
//             return;
//         }

//         const castTable = new RankedTable(getDCCSpellTable(name));
//         const value = castTable?.getAtKey(rollAsNumber);
//         if (value.length !== 1) {
//             logger.error(
//                 `Expected a result, but found ${
//                     value.length === 0 ? "none" : "more than one."
//                 }`
//             );
//             return;
//         }

//         sandbox.sendChat("", `!rt ${value[0].result}`);
//         return;
//     }
// );

// const manifestDCCSpell = _registerCommand("manifest", (name: string) => {
//     logger.info(`Manifesting a spell! "${name}`);

//     sandbox.sendChat(
//         "",
//         `!rt <%%91%%><%%91%%>1t<%%91%%>DCC-SPELL-${name.toUpperCase()}-MANIFESTATION<%%93%%><%%93%%><%%93%%>`
//     );
//     return;
// });

// const dccSpellCommands = {
//     importDCCSpell,
//     exportDCCSpell,
//     deleteDCCSpell,
//     castDCCSpell,
//     manifestDCCSpell,
//     describeDCCSpell,
// };

// const getDCCSpellTables = (
//     name: string
// ): Roll20ObjectInterface<"rollabletable">[] => {
//     const tables = sandbox.filterObjs((obj) => {
//         return (
//             obj._type === "rollabletable" &&
//             obj.get("name").indexOf(`DCC-SPELL-${name.toUpperCase()}-`) === 0
//         );
//     });
//     logger.info(`Found ${tables.length} tables.`);
//     return tables;
// };

// const getDCCSpellTable = (
//     name: string,
//     subtable: string = "CAST"
// ): Roll20ObjectInterface<"rollabletable"> => {
//     return sandbox.findObjs({
//         _type: "rollabletable",
//         name: `DCC-SPELL-${name.toUpperCase()}-${subtable.toUpperCase()}`,
//     })[0];
// };
