import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import api from '../services/api'
import CodeEditor from '../components/CodeEditor'
import TestResults from '../components/TestResults'

const ProblemDetail = () => {
  const { slug } = useParams()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submission, setSubmission] = useState(null)
  const [polling, setPolling] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    api.get('/problems/' + slug)
      .then(res => {
        setProblem(res.data)
        setCode(res.data.defaultCode[language] || '')
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (problem) setCode(problem.defaultCode[language] || '')
  }, [language, problem])

  const pollSubmission = useCallback(async (id) => {
    try {
      const res = await api.get('/submissions/' + id)
      setSubmission(res.data)
      if (['Pending', 'Running'].includes(res.data.status)) {
        setTimeout(() => pollSubmission(id), 1000)
      } else {
        setPolling(false)
      }
    } catch (err) {
      console.error(err)
      setPolling(false)
    }
  }, [])

  const handleSubmit = async () => {
    if (!code.trim()) return
    setSubmitting(true)
    setSubmission(null)
    try {
      const res = await api.post('/submissions', { problemId: problem._id, code, language })
      setPolling(true)
      pollSubmission(res.data.submissionId)
    } catch (err) {
      console.error(err)
      alert('Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    if (problem) {
      setCode(problem.defaultCode[language] || '')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-surface-300 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <span className="text-gray-400">Loading problem...</span>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Problem not found</h2>
          <p className="text-gray-400">The problem you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      'Easy': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
      'Medium': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
      'Hard': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' }
    }
    return configs[difficulty] || configs['Easy']
  }

  const diffConfig = getDifficultyConfig(problem.difficulty)

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Problem Description */}
      <div className="w-1/2 border-r border-surface-300/50 flex flex-col">
        {/* Tabs */}
        <div className="flex items-center border-b border-surface-300/50 px-4">
          {['description', 'submissions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-primary-400 border-primary-400'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'description' && (
            <>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-3">{problem.title}</h1>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${diffConfig.bg} ${diffConfig.text} ${diffConfig.border} border`}>
                    {problem.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{problem.timeLimit}s</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span>{problem.memoryLimit} MB</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    pre: ({ children }) => (
                      <pre className="bg-dark-500 rounded-lg p-4 overflow-x-auto">{children}</pre>
                    ),
                    code: ({ inline, children }) => (
                      inline 
                        ? <code className="bg-surface-300 px-1.5 py-0.5 rounded text-primary-400">{children}</code>
                        : <code>{children}</code>
                    ),
                    h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-6 mb-3">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  }}
                >
                  {problem.description}
                </ReactMarkdown>
              </div>

              {/* Constraints */}
              {problem.constraints && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3>
                  <pre className="bg-dark-500 rounded-lg p-4 text-sm text-gray-300 whitespace-pre-wrap">
                    {problem.constraints}
                  </pre>
                </div>
              )}

              {/* Tags */}
              {problem.tags && problem.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-3 py-1 bg-surface-300/50 text-gray-300 rounded-lg text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'submissions' && submission && (
            <TestResults results={submission.testCaseResults} status={submission.status} />
          )}

          {activeTab === 'submissions' && !submission && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-400">No submissions yet</p>
              <p className="text-gray-500 text-sm mt-1">Submit your code to see results here</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="w-1/2 flex flex-col">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-surface-300/50 bg-surface-200">
          <div className="flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-dark-500 text-gray-200 px-3 py-1.5 rounded-lg border border-surface-300 text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>
          
          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-white text-sm flex items-center space-x-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset</span>
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <CodeEditor language={language} code={code} onChange={(v) => setCode(v || '')} />
        </div>

        {/* Submit Section */}
        <div className="px-4 py-3 border-t border-surface-300/50 bg-surface-200 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {polling && (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-primary-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Evaluating your solution...</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || polling}
              className="btn btn-primary px-6"
            >
              {submitting ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail