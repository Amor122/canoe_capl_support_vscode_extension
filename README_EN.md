# CANoe CAPL Support

VSCode extension for CANoe CAPL language support with syntax highlighting, hover docs, code completion, go to definition, find references, and parameter checking.

## Features

- **Syntax Highlighting**: CAPL keywords, functions, types, strings, comments
- **Hover Documentation**: Hover over functions to see detailed docs
- **Code Completion**: Auto-complete function names
- **Go to Definition**: Jump to variable/function definitions
- **Find References**: Find all usages
- **Parameter Checking**: Built-in function parameter count validation
- **Type Checking**: Type compatibility validation

## Supported Files

- `.can` - CAPL program files
- `.cin` - CAPL include files

## Supported CANoe Versions

19.5.44 (likely compatible with other versions)

## Installation

1. Download `canoe-capl-support-1.0.3.vsix`
2. VSCode: `Extensions` → `Install from VSIX`

## Usage

Open `.can` or `.cin` files to use.

### Hover Documentation

Hover over a function name to view docs:

```
Write("hello");  // Hover over Write
```

### Code Completion

Type function name prefix:

```
Wri  // Press Ctrl+Space to trigger completion
```

### Parameter Checking

Automatically checks parameter count for built-in functions:

```
WriteEx();  // Reports error: requires 3 parameters
```

## Data Source

Function documentation from Vector CANoe Help (19.5.44), containing **7474** built-in functions/overloads.

## Changelog

- 1.0.3 - Support all function overloads, parameter checking
- 1.0.2 - Initial release

## License

MIT License