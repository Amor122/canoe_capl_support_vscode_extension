# Vector CAPL Extension Development Notes

## Current Version
1.0.2 - canoe-capl-support-1.0.2.vsix

## Key Files
- `src/extension.ts` - Main VSCode extension logic
- `src/caplData.ts` - CAPL function/type/keyword data (4944 functions)
- `syntaxes/capl.tmLanguage.json` - Syntax highlighting rules

## Core Technical Issues Solved

### 1. Function Parameter Jump Issue (Line 58 property/value)
**Problem**: Clicking on function parameters (property, value) on the function declaration line didn't work - they either couldn't be clicked or jumped to the wrong location.

**Root Cause**: 
- Symbol collection order was wrong: parameter extraction happened BEFORE function detection, so `currentFunction` was undefined
- Definition lookup skipped function-scoped symbols when `insideFunc` was empty (which happens on the declaration line itself)

**Solution**:
1. In symbol collection: Extract parameters IMMEDIATELY after detecting function definition, using split by `(` `)` `,`
   ```typescript
   const funcMatch = trimmed.match(/^(void|int|long|float|double|char|byte|word|dword|qword|boolean)\s+(\w+)\s*\(/);
   if (funcMatch && !trimmed.includes('{')) {
       currentFunction = funcMatch[2];
       // Extract parameters in the same block
       const parts = trimmed.split(/[\(\),]/);
       for (const part of parts) {
           const varMatch = part.match(/\b(int|long|float|double|char|byte|word|dword|qword)\s+(\w+)/);
           if (varMatch && varMatch[2] !== currentFunction) {
               symbols.push({ name: varMatch[2], type: 'variable', ... });
           }
       }
   }
   ```

2. In definition lookup: Allow matching scoped symbols when insideFunc is empty
   ```typescript
   if (symbol.file.includes('|')) {
       const funcScope = symbol.file.split('|')[1];
       if (insideFunc && funcScope !== insideFunc) continue;  // Only skip if we know the current function
   }
   ```

### 2. Case-Insensitive Matching
- Added `.toLowerCase()` comparison when searching symbols to handle cases like `property` vs `Property`

### 3. Struct Variables
- Added support for `struct TypeName variableName` declarations in variables block
   ```typescript
   const structVarMatch = trimmed.match(/\bstruct\s+(\w+)\s+(\w+)/);
   ```

## Known Limitations
- Parameter parsing on declaration line only (not in function body)
- Some edge cases with complex array syntax not supported

## Test Files
- `C:\Users\Public\Documents\Vector\CANoe\Sample Configurations 19.5.44\CAN\CANXL\CANXLBasic\CAPL\Include\UtilityFunctions.cin`
  - Line 58: `dword ConvertStringValueToDword(char property[], char value[])`
  - Line 109: `void ConvertDwordToString(char property[], dword value, char valueAsString[])`
  - Line 211: `void ReadOutProperty(dword mediaTypeHandle, char property[])`
  - Line 54: struct variable `mediaProperties`

## To Continue
If issues resurface with parameter jumping:
1. Check symbol collection runs after function detection
2. Verify definition lookup allows empty insideFunc to match scoped symbols
3. Test case-insensitive comparison

## Build Command
```bash
cd D:/PY_PROJECTS/vector_capl_extension
npx vsce package
```