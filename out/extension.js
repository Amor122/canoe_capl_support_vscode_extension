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
const collectSymbols = (document) => {
    const symbols = [];
    const text = document.getText();
    const lines = text.split('\n');
    const fileName = document.uri.fsPath;
    let inVariablesBlock = false;
    let braceCount = 0;
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();
        if (trimmed === 'variables') {
            inVariablesBlock = true;
            return;
        }
        if (inVariablesBlock) {
            if (trimmed === '}' || trimmed.startsWith('}')) {
                braceCount--;
                if (braceCount === 0) {
                    inVariablesBlock = false;
                }
                return;
            }
            if (trimmed.includes('{')) {
                braceCount++;
            }
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
            return;
        }
        if (inVariablesBlock) {
            const varMatch = trimmed.match(/^\s*(BYTE|char|word|dword|int|long|float|double|msTimer|mstimer|timer|message|signal|envvar|sysvarInt|sysvarFloat|sysvarString)\s*\*?\s*(\w+)/);
            if (varMatch) {
                symbols.push({
                    name: varMatch[2],
                    type: 'variable',
                    range: new vscode.Range(index, 0, index, line.length),
                    file: fileName
                });
            }
            return;
        }
        const funcMatch = trimmed.match(/^(void|int|long|float|double|char|byte|word|dword|qword|boolean)\s+(\w+)\s*\(/);
        if (funcMatch && !trimmed.includes('{')) {
            symbols.push({
                name: funcMatch[2],
                type: 'function',
                range: new vscode.Range(index, 0, index, line.length),
                file: fileName
            });
            return;
        }
        const onHandlerMatch = trimmed.match(/^on\s+(\w+)\s*\(/);
        if (onHandlerMatch) {
            symbols.push({
                name: 'on ' + onHandlerMatch[1],
                type: 'function',
                range: new vscode.Range(index, 0, index, line.length),
                file: fileName
            });
            return;
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
            const funcKey = Object.keys(caplData_1.CAPL_FUNCTIONS).find(k => k.toLowerCase() === lowerWord);
            if (funcKey) {
                return new vscode.Hover(new vscode.MarkdownString(caplData_1.CAPL_FUNCTIONS[funcKey]), range);
            }
            const kwKey = Object.keys(caplData_1.CAPL_KEYWORDS).find(k => k.toLowerCase() === lowerWord);
            if (kwKey) {
                return new vscode.Hover(new vscode.MarkdownString(caplData_1.CAPL_KEYWORDS[kwKey]), range);
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
            const varMatch = trimmed.match(/\b(int|long|float|double|char|byte|word|dword|qword|boolean|timer|mstimer|message|signal|envvar)\s+(\w+)\s*[=;,\[]/);
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
    const findAllReferences = (word, exceptUri) => {
        const refs = [];
        if (exceptUri) {
            ALL_SYMBOLS.forEach((symbols, uriStr) => {
                if (uriStr === exceptUri.toString())
                    return;
                for (const sym of symbols) {
                    if (sym.name === word) {
                        refs.push(sym);
                    }
                }
            });
        }
        else {
            ALL_SYMBOLS.forEach((symbols, uriStr) => {
                for (const sym of symbols) {
                    if (sym.name === word) {
                        refs.push(sym);
                    }
                }
            });
        }
        return refs;
    };
    const findDefinition = (word, exceptUri) => {
        let found = null;
        ALL_SYMBOLS.forEach((symbols, uriStr) => {
            if (exceptUri && uriStr === exceptUri.toString())
                return;
            for (const sym of symbols) {
                if (sym.name === word) {
                    found = sym;
                    return;
                }
            }
        });
        return found;
    };
    const definitionProvider = vscode.languages.registerDefinitionProvider(docSelector, {
        provideDefinition(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range)
                return null;
            const word = document.getText(range);
            const localSymbols = getDocumentSymbols(document);
            for (const symbol of localSymbols) {
                if (symbol.name === word) {
                    return new vscode.Location(document.uri, symbol.range);
                }
            }
            const found = findDefinition(word, document.uri);
            if (found) {
                return new vscode.Location(vscode.Uri.file(found.file), found.range);
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
            const allRefs = findAllReferences(word, document.uri);
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
            for (const func of Object.keys(caplData_1.CAPL_FUNCTIONS)) {
                const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                item.detail = caplData_1.CAPL_FUNCTIONS[func].split('\n')[0];
                item.insertText = new vscode.SnippetString(func + '($0)');
                items.push(item);
                const upperFunc = func.toUpperCase();
                if (func !== upperFunc) {
                    const itemUpper = new vscode.CompletionItem(upperFunc, vscode.CompletionItemKind.Function);
                    itemUpper.detail = caplData_1.CAPL_FUNCTIONS[func].split('\n')[0];
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
                    if (caplData_1.CAPL_FUNCTIONS[funcName] || caplData_1.CAPL_KEYWORDS[funcName]) {
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