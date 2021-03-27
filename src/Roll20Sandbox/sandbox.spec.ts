import { expect } from "chai";
import "mocha";

import { Id, Roll20ObjectType } from "../Roll20Object";
import { createRoll20Sandbox } from "./sandbox";
import { getLogger } from "../Logger";

const idGenerator = () => Math.random().toString() as Id;

var testNumber = 0;
const logger = getLogger();

const events = {} as Record<string, any>;

describe("createRoll20Sandbox", async () => {
    it(`[${++testNumber}] should return an api object`, async () => {
        const sandbox = await createRoll20Sandbox({
            logger: logger.child({
                logName: testNumber.toString(),
            }),
            idGenerator,
        });

        expect(!!sandbox).to.equal(true);

        sandbox._dispose();
    });

    it(`[${++testNumber}] should support wrapping`, async () => {
        const sandbox = await createRoll20Sandbox({
            logger,
            idGenerator,
            wrappers: {
                createObj: (createFn: Function) => {
                    logger.trace(`createObj()[WRAPPER]`);
                    return (type: Roll20ObjectType, obj: any) => {
                        logger.info(
                            `Attempting createObj(${type}, ${JSON.stringify(
                                obj
                            )}).`
                        );
                        let newObj;
                        try {
                            newObj = createFn(type, obj);
                        } catch (err) {
                            logger.info(
                                `Failed to createObj: ${err.toString()}`
                            );
                            throw err;
                        }
                        logger.info(
                            `createObj(${type}, ${JSON.stringify(
                                obj
                            )}) returned: ${JSON.stringify(newObj)}.`
                        );
                        return newObj;
                    };
                },
            },
        });

        expect(!!sandbox).to.equal(true);

        const myCustFX = sandbox.createObj("custfx", { definition: "foo" });

        expect(myCustFX.get("definition") === "foo").to.equal(true);
        myCustFX.remove();

        sandbox._dispose();
    });
});
