import "mocha";
import { assert, expect } from "chai";

import { getTopLevelScope } from "./index";

describe("getTopLevelScope", () => {
    it("should find 'global' within node.js", () => {
        const testScope = getTopLevelScope();
        try {
            expect(testScope).to.equal(global);
        } catch (err) {
            assert.fail(err);
        }
    });

    it("should accept new keys which are also available globally", () => {
        const testScope = getTopLevelScope();
        try {
            testScope.testKey = "testValue";
            expect(testScope.testKey).to.equal("testValue");
            // @ts-ignore
            expect(testScope.testKey).to.equal(global.testKey);
            // @ts-ignore
            expect(global.testKey).to.equal("testValue");
        } catch (err) {
            assert.fail(err);
        }
    });
});
