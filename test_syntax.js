const fs = require('fs');
const acorn = require('acorn');

const code = fs.readFileSync('app.js', 'utf8');
try {
    acorn.parse(code, { ecmaVersion: 2022 });
    console.log("No syntax errors with acorn!");
} catch (e) {
    console.log("Syntax error at line", e.loc ? e.loc.line : e.lineNumber, "col", e.loc ? e.loc.column : e.column);
    console.log(e.message);
    const lines = code.split('\n');
    if (e.loc) {
        console.log("Line content:", lines[e.loc.line - 1]);
    }
}
