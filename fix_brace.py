from pathlib import Path

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

lines = content.split('\n')

new_lines = []
for i, line in enumerate(lines):
    if i == len(lines) - 1 and line.strip() == "};":
        continue
    new_lines.append(line)

Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text('\n'.join(new_lines), encoding='utf-8')
print("Removed extra brace")