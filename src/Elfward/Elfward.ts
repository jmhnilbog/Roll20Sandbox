import { createRoll20Sandbox, Sandbox } from "../Roll20Sandbox";
import { Id, Roll20ObjectInterface } from "../Roll20Object";
import { getLogger } from "../Logger";
import { createRankedTableConstructor } from "../CustomTable";
import getTopLevelScope from "../util/getTopLevelScope";

const logger = getLogger({
    logLevel: "TRACE",
});

const tracer = (name: string) => {
    return (fn: Function) => {
        return (...rest: any[]) => {
            const rString = `${rest}`;
            const argString =
                rString.length > 50 ? rString.substr(0, 50) + "..." : rString;
            logger.trace(`ENTERING ${name}(${argString})`);
            const r = fn(...rest);
            logger.trace(`EXITING  ${name}(${argString})`);
            return r;
        };
    };
};

// import getTopLevelScope from "../util/getTopLevelScope";
createRoll20Sandbox({
    idGenerator: () => Math.random().toString() as Id,
    logger,
    wrappers: {
        on: tracer("on"),
        sendChat: tracer("sendChat"),
    },
}).then(async (sandbox) => {
    sandbox._promote();

    sandbox.log(
        `Logging from sandbox. Globals: ${Object.keys(sandbox._global)}`
    );
    sandbox.log(sandbox._);
    sandbox.log(sandbox._global._);
    sandbox.log("AGINA");
    sandbox.log(getTopLevelScope()._);

    console.log("COME ON.");
    console.log(Object.keys(sandbox._));
    console.log(Object.keys(global._));

    // @ts-ignore
    await import("../../lib/tableExport");

    sandbox.on("ready", () => {
        sandbox.log("READY BABY!");
        logger.info("ready baby");

        const { _registerCommand } = sandbox;

        const RankedTable = createRankedTableConstructor({
            sandbox,
            logger,
        });

        // set up all the dcc spell casting commands.

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
        const removeDCCSpell = _registerCommand(
            // !remove-dcc-spell name
            "remove-dcc-spell",
            (name: string) => {
                logger.info(`Removing DCC spell: "${name}"`);
                // find all the tables related to the spell.
                const tables = getDCCSpellTables(name);
                tables.forEach((table) => {
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

const testElfwardLocally = (sandbox: Sandbox) => {
    logger.info("Starting local Elfward tests.");

    sandbox._setAsGM("GM" as Id);

    // try a table import
    sandbox.sendChat("", "!import-table --TEST-TABLE --show");
};
