import mongoose from 'mongoose';

const testCaseResultSchema = new mongoose.Schema({
  testCaseIndex: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Running', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE'], default: 'Pending' },
  time: { type: Number },
  memory: { type: Number },
  stdout: { type: String },
  stderr: { type: String },
  judgeToken: { type: String }
});

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  language: { type: String, enum: ['cpp', 'javascript', 'python', 'java'], required: true },
  status: { type: String, enum: ['Pending', 'Running', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE'], default: 'Pending' },
  testCaseResults: [testCaseResultSchema],
  totalTime: { type: Number },
  totalMemory: { type: Number },
  completedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
