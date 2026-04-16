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
function activate(context) {
    const hoverProvider = vscode.languages.registerHoverProvider(docSelector, {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range)
                return null;
            const word = document.getText(range);
            if (caplData_1.CAPL_FUNCTIONS[word]) {
                return new vscode.Hover({
                    language: 'capl',
                    value: `**${word}**\n\n${caplData_1.CAPL_FUNCTIONS[word]}`
                }, range);
            }
            if (caplData_1.CAPL_KEYWORDS[word]) {
                return new vscode.Hover({
                    language: 'capl',
                    value: `**${word}**\n\n${caplData_1.CAPL_KEYWORDS[word]}`
                }, range);
            }
            return null;
        }
    });
    const completionProvider = vscode.languages.registerCompletionItemProvider(docSelector, {
        provideCompletionItems(document, position) {
            const items = [];
            for (const func of Object.keys(caplData_1.CAPL_FUNCTIONS)) {
                const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                item.detail = caplData_1.CAPL_FUNCTIONS[func].split('\n')[0];
                item.insertText = new vscode.SnippetString(func + '($0)');
                items.push(item);
            }
            for (const kw of Object.keys(caplData_1.CAPL_KEYWORDS)) {
                const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
                item.detail = caplData_1.CAPL_KEYWORDS[kw].split('\n')[0];
                items.push(item);
            }
            return items;
        }
    }, '(');
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('capl');
    const updateDiagnostics = (document) => {
        if (document.languageId !== 'capl')
            return;
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
            if (/^\s*(int|long|float|double|char|byte|word|dword|qword|boolean)\s+\w+\s*=/.test(trimmed)) {
                return !trimmed.endsWith(';');
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
            const trimmed = line.trim();
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
            if (trimmed.endsWith(';') || trimmed.endsWith(',') || trimmed.endsWith(':'))
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
    });
    vscode.workspace.textDocuments.forEach(doc => {
        if (doc.languageId === 'capl') {
            updateDiagnostics(doc);
        }
    });
    context.subscriptions.push(hoverProvider, completionProvider, diagnosticCollection, subscription);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map