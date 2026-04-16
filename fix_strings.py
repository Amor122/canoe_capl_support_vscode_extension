from pathlib import Path

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

lines = content.split('\n')

fixed_lines = []
for i, line in enumerate(lines):
    stripped = line.strip()
    
    if stripped == "":
        fixed_lines.append("")
        continue
    
    indent = len(line) - len(line.lstrip()) if line and line[0] in " \t" else 0
    indent_str = " " * indent
    
    if "'" in stripped and ":" in stripped and stripped.endswith("."):
        parts = stripped.split(":")
        if len(parts) == 2:
            key = parts[0].strip()
            value_raw = parts[1].strip().rstrip(",")
            value = value_raw.replace("\n", " ")
            value = value.replace("  ", " ")
            fixed_line = indent_str + key + ": '" + value + "',"
            fixed_lines.append(fixed_line)
            continue
    
    fixed_lines.append(line)

Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text("\n".join(fixed_lines), encoding='utf-8')
print("Fixed newlines in strings")