import re
import os
from pathlib import Path
from collections import defaultdict

HELP_DIR = r"C:\Program Files\Vector\Help\Vector CANoe Help 19.5.44\en"
SAMPLE_DIR = r"C:\Users\Public\Documents\Vector\CANoe\Sample Configurations 19.5.44"

def extract_from_help():
    """Extract all CAPL functions from help documentation"""
    functions = defaultdict(set)
    help_path = Path(HELP_DIR)
    
    capl_dir = help_path / "Content" / "Topics" / "CAPLFunctions"
    if not capl_dir.exists():
        print(f"CAPLFunctions directory not found at {capl_dir}")
        return functions
    
    for htm_file in capl_dir.rglob("*.htm"):
        try:
            content = htm_file.read_text(encoding='utf-8', errors='ignore')
            
            for match in re.findall(r'CAPLfunction([A-Z][A-Za-z0-9_]*)\.htm', content):
                if match and len(match) > 1:
                    category = htm_file.parent.name
                    functions[category].add(match)
            
            for match in re.findall(r'\b([A-Z][a-z]+[A-Z][A-Za-z0-9_]*)\s*=\s*function\b', content):
                if match:
                    functions['OOP'].add(match)
                    
            func_patterns = [
                r'\b([a-z][A-Za-z0-9_]*)\s*=\s*function\b',
                r'function\s+([a-z][A-Za-z0-9_]*)\s*\(',
                r'\b([A-Z][A-Za-z0-9_]+)\s*:\s*function\b',
            ]
            for pattern in func_patterns:
                for match in re.findall(pattern, content):
                    if match and len(match) > 2 and match[0].isupper():
                        functions['Functions'].add(match)
                        
        except Exception as e:
            pass
    
    print(f"Found functions in categories: {list(functions.keys())}")
    return functions

def extract_from_samples():
    """Extract functions from sample .can files"""
    functions = set()
    sample_path = Path(SAMPLE_DIR)
    
    if not sample_path.exists():
        print(f"Sample directory not found at {sample_path}")
        return functions
    
    for can_file in sample_path.rglob("*.can"):
        try:
            content = can_file.read_text(encoding='utf-8', errors='ignore')
            
            for match in re.findall(r'\b([a-z_][A-Za-z0-9_]*)\s*=\s*function\b', content):
                if match and len(match) > 2:
                    functions.add(match)
                    
            for match in re.findall(r'function\s+([a-z_][A-Za-z0-9_]*)\s*\(', content):
                if match:
                    functions.add(match)
                    
            for match in re.findall(r'^\s*(void|int|long|float|double|char|byte|word|dword|qword|boolean)\s+(\w+)\s*\(', content, re.MULTILINE):
                functions.add(match[1])
                
        except:
            pass
    
    return functions

def main():
    print("Extracting CAPL functions from help documentation...")
    help_functions = extract_from_help()
    
    print("\nExtracting functions from sample configurations...")
    sample_functions = extract_from_samples()
    
    all_funcs = set()
    for funcs in help_functions.values():
        all_funcs.update(funcs)
    all_funcs.update(sample_functions)
    
    print(f"\nTotal unique functions found: {len(all_funcs)}")
    
    for category, funcs in sorted(help_functions.items()):
        print(f"  {category}: {len(funcs)}")
    print(f"  Sample files: {len(sample_functions)}")
    
    output_file = Path(r"D:\PY_PROJECTS\vector_capl_extension\ALL_FUNCTIONS.txt")
    with output_file.open('w', encoding='utf-8') as f:
        for func in sorted(all_funcs):
            f.write(func + '\n')
    
    print(f"\nSaved to {output_file}")

if __name__ == "__main__":
    main()