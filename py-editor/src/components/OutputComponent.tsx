import React from 'react';

// Propsの型を定義
interface OutputComponentProps {
    output: string;
}

const OutputComponent: React.FC<OutputComponentProps> = ({ output }) => {
    return (
        <div className="Output-container">
        <h2 className="Output-header">Output</h2>
            <pre className="Output-content">{output}</pre>
        </div>
);
};

export default OutputComponent;