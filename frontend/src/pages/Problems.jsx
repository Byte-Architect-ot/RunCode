import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const Problems = () => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/problems')
      .then(res => setProblems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      'Easy': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
      'Medium': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
      'Hard': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' }
    }
    return configs[difficulty] || configs['Easy']
  }

  const getAcceptanceRate = (p) => {
    if (p.totalSubmissions === 0) return 'N/A'
    return ((p.acceptedSubmissions / p.totalSubmissions) * 100).toFixed(1) + '%'
  }

  const filteredProblems = filter === 'all' 
    ? problems 
    : problems.filter(p => p.difficulty.toLowerCase() === filter)

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-surface-300 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <span className="text-gray-400">Loading problems...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Problems</h1>
        <p className="text-gray-400">Select a problem to start coding</p>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6">
        {['all', 'easy', 'medium', 'hard'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
              filter === f
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Problems List */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-300/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Difficulty</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Acceptance</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tags</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem, index) => {
              const diffConfig = getDifficultyConfig(problem.difficulty)
              return (
                <tr 
                  key={problem._id} 
                  className="border-b border-surface-300/30 hover:bg-surface-300/20 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4">
                    <Link 
                      to={`/problem/${problem.slug}`}
                      className="text-white hover:text-primary-400 font-medium transition-colors"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${diffConfig.bg} ${diffConfig.text} ${diffConfig.border} border`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {getAcceptanceRate(problem)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags?.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 bg-surface-300/50 text-gray-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No problems found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Problems