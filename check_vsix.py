import json
import zipfile

z = zipfile.ZipFile(r"D:\PY_PROJECTS\vector_capl_extension\vector-capl-1.0.0.vsix")
try:
    data = json.loads(z.read("extension/syntaxes/capl.tmLanguage.json"))
    print("VSIX grammar is VALID")
    print(f"Patterns: {len(data.get('patterns', []))}")
    print(f"Repository: {list(data.get('repository', {}).keys())}")
except Exception as e:
    print(f"ERROR: {e}")