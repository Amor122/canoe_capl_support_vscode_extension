const fs = require('fs');

const DETAILED_FILE = 'D:/PY_PROJECTS/vector_capl_extension/DETAILED_FUNCTIONS_FINAL.json';
const OUTPUT_FILE = 'D:/PY_PROJECTS/vector_capl_extension/src/caplData.ts';

const detailed = JSON.parse(fs.readFileSync(DETAILED_FILE, 'utf8'));

function cleanStr(str) {
    if (!str) return '';
    return str
        .replace(/Function Syntax /i, '')
        .replace(/Description /i, '')
        .replace(/Parameters /i, '')
        .replace(/Return Values /i, '')
        .replace(/Example /i, '')
        .replace(/'/g, '')
        .replace(/`/g, '')
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 250);
}

function formatDoc(func) {
    let doc = '';
    if (func.syntax) doc = doc + 'Syntax: ' + cleanStr(func.syntax) + '\n';
    if (func.description) doc = doc + 'Description: ' + cleanStr(func.description) + '\n';
    if (func.parameters && func.parameters !== 'Parameters —') doc = doc + 'Parameters: ' + cleanStr(func.parameters) + '\n';
    if (func.returnValues && func.returnValues !== 'Return Values —') doc = doc + 'Returns: ' + cleanStr(func.returnValues);
    doc = doc.replace(/'/g, '').substring(0, 600);
    return doc.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"');
}

let output = "export const CAPL_KEYWORDS: Record<string, string> = {\n";
output += "    'on': 'on event - Event handler',\n";
output += "    'if': 'if(cond) - Conditional',\n";
output += "    'else': 'else - Alternative branch',\n";
output += "    'while': 'while(cond) - Loop',\n";
output += "    'for': 'for(init;cond;inc) - For loop',\n";
output += "    'switch': 'switch(val) - Switch',\n";
output += "    'case': 'case - Case label',\n";
output += "    'default': 'default - Default case',\n";
output += "    'break': 'break - Break',\n";
output += "    'continue': 'continue - Continue',\n";
output += "    'return': 'return - Return',\n";
output += "    'void': 'void - No return type',\n";
output += "    'const': 'const - Constant',\n";
output += "    'static': 'static - Static',\n";
output += "    'extern': 'extern - External',\n";
output += "    'volatile': 'volatile - Volatile',\n";
output += "};\n\n";

output += "export const CAPL_FUNCTIONS: Record<string, string> = {\n";
detailed.forEach(func => {
    const name = func.name;
    const doc = formatDoc(func);
    if (name && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name) && doc.length > 15) {
        output += "    '" + name + "': '" + doc + "',\n";
    }
});
output += "};\n\n";

output += "export const CAPL_TYPES: Record<string, string> = {\n";
output += "    'BYTE': 'BYTE - 8-bit unsigned',\n";
output += "    'WORD': 'WORD - 16-bit unsigned',\n";
output += "    'DWORD': 'DWORD - 32-bit unsigned',\n";
output += "    'INT': 'INT - 16-bit signed',\n";
output += "    'LONG': 'LONG - 32-bit signed',\n";
output += "    'FLOAT': 'FLOAT - Float',\n";
output += "    'DOUBLE': 'DOUBLE - Double',\n";
output += "    'CHAR': 'CHAR - Character',\n";
output += "    'STRING': 'STRING - String',\n";
output += "    'ENUM': 'ENUM - Enum',\n";
output += "    'STRUCT': 'STRUCT - Struct',\n";
output += "    'ARRAY': 'ARRAY - Array',\n";
output += "    'INT64': 'INT64 - 64-bit signed',\n";
output += "    'QWORD': 'QWORD - 64-bit unsigned',\n";
output += "    'BOOL': 'BOOL - Boolean',\n";
output += "    'handle': 'handle - Handle',\n";
output += "    'dword': 'dword - 32-bit',\n";
output += "    'qword': 'qword - 64-bit',\n";
output += "    'int': 'int - Integer',\n";
output += "    'long': 'long - Long',\n";
output += "    'float': 'float - Float',\n";
output += "    'double': 'double - Double',\n";
output += "    'byte': 'byte - Byte',\n";
output += "    'word': 'word - Word',\n";
output += "    'char': 'char - Char',\n";
output += "    'void': 'void - Void',\n";
output += "};\n";

fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
console.log('Written caplData.ts with ' + detailed.length + ' functions');