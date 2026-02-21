import React, { useState, useEffect } from 'react';
import { contestsAPI } from '../services/api';
import ContestCard from '../components/ContestCard';

const Contests = () => {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedPlatform, setSelectedPlatform] = useState('all');

    const platforms = [
        { id: 'all', name: 'All Platforms' },
        { id: 'codeforces', name: 'Codeforces' },
        { id: 'codechef', name: 'CodeChef' },
        { id: 'leetcode', name: 'LeetCode' },
        { id: 'atcoder', name: 'AtCoder' }
    ];

    const tabs = [
        { id: 'all', label: 'All Contests' },
        { id: 'running', label: 'Live Now' },
        { id: 'upcoming', label: 'Upcoming' }
    ];

    useEffect(() => {
        fetchContests();
    }, [selectedPlatform]);

    const fetchContests = async () => {
        setLoading(true);
        setError(null);

        try {
            let response;

            if (selectedPlatform !== 'all') {
                response = await contestsAPI.getByPlatform(selectedPlatform);
            } else {
                response = await contestsAPI.getAll();
            }

            console.log('API Response:', response.data);

            const contestData = response.data.contests || response.data || [];
            setContests(Array.isArray(contestData) ? contestData : []);
            
        } catch (err) {
            console.error('Error fetching contests:', err);
            setError(err.response?.data?.message || 'Failed to fetch contests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredContests = () => {
        if (activeTab === 'all') return contests;
        return contests.filter(contest => contest.status === activeTab);
    };

    const filteredContests = getFilteredContests();
    const runningContests = contests.filter(c => c.status === 'running');
    const upcomingContests = contests.filter(c => c.status === 'upcoming');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Contests
                            </h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                Track live and upcoming competitive programming contests
                            </p>
                        </div>
                        
                        {/* Stats Pills */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                    {runningContests.length} Live
                                </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                    {upcomingContests.length} Upcoming
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
                        {/* Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                    {tab.id === 'running' && runningContests.length > 0 && (
                                        <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">
                                            {runningContests.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-3">
                            {/* Platform Select */}
                            <select
                                value={selectedPlatform}
                                onChange={(e) => setSelectedPlatform(e.target.value)}
                                className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                                {platforms.map(platform => (
                                    <option key={platform.id} value={platform.id}>
                                        {platform.name}
                                    </option>
                                ))}
                            </select>

                            {/* Refresh Button */}
                            <button
                                onClick={fetchContests}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg 
                                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                                    Failed to load contests
                                </h3>
                                <p className="mt-1 text-sm text-red-600 dark:text-red-300">{error}</p>
                                <button 
                                    onClick={fetchContests}
                                    className="mt-2 text-sm font-medium text-red-700 dark:text-red-400 hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading contests...</p>
                    </div>
                )}

                {/* Contests Display */}
                {!loading && !error && (
                    <>
                        {/* Running Contests */}
                        {runningContests.length > 0 && activeTab !== 'upcoming' && (
                            <div className="mb-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Live Contests
                                        </h2>
                                    </div>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                        {runningContests.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {runningContests.map((contest, index) => (
                                        <ContestCard key={`running-${index}`} contest={contest} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upcoming Contests */}
                        {upcomingContests.length > 0 && activeTab !== 'running' && (
                            <div>
                                <div className="flex items-center gap-3 mb-5">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Upcoming Contests
                                    </h2>
                                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                        {upcomingContests.length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {upcomingContests.map((contest, index) => (
                                        <ContestCard key={`upcoming-${index}`} contest={contest} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {filteredContests.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    No contests found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-4">
                                    There are no contests matching your current filters. Try adjusting your selection.
                                </p>
                                <button 
                                    onClick={fetchContests}
                                    className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Refresh
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer Stats */}
            {!loading && contests.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-center gap-8 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{contests.length}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-gray-500 dark:text-gray-400">Live:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{runningContests.length}</span>
                            </div>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-gray-500 dark:text-gray-400">Upcoming:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{upcomingContests.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contests;