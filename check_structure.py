from pathlib import Path
import re

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

open_count = content.count('{')
close_count = content.count('}')

lines = len(content.split('\n'))

print(f"Open braces: {open_count}, Close braces: {close_count}")
print(f"Total lines: {lines}")
print(f"File size: {len(content)} bytes")

# Extract all function names to verify
funcs = re.findall(r"'([A-Za-z][A-Za-z0-9_]+)':", content)
print(f"Total functions: {len(set(funcs))}")