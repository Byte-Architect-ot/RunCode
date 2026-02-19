import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Submissions = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/submissions/user/all')
      .then(res => setSubmissions(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const getStatusConfig = (status) => {
    const configs = {
      'AC': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Accepted' },
      'WA': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Wrong Answer' },
      'TLE': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', label: 'Time Limit' },
      'RE': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'Runtime Error' },
      'CE': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', label: 'Compile Error' },
      'Pending': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', label: 'Pending' },
      'Running': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Running' }
    }
    return configs[status] || configs['Pending']
  }

  const formatDate = (d) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLanguageDisplay = (lang) => {
    const langs = {
      'javascript': 'JavaScript',
      'python': 'Python',
      'cpp': 'C++',
      'java': 'Java'
    }
    return langs[lang] || lang
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-surface-300 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <span className="text-gray-400">Loading submissions...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Submissions</h1>
        <p className="text-gray-400">View your submission history</p>
      </div>

      {submissions.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No submissions yet</h3>
          <p className="text-gray-400 mb-6">Start solving problems to see your submissions here</p>
          <Link to="/problems" className="btn btn-primary">
            Browse Problems
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-300/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Problem</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Language</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Runtime</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => {
                const statusConfig = getStatusConfig(submission.status)
                return (
                  <tr 
                    key={submission._id} 
                    className="border-b border-surface-300/30 hover:bg-surface-300/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link 
                        to={`/problem/${submission.problemId?.slug}`}
                        className="text-white hover:text-primary-400 font-medium transition-colors"
                      >
                        {submission.problemId?.title || 'Unknown Problem'}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">
                        {getLanguageDisplay(submission.language)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {submission.totalTime ? `${submission.totalTime.toFixed(0)} ms` : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {formatDate(submission.createdAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Submissions