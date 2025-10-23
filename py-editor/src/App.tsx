import { useState, useEffect } from 'react'; // useEffect をインポート
import { usePyodide } from './hooks/usePyodide';
import EditorComponent from './components/EditorComponent';
import OutputComponent from './components/OutputComponent';
import {Play} from 'lucide-react'

// settingから loadDefaultCode 関数をインポート
import { loadDefaultCode } from './setting/defaultCode';

import './App.css';

// 初期表示用のプレースホルダーテキスト
const CODE_PLACEHOLDER = "# Loading default code from database...";

function App() {
    // 初期値をプレースホルダーにする
    const [code, setCode] = useState(CODE_PLACEHOLDER);
    // デフォルトコードのローディング状態を管理
    const [isCodeLoading, setIsCodeLoading] = useState(true);

    const { output, isLoading, isPyodideLoading, runCode } = usePyodide();

    // デフォルトコードを非同期で読み込む
    useEffect(() => {
        async function fetchCode() {
            try {
                // 非同期関数を呼び出す
                const fetchedCode = await loadDefaultCode();
                setCode(fetchedCode);
            } catch (error) {
                console.error("Failed to load default code:", error);
                setCode("# Error: Failed to load code from DB. Please refresh.");
            } finally {
                setIsCodeLoading(false); // ローディング完了
            }
        }

        fetchCode();
    }, []); // マウント時に一度だけ実行

    const handleRun = () => {
        runCode(code);
    };

    // Pyodideロード中、またはコード実行中、またはデフォルトコードロード中
    const isBusy = isLoading || isPyodideLoading || isCodeLoading;

    // ボタンのテキストを動的に変更
    const getButtonText = () => {
        if (isPyodideLoading) return 'Initializing...';
        if (isCodeLoading) return 'Loading Code...';
        if (isLoading) return 'Running...';
        return 'Run';
    };

    return (
        <div className="App">
            <header className="App-header">
                <button
                    className="run-button"
                    onClick={handleRun}
                    disabled={isBusy}
                >
                    <Play size={16} aria-hidden="true" />
                    <span>{getButtonText()}</span>
                </button>
            </header>

            <main className="App-main">
                {/* EditorComponentに readOnly プロパティを渡す */}
                <EditorComponent
                    code={code}
                    setCode={setCode}
                    readOnly={isCodeLoading} // コードロード中は編集不可
                />
                <OutputComponent output={output} />
            </main>
        </div>
    );
}

export default App;