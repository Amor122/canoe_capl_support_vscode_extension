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

def categorize(func):
    prefixes = [
        ("A429", "ARINC 429"), ("A664", "AFDX"), ("ADAS", "ADAS"),
        ("AREth", "AUTOSAR Eth"), ("Ar", "AUTOSAR"), ("Avb", "AVB"),
        ("Can", "CAN"), ("CAN", "CAN"), ("Car", "Car2x"), ("C2x", "Car2x"),
        ("Diag", "Diagnostics"), ("DoIP", "DoIP"), ("Eth", "Ethernet"),
        ("Fr", "FlexRay"), ("J1939", "J1939"), ("LIN", "LIN"),
        ("SomeIp", "SOME/IP"), ("Xcp", "XCP"), ("X509", "Security"),
        ("Sensor", "Sensor"), ("SCC", "Smart Charging"), ("Media", "Media"),
        ("Test", "Test"), ("Chk", "Check"), ("Replay", "Replay"),
        ("Scope", "Scope"), ("Proj", "Project"), ("DO", "Distributed Objects"),
    ]
    for prefix, cat in prefixes:
        if func.startswith(prefix):
            return cat
    return "General"

new_entries = []
for func in new_funcs:
    cat = categorize(func)
    desc = f"{func}(); - {cat} function"
    new_entries.append(f"    '{func}': '{desc}',")

content = content.rstrip() + "\n\n" + "\n".join(new_entries) + "\n"

with open(capl_data_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Added {len(new_entries)} functions")