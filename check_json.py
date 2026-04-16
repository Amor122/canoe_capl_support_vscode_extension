import json

with open(r"D:\PY_PROJECTS\vector_capl_extension\syntaxes\capl.tmLanguage.json") as f:
    try:
        data = json.load(f)
        print("JSON is VALID")
        print(f"Patterns: {len(data.get('patterns', []))}")
        print(f"Repository keys: {list(data.get('repository', {}).keys())}")
    except json.JSONDecodeError as e:
        print(f"JSON ERROR: {e}")