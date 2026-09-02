const fs = require('fs');

global.window = global;
global.location = { hostname: 'localhost', origin: 'http://localhost:8000', reload: () => {} };
global.window.location = global.location;
global.document = {
    readyState: 'complete',
    addEventListener: () => {},
    getElementById: (id) => ({
        value: '',
        style: {},
        innerHTML: '',
        textContent: '',
        addEventListener: () => {},
        classList: { add: () => {}, remove: () => {}, contains: () => false }
    }),
    querySelector: () => ({
        style: {},
        classList: { add: () => {}, remove: () => {} },
        addEventListener: () => {}
    }),
    querySelectorAll: () => []
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};
global.sessionStorage = {
    getItem: () => null,
    setItem: () => {}
};
global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });

try {
    const dataCode = fs.readFileSync('data.js', 'utf8');
    eval(dataCode);
    console.log("data.js evaluated successfully! APP_BUILD_VERSION =", APP_BUILD_VERSION);

    const appCode = fs.readFileSync('app.js', 'utf8');
    eval(appCode);
    console.log("app.js evaluated successfully! ZERO SYNTAX / RUNTIME ERRORS!");
} catch (err) {
    console.error("RUNTIME/SYNTAX ERROR:", err);
    process.exit(1);
}
