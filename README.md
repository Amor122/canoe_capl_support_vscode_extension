# Vector CAPL Language Support

VSCode extension providing comprehensive CAPL (Communication Access Programming Language) support for Vector CANoe/CANalyzer.

## Features

### Syntax Highlighting
- Keywords: if, else, while, for, switch, case, return, const, static, void, enum, struct, on, include, define
- Types: byte, word, dword, qword, int, long, int64, float, double, char, boolean, timer, Timer, msTimer, mstimer, message, signal, envvar, pdu, sysvar
- Functions: write, writeLineEx, putValue, getValue, setTimer, setTimerCyclic, memcpy, memset, strlen, strcpy, TestStepPass, TestStepFail, and 5000+ more
- Comments and strings support

### Hover Documentation  
- Hover over functions and keywords to see descriptions
- Includes 5000+ CAPL functions from Vector CANoe Help

### Auto-completion
- IntelliSense for CAPL functions and keywords
- User-defined variables and functions
- Variables from `variables { }` blocks

### Jump to Definition
- Ctrl+Click or F12 to jump to variable/function definitions
- Supports variables defined in `variables { }` blocks
- Supports functions defined after usage
- Cross-file navigation (all open .can/.cin files)

### Find References
- Shift+F12 to find all references to a variable or function
- Searches across all open CAPL files

### Include Links
- Ctrl+Click on #include paths to open included files

### Syntax Error Analysis
- Real-time diagnostics for:
  - Missing semicolons
  - Unmatched braces and parentheses
  - Comments at end of lines handled correctly

## File Extensions

- `.can` - CANoe configuration files  
- `.cin` - CANoe Include files

## Installation

1. Install from VSCode Marketplace (search for "Vector CAPL")
2. Or: Install the VSIX file from releases

## Usage

1. Open any `.can`, `.capl`, or `.cin` file in VSCode
2. For cross-file features, add the project folder to workspace:
   - File → Add Folder to Workspace
   - Select the CANoe Sample Configurations folder

## Keyboard Shortcuts

| Feature | Shortcut |
|---------|---------|
| Jump to Definition | Ctrl+Click or F12 |
| Find References | Shift+F12 |
| Hover Documentation | Hover over function |

## Data Sources

This extension was built by analyzing:
- Vector CANoe Help 19.5.44 documentation
- Sample Configurations from CANoe 19.5.44

Total CAPL functions documented: 5000+

## Version

1.0.0

## License

MIT