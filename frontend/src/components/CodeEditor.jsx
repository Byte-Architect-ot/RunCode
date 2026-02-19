import Editor from '@monaco-editor/react'

const CodeEditor = ({ language, code, onChange }) => {
  const getMonacoLanguage = (lang) => {
    const langMap = {
      'cpp': 'cpp',
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java'
    }
    return langMap[lang] || 'javascript'
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-surface-300/50">
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={onChange}
        theme="vs-dark"
        loading={
          <div className="flex items-center justify-center h-full bg-dark-500">
            <div className="flex items-center space-x-3 text-gray-400">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading editor...</span>
            </div>
          </div>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  )
}

export default CodeEditor