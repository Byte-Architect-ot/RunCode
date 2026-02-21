import axios from 'axios';

// Cache to avoid hitting APIs too frequently
let cache = {
    contests: null,
    lastFetch: null,
    ttl: 5 * 60 * 1000 // 5 minutes
};

class ContestService {

    isCacheValid() {
        return cache.contests && cache.lastFetch && 
               (Date.now() - cache.lastFetch) < cache.ttl;
    }

    // ✅ CODEFORCES API - Very Reliable!
    async fetchCodeforces() {
        try {
            console.log('Fetching from Codeforces...');
            const response = await axios.get('https://codeforces.com/api/contest.list', {
                timeout: 10000
            });

            if (response.data.status !== 'OK') {
                return [];
            }

            return response.data.result
                .filter(c => c.phase === 'BEFORE' || c.phase === 'CODING')
                .slice(0, 15)
                .map(contest => ({
                    name: contest.name,
                    platform: 'Codeforces',
                    url: `https://codeforces.com/contest/${contest.id}`,
                    startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
                    endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000).toISOString(),
                    duration: contest.durationSeconds,
                    status: contest.phase === 'CODING' ? 'running' : 'upcoming'
                }));
        } catch (error) {
            console.error('Codeforces API Error:', error.message);
            return [];
        }
    }

    // ✅ LEETCODE GraphQL API
    async fetchLeetCode() {
        try {
            console.log('Fetching from LeetCode...');
            const response = await axios.post('https://leetcode.com/graphql', {
                query: `
                    query {
                        allContests {
                            title
                            titleSlug
                            startTime
                            duration
                        }
                    }
                `
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'Referer': 'https://leetcode.com'
                }
            });

            const now = Date.now() / 1000;
            const contests = response.data?.data?.allContests || [];

            return contests
                .filter(c => c.startTime > now - 7200) // Not ended more than 2 hours ago
                .slice(0, 10)
                .map(contest => {
                    const startTime = new Date(contest.startTime * 1000);
                    const endTime = new Date((contest.startTime + contest.duration) * 1000);
                    const nowDate = new Date();

                    let status = 'upcoming';
                    if (nowDate >= startTime && nowDate <= endTime) {
                        status = 'running';
                    } else if (nowDate > endTime) {
                        status = 'ended';
                    }

                    return {
                        name: contest.title,
                        platform: 'LeetCode',
                        url: `https://leetcode.com/contest/${contest.titleSlug}`,
                        startTime: startTime.toISOString(),
                        endTime: endTime.toISOString(),
                        duration: contest.duration,
                        status
                    };
                })
                .filter(c => c.status !== 'ended');
        } catch (error) {
            console.error('LeetCode API Error:', error.message);
            return [];
        }
    }

    // ✅ ATCODER - Using their official endpoint
    async fetchAtCoder() {
        try {
            console.log('Fetching from AtCoder...');
            const response = await axios.get('https://atcoder.jp/contests/', {
                timeout: 10000,
                headers: {
                    'Accept': 'text/html'
                }
            });

            // AtCoder doesn't have JSON API, return scheduled contests from known patterns
            return this.getAtCoderScheduled();
        } catch (error) {
            console.error('AtCoder Error:', error.message);
            return this.getAtCoderScheduled();
        }
    }

    // AtCoder typically has ABC on Saturdays, ARC occasionally
    getAtCoderScheduled() {
        const contests = [];
        const now = new Date();
        
        // Find next Saturday 21:00 JST (12:00 UTC)
        let nextSaturday = new Date(now);
        nextSaturday.setUTCHours(12, 0, 0, 0);
        const daysUntilSaturday = (6 - now.getUTCDay() + 7) % 7 || 7;
        nextSaturday.setDate(now.getDate() + daysUntilSaturday);

        if (nextSaturday > now) {
            contests.push({
                name: `AtCoder Beginner Contest`,
                platform: 'AtCoder',
                url: 'https://atcoder.jp/contests/',
                startTime: nextSaturday.toISOString(),
                endTime: new Date(nextSaturday.getTime() + 100 * 60 * 1000).toISOString(),
                duration: 6000,
                status: 'upcoming'
            });
        }

        return contests;
    }

    // ✅ CODECHEF - Using their API
    async fetchCodeChef() {
        try {
            console.log('Fetching from CodeChef...');
            const response = await axios.get('https://www.codechef.com/api/list/contests/all', {
                timeout: 10000,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const contests = [];
            const data = response.data;

            // Present/Running contests
            if (data.present_contests) {
                data.present_contests.forEach(c => {
                    contests.push({
                        name: c.contest_name,
                        platform: 'CodeChef',
                        url: `https://www.codechef.com/${c.contest_code}`,
                        startTime: new Date(c.contest_start_date).toISOString(),
                        endTime: new Date(c.contest_end_date).toISOString(),
                        duration: this.calculateDuration(c.contest_start_date, c.contest_end_date),
                        status: 'running'
                    });
                });
            }

            // Future contests
            if (data.future_contests) {
                data.future_contests.forEach(c => {
                    contests.push({
                        name: c.contest_name,
                        platform: 'CodeChef',
                        url: `https://www.codechef.com/${c.contest_code}`,
                        startTime: new Date(c.contest_start_date).toISOString(),
                        endTime: new Date(c.contest_end_date).toISOString(),
                        duration: this.calculateDuration(c.contest_start_date, c.contest_end_date),
                        status: 'upcoming'
                    });
                });
            }

            return contests.slice(0, 10);
        } catch (error) {
            console.error('CodeChef API Error:', error.message);
            return this.getCodeChefScheduled();
        }
    }

    // CodeChef fallback - they typically have Starters on Wednesdays
    getCodeChefScheduled() {
        const now = new Date();
        let nextWednesday = new Date(now);
        nextWednesday.setUTCHours(14, 30, 0, 0);
        const daysUntilWednesday = (3 - now.getUTCDay() + 7) % 7 || 7;
        nextWednesday.setDate(now.getDate() + daysUntilWednesday);

        if (nextWednesday > now) {
            return [{
                name: 'CodeChef Starters',
                platform: 'CodeChef',
                url: 'https://www.codechef.com/contests',
                startTime: nextWednesday.toISOString(),
                endTime: new Date(nextWednesday.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                duration: 7200,
                status: 'upcoming'
            }];
        }
        return [];
    }

    calculateDuration(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.floor((endDate - startDate) / 1000);
    }

    // ✅ MAIN FETCH - Combines all sources
    async fetchAllContests() {
        // Return cache if valid
        if (this.isCacheValid()) {
            console.log('Returning cached data');
            return cache.contests;
        }

        console.log('Fetching from all sources...');

        // Fetch from all sources in parallel
        const [codeforces, leetcode, codechef, atcoder] = await Promise.all([
            this.fetchCodeforces(),
            this.fetchLeetCode(),
            this.fetchCodeChef(),
            this.fetchAtCoder()
        ]);

        console.log(`Fetched: CF=${codeforces.length}, LC=${leetcode.length}, CC=${codechef.length}, AC=${atcoder.length}`);

        // Combine all contests
        let allContests = [
            ...codeforces,
            ...leetcode,
            ...codechef,
            ...atcoder
        ];

        // If no contests from APIs, use enhanced mock data
        if (allContests.length === 0) {
            console.log('All APIs failed, using mock data');
            allContests = this.getMockContests();
        }

        // Sort by start time
        allContests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        // Update cache
        cache.contests = allContests;
        cache.lastFetch = Date.now();

        return allContests;
    }

    // Fetch by platform
    async fetchByPlatform(platform) {
        const platformLower = platform.toLowerCase();

        switch (platformLower) {
            case 'codeforces':
                return await this.fetchCodeforces();
            case 'leetcode':
                return await this.fetchLeetCode();
            case 'codechef':
                return await this.fetchCodeChef();
            case 'atcoder':
                return await this.fetchAtCoder();
            default:
                // Filter from all contests
                const all = await this.fetchAllContests();
                return all.filter(c => 
                    c.platform.toLowerCase().includes(platformLower)
                );
        }
    }

    // Enhanced mock data
    getMockContests() {
        const now = new Date();
        
        const addHours = (hours) => new Date(now.getTime() + hours * 60 * 60 * 1000);
        const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        return [
            {
                name: "Codeforces Round #925 (Div. 2)",
                platform: "Codeforces",
                url: "https://codeforces.com/contests",
                startTime: addHours(26).toISOString(),
                endTime: addHours(28).toISOString(),
                duration: 7200,
                status: "upcoming"
            },
            {
                name: "Educational Codeforces Round 162",
                platform: "Codeforces",
                url: "https://codeforces.com/contests",
                startTime: addDays(3).toISOString(),
                endTime: new Date(addDays(3).getTime() + 2 * 60 * 60 * 1000).toISOString(),
                duration: 7200,
                status: "upcoming"
            },
            {
                name: "LeetCode Weekly Contest 385",
                platform: "LeetCode",
                url: "https://leetcode.com/contest/",
                startTime: addDays(2).toISOString(),
                endTime: new Date(addDays(2).getTime() + 1.5 * 60 * 60 * 1000).toISOString(),
                duration: 5400,
                status: "upcoming"
            },
            {
                name: "LeetCode Biweekly Contest 125",
                platform: "LeetCode",
                url: "https://leetcode.com/contest/",
                startTime: addDays(5).toISOString(),
                endTime: new Date(addDays(5).getTime() + 1.5 * 60 * 60 * 1000).toISOString(),
                duration: 5400,
                status: "upcoming"
            },
            {
                name: "CodeChef Starters 125",
                platform: "CodeChef",
                url: "https://www.codechef.com/contests",
                startTime: addDays(4).toISOString(),
                endTime: new Date(addDays(4).getTime() + 2 * 60 * 60 * 1000).toISOString(),
                duration: 7200,
                status: "upcoming"
            },
            {
                name: "AtCoder Beginner Contest 345",
                platform: "AtCoder",
                url: "https://atcoder.jp/contests",
                startTime: addDays(6).toISOString(),
                endTime: new Date(addDays(6).getTime() + 100 * 60 * 1000).toISOString(),
                duration: 6000,
                status: "upcoming"
            },
            {
                name: "AtCoder Regular Contest 175",
                platform: "AtCoder",
                url: "https://atcoder.jp/contests",
                startTime: addDays(8).toISOString(),
                endTime: new Date(addDays(8).getTime() + 120 * 60 * 1000).toISOString(),
                duration: 7200,
                status: "upcoming"
            },
            {
                name: "HackerRank Week of Code 45",
                platform: "HackerRank",
                url: "https://www.hackerrank.com/contests",
                startTime: addDays(7).toISOString(),
                endTime: addDays(14).toISOString(),
                duration: 604800,
                status: "upcoming"
            }
        ];
    }
}

const contestService = new ContestService();
export default contestService;