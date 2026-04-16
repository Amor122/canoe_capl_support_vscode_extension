import re
from pathlib import Path

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

lines = content.split('\n')

new_lines = []
for i, line in enumerate(lines):
    if i < 629:
        new_lines.append(line)
    elif line.strip().startswith("export const CAPL_TYPES"):
        new_lines.append("")
        new_lines.append("export const CAPL_TYPES = [")
        new_lines.append("    'byte', 'word', 'dword', 'int', 'long', 'int64', 'qword', 'float', 'double', 'char', 'boolean',")
        new_lines.append("    'void', 'message', 'signal', 'timer', 'Timer', 'msTimer', 'mstimer', 'pdu', 'envvar', 'env',")
        new_lines.append("    'sysvar', 'sys', 'msglist', 'signallist', 'node', 'struct', 'array', 'enum', 'enumerates'")
        new_lines.append("];")
        break
    elif line.strip().startswith("export const CAPL_TYPES"):
        break
    else:
        continue

Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text('\n'.join(new_lines), encoding='utf-8')
print("Fixed")