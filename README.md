# About This Project
webブラウザで実行できるpythonエディタと実行環境です


## 使っている技術
- Python実行環境：pyodide
- エディタ：monaco-editor/react
- UI：react
- 開発環境：vite


## 構築手順
```aiignore
docker build -t py-editor .
docker run -d -p 28888:8888 -p 20022:22 --name py-editor-container py-editor
```