import "mocha";
import { expect } from "chai";

import { Id } from "./types";
import { createRoll20ObjectConstructor } from "./Roll20Object";

const logger = {
    ...(console || {}),
    fatal: (...rest: any[]) => {
        logger.error(...rest);
        throw new Error(...rest);
    },
    child: () => logger,
};

const idGenerator = () => Math.random().toString() as Id;

describe("createRoll20ObjectConstructor", () => {
    it("should return a constructor", () => {
        const pool = {} as Record<string, any>;
        const events = {} as Record<string, any>;
        const eventGenerator = (name: string, ...rest: any[]) =>
            (events[name] = rest);
        const Roll20Object = createRoll20ObjectConstructor({
            logger,
            idGenerator,
            pool,
            eventGenerator,
        });
        const obj = new Roll20Object("custfx", { definition: "garg" });
        pool[obj.id] = obj;
        expect(obj.get("definition")).to.equal("garg");
        expect(obj).to.be.instanceOf(Roll20Object);
    });

    describe("Roll20Object", () => {
        it("should maintain type info for individual types", () => {
            const pool = {} as Record<string, any>;
            const events = {} as Record<string, any>;
            const eventGenerator = (name: string, ...rest: any[]) =>
                (events[name] = rest);
            const Roll20Object = createRoll20ObjectConstructor({
                logger,
                idGenerator,
                pool,
                eventGenerator,
            });
            const testAbility = new Roll20Object("ability", {
                _id: "XXIDXX" as Id,
                description: "Test Ability",
            });
            expect(testAbility).to.be.instanceOf(Roll20Object);

            const description = testAbility.get("description");
            expect(description).to.equal("Test Ability");

            const id = testAbility.id;
            expect(id).to.equal("XXIDXX");
        });

        it("should allow get and set", () => {
            const pool = {} as Record<string, any>;
            const events = {} as Record<string, any>;
            const eventGenerator = (name: string, ...rest: any[]) =>
                (events[name] = rest);
            const Roll20Object = createRoll20ObjectConstructor({
                logger,
                idGenerator,
                pool,
                eventGenerator,
            });
            const testAbility = new Roll20Object("ability", {
                _id: "XXIDXX" as Id,
                description: "Test Ability",
            });
            expect(testAbility).to.be.instanceOf(Roll20Object);

            const description = testAbility.get("description");
            expect(description).to.equal("Test Ability");

            const id = testAbility.id;
            expect(id).to.equal("XXIDXX");

            testAbility.set({ name: "TEST NAME" });
            expect(testAbility.get("name")).to.equal("TEST NAME");
        });
    });
});
