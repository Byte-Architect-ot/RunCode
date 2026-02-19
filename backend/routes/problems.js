import express from 'express';
import Problem from '../models/Problem.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find().select('title slug difficulty tags totalSubmissions acceptedSubmissions');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json({
      _id: problem._id,
      title: problem.title,
      slug: problem.slug,
      description: problem.description,
      difficulty: problem.difficulty,
      defaultCode: problem.defaultCode,
      constraints: problem.constraints,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
      sampleInput: problem.sampleInput,
      sampleOutput: problem.sampleOutput,
      tags: problem.tags,
      totalSubmissions: problem.totalSubmissions,
      acceptedSubmissions: problem.acceptedSubmissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
