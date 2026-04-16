import os
import re
from pathlib import Path

help_dir = Path(r"C:\Program Files\Vector\Help\Vector CANoe Help 19.5.44\en\Content\Topics\CAPLFunctions")
capl_data_path = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts")

with open(capl_data_path, 'r', encoding='utf-8') as f:
    capl_content = f.read()

existing_funcs = set()
for match in re.findall(r"'([A-Za-z][A-Za-z0-9_]+)':", capl_content):
    existing_funcs.add(match)

print(f"Existing functions in caplData.ts: {len(existing_funcs)}")

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

all_help_funcs = set()
for htm_file in help_dir.rglob("*.htm"):
    funcs = extract_functions_from_file(htm_file)
    all_help_funcs.update(funcs)

print(f"Functions from help: {len(all_help_funcs)}")

missing_funcs = all_help_funcs - existing_funcs

with open(r"D:\PY_PROJECTS\vector_capl_extension\MISSING_FUNCTIONS.txt", 'w', encoding='utf-8') as f:
    for func in sorted(missing_funcs):
        f.write(func + '\n')

print(f"Missing functions: {len(missing_funcs)}")
print(f"First 100 missing functions:")
for i, func in enumerate(sorted(missing_funcs)[:100]):
    print(f"  {func}")