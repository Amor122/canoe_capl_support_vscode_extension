from pathlib import Path
import re

capl = Path(r'D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts')
content = capl.read_text(encoding='utf-8')
funcs = set(re.findall(r"'([A-Za-z_][A-Za-z0-9_]*)':", content))
print(f'Total functions now: {len(funcs)}')