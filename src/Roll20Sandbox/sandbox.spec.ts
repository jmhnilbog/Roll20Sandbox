import { expect } from "chai";
import "mocha";

import { Id, Roll20ObjectType } from "../Roll20Object";
import { createRoll20Sandbox } from "./sandbox";
import { getLogger } from "../Logger";

const idGenerator = () => Math.random().toString() as Id;

const logger = getLogger();
const pool = {} as Record<string, any>;
const events = {} as Record<string, any>;

describe("createRoll20Sandbox", async () => {
    it("should return an api object", async () => {
        const sandbox = await createRoll20Sandbox({
            logger,
            pool,
            idGenerator,
        });

        expect(!!sandbox).to.equal(true);

        const myCustFX = sandbox.createObj("custfx", { definition: "foo" });
        console.log(myCustFX.get("definition"));
        expect(myCustFX.get("definition") === "foo").to.equal(true);
        expect(pool[myCustFX.id]).to.equal(myCustFX);
        console.log("POOL");
        console.log(pool);
        myCustFX.remove();
        expect(pool[myCustFX.id as string]).to.be.undefined;
    });

    it("should support wrapping", async () => {
        const sandbox = await createRoll20Sandbox({
            logger,
            pool,
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
        console.log(myCustFX.get("definition"));
        expect(myCustFX.get("definition") === "foo").to.equal(true);
        expect(pool[myCustFX.id]).to.equal(myCustFX);
        console.log("POOL");
        console.log(pool);
        myCustFX.remove();
        expect(pool[myCustFX.id as string]).to.be.undefined;
    });
});
