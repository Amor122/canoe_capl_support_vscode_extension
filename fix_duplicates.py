from pathlib import Path

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

lines = content.split('\n')

new_lines = []
found_types = False
for i, line in enumerate(lines):
    new_lines.append(line)
    if line.strip() == "export const CAPL_TYPES = [":
        found_types = True
    if found_types and line.strip() == "];":

        break

for line in lines[i+1:]:
    new_lines.append(line)

Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text('\n'.join(new_lines), encoding='utf-8')
print('Removed duplicate content')