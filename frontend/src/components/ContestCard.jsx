import React from 'react';

const ContestCard = ({ contest }) => {
    const {
        name,
        platform,
        url,
        startTime,
        endTime,
        duration,
        status
    } = contest;

    // Format duration
    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        return `${hours}h ${minutes}m`;
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get time until contest starts
    const getTimeUntil = (startTime) => {
        const now = new Date();
        const start = new Date(startTime);
        const diff = start - now;

        if (diff <= 0) return 'Started';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    // Platform colors and icons
    const getPlatformStyle = (platform) => {
        const styles = {
            'codeforces': { 
                bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
                icon: 'CF'
            },
            'codechef': { 
                bg: 'bg-gradient-to-r from-amber-600 to-amber-700',
                icon: 'CC'
            },
            'leetcode': { 
                bg: 'bg-gradient-to-r from-green-600 to-green-700',
                icon: 'LC'
            },
            'atcoder': { 
                bg: 'bg-gradient-to-r from-gray-700 to-gray-800',
                icon: 'AC'
            },
            'hackerrank': { 
                bg: 'bg-gradient-to-r from-green-600 to-green-700',
                icon: 'HR'
            },
            'hackerearth': { 
                bg: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
                icon: 'HE'
            },
            'topcoder': { 
                bg: 'bg-gradient-to-r from-blue-700 to-blue-800',
                icon: 'TC'
            }
        };
        
        const key = platform?.toLowerCase().replace(/\s+/g, '');
        return styles[key] || { bg: 'bg-gradient-to-r from-purple-600 to-purple-700', icon: 'CP' };
    };

    const platformStyle = getPlatformStyle(platform);

    // Status badge
    const getStatusBadge = () => {
        if (status === 'running') {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">LIVE</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{getTimeUntil(startTime)}</span>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group">
            {/* Platform Header */}
            <div className={`${platformStyle.bg} px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{platformStyle.icon}</span>
                    </div>
                    <span className="text-white text-sm font-medium">
                        {platform}
                    </span>
                </div>
                <svg className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>

            {/* Contest Content */}
            <div className="p-4">
                {/* Title and Status */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white line-clamp-2 flex-1 mr-3 leading-tight">
                        {name}
                    </h3>
                    {getStatusBadge()}
                </div>

                {/* Contest Details */}
                <div className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Starts</p>
                            <p className="font-medium text-gray-700 dark:text-gray-300">{formatDate(startTime)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Duration</p>
                            <p className="font-medium text-gray-700 dark:text-gray-300">{formatDuration(duration)}</p>
                        </div>
                    </div>

                    {endTime && (
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Ends</p>
                                <p className="font-medium text-gray-700 dark:text-gray-300">{formatDate(endTime)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        status === 'running'
                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
                            : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white shadow-sm hover:shadow-md'
                    }`}
                >
                    {status === 'running' ? 'Join Contest' : 'View Details'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default ContestCard;