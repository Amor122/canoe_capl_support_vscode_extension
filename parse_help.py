import re
import json
from pathlib import Path
from html import unescape
from collections import defaultdict

HELP_DIR = r"C:\Program Files\Vector\Help\Vector CANoe Help 19.5.44\en"

def clean_html_text(text):
    """Clean HTML and extract plain text"""
    if not text:
        return ''
    # Replace common HTML elements
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</p>', '\n', text)
    text = re.sub(r'</tr>', '\n', text)
    text = re.sub(r'</td>', ' ', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = unescape(text)
    # Clean up whitespace
    text = re.sub(r'\n\s*\n', '\n', text)
    text = ' '.join(text.split())
    return text.strip()

def parse_html_file(htm_path):
    """Parse a single HTML help file and extract function info"""
    try:
        content = htm_path.read_text(encoding='utf-8', errors='ignore')
    except:
        return None
    
    result = {
        'title': '',
        'original_name': '',
        'syntax': '',
        'description': '',
        'parameters': '',
        'returnValues': '',
        'example': ''
    }
    
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if title_match:
        result['title'] = title_match.group(1).strip()
        result['original_name'] = result['title'].replace('/', '_')
    
    syntax_section = re.search(r'<div[^>]*data-mc-target-name="DIVCAPLFunctionSyntax"[^>]*>(.*?)</div>', content, re.DOTALL)
    if syntax_section:
        syntax_text = syntax_section.group(1)
        
        # Remove all HTML tags
        plain = re.sub(r'<[^>]+>', ' ', syntax_text)
        plain = unescape(plain)
        
        # Remove comments like "// form 1" and "Syntax" prefix
        plain = re.sub(r'\s*//.*$', '', plain, flags=re.MULTILINE)
        plain = re.sub(r'^Syntax\s+', '', plain, flags=re.MULTILINE)
        
        # Clean up whitespace
        plain = re.sub(r'\s+', ' ', plain)
        
        # Find all function patterns - be more aggressive
        # Handle both "returnType funcName(params)" and "funcName(params)"
        # Also handle char[] as parameter type
        funcs = re.findall(r'(\w+)\s*\(([^)]*)\)', plain)
        
        clean_syntax = []
        for func_name, params in funcs:
            full = f"{func_name}({params})"
            # Skip keywords and noise
            if func_name.lower() in ('syntax', 'void', 'char', 'int', 'long', 'byte', 'word', 'dword', 'double', 'float', 'class', 'struct'):
                continue
            # Must have balanced parens and not empty
            if full.count('(') == full.count(')') and func_name:
                clean_syntax.append(full)
        
        if clean_syntax:
            result['syntax'] = '\n'.join(clean_syntax)
    
    desc_section = re.search(r'<div[^>]*data-mc-target-name="DIVCAPLDescription"[^>]*>(.*?)</div>', content, re.DOTALL)
    if desc_section:
        result['description'] = clean_html_text(desc_section.group(1))
    
    params_section = re.search(r'<div[^>]*data-mc-target-name="DIVCAPLParameters"[^>]*>(.*?)</div>', content, re.DOTALL)
    if params_section:
        result['parameters'] = clean_html_text(params_section.group(1))
    
    return_section = re.search(r'<div[^>]*data-mc-target-name="DIVCAPLReturnValues"[^>]*>(.*?)</div>', content, re.DOTALL)
    if return_section:
        result['returnValues'] = clean_html_text(return_section.group(1))
    
    example_section = re.search(r'<div[^>]*data-mc-target-name="DIVCAPLExample"[^>]*>(.*?)</div>', content, re.DOTALL)
    if example_section:
        result['example'] = clean_html_text(example_section.group(1))
    
    return result if result['syntax'] else None

def extract_all_functions():
    """Extract all CAPL functions from help directory"""
    help_path = Path(HELP_DIR)
    all_functions = []
    
    # 搜索所有可能的目录
    search_patterns = [
        help_path / "Content" / "Topics",
        help_path / "Subsystems",
    ]
    
    # 需要排除的Overview等非函数文件
    exclude_patterns = ['Overview', 'overview', 'ErrorCodes', 'errorcodes', 'Selectors', 'selectors', 
                        'StartPage', 'ClassOverview', 'FunctionsOverview', 'Description',
                        'ReturnCodes', 'Limitations', 'FormatExpressions', 'EventProceduresOverview',
                        'ExpandedFunctions', 'AccessMode', 'ProcessingDiagnosticRequests']
    
    for search_path in search_patterns:
        if not search_path.exists():
            continue
        for htm_file in search_path.rglob("CAPLfunction*.htm"):
            # 检查是否应该排除
            should_skip = False
            for exc in exclude_patterns:
                if exc in htm_file.name:
                    should_skip = True
                    break
            
            if not should_skip:
                func_info = parse_html_file(htm_file)
                if func_info:
                    all_functions.append(func_info)
    
    return all_functions

def main():
    print("Parsing CANoe help files...")
    functions = extract_all_functions()
    
    print(f"Found {len(functions)} functions with syntax")
    
    output_path = Path(r"D:\PY_PROJECTS\vector_capl_extension\HELP_EXTRACTED.json")
    with output_path.open('w', encoding='utf-8') as f:
        json.dump(functions, f, indent=2, ensure_ascii=False)
    
    print(f"Saved to {output_path}")
    
    print("\nSample functions:")
    for func in functions[:5]:
        print(f"  {func['original_name']}: {func['syntax'][:50]}...")

if __name__ == "__main__":
    main()
