import React from 'react';
import Editor from '@monaco-editor/react';

// Propsの型に readOnly を追加
interface EditorComponentProps {
    code: string;
    setCode: (value: string) => void;
    readOnly?: boolean; // 👈 追加 (オプショナル)
}

const EditorComponent: React.FC<EditorComponentProps> = ({
                                                             code,
                                                             setCode,
                                                             readOnly = false
                                                         }) => {
    return (
        <div className="Editor-container">
            <Editor
                height="100%"
                language="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    readOnly: readOnly,
                }}
            />
        </div>
    );
};

export default EditorComponent;