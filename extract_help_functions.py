import os
import re
from pathlib import Path

help_dir = Path(r"C:\Program Files\Vector\Help\Vector CANoe Help 19.5.44\en\Content\Topics\CAPLFunctions")

def extract_functions_from_file(filepath):
    functions = set()
    try:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            matches = re.findall(r'CAPLfunction([A-Za-z][A-Za-z0-9_]*)\.htm', content)
            for m in matches:
                func_name = m
                if func_name and not func_name[0].isdigit():
                    functions.add(func_name)
    except Exception as e:
        pass
    return functions

all_functions = set()
for htm_file in help_dir.rglob("*.htm"):
    funcs = extract_functions_from_file(htm_file)
    all_functions.update(funcs)

with open(r"D:\PY_PROJECTS\vector_capl_extension\HELP_FUNCTIONS.txt", 'w', encoding='utf-8') as f:
    for func in sorted(all_functions):
        f.write(func + '\n')

print(f"Found {len(all_functions)} unique functions")