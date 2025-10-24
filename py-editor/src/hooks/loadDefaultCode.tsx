import { useState, useEffect } from 'react';

// 設定ファイルから静的なコードをインポート
import staticCode from '../setting/defaultCode.json';

// 将来DBから取得する（という想定の）フラグ
// true にすると、JSONではなく500msの遅延を模倣します
const USE_DATABASE = false;

// このフックが外部に提供する値の型
interface useDefaultCodeReturn {
    code: string;
    isCodeLoading: boolean;
}

// 初期表示用のプレースホルダーテキスト
const CODE_PLACEHOLDER = "# Loading default code...";

/**
 * デフォルトコードを非同期で読み込むロジックを管理するカスタムフック
 */
export const useDefaultCode = (): useDefaultCodeReturn => {
    // コード内容
    const [code, setCode] = useState(CODE_PLACEHOLDER);
    // コードのローディング状態
    const [isCodeLoading, setIsCodeLoading] = useState(true);

    // デフォルトコードを非同期で読み込む
    useEffect(() => {
        async function fetchCode() {
            try {
                let fetchedCode: string;

                if (USE_DATABASE) {
                    // --- 将来のDBアクセス処理 ---
                    console.log("Fetching default code from DB...");
                    // DBアクセスを 500ms の遅延で模倣
                    await new Promise(resolve => setTimeout(resolve, 500));
                    fetchedCode = "# Code loaded from Database! \nprint('Hello from DB')";
                    console.log("Default code loaded from DB.");

                } else {
                    // --- 現在の静的JSON読み込み処理 ---
                    // インポートしたJSONオブジェクトからコード文字列を取得
                    // @ts-ignore
                    fetchedCode = staticCode.code;
                }

                setCode(fetchedCode);

            } catch (error) {
                console.error("Failed to load default code:", error);
                setCode("# Error: Failed to load code. Please refresh.");
            } finally {
                setIsCodeLoading(false); // ローディング完了
            }
        }

        fetchCode();
    }, []); // マウント時に一度だけ実行

    return { code, isCodeLoading };
};

