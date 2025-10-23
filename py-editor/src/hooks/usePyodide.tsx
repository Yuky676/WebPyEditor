import { useState, useEffect, useRef, useCallback } from 'react';
import type { PyodideInterface } from 'pyodide';
import { loadPyodide } from 'pyodide';

// このフックが外部に提供する値の型
interface UsePyodideReturn {
    output: string;
    isLoading: boolean;
    isPyodideLoading: boolean;
    runCode: (code: string) => Promise<void>;
}

/**
 * Pyodideの初期化とコード実行を管理するカスタムフック
 */
export const usePyodide = (): UsePyodideReturn => {
    const [output, setOutput] = useState("Loading Pyodide and dependencies... Please wait.");
    const [isLoading, setIsLoading] = useState(true);
    const [isPyodideLoading, setIsPyodideLoading] = useState(true);

    // Pyodideインスタンス
    const pyodideRef = useRef<PyodideInterface | null>(null);

    // 標準出力・エラー出力を溜めるためのRef
    const stdoutRef = useRef<string[]>([]);
    const stderrRef = useRef<string[]>([]);

    // Pyodideの初期化（マウント時に一度だけ実行）
    useEffect(() => {
        async function initializePyodide() {
            try {
                // PyodideをCDNからロード
                const pyodide = await loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/",
                    stdout: (text) => {
                        stdoutRef.current.push(text);
                    },
                    stderr: (text) => {
                        stderrRef.current.push(text);
                    },
                });

                pyodideRef.current = pyodide;

                setOutput("Loading package list...");

                // 1. publicフォルダから設定ファイルを取得
                const response = await fetch('/pyodide-packages.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch package list: ${response.statusText}`);
                }
                const packagesToLoad: string[] = await response.json();

                // 2. リストにあるパッケージをロード
                if (packagesToLoad.length > 0) {
                    setOutput(`Loading packages: ${packagesToLoad.join(', ')}...`);
                    // loadPackageにはパッケージ名の配列を渡すことができます
                    await pyodide.loadPackage(packagesToLoad);
                } else {
                    setOutput("No packages to load.");
                }

                // 準備完了
                setOutput("Ready to execute Python code.");
                setIsLoading(false);
                setIsPyodideLoading(false);
            } catch (error) {
                console.error("Pyodide initialization failed:", error);
                setOutput(`Pyodide initialization failed: ${error}`);
                setIsLoading(false);
                setIsPyodideLoading(false);
            }
        }
        initializePyodide();
    }, []); // 空の依存配列で、マウント時に一度だけ実行

    // コード実行ロジック
    // useCallbackで関数をメモ化し、App.tsxでの再レンダリングを最適化
    const runCode = useCallback(async (code: string) => {
        const pyodide = pyodideRef.current;
        if (!pyodide) {
            setOutput("Pyodide is not initialized yet.");
            return;
        }

        // 実行中はボタンを無効化
        setIsLoading(true);
        // 出力バッファをクリア
        stdoutRef.current = [];
        stderrRef.current = [];
        setOutput("Executing code...");

        try {
            // Pythonコードを実行
            await pyodide.runPythonAsync(code);

            // 実行後の出力を結合
            const stdOutput = stdoutRef.current.join('\n');
            const stdError = stderrRef.current.join('\n');

            let finalOutput = "";
            if (stdOutput) {
                finalOutput += stdOutput;
            }
            if (stdError) {
                finalOutput += (finalOutput ? "\n--- ERROR ---\n" : "") + stdError;
            }
            if (!finalOutput) {
                finalOutput = "Execution finished with no output.";
            }

            setOutput(finalOutput);

        } catch (error) {
            console.error("Python execution error:", error);
            setOutput(`Python Execution Error:\n${error}`);
        } finally {
            // 実行完了
            setIsLoading(false);
        }
    }, []); // 依存配列は空（Refのみ使用しているため）

    return { output, isLoading, isPyodideLoading, runCode };
};