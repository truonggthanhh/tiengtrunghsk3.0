import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write something amazing...',
  height = '400px',
}) => {
  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  // Quill formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'align',
    'color',
    'background',
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
      <style>{`
        .rich-text-editor .quill {
          background: white;
          border-radius: 8px;
          border: 1px solid #d1d5db;
        }
        .dark .rich-text-editor .quill {
          background: #1f2937;
          border-color: #374151;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
        }
        .dark .rich-text-editor .ql-toolbar {
          border-color: #374151;
          background: #111827;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border: 1px solid #d1d5db;
          font-size: 16px;
          min-height: ${height};
        }
        .dark .rich-text-editor .ql-container {
          border-color: #374151;
          color: #f3f4f6;
        }
        .rich-text-editor .ql-editor {
          min-height: ${height};
          padding: 16px;
        }
        .dark .rich-text-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
        }
        .dark .rich-text-editor .ql-snow .ql-stroke {
          stroke: #9ca3af;
        }
        .dark .rich-text-editor .ql-snow .ql-fill {
          fill: #9ca3af;
        }
        .dark .rich-text-editor .ql-snow .ql-picker-label {
          color: #9ca3af;
        }
        .dark .rich-text-editor .ql-toolbar button:hover,
        .dark .rich-text-editor .ql-toolbar button:focus {
          color: #60a5fa;
        }
        .dark .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .dark .rich-text-editor .ql-toolbar button:focus .ql-stroke {
          stroke: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
