import { expect } from "chai";
import "mocha";

import {
    Id,
    IdGenerator,
    Roll20ObjectInterface,
    Roll20ObjectShapeTypeMap,
    Roll20ObjectType,
} from "../Roll20Object";
import { getLogger, Logger } from "../Logger";

import { createRoll20Sandbox, Sandbox } from ".";

describe("createRoll20Sandbox", async () => {
    let testNumber = 0;
    let logger: Logger;
    let sandbox: Sandbox;
    let nextId = 0;
    let idGenerator: IdGenerator = () => (++nextId).toString() as Id;
    before(() => {
        logger = getLogger({
            logName: "Roll20Sandbox Tests",
            logLevel: "INFO",
        });
    });
    beforeEach(async () => {
        nextId = 0;
        sandbox = await createRoll20Sandbox({
            logger: logger.child({
                logName: testNumber.toString(),
            }),
            idGenerator,
        });
    });
    afterEach(() => {
        sandbox._dispose();
    });
    after(() => {});
    it(`[${++testNumber}] should return a sandbox object`, async () => {
        expect(!!sandbox).to.equal(true);
        expect(sandbox.state).to.exist;
    });

    it(`[${++testNumber}] should allow Roll20Object management`, async () => {
        const macros = [] as Roll20ObjectInterface<"macro">[];
        // add 10 items
        for (var i = 0; i < 10; i++) {
            macros.push(sandbox.createObj("macro", {}));
        }

        // since we're incrementing ids by 1, we can use it to check what we'ce got.
        expect(macros[0].id).to.equal("1");
        expect(macros[9].id).to.equal("10");
    });
});
