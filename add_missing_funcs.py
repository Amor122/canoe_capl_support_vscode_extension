import re
from pathlib import Path

capl_data_path = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts")

with open(capl_data_path, 'r', encoding='utf-8') as f:
    capl_content = f.read()

existing_funcs = set()
for match in re.findall(r"'([A-Za-z][A-Za-z0-9_]+)':", capl_content):
    existing_funcs.add(match)

with open(r"D:\PY_PROJECTS\vector_capl_extension\MISSING_FUNCTIONS.txt", 'r', encoding='utf-8') as f:
    missing_funcs = [line.strip() for line in f if line.strip()]

new_funcs = [f for f in missing_funcs if f not in existing_funcs]

def categorize_function(func_name):
    prefixes = {
        'A429': 'ARINC 429',
        'A664': 'AFDX/ARINC 664',
        'ADAS': 'ADAS',
        'AREth': 'AUTOSAR Ethernet',
        'Areth': 'AUTOSAR Ethernet',
        'AR': 'AUTOSAR',
        'Ar': 'AUTOSAR',
        'Avb': 'AVB',
        'Can': 'CAN',
        'CAN': 'CAN',
        'Car': 'Car2x',
        'C2x': 'Car2x',
        'Diag': 'Diagnostics',
        'DoIP': 'DoIP',
        'Eth': 'Ethernet',
        'Fr': 'FlexRay',
        'J1939': 'J1939',
        'LIN': 'LIN',
        'SomeIp': 'SOME/IP',
        'Xcp': 'XCP',
        'X509': 'Security',
        'Sensor': 'Sensor',
        'SCC': 'Smart Charging',
        'Media': 'Media',
        'Test': 'Test',
        'Chk': 'Check',
        'Replay': 'Replay',
        'Scope': 'Scope',
        'Proj': 'Project',
    }
    for prefix, category in prefixes.items():
        if func_name.startswith(prefix):
            return category
    return 'General'

def get_description(func_name, category):
    base_desc = category if category != 'General' else 'CAPL'
    return f"{func_name}();\n\n{base_desc} function."

func_dict = {}
for func in new_funcs:
    category = categorize_function(func)
    if category not in func_dict:
        func_dict[category] = []
    func_dict[category].append((func, get_description(func, category)))

lines_to_add = []
lines_to_add.append("")
lines_to_add.append("    // Additional Functions from Help Documentation")

for category in sorted(func_dict.keys()):
    funcs = func_dict[category]
    lines_to_add.append(f"    // {category}")
    for func, desc in sorted(funcs):
        lines_to_add.append(f"    '{func}': '{desc}',")

lines_to_add.append("")

new_content = capl_content.rstrip() + "\n" + "\n".join(lines_to_add) + "\n};"

with open(capl_data_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Added {len(new_funcs)} new functions to caplData.ts")