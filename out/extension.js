"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const caplData_1 = require("./caplData");
const docSelector = { language: 'capl', scheme: 'file' };
const ALL_SYMBOLS = new Map();
const TYPE_MAP = {
    'byte': ['byte', 'char', 'int', 'long', 'word', 'dword', 'qword'],
    'int': ['int', 'long', 'word', 'dword', 'qword', 'byte', 'char'],
    'long': ['long', 'dword', 'int', 'qword', 'word', 'byte', 'char'],
    'word': ['word', 'dword', 'int', 'long', 'byte', 'char', 'qword'],
    'dword': ['dword', 'long', 'word', 'int', 'qword', 'byte', 'char'],
    'qword': ['qword', 'dword', 'long', 'word', 'int', 'byte', 'char'],
    'float': ['float', 'double'],
    'double': ['double', 'float'],
    'char': ['char', 'byte', 'int', 'long', 'word', 'dword', 'qword'],
    'boolean': ['boolean', 'byte', 'int', 'long'],
    'struct': ['struct', 'byte', 'char', 'array', 'byte[]', 'char[]'],
    'union': ['union', 'byte', 'char', 'array', 'byte[]', 'char[]'],
    'array': ['array', 'byte', 'char', 'byte[]', 'char[]'],
    'timer': ['timer', 'mstimer', 'dword', 'long'],
    'mstimer': ['mstimer', 'timer', 'dword', 'long'],
    'int64': ['int64', 'qword', 'dword', 'long'],
    'string': ['string', 'char', 'byte', 'text'],
    'text': ['text', 'string', 'char', 'byte'],
    'message': ['message', 'dword', 'qword', 'long'],
    'signal': ['signal', 'dword', 'qword', 'long'],
};
const getExpectedTypes = (paramType) => {
    const t = paramType.toLowerCase().replace(/\s*(array|\[\])?$/, '').trim();
    return TYPE_MAP[t] || [t];
};
const isTypeCompatible = (actualType, expectedTypes) => {
    const a = actualType.toLowerCase().replace(/\s*(array|\[\])?$/, '').trim();
    const actualCompat = TYPE_MAP[a] || [a];
    for (const act of actualCompat) {
        for (const exp of expectedTypes) {
            if (act === exp)
                return true;
        }
    }
    return false;
};
const getVariableType = (varName, document, currentLine) => {
    const text = document.getText();
    const lines = text.split('\n');
    // Find current function/envent handler scope - search backwards from currentLine
    let funcStart = 0;
    let isInFunction = false;
    for (let i = currentLine - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (/^(void|int|long|float|double|char|byte|word|dword|qword|timer|mstimer|int64|string|text|message)\s+\w+\s*\(/.test(line) ||
            /^on\s+/.test(line)) {
            funcStart = i + 1;
            isInFunction = true;
            break;
        }
    }
    let searchLimit = currentLine > 0 ? currentLine - 1 : lines.length;
    const scopeStart = funcStart > 0 ? funcStart : 0;
    // Helper to search variables in a range
    const searchInRange = (start, end) => {
        for (let i = start; i < end; i++) {
            const line = lines[i].trim();
            // Function parameters (only if isInFunction)
            if (isInFunction) {
                const funcMatch = line.match(/^(void|int|long|float|double|char|byte|word|dword|qword|timer|mstimer|int64|string|text|message)\s+(\w+)\s*\(([^)]*)\)/i);
                if (funcMatch) {
                    const params = funcMatch[3].split(',');
                    for (const p of params) {
                        const pm = p.match(/\b(const\s+)?(dword|word|byte|int|long|float|double|qword|boolean|timer|mstimer|int64|string|text|char|message|signal)\s+(\w+)/i);
                        if (pm && pm[3] && pm[3].toLowerCase() === varName.toLowerCase()) {
                            return (pm[2] || 'dword').toLowerCase();
                        }
                    }
                }
            }
            // pdu/message declarations
            const msgDecl = line.match(/^\s*(pdu|message|ethernetPacket|flexraymessage|a664frame|a664message|linframe|pg)(?:\s+\w+)?(?:\s+0x[\da-fA-F]+)?\s*\*?\s*(\w+)\s*[;=,\[]/i);
            if (msgDecl && msgDecl[2] && msgDecl[2].toLowerCase() === varName.toLowerCase()) {
                return 'message';
            }
            // ethernetPacket flexraymessage etc without keyword
            const implicitMsg = line.match(/^\s*(ethernetPacket|flexraymessage|a664frame|a664message|linframe|pg)\s+(\w+)\s*[;=,\[]/i);
            if (implicitMsg && implicitMsg[2] && implicitMsg[2].toLowerCase() === varName.toLowerCase()) {
                return 'message';
            }
            // for loop
            const forDecl = line.match(/^\s*for\s*\(\s*(\w+(?:\[\])?)\s+(\w+)\s*:/i);
            if (forDecl && forDecl[2] && forDecl[2].toLowerCase() === varName.toLowerCase()) {
                return forDecl[1].replace('[]', '').toLowerCase();
            }
            // stack/queue
            const stackDecl = line.match(/^\s*(const\s+)?stack\s+(\w+)\s+(\w+)\s*[;=,\[]/i);
            if (stackDecl && stackDecl[3] && stackDecl[3].toLowerCase() === varName.toLowerCase()) {
                return 'stack';
            }
            const queueDecl = line.match(/^\s*(const\s+)?queue\s+(\w+)\s+(\w+)\s*[;=,\[]/i);
            if (queueDecl && queueDecl[3] && queueDecl[3].toLowerCase() === varName.toLowerCase()) {
                return 'queue';
            }
            // basic types
            const basicDecl = line.match(/^\s*(const\s+)?(dword|word|byte|int|long|float|double|qword|boolean|timer|mstimer|int64|string|text|char)\s+(\w+)\s*[;=,\[]/i);
            if (basicDecl && basicDecl[3] && basicDecl[3].toLowerCase() === varName.toLowerCase()) {
                return (basicDecl[2] || 'dword').toLowerCase();
            }
        }
        return null;
    };
    // First search in function scope (if in function)
    if (isInFunction) {
        const result = searchInRange(funcStart, searchLimit);
        if (result)
            return result;
    }
    // If not found in function (or not in function), search from line 0 to find globals
    return searchInRange(0, lines.length) || searchIncludedFiles(document, varName) || '';
};
// Helper to search for symbols in included files (recursively)
const searchIncludedFiles = (document, varName, visited = new Set()) => {
    const docPath = document.uri.fsPath;
    const docDir = docPath.replace(/[/\\][^/\\]+$/, '');
    const text = document.getText();
    const lines = text.split('\n');
    // Find all included files
    const includePaths = [];
    for (const line of lines) {
        const match = line.match(/#include\s*[<"]([^>"]+)[>"]/);
        if (match) {
            const incPath = match[1];
            let fullPath;
            if (incPath.startsWith('/') || (incPath.length > 1 && incPath[1] === ':')) {
                fullPath = incPath;
            }
            else {
                fullPath = docDir + '/' + incPath;
            }
            if (!visited.has(fullPath)) {
                includePaths.push(fullPath);
            }
        }
    }
    // Search in each included file (recursively)
    for (const incPath of includePaths) {
        visited.add(incPath);
        try {
            const incDoc = vscode.workspace.textDocuments.find(d => d.uri.fsPath === incPath);
            if (incDoc) {
                const incText = incDoc.getText();
                const incLines = incText.split('\n');
                for (let i = 0; i < incLines.length; i++) {
                    const line = incLines[i].trim();
                    // Check for variable declarations
                    const varMatch = line.match(/^\s*(const\s+)?(dword|word|byte|int|long|float|double|qword|boolean|timer|mstimer|int64|string|text|char)\s+(\w+)\s*[;=,\[]/i);
                    if (varMatch && varMatch[3] && varMatch[3].toLowerCase() === varName.toLowerCase()) {
                        return (varMatch[2] || 'dword').toLowerCase();
                    }
                    // Check for message declarations
                    const msgDecl = line.match(/^\s*(pdu|message|ethernetPacket|flexraymessage|a664frame|a664message|linframe|pg)(?:\s+\w+)?(?:\s+0x[\da-fA-F]+)?\s*\*?\s*(\w+)\s*[;=,\[]/i);
                    if (msgDecl && msgDecl[2] && msgDecl[2].toLowerCase() === varName.toLowerCase()) {
                        return 'message';
                    }
                    // Check for stack/queue
                    const stackDecl = line.match(/^\s*(const\s+)?stack\s+(\w+)\s+(\w+)\s*[;=,\[]/i);
                    if (stackDecl && stackDecl[3] && stackDecl[3].toLowerCase() === varName.toLowerCase()) {
                        return 'stack';
                    }
                    const queueDecl = line.match(/^\s*(const\s+)?queue\s+(\w+)\s+(\w+)\s*[;=,\[]/i);
                    if (queueDecl && queueDecl[3] && queueDecl[3].toLowerCase() === varName.toLowerCase()) {
                        return 'queue';
                    }
                }
                // Recursively search in nested includes
                const nestedResult = searchIncludedFiles(incDoc, varName, visited);
                if (nestedResult)
                    return nestedResult;
            }
        }
        catch (e) {
            // Skip if file cannot be read
        }
    }
    return '';
};
const getFunctionParams = (syntaxLine, argCount) => {
    const cleanSyntax = syntaxLine.replace(/.*Syntax:\s*/i, '');
    const formParts = cleanSyntax.split(/\/\/\s*form\s*\d+/i);
    for (const form of formParts) {
        const trimmed = form.trim();
        if (!trimmed.includes('('))
            continue;
        const pm = trimmed.match(/\(([^)]*)\)/);
        if (pm) {
            const fp = pm[1].split(',').filter(p => p.trim());
            const isVariadic = fp.some(p => p.includes('...'));
            if (isVariadic) {
                const minParams = fp.filter(p => p.trim() && !p.includes('...')).length;
                if (argCount >= minParams) {
                    return fp;
                }
            }
            else if (fp.length === argCount) {
                return fp;
            }
            else if (fp.length === 0 && argCount === 0) {
                return fp;
            }
        }
    }
    const firstPm = formParts[0]?.trim().match(/\(([^)]*)\)/);
    return firstPm ? firstPm[1].split(',').filter(p => p.trim()) : [];
};
const findMatchingParams = (funcData, argCount) => {
    const syntaxLines = funcData.split('\n').filter(l => l.includes('Syntax:'));
    for (const line of syntaxLines) {
        const cleanLine = line.replace(/.*Syntax:\s*/, 'Syntax: ');
        const params = getFunctionParams(cleanLine, argCount);
        if (params.length > 0 || argCount === 0) {
            const isVariadic = params.some(p => p.includes('...'));
            const minParams = isVariadic ? params.filter(p => p.trim() && !p.includes('...')).length : params.length;
            return { params, isVariadic, minParams };
        }
    }
    return { params: [], isVariadic: false, minParams: 0 };
};
const collectSymbols = (document) => {
    const symbols = [];
    const text = document.getText();
    const lines = text.split('\n');
    const fileName = document.uri.fsPath;
    let inVariablesBlock = false;
    let braceCount = 0;
    let currentFunction = '';
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();
        const braceMatch = trimmed.match(/{/g);
        if (braceMatch) {
            braceCount += braceMatch.length;
        }
        const closeMatch = trimmed.match(/}/g);
        if (closeMatch) {
            braceCount -= closeMatch.length;
            if (inVariablesBlock && braceCount <= 0) {
                inVariablesBlock = false;
                braceCount = 0;
            }
        }
        if (trimmed === 'variables') {
            inVariablesBlock = true;
            braceCount = 1;
            return;
        }
        if (trimmed.startsWith('#include')) {
            const match = trimmed.match(/#include\s*[<"](.+)[>"]/);
            if (match) {
                symbols.push({
                    name: match[1],
                    type: 'include',
                    range: new vscode.Range(index, 0, index, line.length),
                    file: fileName
                });
            }
        }
        if (inVariablesBlock || braceCount > 0) {
            const varMatch = trimmed.match(/^\s*(const\s+)?(dword|word|byte|int|long|float|double|msTimer|mstimer|timer|message|signal|envvar|qword)\s*\*?\s*(\w+)/);
            if (varMatch) {
                symbols.push({
                    name: varMatch[3],
                    type: 'variable',
                    range: new vscode.Range(index, 0, index, line.length),
                    file: fileName
                });
            }
            const structVarMatch = trimmed.match(/\bstruct\s+(\w+)\s+(\w+)/);
            if (structVarMatch) {
                symbols.push({
                    name: structVarMatch[2],
                    type: 'variable',
                    range: new vscode.Range(index, 0, index, line.length),
                    file: fileName
                });
            }
            const arrMatch = trimmed.match(/^\s*byte\s+(\w+)\[/);
            if (arrMatch) {
                symbols.push({
                    name: arrMatch[1],
                    type: 'variable',
                    range: new vscode.Range(index, 0, index, line.length),
                    file: fileName
                });
            }
            const constVarMatch = trimmed.match(/^\s*const\s+(\w+)\s*=/);
            if (constVarMatch) {
                symbols.push({
                    name: constVarMatch[1],
                    type: 'variable',
                    range: new vscode.Range(index, 0, index, line.length),
                    file: fileName
                });
            }
        }
        const enumMatch = trimmed.match(/^\s*enum\s+(\w+)/);
        if (enumMatch) {
            symbols.push({
                name: enumMatch[1],
                type: 'type',
                range: new vscode.Range(index, 0, index, line.length),
                file: fileName
            });
        }
        const structMatch = trimmed.match(/^\s*struct\s+(\w+)/);
        if (structMatch) {
            symbols.push({
                name: structMatch[1],
                type: 'type',
                range: new vscode.Range(index, 0, index, line.length),
                file: fileName
            });
        }
        const paramTypeMatch = trimmed.match(/\b(int|long|float|double|char|byte|word|dword|qword)\s+(\w+)/g);
        if (paramTypeMatch && currentFunction && trimmed.includes('(')) {
            for (const m of paramTypeMatch) {
                const pm = m.match(/\b(int|long|float|double|char|byte|word|dword|qword)\s+(\w+)/);
                if (pm) {
                    symbols.push({
                        name: pm[2],
                        type: 'variable',
                        range: new vscode.Range(index, 0, index, line.length),
                        file: fileName + '|' + currentFunction
                    });
                }
            }
        }
        const funcMatch = trimmed.match(/^(void|int|long|float|double|char|byte|word|dword|qword|boolean)\s+(\w+)\s*\(/);
        if (funcMatch && !trimmed.includes('{')) {
            currentFunction = funcMatch[2];
            symbols.push({
                name: funcMatch[2],
                type: 'function',
                range: new vscode.Range(index, 0, index, line.length),
                file: fileName
            });
            const parts = trimmed.split(/[\(\),]/);
            for (const part of parts) {
                const varMatch = part.match(/\b(int|long|float|double|char|byte|word|dword|qword)\s+(\w+)/);
                if (varMatch && varMatch[2] !== currentFunction) {
                    symbols.push({
                        name: varMatch[2],
                        type: 'variable',
                        range: new vscode.Range(index, 0, index, line.length),
                        file: fileName + '|' + currentFunction
                    });
                }
            }
        }
        const localVarMatch = trimmed.match(/^\s*(int|long|float|double|char|byte|word|dword|qword)\s+(\w+)\s*=/);
        if (localVarMatch && currentFunction) {
            symbols.push({
                name: localVarMatch[2],
                type: 'variable',
                range: new vscode.Range(index, 0, index, line.length),
                file: fileName + '|' + currentFunction
            });
        }
        const onHandlerMatch = trimmed.match(/^on\s+(\w+)\s*\(/);
        if (onHandlerMatch) {
            symbols.push({
                name: 'on ' + onHandlerMatch[1],
                type: 'function',
                range: new vscode.Range(index, 0, index, line.length),
                file: fileName
            });
        }
    });
    return symbols;
};
function activate(context) {
    const hoverProvider = vscode.languages.registerHoverProvider(docSelector, {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range)
                return null;
            const word = document.getText(range);
            const upperWord = word.toUpperCase();
            const lowerWord = word.toLowerCase();
            const localSymbols = getDocumentSymbols(document);
            const userFuncs = localSymbols.filter(s => s.type === 'function' && s.name.toLowerCase() === lowerWord);
            if (userFuncs.length > 0) {
                const docLines = document.getText().split('\n');
                const sf = userFuncs[0];
                const funcLineIdx = sf.range.start.line;
                const funcLine = docLines[funcLineIdx].trim();
                let comment = '';
                let foundComment = false;
                for (let i = funcLineIdx - 1; i >= 0; i--) {
                    const line = docLines[i].trim();
                    if (line.includes('/*')) {
                        foundComment = true;
                        comment = line + '\n' + comment;
                        if (line.includes('*/'))
                            break;
                    }
                    else if (foundComment) {
                        comment = line + '\n' + comment;
                        if (line.includes('*/'))
                            break;
                    }
                    else if (line.length > 0) {
                        break;
                    }
                }
                let hover = `**Function**: ${sf.name}\n\n\`\`\`capl\n${funcLine}\n\`\`\``;
                if (comment) {
                    hover += '\n\n' + comment.replace(/\/\*|\*\//g, '').trim();
                }
                const md = new vscode.MarkdownString(hover);
                md.isTrusted = true;
                return new vscode.Hover(md, range);
            }
            const typeKey = Object.keys(caplData_1.CAPL_TYPES).find(k => k.toLowerCase() === lowerWord);
            if (typeKey) {
                const md = new vscode.MarkdownString(caplData_1.CAPL_TYPES[typeKey]);
                md.isTrusted = true;
                return new vscode.Hover(md, range);
            }
            // Find function by name - keys are functionName(params) format
            const funcKeys = Object.keys(caplData_1.CAPL_FUNCTIONS).filter(k => k.toLowerCase().startsWith(lowerWord + '(') ||
                k.toLowerCase().startsWith(lowerWord.toLowerCase() + '(') ||
                k.toLowerCase().startsWith(lowerWord.toUpperCase() + '('));
            if (funcKeys.length > 0) {
                // Start with first entry's full documentation
                const firstRaw = caplData_1.CAPL_FUNCTIONS[funcKeys[0]];
                let doc = firstRaw;
                // Add syntax from all other overloads
                if (funcKeys.length > 1) {
                    const firstSyntaxMatch = firstRaw.match(/Syntax:[^\n]*/);
                    for (const key of funcKeys.slice(1)) {
                        const raw = caplData_1.CAPL_FUNCTIONS[key];
                        const syntaxMatch = raw.match(/Syntax:[^\n]*/);
                        if (syntaxMatch && firstSyntaxMatch && syntaxMatch[0] !== firstSyntaxMatch[0]) {
                            doc += '\n' + syntaxMatch[0];
                        }
                    }
                }
                const md = new vscode.MarkdownString(doc.replace(/\n/g, '<br/>'));
                md.isTrusted = true;
                md.supportHtml = true;
                return new vscode.Hover(md, range);
            }
            const kwKey = Object.keys(caplData_1.CAPL_KEYWORDS).find(k => k.toLowerCase() === lowerWord);
            if (kwKey) {
                const raw = caplData_1.CAPL_KEYWORDS[kwKey];
                const doc = raw.replace(/\n/g, '<br/>');
                const md = new vscode.MarkdownString(doc);
                md.isTrusted = true;
                md.supportHtml = true;
                return new vscode.Hover(md, range);
            }
            return null;
        }
    });
    const getUserDefinedVariables = (document) => {
        const text = document.getText();
        const variables = [];
        let inVariablesBlock = false;
        let braceCount = 0;
        const lines = text.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed === 'variables') {
                inVariablesBlock = true;
                continue;
            }
            if (inVariablesBlock) {
                if (trimmed === '}' || trimmed.startsWith('}')) {
                    braceCount--;
                    if (braceCount === 0) {
                        inVariablesBlock = false;
                    }
                    continue;
                }
                if (trimmed.includes('{')) {
                    braceCount++;
                }
            }
            if (inVariablesBlock) {
                const varMatch = trimmed.match(/^\s*(BYTE|char|word|dword|int|long|float|double|msTimer|mstimer|timer|message|signal|envvar|sysvarInt|sysvarFloat|sysvarString)\s*\*?\s*(\w+)/);
                if (varMatch) {
                    const varName = varMatch[2];
                    if (!variables.includes(varName)) {
                        variables.push(varName);
                    }
                }
                continue;
            }
            const varMatch = trimmed.match(/\b(int|long|float|double|char|byte|word|dword|qword|boolean|timer|mstimer|message|signal|envvar)\s*\*?\s*(\w+)\s*[=;,\[]/);
            if (varMatch) {
                const varName = varMatch[2];
                if (!variables.includes(varName)) {
                    variables.push(varName);
                }
            }
        }
        return variables;
    };
    const documentSymbols = new Map();
    const getDocumentSymbols = (doc) => {
        const uri = doc.uri.toString();
        if (!documentSymbols.has(uri)) {
            documentSymbols.set(uri, collectSymbols(doc));
        }
        return documentSymbols.get(uri);
    };
    const indexAllDocuments = () => {
        ALL_SYMBOLS.clear();
        for (const doc of vscode.workspace.textDocuments) {
            if (doc.languageId === 'capl') {
                const symbols = collectSymbols(doc);
                ALL_SYMBOLS.set(doc.uri.toString(), symbols);
            }
        }
    };
    const findAllReferences = (word, exceptUri, currentFunc) => {
        const refs = [];
        ALL_SYMBOLS.forEach((symbols, uriStr) => {
            if (exceptUri && uriStr === exceptUri.toString()) {
                for (const sym of symbols) {
                    if (sym.name === word) {
                        if (sym.file.includes('|')) {
                            const funcScope = sym.file.split('|')[1];
                            if (!currentFunc || funcScope === currentFunc) {
                                refs.push(sym);
                            }
                        }
                        else {
                            refs.push(sym);
                        }
                    }
                }
                return;
            }
            for (const sym of symbols) {
                if (sym.name === word) {
                    refs.push(sym);
                }
            }
        });
        return refs;
    };
    const findDefinition = (word, exceptUri, currentFunc) => {
        let localFound = null;
        let globalFound = null;
        ALL_SYMBOLS.forEach((symbols, uriStr) => {
            for (const sym of symbols) {
                if (sym.name === word) {
                    if (sym.file.includes('|')) {
                        const funcScope = sym.file.split('|')[1];
                        if (currentFunc && funcScope === currentFunc) {
                            localFound = sym;
                        }
                    }
                    else if (exceptUri && uriStr !== exceptUri.toString()) {
                        globalFound = sym;
                    }
                    else if (!exceptUri) {
                        globalFound = sym;
                    }
                }
            }
        });
        return localFound || globalFound;
    };
    const definitionProvider = vscode.languages.registerDefinitionProvider(docSelector, {
        provideDefinition(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range)
                return null;
            const word = document.getText(range);
            const lineNum = position.line;
            const currentLine = document.lineAt(lineNum).text;
            let insideFunc = '';
            for (let i = lineNum - 1; i >= 0; i--) {
                const line = document.lineAt(i).text.trim();
                const funcMatch = line.match(/^(void|int|long|float|double|char|byte|word|dword|qword)\s+(\w+)\s*\(/);
                if (funcMatch) {
                    insideFunc = funcMatch[2];
                    break;
                }
                const onMatch = line.match(/^on\s+(\w+)/);
                if (onMatch) {
                    insideFunc = 'on ' + onMatch[1];
                    break;
                }
            }
            const localSymbols = getDocumentSymbols(document);
            for (const symbol of localSymbols) {
                if (symbol.name.toLowerCase() === word.toLowerCase()) {
                    const isScoped = symbol.file.includes('|');
                    if (isScoped) {
                        const funcScope = symbol.file.split('|')[1];
                        if (insideFunc && funcScope !== insideFunc)
                            continue;
                    }
                    return new vscode.Location(document.uri, symbol.range);
                }
            }
            // Search in included files
            const docDir = document.uri.fsPath.replace(/[/\\][^/\\]+$/, '');
            const text = document.getText();
            const lines = text.split('\n');
            for (const line of lines) {
                const match = line.match(/#include\s*[<"]([^>"]+)[>"]/);
                if (match) {
                    const incPath = match[1];
                    let fullPath;
                    if (incPath.startsWith('/') || (incPath.length > 1 && incPath[1] === ':')) {
                        fullPath = incPath;
                    }
                    else {
                        fullPath = docDir + '/' + incPath;
                    }
                    try {
                        const incDoc = vscode.workspace.textDocuments.find(d => d.uri.fsPath === fullPath);
                        if (incDoc) {
                            const incSymbols = getDocumentSymbols(incDoc);
                            for (const sym of incSymbols) {
                                if (sym.name.toLowerCase() === word.toLowerCase()) {
                                    return new vscode.Location(incDoc.uri, sym.range);
                                }
                            }
                        }
                    }
                    catch (e) {
                        // Skip
                    }
                }
            }
            return null;
        }
    });
    const referenceProvider = vscode.languages.registerReferenceProvider(docSelector, {
        provideReferences(document, position, context, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range)
                return [];
            const word = document.getText(range);
            const refs = [];
            const lineNum = position.line;
            let currentRefFunc = '';
            for (let i = lineNum - 1; i >= 0; i--) {
                const line = document.lineAt(i).text.trim();
                const funcMatch = line.match(/^(void|int|long|float|double|char|byte|word|dword|qword)\s+(\w+)\s*\(/);
                if (funcMatch) {
                    currentRefFunc = funcMatch[2];
                    break;
                }
                const onMatch = line.match(/^on\s+(\w+)/);
                if (onMatch) {
                    currentRefFunc = 'on ' + onMatch[1];
                    break;
                }
            }
            const text = document.getText();
            const lines = text.split('\n');
            lines.forEach((line, index) => {
                if (line.includes(word)) {
                    const match = line.match(new RegExp('\\b' + word + '\\b'));
                    if (match) {
                        const lineText = line;
                        let col = lineText.indexOf(word);
                        if (col >= 0) {
                            refs.push(new vscode.Location(document.uri, new vscode.Range(index, col, index, col + word.length)));
                        }
                    }
                }
            });
            const allRefs = findAllReferences(word, document.uri, currentRefFunc);
            for (const ref of allRefs) {
                try {
                    refs.push(new vscode.Location(vscode.Uri.file(ref.file), ref.range));
                }
                catch (e) { }
            }
            return refs;
        }
    });
    const documentLinkProvider = vscode.languages.registerDocumentLinkProvider(docSelector, {
        provideDocumentLinks(document, token) {
            const links = [];
            const text = document.getText();
            const lines = text.split('\n');
            const docDir = document.uri.fsPath.replace(/[/\\][^/\\]+$/, '');
            lines.forEach((line, index) => {
                const match = line.match(/#include\s*[<"]([^>"]+)[>"]/);
                if (match) {
                    const includePath = match[1];
                    const startPos = line.indexOf(match[1]);
                    const range = new vscode.Range(index, startPos, index, startPos + includePath.length);
                    let targetPath;
                    if (includePath.startsWith('/') || (includePath.length > 1 && includePath[1] === ':')) {
                        targetPath = includePath;
                    }
                    else {
                        targetPath = docDir + '/' + includePath;
                    }
                    const targetUri = vscode.Uri.file(targetPath);
                    const link = new vscode.DocumentLink(range, targetUri);
                    link.tooltip = 'Open ' + includePath;
                    links.push(link);
                }
            });
            return links;
        }
    });
    const completionProvider = vscode.languages.registerCompletionItemProvider(docSelector, {
        provideCompletionItems(document, position) {
            const items = [];
            const userVars = getUserDefinedVariables(document);
            const symbols = getDocumentSymbols(document);
            // Deduplicate by function name prefix
            const funcNames = new Set();
            for (const funcKey of Object.keys(caplData_1.CAPL_FUNCTIONS)) {
                const match = funcKey.match(/^(\w+)\(/);
                if (!match)
                    continue;
                const funcName = match[1];
                if (funcNames.has(funcName))
                    continue;
                funcNames.add(funcName);
                const item = new vscode.CompletionItem(funcName, vscode.CompletionItemKind.Function);
                item.detail = caplData_1.CAPL_FUNCTIONS[funcKey].split('\n')[0];
                item.insertText = new vscode.SnippetString(funcName + '($0)');
                items.push(item);
                const upperFunc = funcName.toUpperCase();
                if (funcName !== upperFunc) {
                    const itemUpper = new vscode.CompletionItem(upperFunc, vscode.CompletionItemKind.Function);
                    itemUpper.detail = item.detail;
                    itemUpper.insertText = new vscode.SnippetString(upperFunc + '($0)');
                    items.push(itemUpper);
                }
            }
            for (const kw of Object.keys(caplData_1.CAPL_KEYWORDS)) {
                const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
                item.detail = caplData_1.CAPL_KEYWORDS[kw].split('\n')[0];
                items.push(item);
                const upperKw = kw.toUpperCase();
                if (kw !== upperKw) {
                    const itemUpper = new vscode.CompletionItem(upperKw, vscode.CompletionItemKind.Keyword);
                    itemUpper.detail = caplData_1.CAPL_KEYWORDS[kw].split('\n')[0];
                    items.push(itemUpper);
                }
            }
            for (const t of Object.keys(caplData_1.CAPL_TYPES)) {
                const item = new vscode.CompletionItem(t, vscode.CompletionItemKind.TypeParameter);
                item.detail = caplData_1.CAPL_TYPES[t];
                items.push(item);
            }
            for (const v of userVars) {
                const item = new vscode.CompletionItem(v, vscode.CompletionItemKind.Variable);
                item.detail = 'user defined variable';
                items.push(item);
            }
            for (const symbol of symbols) {
                if (symbol.type === 'function') {
                    const item = new vscode.CompletionItem(symbol.name, vscode.CompletionItemKind.Function);
                    item.detail = 'user defined function';
                    items.push(item);
                }
                else if (symbol.type === 'variable') {
                    const item = new vscode.CompletionItem(symbol.name, vscode.CompletionItemKind.Variable);
                    item.detail = 'user defined variable';
                    items.push(item);
                }
            }
            return items;
        }
    }, '');
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('capl');
    const updateDiagnostics = (document) => {
        if (document.languageId !== 'capl')
            return;
        documentSymbols.delete(document.uri.toString());
        getDocumentSymbols(document);
        const diagnostics = [];
        const text = document.getText();
        const lines = text.split('\n');
        let braceCount = 0;
        let parenCount = 0;
        const isInsideBlockComment = (lineIdx) => {
            let inComment = false;
            for (let i = 0; i <= lineIdx; i++) {
                const line = lines[i];
                if (line.includes('/*'))
                    inComment = true;
                if (line.includes('*/'))
                    inComment = false;
            }
            return inComment;
        };
        const isStatementNeedingSemicolon = (line) => {
            const trimmed = line.trim();
            if (!trimmed)
                return false;
            const functionPattern = /^\s*(void|int|long|float|double|char|byte|word|dword|qword|boolean|timer|message|signal|envvar)\s+\w+\s*\([^;]*\)\s*\{?\s*$/;
            const enumPattern = /^\s*enum\s+\w+\s*\{/;
            const structPattern = /^\s*struct\s+\w*\s*\{/;
            const arrayPattern = /^\s*array\s+<.*>\s+\w+\s*=/;
            const onHandlerPattern = /^\s*on\w+\s*\([^)]*\)\s*\{?\s*$/;
            if (functionPattern.test(trimmed))
                return false;
            if (enumPattern.test(trimmed))
                return false;
            if (structPattern.test(trimmed))
                return false;
            if (arrayPattern.test(trimmed))
                return false;
            if (onHandlerPattern.test(trimmed))
                return false;
            if (trimmed.includes('(') && trimmed.includes(')')) {
                const funcCallMatch = trimmed.match(/^\s*(\w+)\s*\(/);
                if (funcCallMatch) {
                    const funcName = funcCallMatch[1];
                    const isKnownFunc = Object.keys(caplData_1.CAPL_FUNCTIONS).some(k => k.startsWith(funcName + '('));
                    if (isKnownFunc || caplData_1.CAPL_KEYWORDS[funcName]) {
                        return !trimmed.endsWith(';');
                    }
                }
            }
            if (/^\s*\w+\s*=\s*[^=].*;\s*$/.test(trimmed))
                return false;
            const hasSemicolon = (str) => str.trim().endsWith(';');
            if (/^\s*(int|long|float|double|char|byte|word|dword|qword|boolean)\s+\w+\s*=/.test(trimmed)) {
                return !hasSemicolon(trimmed);
            }
            return false;
        };
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            if (isInsideBlockComment(index))
                return;
            for (const char of line) {
                if (char === '{')
                    braceCount++;
                if (char === '}')
                    braceCount--;
            }
            const commentIdx = line.indexOf('//');
            let codePart = commentIdx >= 0 ? line.substring(0, commentIdx) : line;
            for (const char of codePart) {
                if (char === '(')
                    parenCount++;
                if (char === ')')
                    parenCount--;
            }
            const trimmed = codePart.trim();
            if (!trimmed)
                return;
            if (trimmed.startsWith('//'))
                return;
            if (trimmed.startsWith('/*'))
                return;
            if (trimmed.startsWith('#'))
                return;
            if (/^(\*|\*\/)/.test(trimmed))
                return;
            if (/^(if|else|while|for|switch)\s*\(/.test(trimmed))
                return;
            if (/^(if|else|while|for)\s*\{/.test(trimmed))
                return;
            if (trimmed === '}' || trimmed === '{')
                return;
            const funcCallRegex = /(\w+)\s*\(/g;
            const funcMatches = [...trimmed.matchAll(funcCallRegex)];
            for (const callMatch of funcMatches) {
                const funcName = callMatch[1];
                // Find matching closing paren by balancing from start
                const startPos = callMatch.index + callMatch[0].length;
                let depth = 1;
                let endPos = startPos;
                for (let j = startPos; j < trimmed.length && depth > 0; j++) {
                    if (trimmed[j] === '(')
                        depth++;
                    else if (trimmed[j] === ')')
                        depth--;
                    if (depth === 0) {
                        endPos = j;
                        break;
                    }
                }
                // Split arguments by ',' only at depth=1
                const argsPart = trimmed.substring(startPos, endPos);
                const actualArgs = [];
                let currentArg = '';
                let argDepth = 0;
                for (const ch of argsPart) {
                    if (ch === '(')
                        argDepth++;
                    else if (ch === ')')
                        argDepth--;
                    else if (ch === ',' && argDepth === 0) {
                        if (currentArg.trim())
                            actualArgs.push(currentArg.trim());
                        currentArg = '';
                        continue;
                    }
                    currentArg += ch;
                }
                if (currentArg.trim())
                    actualArgs.push(currentArg.trim());
                const actualCount = actualArgs.length;
                // Find all matching function keys
                const funcKeys = Object.keys(caplData_1.CAPL_FUNCTIONS).filter(k => k.startsWith(funcName + '(') ||
                    k.startsWith(funcName.toLowerCase() + '(') ||
                    k.startsWith(funcName.toUpperCase() + '('));
                // Better matching: consider BOTH parameter count and type compatibility
                let funcKey = null;
                let funcData = null;
                let bestMatch = null;
                for (const k of funcKeys) {
                    const data = caplData_1.CAPL_FUNCTIONS[k];
                    const syntaxLine = data.split('\n').find(l => l.includes('Syntax:'));
                    if (!syntaxLine)
                        continue;
                    const cleanSyntax = syntaxLine.replace(/.*Syntax:\s*/, 'Syntax: ');
                    const params = getFunctionParams(cleanSyntax, actualCount);
                    if (params.length === 0 && actualCount > 0)
                        continue;
                    if (params.length > actualCount && !params.some(p => p.includes('...')))
                        continue;
                    // Calculate type compatibility score
                    let score = 0;
                    let allMatch = true;
                    // Check type compatibility for each argument
                    for (let idx = 0; idx < Math.min(actualArgs.length, params.length); idx++) {
                        const arg = actualArgs[idx].trim();
                        const fullExp = params[idx].trim();
                        if (fullExp.includes('...'))
                            continue;
                        const expTypeMatch = fullExp.match(/^\s*(\w+)/i);
                        const expTypeRaw = expTypeMatch ? expTypeMatch[1].toLowerCase() : fullExp.replace(/[\[\]].*$/, '').trim().split(/\s/)[0].toLowerCase();
                        const expTypes = getExpectedTypes(expTypeRaw);
                        if (/^[a-zA-Z_]\w*$/.test(arg)) {
                            const vType = getVariableType(arg, document, lineNum);
                            if (vType && isTypeCompatible(vType, expTypes)) {
                                score++;
                            }
                            else if (!vType) {
                                allMatch = false;
                            }
                        }
                    }
                    // Prefer exact parameter count match
                    const exactCountMatch = (params.length === actualCount) || (params.length === 0 && actualCount === 0);
                    if (exactCountMatch)
                        score += 10;
                    if (allMatch && (!bestMatch || score > bestMatch.matchScore)) {
                        bestMatch = { key: k, data, matchScore: score };
                    }
                }
                if (bestMatch) {
                    // Already have best match
                }
                else {
                    funcKey = null;
                    funcData = null;
                    // Fallback: find by param count only
                    let fallbackMatch = null;
                    for (const k of funcKeys) {
                        const data = caplData_1.CAPL_FUNCTIONS[k];
                        const syntaxLine = data.split('\n').find(l => l.includes('Syntax:'));
                        if (!syntaxLine)
                            continue;
                        const result = findMatchingParams(data, actualCount);
                        if (result.params.length > 0) {
                            const diff = Math.abs(actualCount - result.minParams);
                            if (!fallbackMatch || diff < fallbackMatch.minDiff) {
                                fallbackMatch = { key: k, data, minDiff: diff };
                            }
                        }
                    }
                    if (fallbackMatch) {
                        funcKey = fallbackMatch.key;
                        funcData = fallbackMatch.data;
                    }
                }
                if (funcData) {
                    const cleanSyntaxLine = funcData.split('\n').find(l => l.includes('Syntax:'))?.replace(/.*Syntax:\s*/, 'Syntax: ') || '';
                    const result = getFunctionParams(cleanSyntaxLine, actualCount);
                    const isVariadic = result.some(p => p.includes('...'));
                    const minParams = isVariadic ? result.filter(p => p.trim() && !p.includes('...')).length : result.length;
                    const params = result;
                    const hasExactMatch = isVariadic
                        ? (actualCount >= minParams)
                        : (params.length === actualCount);
                    if (!hasExactMatch) {
                        const msg = isVariadic
                            ? `Function '${funcName}' expects ${minParams}+ params (got ${actualCount})`
                            : `Function '${funcName}' expects ${params.length} params (got ${actualCount})`;
                        diagnostics.push({
                            message: msg,
                            range: new vscode.Range(lineNum - 1, 0, lineNum - 1, line.length),
                            severity: vscode.DiagnosticSeverity.Warning
                        });
                    }
                    for (let i = 0; i < Math.min(actualCount, params.length); i++) {
                        const arg = actualArgs[i].trim();
                        const fullExp = params[i].trim();
                        // Skip variadic params (containing ...)
                        if (fullExp.includes('...'))
                            continue;
                        // Extract expected type - supports all CAPL types
                        const expTypeMatch = fullExp.match(/^\s*(struct|union|array|dword|word|byte|int|long|float|double|qword|boolean|char|timer|mstimer|int64|string|text|message|signal|this)\b/i);
                        let expTypeRaw;
                        if (expTypeMatch) {
                            expTypeRaw = expTypeMatch[1].toLowerCase();
                        }
                        else {
                            const typeFromPattern = fullExp.replace(/[\[\]].*$/, '').trim().split(/\s/)[0].toLowerCase();
                            expTypeRaw = typeFromPattern;
                        }
                        const expTypes = getExpectedTypes(expTypeRaw);
                        // Skip checking for 'this' - it's a special reference in CAPL event handlers
                        if (arg.toLowerCase() === 'this')
                            continue;
                        // Skip checking for database objects (messages, nodes, PDUs) in function parameters
                        // These are defined in database (DBC, LDF, etc.), not user variables
                        // Check function name patterns that take database objects as parameters
                        if (funcName.toLowerCase().startsWith('chkstart_') ||
                            funcName.toLowerCase().startsWith('chkcreate_') ||
                            funcName.toLowerCase().includes('inconsistent') ||
                            funcName.toLowerCase().includes('msgdist') ||
                            funcName.toLowerCase().includes('msgoccurrence') ||
                            funcName.toLowerCase().includes('msgsignal') ||
                            funcName.toLowerCase().includes('nodecycle') ||
                            funcName.toLowerCase().includes('nodedead') ||
                            funcName.toLowerCase().includes('nodebabbling')) {
                            continue;
                        }
                        if (/^[a-zA-Z_]\w*$/.test(arg)) {
                            const vType = getVariableType(arg, document, lineNum);
                            if (!vType) {
                                diagnostics.push({
                                    message: `Undefined variable '${arg}'`,
                                    range: new vscode.Range(lineNum - 1, 0, lineNum - 1, line.length),
                                    severity: vscode.DiagnosticSeverity.Error
                                });
                            }
                            else if (!isTypeCompatible(vType, expTypes)) {
                                diagnostics.push({
                                    message: `Parameter ${i + 1} type mismatch: expects ${expTypeRaw}, got '${vType}'`,
                                    range: new vscode.Range(lineNum - 1, 0, lineNum - 1, line.length),
                                    severity: vscode.DiagnosticSeverity.Warning
                                });
                            }
                        }
                    }
                }
            }
            const endsWithValid = trimmed.endsWith(';') || trimmed.endsWith(',') || trimmed.endsWith(':') || trimmed.endsWith('{') || trimmed.endsWith('}');
            if (endsWithValid)
                return;
            if (/^(case|default)\s+/.test(trimmed))
                return;
            if (isStatementNeedingSemicolon(line)) {
                const range = new vscode.Range(lineNum - 1, 0, lineNum - 1, line.length);
                diagnostics.push({
                    message: 'Missing semicolon',
                    range,
                    severity: vscode.DiagnosticSeverity.Warning,
                    code: 'missing-semicolon'
                });
            }
        });
        if (braceCount > 0) {
            const lastLine = lines.length;
            diagnostics.push({
                message: `Missing ${braceCount} closing brace(s)`,
                range: new vscode.Range(lastLine - 1, 0, lastLine - 1, 0),
                severity: vscode.DiagnosticSeverity.Error,
                code: 'unclosed-brace'
            });
        }
        if (parenCount !== 0) {
            const lastLine = lines.length;
            diagnostics.push({
                message: parenCount > 0 ? 'Missing closing parenthesis' : 'Extra closing parenthesis',
                range: new vscode.Range(lastLine - 1, 0, lastLine - 1, 0),
                severity: vscode.DiagnosticSeverity.Error,
                code: 'unmatched-parenthesis'
            });
        }
        diagnosticCollection.set(document.uri, diagnostics);
    };
    const subscription = vscode.workspace.onDidChangeTextDocument((e) => {
        updateDiagnostics(e.document);
        documentSymbols.delete(e.document.uri.toString());
        getDocumentSymbols(e.document);
        indexAllDocuments();
    });
    const fileOpenSubscription = vscode.workspace.onDidOpenTextDocument((e) => {
        if (e.languageId === 'capl') {
            documentSymbols.delete(e.uri.toString());
            getDocumentSymbols(e);
            indexAllDocuments();
        }
    });
    const fileCloseSubscription = vscode.workspace.onDidCloseTextDocument((e) => {
        ALL_SYMBOLS.delete(e.uri.toString());
        documentSymbols.delete(e.uri.toString());
    });
    vscode.workspace.textDocuments.forEach(doc => {
        if (doc.languageId === 'capl') {
            updateDiagnostics(doc);
        }
    });
    indexAllDocuments();
    context.subscriptions.push(hoverProvider, completionProvider, diagnosticCollection, subscription, definitionProvider, referenceProvider, documentLinkProvider, fileOpenSubscription, fileCloseSubscription);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map