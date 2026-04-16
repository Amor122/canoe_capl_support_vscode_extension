import json
import zipfile

z = zipfile.ZipFile(r"D:\PY_PROJECTS\vector_capl_extension\vector-capl-1.0.0.vsix")
data = json.loads(z.read("extension/syntaxes/capl.tmLanguage.json"))
repo = data.get("repository", {})

print("Keywords pattern:")
print(repo.get("keywords", {}).get("patterns", []))

print("\nTypes pattern:")
print(repo.get("types", {}).get("patterns", []))

print("\nFunctions pattern (first 3):")
funcs = repo.get("functions", {}).get("patterns", [])
for f in funcs[:3]:
    print(f)