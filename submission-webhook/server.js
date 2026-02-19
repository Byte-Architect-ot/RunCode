import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 4000;

mongoose.connect('mongodb://127.0.0.1:27017/algorithmic_arena')
  .then(() => console.log('Webhook connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

const submissionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  problemId: mongoose.Schema.Types.ObjectId,
  code: String,
  language: String,
  status: String,
  testCaseResults: [{
    testCaseIndex: Number,
    status: String,
    time: Number,
    memory: Number,
    stdout: String,
    stderr: String,
    judgeToken: String
  }],
  totalTime: Number,
  totalMemory: Number,
  completedAt: Date
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

const STATUS_MAP = {
  1: 'Running', 2: 'Running', 3: 'AC', 4: 'WA',
  5: 'TLE', 6: 'CE', 7: 'RE', 8: 'RE', 9: 'RE',
  10: 'RE', 11: 'RE', 12: 'RE', 13: 'RE', 14: 'MLE'
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.put('/webhook', async (req, res) => {
  try {
    const { submissionId, testCaseIndex } = req.query;
    const result = req.body;

    console.log('Webhook received for submission:', submissionId, 'test:', testCaseIndex);

    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ message: 'Not found' });

    const statusId = result.status?.id;
    const status = STATUS_MAP[statusId] || 'RE';
    const idx = parseInt(testCaseIndex);

    if (submission.testCaseResults[idx]) {
      submission.testCaseResults[idx].status = status;
      submission.testCaseResults[idx].time = result.time ? parseFloat(result.time) * 1000 : null;
      submission.testCaseResults[idx].memory = result.memory || null;
      if (result.stdout) {
        submission.testCaseResults[idx].stdout = Buffer.from(result.stdout, 'base64').toString();
      }
      if (result.stderr) {
        submission.testCaseResults[idx].stderr = Buffer.from(result.stderr, 'base64').toString();
      }
    }

    const allComplete = submission.testCaseResults.every(tc => !['Pending', 'Running'].includes(tc.status));
    
    if (allComplete) {
      const statuses = submission.testCaseResults.map(tc => tc.status);
      if (statuses.includes('CE')) submission.status = 'CE';
      else if (statuses.includes('WA')) submission.status = 'WA';
      else if (statuses.includes('TLE')) submission.status = 'TLE';
      else if (statuses.includes('MLE')) submission.status = 'MLE';
      else if (statuses.includes('RE')) submission.status = 'RE';
      else submission.status = 'AC';
      submission.completedAt = new Date();
    }

    await submission.save();
    res.json({ message: 'OK' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log('Webhook server on port ' + PORT));
