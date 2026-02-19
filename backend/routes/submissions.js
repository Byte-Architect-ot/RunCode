import express from 'express';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import auth from '../middleware/auth.js';
import { executeCode } from '../services/judge0.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Create submission
    const submission = new Submission({
      userId: req.user._id,
      problemId,
      code,
      language,
      status: 'Running',
      testCaseResults: problem.testCases.map((_, i) => ({ testCaseIndex: i, status: 'Running' }))
    });
    await submission.save();
    
    problem.totalSubmissions += 1;
    await problem.save();

    // Build full code with boilerplate
    const fullBoilerplate = problem.fullBoilerplate[language] || '';
    let fullCode;
    
    if (fullBoilerplate) {
      fullCode = fullBoilerplate.replace('##USER_CODE##', code);
    } else {
      fullCode = code;
    }

    console.log('=== Executing Code ===');
    console.log('Language:', language);
    console.log('Full Code:\n', fullCode);

    // Execute each test case
    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];
      
      console.log(`\n=== Test Case ${i + 1} ===`);
      console.log('Input:', tc.input);
      console.log('Expected:', tc.expectedOutput);
      
      try {
        const result = await executeCode(fullCode, language, tc.input);
        
        console.log('Result status:', result.status);
        
        const stdout = result.stdout 
          ? Buffer.from(result.stdout, 'base64').toString().trim() 
          : '';
        const stderr = result.stderr 
          ? Buffer.from(result.stderr, 'base64').toString().trim() 
          : '';
        
        console.log('Stdout:', stdout);
        console.log('Stderr:', stderr);
        
        const expectedOutput = tc.expectedOutput.trim();
        
        let status;
        if (result.status.id === 5) {
          status = 'TLE';
        } else if (result.status.id === 6) {
          status = 'CE';
        } else if (result.status.id === 7) {
          status = 'RE';
        } else if (stdout === expectedOutput) {
          status = 'AC';
        } else {
          status = 'WA';
        }

        console.log('Status:', status);

        submission.testCaseResults[i].status = status;
        submission.testCaseResults[i].time = result.time ? result.time * 1000 : 0;
        submission.testCaseResults[i].memory = result.memory || 0;
        submission.testCaseResults[i].stdout = stdout;
        submission.testCaseResults[i].stderr = stderr;
        
      } catch (err) {
        console.error(`Test case ${i} error:`, err);
        submission.testCaseResults[i].status = 'RE';
        submission.testCaseResults[i].stderr = err.message;
      }
    }

    // Determine final status
    const statuses = submission.testCaseResults.map(tc => tc.status);
    console.log('\n=== Final Statuses ===', statuses);
    
    if (statuses.includes('CE')) submission.status = 'CE';
    else if (statuses.includes('RE')) submission.status = 'RE';
    else if (statuses.includes('TLE')) submission.status = 'TLE';
    else if (statuses.includes('WA')) submission.status = 'WA';
    else if (statuses.every(s => s === 'AC')) submission.status = 'AC';
    else submission.status = 'WA';

    submission.totalTime = submission.testCaseResults.reduce((sum, tc) => sum + (tc.time || 0), 0);
    submission.totalMemory = Math.max(...submission.testCaseResults.map(tc => tc.memory || 0));
    submission.completedAt = new Date();

    if (submission.status === 'AC') {
      problem.acceptedSubmissions += 1;
      await problem.save();
    }

    await submission.save();

    console.log('\n=== Final Status ===', submission.status);

    res.status(201).json({ submissionId: submission._id, status: submission.status });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    if (submission.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/all', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id })
      .populate('problemId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;