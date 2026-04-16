from pathlib import Path
import re

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

pattern = r"'([A-Za-z][A-Za-z0-9_]+)':\s*'([^']*?)',\s*\n\s*([A-Za-z]+\s+function\.)',"

def fix_format(match):
    func = match.group(1)
    desc = match.group(2).strip()
    suffix = match.group(3)
    return f"    '{func}': '{desc} {suffix}',"

fixed = re.sub(pattern, fix_format, content)

fixed = fixed.replace("'\n\n", "'\n")
fixed = fixed.replace("\n'", "'\n")

Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text(fixed, encoding='utf-8')
print("Fixed format")