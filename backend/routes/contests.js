import express from 'express';
import contestService from '../services/contestApi.js';

const router = express.Router();

// @route   GET /api/contests
router.get('/', async (req, res) => {
    try {
        const { platform } = req.query;
        
        console.log('Fetching contests, platform:', platform || 'all');
        
        let contests;
        
        if (platform && platform !== 'all') {
            contests = await contestService.fetchByPlatform(platform);
        } else {
            contests = await contestService.fetchAllContests();
        }

        console.log('Fetched contests count:', contests.length);

        // Sort by start time
        contests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        // Filter out ended contests
        const activeContests = contests.filter(c => c.status !== 'ended');

        res.json({
            success: true,
            count: activeContests.length,
            contests: activeContests
        });
    } catch (error) {
        console.error('Error in /api/contests:', error);
        
        // Return mock data on error
        const mockContests = contestService.getMockContests();
        res.json({
            success: true,
            count: mockContests.length,
            contests: mockContests,
            fallback: true
        });
    }
});

// @route   GET /api/contests/running
router.get('/running', async (req, res) => {
    try {
        const contests = await contestService.fetchAllContests();
        const runningContests = contests.filter(c => c.status === 'running');

        res.json({
            success: true,
            count: runningContests.length,
            contests: runningContests
        });
    } catch (error) {
        console.error('Error in /running:', error);
        res.json({ success: true, count: 0, contests: [] });
    }
});

// @route   GET /api/contests/upcoming
router.get('/upcoming', async (req, res) => {
    try {
        const { hours } = req.query;
        const contests = await contestService.fetchAllContests();
        
        let upcomingContests = contests.filter(c => c.status === 'upcoming');

        if (hours) {
            const hoursInMs = parseInt(hours) * 60 * 60 * 1000;
            const now = new Date();
            upcomingContests = upcomingContests.filter(c => {
                const diff = new Date(c.startTime) - now;
                return diff > 0 && diff <= hoursInMs;
            });
        }

        res.json({
            success: true,
            count: upcomingContests.length,
            contests: upcomingContests
        });
    } catch (error) {
        console.error('Error in /upcoming:', error);
        res.json({ success: true, count: 0, contests: [] });
    }
});

// @route   GET /api/contests/platform/:platform
router.get('/platform/:platform', async (req, res) => {
    try {
        const { platform } = req.params;
        console.log('Fetching for platform:', platform);
        
        const contests = await contestService.fetchByPlatform(platform);
        const activeContests = contests.filter(c => c.status !== 'ended');

        res.json({
            success: true,
            platform,
            count: activeContests.length,
            contests: activeContests
        });
    } catch (error) {
        console.error('Error in /platform:', error);
        res.json({ success: true, platform: req.params.platform, count: 0, contests: [] });
    }
});

export default router;