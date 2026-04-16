from pathlib import Path

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

lines = content.split('\n')
count = 0
for i, line in enumerate(lines):
    count += line.count('{') - line.count('}')
    if count < 0:
        print(f"Line {i+1}: Too many closing braces - {count}")
        print(f"  {line}")
        break
else:
    print(f"Brace count at end: {count}")