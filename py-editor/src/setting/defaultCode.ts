// DBから取得するコードの（仮の）内容
const codeFromDB = `import pandas as pd
import numpy as np
import io

# サンプルデータを作成
data = """A,B
1,4
2,5
3,6
"""
df = pd.read_csv(io.StringIO(data))

print("--- Pandas DataFrame ---")
print(df.head())

# Numpyを使った計算
print("\\n--- Numpy Calculation ---")
numpy_array = np.array(df['A'])
print(f"Mean of column 'A' (using numpy): {np.mean(numpy_array)}")
`;

/**
 * デフォルトコードを非同期で取得します。
 * (現在は500ms待機してローカルの文字列を返すことでDBアクセスを模倣しています)
 * * @returns {Promise<string>} 取得したコード文字列
 */
export const loadDefaultCode = async (): Promise<string> => {
    console.log("Fetching default code from DB...");

    // DBアクセスを 500ms の遅延で模倣
    // 将来的に、ここの処理が fetch('/api/default-code') などに置き換わります
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("Default code loaded.");
    return codeFromDB;
};