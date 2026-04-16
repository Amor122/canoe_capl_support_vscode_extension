from pathlib import Path

content = Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").read_text(encoding='utf-8')

old_marker = "'@': '@sysvar::Namespace::Variable"
brace_marker = "};"

start_idx = content.find(old_marker)
if start_idx > 0:
    brace_pos = content.find(brace_marker, start_idx)
    if brace_pos > 0:
        new_content = content[:brace_pos+2] + "\n"

        new_funcs_start = content.find("// Additional Functions from Help Documentation")
        if new_funcs_start > 0:
            caps_types_pos = content.find("export const CAPL_TYPES", new_funcs_start)
            if caps_types_pos > 0:
                funcs_part = content[new_funcs_start:caps_types_pos]
                new_content += "// Additional Functions from Help Documentation\n"
                funcs_clean = funcs_part.replace("// Additional Functions from Help Documentation\n", "")
                funcs_clean = funcs_clean.replace("\n    // ", "\n    // ")
                funcs_clean = funcs_clean.strip() + "\n"

                new_content += funcs_clean

        caps_types = content.find("[", content.find("export const CAPL_TYPES"))
        new_content += content[caps_types:]

        Path(r"D:\PY_PROJECTS\vector_capl_extension\src\caplData.ts").write_text(new_content, encoding='utf-8')
        print("Fixed file structure")