# Vector CAPL Language Support

VSCode extension providing CAPL (Communication Access Programming Language) support with syntax highlighting, hover documentation, and syntax error analysis.

## Features

- **Syntax Highlighting**: Full grammar support for CAPL language keywords, functions, types, comments, and strings
- **Hover Documentation**: Hover over CAPL functions and keywords to see their descriptions
- **Auto-completion**: IntelliSense for CAPL functions and keywords
- **Syntax Error Analysis**: Real-time diagnostics for common syntax errors like missing semicolons, unmatched braces/parentheses

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Open the project in VSCode and press F5 to launch the extension

## File Extensions

The extension recognizes files with `.capl` and `.can` extensions.

## CAPL Functions Included

- Output functions: `output`, `write`, `elnl`, `elprintf`, `elprintfex`
- Timer functions: `setTimer`, `setTimerSync`, `cancelTimer`, `timer`, `elapsed`
- Value access: `putValue`, `getValue`, `setWrite`, `getSignal`, `setSignal`
- Message handlers: `onmessage`, `ontimer`, `onstart`, `onstop`, `onerror`, `onkey`
- Test functions: `testcase`, `testfunction`, `testwait`, `testassert`, `teststep`
- Math functions: `sqrt`, `abs`, `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log`, `exp`, `pow`
- String functions: `strlen`, `strcpy`, `strcat`, `strcmp`, `sprintf`, `atoi`, `atof`
- Memory functions: `memset`, `memcpy`, `memcmp`, `memmove`
- File functions: `filemap`, `fileclose`, `fileread`, `filewrite`
- Logging functions: `logOpen`, `logClose`, `logReset`, `logWrite`
- Hardware functions: `xlSetLED`, `xlAcquireLED`, `InterfaceStatus`
- Panel functions: `openPanel`, `closePanel`, `enableControl`, `SetControlProperty`
- And many more...

## Configuration

The extension uses the built-in VSCode theming for syntax colors. You can customize colors in your VSCode settings.

## License

MIT
