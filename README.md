# Roll20Sandbox

Trying to make Roll20Api stuff less of a PITA.

```
# build to JS (you upload build/upload.js to the API)
npm run build

# run your tests locally (*.spec.ts)
npm run test

# run a sample campaign locally
npm run start::elfward

```

## What's Here

### Logger

A logger that dumps to console locally and uses 'log' in the sandbox.

### Roll20Object

A Roll20Object stand-in used outside of the sandbox.

### Roll20Sandbox

A stand-in for the actual sandbox. You can 'promote' the stand-in to the global scope so other libraries will work locally. The sandbox also has some extra functions exposed to allow you to fake things like object selection and zindex changes, or setting the GM.

### CustomTable

Want to process rollable tables a special way? Use this. Includes "RankedTable", which lets you work with tables that give a result at a value or lower (1 is a critical failure, 9 is a failure, 10+ is a hit, etc.)
