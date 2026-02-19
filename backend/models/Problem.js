import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  defaultCode: {
    cpp: { type: String, default: '' },
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    java: { type: String, default: '' }
  },
  fullBoilerplate: {
    cpp: { type: String, default: '' },
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    java: { type: String, default: '' }
  },
  testCases: [testCaseSchema],
  constraints: { type: String },
  timeLimit: { type: Number, default: 2 },
  memoryLimit: { type: Number, default: 256 },
  sampleInput: { type: String },
  sampleOutput: { type: String },
  tags: [{ type: String }],
  totalSubmissions: { type: Number, default: 0 },
  acceptedSubmissions: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Problem', problemSchema);
