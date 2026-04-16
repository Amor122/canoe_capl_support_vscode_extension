from pathlib import Path

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

lines = content.split('\n')

new_lines = []
in_new_section = False
last_line_empty = False

for line in lines:
    stripped = line.strip()

    if "// Additional Functions from Help Documentation" in stripped:
        in_new_section = True
        new_lines.append(line)
        continue

    if in_new_section:
        if stripped.startswith('// '):
            new_lines.append(line)
            last_line_empty = False
            continue

        if "'" in stripped and ":" in stripped and stripped.endswith("."):
            continue

        if stripped and not stripped.startswith("'") and not stripped.startswith("export"):
            new_lines.append(line)
            last_line_empty = False
            continue

        if stripped == "":
            if not last_line_empty:
                new_lines.append(line)
                last_line_empty = True
            continue

        new_lines.append(line)
        continue

    new_lines.append(line)
    last_line_empty = (stripped == "")

Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text('\n'.join(new_lines), encoding='utf-8')
print("Fixed extra newlines")