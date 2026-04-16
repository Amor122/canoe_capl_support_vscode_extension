import re
from pathlib import Path

capl_data_path = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts")

with open(capl_data_path, 'r', encoding='utf-8') as f:
    content = f.read()

existing_funcs = set()
for match in re.findall(r"'([A-Za-z][A-Za-z0-9_]+)':", content):
    existing_funcs.add(match)

with open(Path(r"D:\PY_PROJECTS\vector_capl_extension\MISSING_FUNCTIONS.txt"), 'r', encoding='utf-8') as f:
    missing_funcs = [line.strip() for line in f if line.strip()]

new_funcs = [f for f in missing_funcs if f not in existing_funcs]

def get_description(func_name):
    return f"{func_name}(); - CAPL function"

new_entries = []
for func in new_funcs:
    new_entries.append(f"    '{func}': '{get_description(func)}',")

end_marker = "export const CAPL_TYPES"
idx = content.find(end_marker)

if idx > 0:
    new_content = content[:idx] + "\n".join(new_entries) + "\n\n" + content[idx:]
    
    with open(capl_data_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Added {len(new_funcs)} functions")
else:
    print(f"Could not find {end_marker}")