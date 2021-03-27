import "mocha";
import { expect } from "chai";

import { createRoll20ObjectConstructor, Id } from "./";
import { getLogger } from "../Logger";

const logger = getLogger({
    logName: "Roll20Object Tests",
    logLevel: "TRACE",
});
const idGenerator = () => Math.random().toString() as Id;

var testNumber = 0;

describe("createRoll20ObjectConstructor", () => {
    it(`[${++testNumber}] should return a constructor`, () => {
        const Roll20Object = createRoll20ObjectConstructor({
            logger: logger.child({ logName: testNumber.toString() }),
            idGenerator,
        });
        const obj = new Roll20Object("custfx", { definition: "garg" });
        expect(obj.get("definition")).to.equal("garg");
        expect(obj.get("_type")).to.equal("custfx");
        expect(obj).to.be.instanceOf(Roll20Object);
    });

    describe("Roll20Object", () => {
        it(`[${++testNumber}] should maintain type info for individual types`, () => {
            const Roll20Object = createRoll20ObjectConstructor({
                logger: logger.child({ logName: testNumber.toString() }),
                idGenerator,
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

        it(`[${++testNumber}] should allow get and set`, () => {
            const Roll20Object = createRoll20ObjectConstructor({
                logger: logger.child({ logName: testNumber.toString() }),
                idGenerator,
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

        it(`[${++testNumber}] should support object pooling`, () => {
            const pool = {} as Record<string, any>;

            const Roll20Object = createRoll20ObjectConstructor({
                logger: logger.child({ logName: testNumber.toString() }),
                idGenerator,
                pool,
            });
            const testAbility = new Roll20Object("ability", {
                _id: "XXIDXX" as Id,
                description: "Test Ability",
            });
            expect(testAbility).to.be.instanceOf(Roll20Object);

            expect(Object.keys(pool).length).to.equal(1);

            const others = Array.from(Array(10).keys()).map((n) => {
                return new Roll20Object("attribute", {
                    _id: (Math.random() + n).toString() as Id,
                    current: Math.random(),
                    max: Math.random(),
                });
            });

            expect(Object.keys(pool).length).to.equal(11);

            testAbility.remove();
            expect(Object.keys(pool).length).to.equal(10);
        });

        it(`[${++testNumber}] should cause remove events`, () => {
            const events = {} as Record<string, any>;
            const eventGenerator = (name: string, ...rest: any[]) => {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(rest);
            };
            const Roll20Object = createRoll20ObjectConstructor({
                logger: logger.child({ logName: testNumber.toString() }),
                idGenerator,
                eventGenerator,
            });
            const testAbility = new Roll20Object("ability", {
                _id: "XXIDXX" as Id,
                description: "Test Ability",
            });
            expect(testAbility).to.be.instanceOf(Roll20Object);
            expect(events["remove:ability"]).to.be.undefined;

            testAbility.remove();
            expect(events["remove:ability"]).to.have.length(1);
        });

        it(`[${++testNumber}] should cause add events`, () => {
            const events = {} as Record<string, any>;
            const eventGenerator = (name: string, ...rest: any[]) => {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(rest);
            };
            const Roll20Object = createRoll20ObjectConstructor({
                logger: logger.child({ logName: testNumber.toString() }),
                idGenerator,
                eventGenerator,
            });
            expect(events["add:ability"]).to.be.undefined;
            const testAbility = new Roll20Object("ability", {
                _id: "XXIDXX" as Id,
                description: "Test Ability",
            });
            expect(testAbility).to.be.instanceOf(Roll20Object);
            expect(events["add:ability"]).to.have.length(1);
        });

        it(`[${++testNumber}] should cause change events`, () => {
            const events = {} as Record<string, any>;
            const eventGenerator = (name: string, ...rest: any[]) => {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(rest);
            };
            const Roll20Object = createRoll20ObjectConstructor({
                logger: logger.child({ logName: testNumber.toString() }),
                idGenerator,
                eventGenerator,
            });
            const testAbility = new Roll20Object("ability", {
                _id: "XXIDXX" as Id,
                description: "Test Ability",
            });
            expect(events["change:ability:name"]).to.be.undefined;
            expect(testAbility).to.be.instanceOf(Roll20Object);

            testAbility.set("name", "fred");
            expect(events["change:ability:name"]).to.have.length(1);
        });
    });
});
