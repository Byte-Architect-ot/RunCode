import mongoose from 'mongoose';
import Problem from './models/Problem.js';

const seedData = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/algorithmic_arena');
    console.log('Connected to MongoDB');

    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    const problems = [
      {
        title: 'Two Sum',
        slug: 'two-sum',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

**Example 1:**
Input: nums = [2,7,11,15], target = 9
Output: [0,1]

**Example 2:**
Input: nums = [3,2,4], target = 6
Output: [1,2]`,
        difficulty: 'Easy',
        defaultCode: {
          javascript: `function twoSum(nums, target) {
  // Write your code here
  
}`,
          python: `def twoSum(nums, target):
    # Write your code here
    pass`
        },
        fullBoilerplate: {
          javascript: `##USER_CODE##

const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');
const nums = JSON.parse(input[0]);
const target = parseInt(input[1]);
const result = twoSum(nums, target);
console.log(JSON.stringify(result));`,
          python: `##USER_CODE##

import json
import sys

input_data = sys.stdin.read().strip().split('\\n')
nums = json.loads(input_data[0])
target = int(input_data[1])
result = twoSum(nums, target)
print(json.dumps(result))`
        },
        testCases: [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', isHidden: false },
          { input: '[3,2,4]\n6', expectedOutput: '[1,2]', isHidden: false },
          { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true }
        ],
        constraints: '2 <= nums.length <= 10^4',
        timeLimit: 2,
        memoryLimit: 256,
        sampleInput: '[2,7,11,15]\n9',
        sampleOutput: '[0,1]',
        tags: ['Array', 'Hash Table']
      },
      {
        title: 'Add Two Numbers',
        slug: 'add-two-numbers',
        description: `Given two numbers a and b, return their sum.

**Example 1:**
Input: a = 5, b = 3
Output: 8

**Example 2:**
Input: a = 10, b = 20
Output: 30`,
        difficulty: 'Easy',
        defaultCode: {
          javascript: `function addTwo(a, b) {
  // Write your code here
  
}`,
          python: `def addTwo(a, b):
    # Write your code here
    pass`
        },
        fullBoilerplate: {
          javascript: `##USER_CODE##

const input = require('fs').readFileSync(0, 'utf-8').trim().split('\\n');
const a = parseInt(input[0]);
const b = parseInt(input[1]);
const result = addTwo(a, b);
console.log(result);`,
          python: `##USER_CODE##

import sys
input_data = sys.stdin.read().strip().split('\\n')
a = int(input_data[0])
b = int(input_data[1])
result = addTwo(a, b)
print(result)`
        },
        testCases: [
          { input: '5\n3', expectedOutput: '8', isHidden: false },
          { input: '10\n20', expectedOutput: '30', isHidden: false },
          { input: '100\n200', expectedOutput: '300', isHidden: true }
        ],
        constraints: '-1000 <= a, b <= 1000',
        timeLimit: 2,
        memoryLimit: 256,
        sampleInput: '5\n3',
        sampleOutput: '8',
        tags: ['Math']
      },
      {
        title: 'Reverse String',
        slug: 'reverse-string',
        description: `Write a function that reverses a string.

**Example 1:**
Input: "hello"
Output: "olleh"

**Example 2:**
Input: "world"
Output: "dlrow"`,
        difficulty: 'Easy',
        defaultCode: {
          javascript: `function reverseString(s) {
  // Write your code here
  
}`,
          python: `def reverseString(s):
    # Write your code here
    pass`
        },
        fullBoilerplate: {
          javascript: `##USER_CODE##

const input = require('fs').readFileSync(0, 'utf-8').trim();
const result = reverseString(input);
console.log(result);`,
          python: `##USER_CODE##

import sys
s = sys.stdin.read().strip()
result = reverseString(s)
print(result)`
        },
        testCases: [
          { input: 'hello', expectedOutput: 'olleh', isHidden: false },
          { input: 'world', expectedOutput: 'dlrow', isHidden: false },
          { input: 'abcdef', expectedOutput: 'fedcba', isHidden: true }
        ],
        constraints: '1 <= s.length <= 1000',
        timeLimit: 2,
        memoryLimit: 256,
        sampleInput: 'hello',
        sampleOutput: 'olleh',
        tags: ['String']
      }
    ];

    await Problem.insertMany(problems);
    console.log('Seeded ' + problems.length + ' problems');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();