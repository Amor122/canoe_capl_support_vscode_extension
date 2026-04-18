import * as vscode from 'vscode';
import { CAPL_FUNCTIONS, CAPL_KEYWORDS, CAPL_TYPES } from './caplData';

const docSelector = { language: 'capl', scheme: 'file' };

const ALL_SYMBOLS = new Map<string, SymbolLocation[]>();

interface SymbolLocation {
    name: string;
    type: 'variable' | 'function' | 'include' | 'type';
    range: vscode.Range;
    file: string;
}

const TYPE_MAP: Record<string, string[]> = {
    'byte': ['byte', 'int', 'long', 'word', 'dword', 'qword'],
    'int': ['int', 'long', 'dword', 'word', 'byte', 'qword'],
    'long': ['long', 'dword', 'int', 'qword', 'word', 'byte'],
    'word': ['word', 'dword', 'int', 'long', 'byte', 'qword'],
    'dword': ['dword', 'long', 'qword', 'word', 'int', 'byte'],
    'qword': ['qword', 'dword', 'long', 'word', 'int', 'byte'],
    'float': ['float', 'double'],
    'double': ['double', 'float'],
    'char': ['char', 'byte'],
    'boolean': ['boolean', 'byte', 'int', 'long'],
};

const getExpectedTypes = (paramType: string): string[] => {
    const t = paramType.toLowerCase().replace(/\s*(array|\[\])?$/, '').trim();
    return TYPE_MAP[t] || [t];
};

const isTypeCompatible = (actualType: string, expectedTypes: string[]): boolean => {
    const a = actualType.toLowerCase().replace(/\s*(array|\[\])?$/, '').trim();
    const actualCompat = TYPE_MAP[a] || [a];
    for (const act of actualCompat) {
        for (const exp of expectedTypes) {
            if (act === exp) return true;
        }
    }
    return false;
};

const getVariableType = (varName: string, document: vscode.TextDocument, currentLine: number): string => {
    const text = document.getText();
    const lines = text.split('\n');
    let searchLimit = currentLine > 0 ? currentLine - 1 : lines.length;
    
    for (let i = 0; i < searchLimit; i++) {
        const line = lines[i].trim();
        
        const funcMatch = line.match(/^(void|int|long|float|double|char|byte|word|dword|qword)\s+(\w+)\s*\(([^)]*)\)/i);
        if (funcMatch) {
            const params = funcMatch[3].split(',');
            for (const p of params) {
                const pm = p.match(/\b(dword|word|byte|int|long|float|double|qword|boolean|char)\s+(\w+)/i);
                if (pm && pm[2].toLowerCase() === varName.toLowerCase()) {
                    return pm[1].toLowerCase();
                }
            }
            continue;
        }
        
        const varDecl = line.match(/^\s*(dword|word|byte|int|long|float|double|qword|boolean)\s+(\w+)\s*[=;,\[]/i);
        if (varDecl && varDecl[2].toLowerCase() === varName.toLowerCase()) {
            return varDecl[1].toLowerCase();
        }
        const varAssign = line.match(/^\s*(dword|word|byte|int|long|float|double|qword|boolean)\s+(\w+)\s*=/i);
        if (varAssign && varAssign[2].toLowerCase() === varName.toLowerCase()) {
            return varAssign[1].toLowerCase();
        }
    }
    return '';
};

const getFunctionParams = (syntaxLine: string, argCount: number): string[] => {
    const afterSyntax = syntaxLine.replace(/^Syntax:\s*/i, '');
    const formParts = afterSyntax.split(/\/\/\s*form\s*\d+/i);
    for (const form of formParts) {
        const trimmed = form.trim();
        if (!trimmed.includes('(')) continue;
        const pm = trimmed.match(/\(([^)]*)\)/);
        if (pm) {
            const fp = pm[1].split(',').filter(p => p.trim());
            if (fp.length === argCount) {
                return fp;
            }
            if (fp.length > argCount && fp.some(p => p.includes('...'))) {
                return fp;
            }
        }
    }
    const firstPm = formParts[0]?.trim().match(/\(([^)]*)\)/);
    return firstPm ? firstPm[1].split(',').filter(p => p.trim()) : [];
};

