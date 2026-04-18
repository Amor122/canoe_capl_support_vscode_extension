from pathlib import Path
import re

capl_file = Path(r'D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts')
content = capl_file.read_text(encoding='utf-8')

existing = set(re.findall(r"'([A-Za-z_][A-Za-z0-9_]*)':", content))
print(f'Existing functions: {len(existing)}')

with open(r'D:\PY_PROJECTS\vector_capl_extension\ALL_FUNCTIONS.txt') as f:
    all_funcs = [line.strip() for line in f if line.strip()]

new_funcs = [f for f in all_funcs if f not in existing]
print(f'New functions to add: {len(new_funcs)}')

# Categorize functions
def categorize(func):
    prefixes = [
        ('A429', 'ARINC 429'), ('A664', 'AFDX'), ('ADAS', 'ADAS'),
        ('Areth', 'AUTOSAR Eth'), ('AR', 'AUTOSAR'), ('Avb', 'AVB'),
        ('Can', 'CAN'), ('CAN', 'CAN'), ('Car', 'Car2x'), ('C2x', 'Car2x'),
        ('Diag', 'Diagnostics'), ('DoIP', 'DoIP'), ('Eth', 'Ethernet'),
        ('Fr', 'FlexRay'), ('J1939', 'J1939'), ('LIN', 'LIN'),
        ('SomeIp', 'SOME/IP'), ('Xcp', 'XCP'), ('X509', 'Security'),
        ('Sensor', 'Sensor'), ('SCC', 'Smart Charging'), ('Media', 'Media'),
        ('Test', 'Test'), ('Chk', 'Check'), ('Replay', 'Replay'),
        ('Scope', 'Scope'), ('Proj', 'Project'), ('DO', 'Distributed Objects'),
        ('SysVar', 'System Variables'), ('TLSA', 'TLS'), ('TCP', 'TCP'),
        ('ISO', 'ISO'), ('OCPP', 'OCPP'), ('E2E', 'E2E'),
    ]
    for prefix, cat in prefixes:
        if func.startswith(prefix):
            return cat
    return 'General'

# Group new functions
grouped = {}
for func in new_funcs:
    cat = categorize(func)
    if cat not in grouped:
        grouped[cat] = []
    grouped[cat].append(func)

print("\nNew functions by category:")
for cat, funcs in sorted(grouped.items()):
    print(f"  {cat}: {len(funcs)}")

# Add to caplData.ts
entries = []
for func in new_funcs:
    cat = categorize(func)
    entries.append(f"    '{func}': '{func}(); - {cat} function',")

# Find the end of CAPL_FUNCTIONS
lines = content.split('\n')
new_lines = []
for line in lines:
    new_lines.append(line)
    if line.strip() == "};": 
        break

for entry in sorted(entries):
    new_lines.append(entry)

new_content = '\n'.join(new_lines)

with open(capl_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\nAdded {len(entries)} new functions to caplData.ts")