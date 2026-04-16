from pathlib import Path
import re

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

marker = "// Additional Functions from Help Documentation"
idx = content.find(marker)

if idx > 0:
    before = content[:idx].rstrip()
    
    lines = before.split('\n')
    if lines and lines[-1].strip() == "};":
        pass
    elif lines and not lines[-1].strip().endswith('},'):
        if lines[-1].strip().endswith("'"):
            lines[-1] = lines[-1].rstrip() + "' };"
        else:
            lines[-1] = lines[-1].rstrip() + "\n};"
    
    before_fixed = '\n'.join(lines)
    Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text(before_fixed, encoding='utf-8')
    print("Removed additional functions section")
else:
    print("Section not found")