const collectSymbols = (document: vscode.TextDocument): SymbolLocation[] => {
    const symbols: SymbolLocation[] = [];
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
            const varMatch = trimmed.match(/^\s*(const\s+)?(dword|word|byte|int|long|float|double|msTimer|mstimer|timer|message|signal|envvar|qword)\s*(\*\s*)?(\w+)/);
            if (varMatch) {
                symbols.push({
                    name: varMatch[4],
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

export function activate(context: vscode.ExtensionContext) {
    const hoverProvider = vscode.languages.registerHoverProvider(docSelector, {
        provideHover(document, position, token) {
            const range = document.getWordRangeAtPosition(position);
            if (!range) return null;
            
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
                        if (line.includes('*/')) break;
                    } else if (foundComment) {
                        comment = line + '\n' + comment;
                        if (line.includes('*/')) break;
                    } else if (line.length > 0) {
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
            
            const typeKey = Object.keys(CAPL_TYPES).find(k => k.toLowerCase() === lowerWord);
            if (typeKey) {
                const md = new vscode.MarkdownString(CAPL_TYPES[typeKey]);
                md.isTrusted = true;
                return new vscode.Hover(md, range);
            }
            
            const funcKey = Object.keys(CAPL_FUNCTIONS).find(k => k.toLowerCase() === lowerWord);
            if (funcKey) {
                const raw = CAPL_FUNCTIONS[funcKey];
                const doc = raw.replace(/\n/g, '<br/>');
                const md = new vscode.MarkdownString(doc);
                md.isTrusted = true;
                md.supportHtml = true;
                return new vscode.Hover(md, range);
            }
            
            const kwKey = Object.keys(CAPL_KEYWORDS).find(k => k.toLowerCase() === lowerWord);
            if (kwKey) {
                const raw = CAPL_KEYWORDS[kwKey];
                const doc = raw.replace(/\n/g, '<br/>');
                const md = new vscode.MarkdownString(doc);
                md.isTrusted = true;
                md.supportHtml = true;
                return new vscode.Hover(md, range);
            }
            
            return null;
        }
    });

    const getUserDefinedVariables = (document: vscode.TextDocument): string[] => {
        const text = document.getText();
        const variables: string[] = [];
        
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

    const documentSymbols = new Map<string, SymbolLocation[]>();

    const getDocumentSymbols = (doc: vscode.TextDocument): SymbolLocation[] => {
        const uri = doc.uri.toString();
        if (!documentSymbols.has(uri)) {
            documentSymbols.set(uri, collectSymbols(doc));
        }
        return documentSymbols.get(uri)!;
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

    const findAllReferences = (word: string, exceptUri?: vscode.Uri, currentFunc?: string): SymbolLocation[] => {
        const refs: SymbolLocation[] = [];
        
        ALL_SYMBOLS.forEach((symbols, uriStr) => {
            if (exceptUri && uriStr === exceptUri.toString()) {
                for (const sym of symbols) {
                    if (sym.name === word) {
                        if (sym.file.includes('|')) {
                            const funcScope = sym.file.split('|')[1];
                            if (!currentFunc || funcScope === currentFunc) {
                                refs.push(sym);
                            }
                        } else {
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

    const findDefinition = (word: string, exceptUri?: vscode.Uri, currentFunc?: string): SymbolLocation | null => {
        let localFound: SymbolLocation | null = null;
        let globalFound: SymbolLocation | null = null;
        
        ALL_SYMBOLS.forEach((symbols, uriStr) => {
            for (const sym of symbols) {
                if (sym.name === word) {
                    if (sym.file.includes('|')) {
                        const funcScope = sym.file.split('|')[1];
                        if (currentFunc && funcScope === currentFunc) {
                            localFound = sym;
                        }
                    } else if (exceptUri && uriStr !== exceptUri.toString()) {
                        globalFound = sym;
                    } else if (!exceptUri) {
                        globalFound = sym;
                    }
                }
            }
        });
        
        return localFound || globalFound;
    };

    const definitionProvider = vscode.languages.registerDefinitionProvider(docSelector, {
        provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.Location | null {
            const range = document.getWordRangeAtPosition(position);
            if (!range) return null;
            
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
                        if (insideFunc && funcScope !== insideFunc) continue;
                    }
                    return new vscode.Location(document.uri, symbol.range);
                }
            }
            
            return null;
        }
    });

    const referenceProvider = vscode.languages.registerReferenceProvider(docSelector, {
        provideReferences(document: vscode.TextDocument, position: vscode.Position, context: vscode.ReferenceContext, token: vscode.CancellationToken): vscode.Location[] {
            const range = document.getWordRangeAtPosition(position);
            if (!range) return [];
            
            const word = document.getText(range);
            const refs: vscode.Location[] = [];
            
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
                } catch (e) {}
            }
            
            return refs;
        }
    });

    const documentLinkProvider = vscode.languages.registerDocumentLinkProvider(docSelector, {
        provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.DocumentLink[] {
            const links: vscode.DocumentLink[] = [];
            const text = document.getText();
            const lines = text.split('\n');
            const docDir = document.uri.fsPath.replace(/[/\\][^/\\]+$/, '');
            
            lines.forEach((line, index) => {
                const match = line.match(/#include\s*[<"]([^>"]+)[>"]/);
                if (match) {
                    const includePath = match[1];
                    const startPos = line.indexOf(match[1]);
                    const range = new vscode.Range(index, startPos, index, startPos + includePath.length);
                    
                    let targetPath: string;
                    if (includePath.startsWith('/') || (includePath.length > 1 && includePath[1] === ':')) {
                        targetPath = includePath;
                    } else {
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
        provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
            const items: vscode.CompletionItem[] = [];
            const userVars = getUserDefinedVariables(document);
            const symbols = getDocumentSymbols(document);
            
            for (const func of Object.keys(CAPL_FUNCTIONS)) {
                const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                item.detail = CAPL_FUNCTIONS[func].split('\n')[0];
                item.insertText = new vscode.SnippetString(func + '($0)');
                items.push(item);
                
                const upperFunc = func.toUpperCase();
                if (func !== upperFunc) {
                    const itemUpper = new vscode.CompletionItem(upperFunc, vscode.CompletionItemKind.Function);
                    itemUpper.detail = CAPL_FUNCTIONS[func].split('\n')[0];
                    itemUpper.insertText = new vscode.SnippetString(upperFunc + '($0)');
                    items.push(itemUpper);
                }
            }
            
            for (const kw of Object.keys(CAPL_KEYWORDS)) {
                const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
                item.detail = CAPL_KEYWORDS[kw].split('\n')[0];
                items.push(item);
                
                const upperKw = kw.toUpperCase();
                if (kw !== upperKw) {
                    const itemUpper = new vscode.CompletionItem(upperKw, vscode.CompletionItemKind.Keyword);
                    itemUpper.detail = CAPL_KEYWORDS[kw].split('\n')[0];
                    items.push(itemUpper);
                }
            }
            
            for (const t of Object.keys(CAPL_TYPES)) {
                const item = new vscode.CompletionItem(t, vscode.CompletionItemKind.TypeParameter);
                item.detail = CAPL_TYPES[t];
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
                } else if (symbol.type === 'variable') {
                    const item = new vscode.CompletionItem(symbol.name, vscode.CompletionItemKind.Variable);
                    item.detail = 'user defined variable';
                    items.push(item);
                }
            }
            
            return items;
        }
    }, '');

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('capl');

    const updateDiagnostics = (document: vscode.TextDocument) => {
        if (document.languageId !== 'capl') return;
        
        documentSymbols.delete(document.uri.toString());
        getDocumentSymbols(document);
        
        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const lines = text.split('\n');
        
        let braceCount = 0;
        let parenCount = 0;
        
        const isInsideBlockComment = (lineIdx: number) => {
            let inComment = false;
            for (let i = 0; i <= lineIdx; i++) {
                const line = lines[i];
                if (line.includes('/*')) inComment = true;
                if (line.includes('*/')) inComment = false;
            }
            return inComment;
        };
        
        const isStatementNeedingSemicolon = (line: string): boolean => {
            const trimmed = line.trim();
            if (!trimmed) return false;
            
            const functionPattern = /^\s*(void|int|long|float|double|char|byte|word|dword|qword|boolean|timer|message|signal|envvar)\s+\w+\s*\([^;]*\)\s*\{?\s*$/;
            const enumPattern = /^\s*enum\s+\w+\s*\{/;
            const structPattern = /^\s*struct\s+\w*\s*\{/;
            const arrayPattern = /^\s*array\s+<.*>\s+\w+\s*=/;
            const onHandlerPattern = /^\s*on\w+\s*\([^)]*\)\s*\{?\s*$/;
            
            if (functionPattern.test(trimmed)) return false;
            if (enumPattern.test(trimmed)) return false;
            if (structPattern.test(trimmed)) return false;
            if (arrayPattern.test(trimmed)) return false;
            if (onHandlerPattern.test(trimmed)) return false;
            
            if (trimmed.includes('(') && trimmed.includes(')')) {
                const funcCallMatch = trimmed.match(/^\s*(\w+)\s*\(/);
                if (funcCallMatch) {
                    const funcName = funcCallMatch[1];
                    if (CAPL_FUNCTIONS[funcName] || CAPL_KEYWORDS[funcName]) {
                        return !trimmed.endsWith(';');
                    }
                }
            }
            
            if (/^\s*\w+\s*=\s*[^=].*;\s*$/.test(trimmed)) return false;
            const hasSemicolon = (str: string) => str.trim().endsWith(';');
            
            if (/^\s*(int|long|float|double|char|byte|word|dword|qword|boolean)\s+\w+\s*=/.test(trimmed)) {
                return !hasSemicolon(trimmed);
            }

            return false;
        };
        
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            
            if (isInsideBlockComment(index)) return;
            
            for (const char of line) {
                if (char === '{') braceCount++;
                if (char === '}') braceCount--;
            }
            
            const commentIdx = line.indexOf('//');
            let codePart = commentIdx >= 0 ? line.substring(0, commentIdx) : line;
            for (const char of codePart) {
                if (char === '(') parenCount++;
                if (char === ')') parenCount--;
            }
            
            const trimmed = codePart.trim();
            
            if (!trimmed) return;
            if (trimmed.startsWith('//')) return;
            if (trimmed.startsWith('/*')) return;
            if (trimmed.startsWith('#')) return;
            if (/^(\*|\*\/)/.test(trimmed)) return;
            if (/^(if|else|while|for|switch)\s*\(/.test(trimmed)) return;
            if (/^(if|else|while|for)\s*\{/.test(trimmed)) return;
            if (trimmed === '}' || trimmed === '{') return;
            
            const funcCallRegex = /(\w+)\s*\(([^)]*)\)/g;
            const funcMatches = trimmed.matchAll(funcCallRegex);
            for (const callMatch of funcMatches) {
                const funcName = callMatch[1];
                const funcData = CAPL_FUNCTIONS[funcName] || CAPL_FUNCTIONS[funcName.toLowerCase()] || CAPL_FUNCTIONS[funcName.toUpperCase()];
                if (funcData) {
                    const syntaxMatchPart = funcData.split('\n').find(l => l.startsWith('Syntax:'));
                    if (syntaxMatchPart) {
                        const actualArgs = callMatch[2] ? callMatch[2].split(',').filter(a => a.trim()) : [];
                        let params = getFunctionParams(syntaxMatchPart, actualArgs.length);
                        const isVariadic = params.some(p => p.includes('...'));
                        if (isVariadic) {
                            params = params.filter(p => p.trim() && !p.includes('...'));
                        }
                        if (actualArgs.length !== params.length || (params.length === 0 && actualArgs.length > 0)) {
                            const msg = actualArgs.length > params.length 
                                ? `Function '${funcName}' expects ${params.length} params (got ${actualArgs.length})`
                                : (actualArgs.length < params.length
                                    ? (isVariadic 
                                        ? `Function '${funcName}' expects ${params.length}+ params (got ${actualArgs.length})`
                                        : `Function '${funcName}' expects ${params.length} params (got ${actualArgs.length})`)
                                    : `Function '${funcName}' requires 0 params (got ${actualArgs.length})`);
                            diagnostics.push({
                                message: msg,
                                range: new vscode.Range(lineNum - 1, 0, lineNum - 1, line.length),
                                severity: vscode.DiagnosticSeverity.Warning
                            });
                        }
                        for (let i = 0; i < Math.min(actualArgs.length, params.length); i++) {
                            const arg = actualArgs[i].trim();
                            const fullExp = params[i].trim();
                            const expTypeMatch = fullExp.match(/^\s*(dword|word|byte|int|long|float|double|qword|boolean|char)\b/i);
                            const expTypeRaw = expTypeMatch ? expTypeMatch[1].toLowerCase() : fullExp.replace(/\[\].*$/, '').trim().split(/\s/)[0];
                            const expTypes = getExpectedTypes(expTypeRaw);
                            if (/^[a-zA-Z_]\w*$/.test(arg)) {
                                const vType = getVariableType(arg, document, lineNum);
                                if (!vType) {
                                    diagnostics.push({
                                        message: `Undefined variable '${arg}'`,
                                        range: new vscode.Range(lineNum - 1, 0, lineNum - 1, line.length),
                                        severity: vscode.DiagnosticSeverity.Error
                                    });
                                } else if (!isTypeCompatible(vType, expTypes)) {
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
            }
            
            const endsWithValid = trimmed.endsWith(';') || trimmed.endsWith(',') || trimmed.endsWith(':') || trimmed.endsWith('{') || trimmed.endsWith('}');
            if (endsWithValid) return;
            
            if (/^(case|default)\s+/.test(trimmed)) return;
            
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

    context.subscriptions.push(
        hoverProvider, 
        completionProvider, 
        diagnosticCollection, 
        subscription,
        definitionProvider,
        referenceProvider,
        documentLinkProvider,
        fileOpenSubscription,
        fileCloseSubscription
    );
}

export function deactivate() {}