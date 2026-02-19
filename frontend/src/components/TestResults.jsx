const TestResults = ({ results, status }) => {
  const getStatusConfig = (s) => {
    const configs = {
      'AC': { 
        bg: 'bg-green-500/20', 
        text: 'text-green-400', 
        border: 'border-green-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        label: 'Accepted'
      },
      'WA': { 
        bg: 'bg-red-500/20', 
        text: 'text-red-400', 
        border: 'border-red-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        label: 'Wrong Answer'
      },
      'TLE': { 
        bg: 'bg-yellow-500/20', 
        text: 'text-yellow-400', 
        border: 'border-yellow-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: 'Time Limit'
      },
      'RE': { 
        bg: 'bg-purple-500/20', 
        text: 'text-purple-400', 
        border: 'border-purple-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
        label: 'Runtime Error'
      },
      'CE': { 
        bg: 'bg-orange-500/20', 
        text: 'text-orange-400', 
        border: 'border-orange-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: 'Compile Error'
      },
      'Running': { 
        bg: 'bg-blue-500/20', 
        text: 'text-blue-400', 
        border: 'border-blue-500/30',
        icon: (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ),
        label: 'Running'
      },
      'Pending': { 
        bg: 'bg-gray-500/20', 
        text: 'text-gray-400', 
        border: 'border-gray-500/30',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: 'Pending'
      }
    }
    return configs[s] || configs['Pending']
  }

  const overallConfig = status ? getStatusConfig(status) : null

  return (
    <div className="card p-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Test Results</h3>
        {overallConfig && (
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${overallConfig.bg} ${overallConfig.border} border`}>
            {overallConfig.icon}
            <span className={`text-sm font-medium ${overallConfig.text}`}>
              {overallConfig.label}
            </span>
          </div>
        )}
      </div>

      {/* Test Cases Grid */}
      <div className="space-y-2">
        {results.map((result, index) => {
          const config = getStatusConfig(result.status)
          return (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg ${config.bg} ${config.border} border transition-all duration-200`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-dark-500/50 ${config.text}`}>
                  {config.icon}
                </div>
                <div>
                  <span className="text-white font-medium">Test Case {index + 1}</span>
                  <span className={`ml-2 text-sm ${config.text}`}>{result.status}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                {result.time !== undefined && result.time !== null && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{result.time.toFixed(0)} ms</span>
                  </div>
                )}
                {result.memory !== undefined && result.memory !== null && result.memory > 0 && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span>{(result.memory / 1024).toFixed(1)} MB</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TestResults