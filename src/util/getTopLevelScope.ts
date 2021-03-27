let _root: any;

export const getTopLevelScope = () => {
    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.

    if (!_root) {
        _root =
            (typeof self == "object" && self.self === self && self) ||
            // @ts-ignore
            (typeof global == "object" && global.global === global && global) ||
            Function("return this")() ||
            {};
    }
    return _root;
};

export default getTopLevelScope;
