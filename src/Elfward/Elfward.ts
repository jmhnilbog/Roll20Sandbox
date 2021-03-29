import { createRoll20Sandbox, Sandbox } from "../Roll20Sandbox";
import { Id, Roll20ObjectInterface } from "../Roll20Object";
import { getLogger } from "../Logger";
import {
    createCustomTableMessageHandler,
    createRankedTableConstructor,
} from "../CustomTable";

const logger = getLogger({
    logLevel: "TRACE",
    logName: "Elfward",
});

// const tracer = (name: string) => {
//     return (fn: Function) => {
//         return (...rest: any[]) => {
//             const rString = `${rest}`;
//             const argString =
//                 rString.length > 50 ? rString.substr(0, 50) + "..." : rString;
//             logger.trace(`ENTERING ${name}(${argString})`);
//             const r = fn(...rest);
//             logger.trace(`EXITING  ${name}(${argString})`);
//             return r;
//         };
//     };
// };

logger.info("About to createRoll20Sandbox.");

createRoll20Sandbox({
    idGenerator: () => Math.random().toString() as Id,
    logger: logger.child({
        logName: "Roll20Sandbox",
    }),
}).then(async (sandbox) => {
    // Once we're ready...
    sandbox.on("ready", async () => {
        logger.trace("on(ready) heard.");
        // make the sandbox functions 'global' so other libraries think they are
        // within the sandbox.
        sandbox._promote();

        // There's got to be a way to conditionally include these files in a build,
        // but dynamic import() appears to modularize them so they don't have the global
        // side effects we want. We'll probably want to simply concatenate them to the
        // build instead. For now, you'll need them as separate scripts in roll20.

        if (!sandbox._isWithinSandbox()) {
            importLibs();
        }

        const { _registerCommand } = sandbox;

        const c = sandbox.Campaign();

        const RankedTable = createRankedTableConstructor({
            sandbox,
            logger: logger.child({
                logName: "RankedTable",
            }),
        });

        const rankedTableMessageHandler = createCustomTableMessageHandler({
            sandbox,
            logger,
            TableConstructor: RankedTable,
        });
        sandbox.on("chat:message", rankedTableMessageHandler);

        // Add a spell (using Table Export script)
        const importDCCSpell = _registerCommand(
            // !import-dcc-spell [data]
            "import-dcc-spell",
            (...rest: any[]) => {
                logger.info("Importing DCC spell.");
                sandbox.sendChat("", rest.join("\n"), undefined, {
                    noarchive: true,
                });
            }
        );

        // Export a spell (using Table Export script)
        const exportDCCSpell = _registerCommand(
            // !export-dcc-spell name
            "export-dcc-spell",
            (name: string) => {
                logger.info(`Exporting DCC spell: "${name}"`);
                // find all the tables related to the spell.
                const tables = getDCCSpellTables(name);
                tables.forEach((table) => {
                    sandbox.sendChat("", `!export-table ${table.get("name")}`);
                });
            }
        );

        // Remove all of a spell's tables
        const deleteDCCSpell = _registerCommand(
            // !remove-dcc-spell name
            "delete-dcc-spell",
            (name: string) => {
                logger.info(`Removing DCC spell: "${name}"`);
                // find all the tables related to the spell.
                const tables = getDCCSpellTables(name);
                tables.forEach((table) => {
                    // TODO: do we need to remove the items as well?
                    table.remove();
                });
            }
        );

        const castDCCSpell = _registerCommand(
            // !cast NAME ROLL_OR_RANK
            "cast",
            (name: string, roll: string) => {
                logger.info(`Casting a spell! "${name}" "${roll}"`);
                const rollAsNumber = Number(roll);
                if (isNaN(rollAsNumber)) {
                    logger.error(
                        `Roll "${roll}" could not be parsed into a number.`
                    );
                    return;
                }

                const castTable = new RankedTable(getDCCSpellTable(name));
                const value = castTable?.getAtKey(rollAsNumber);
                if (value.length !== 1) {
                    logger.error(
                        `Expected a result, but found ${
                            value.length === 0 ? "none" : "more than one."
                        }`
                    );
                    return;
                }

                sandbox.sendChat("", `!rt ${value[0].result}`);
                return;
            }
        );

        const manifestDCCSpell = _registerCommand(
            "manifest",
            (name: string) => {
                logger.info(`Manifesting a spell! "${name}`);

                sandbox.sendChat(
                    "",
                    `!rt <%%91%%><%%91%%>1t<%%91%%>DCC-SPELL-${name.toUpperCase()}-MANIFESTATION<%%93%%><%%93%%><%%93%%>`
                );
                return;
            }
        );

        const dccSpellCommands = {
            importDCCSpell,
            exportDCCSpell,
            deleteDCCSpell,
            castDCCSpell,
            manifestDCCSpell,
        };

        const getDCCSpellTables = (
            name: string
        ): Roll20ObjectInterface<"rollabletable">[] => {
            const tables = sandbox.filterObjs((obj) => {
                return (
                    obj._type === "rollabletable" &&
                    obj
                        .get("name")
                        .indexOf(`DCC-SPELL-${name.toUpperCase()}-`) === 0
                );
            });
            logger.info(`Found ${tables.length} tables.`);
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

        if (sandbox._isWithinSandbox()) {
            return;
        }
        testElfwardLocally(sandbox);
    });
});

const importLibs = () => {
    "REPLACE WITH LIBS";
};

const testElfwardLocally = (sandbox: Sandbox) => {
    logger.info("Starting local Elfward tests.");

    sandbox._setAsGM("GM" as Id);

    sandbox.Campaign();

    // try a table import
    sandbox.sendChat("", "!import-table --TEST-TABLE --show");
};
