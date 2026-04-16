from pathlib import Path

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')
lines = content.split('\n')

new_lines = []
for i, line in enumerate(lines):
    stripped = line.strip()
    if stripped and not stripped.endswith("';") and not stripped.startswith("//"):
        if stripped.endswith("'") and not stripped.endswith("',"):
            line = line.rstrip() + "',"
    new_lines.append(line)

Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text('\n'.join(new_lines), encoding='utf-8')
print("Fixed trailing commas")