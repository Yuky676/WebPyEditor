import { useState, useEffect } from 'react';
import Split from 'react-split';

import { usePyodide } from './hooks/usePyodide';
import { useDefaultCode } from './hooks/loadDefaultCode';

import EditorComponent from './components/EditorComponent';
import OutputComponent from './components/OutputComponent';

import { Play } from 'lucide-react';


import './App.css';

function App() {
    // 1. Pyodideのロジック
    const { output, isLoading, isPyodideLoading, runCode } = usePyodide();
    // 2. デフォルトコードの読み込みロジック
    const { code: defaultCode, isCodeLoading } = useDefaultCode();

    // エディタの現在の内容を管理するState
    const [editableCode, setEditableCode] = useState(defaultCode);

    // useDefaultCode がコードのロードを完了したら（defaultCodeが変わったら）、
    // 編集用の editableCode State を更新する
    useEffect(() => {
        setEditableCode(defaultCode);
    }, [defaultCode]); // defaultCode が変更されたら（ロード完了時）に発火

    // 実行ボタンのハンドラ
    const handleRun = () => {
        // 実行中は実行しない
        if (isBusy) return;
        runCode(editableCode);
    };

    const isBusy = isLoading || isPyodideLoading || isCodeLoading;

    const getButtonText = () => {
        if (isPyodideLoading) return 'Initializing...';
        if (isCodeLoading) return 'Loading Code...';
        if (isLoading) return 'Running...';

        return 'Run';
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>py-editor</h1>
                <button
                    className="run-button"
                    onClick={handleRun}
                    disabled={isBusy}
                >
                    {!isBusy && <Play size={16} aria-hidden="true" />}
                    <span>{getButtonText()}</span>
                </button>
            </header>

            <Split
                className="App-main"
                sizes={[50, 50]}
                minSize={300}
                direction="horizontal"
                gutterSize={16}
            >
                <EditorComponent
                    code={editableCode}
                    setCode={setEditableCode}
                    readOnly={isCodeLoading}
                />
                <OutputComponent output={output} />
            </Split>
        </div>
    );
}

export default App;

