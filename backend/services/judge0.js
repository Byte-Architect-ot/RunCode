import { spawn } from 'child_process';
import { writeFile, unlink, mkdtemp } from 'fs/promises';
import path from 'path';
import os from 'os';

const LANGUAGE_IDS = { cpp: 54, javascript: 63, python: 71, java: 62 };

// Local code execution
export const executeCode = (code, language, stdin) => {
  return new Promise(async (resolve) => {
    const startTime = Date.now();
    let tempDir;
    let codeFile;
    
    try {
      // Create temp directory
      tempDir = await mkdtemp(path.join(os.tmpdir(), 'arena-'));
      
      let command;
      let args;
      
      if (language === 'javascript') {
        codeFile = path.join(tempDir, 'solution.js');
        await writeFile(codeFile, code);
        command = 'node';
        args = [codeFile];
      } else if (language === 'python') {
        codeFile = path.join(tempDir, 'solution.py');
        await writeFile(codeFile, code);
        command = 'python3';
        args = [codeFile];
      } else {
        resolve({
          status: { id: 6 },
          stderr: Buffer.from('Language not supported').toString('base64'),
          stdout: '',
          time: 0,
          memory: 0
        });
        return;
      }

      const child = spawn(command, args, {
        cwd: tempDir,
        timeout: 5000
      });

      let stdout = '';
      let stderr = '';
      let killed = false;

      // Set timeout
      const timer = setTimeout(() => {
        killed = true;
        child.kill('SIGKILL');
      }, 5000);

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Write stdin
      if (stdin) {
        child.stdin.write(stdin);
      }
      child.stdin.end();

      child.on('close', async (code) => {
        clearTimeout(timer);
        const endTime = Date.now();
        const time = (endTime - startTime) / 1000;

        // Cleanup
        try {
          if (codeFile) await unlink(codeFile);
          if (tempDir) await unlink(tempDir).catch(() => {});
        } catch (e) {}

        if (killed) {
          resolve({
            status: { id: 5 },
            stderr: Buffer.from('Time Limit Exceeded').toString('base64'),
            stdout: '',
            time: time,
            memory: 0
          });
        } else if (code !== 0) {
          resolve({
            status: { id: 7 },
            stderr: Buffer.from(stderr || 'Runtime Error').toString('base64'),
            stdout: Buffer.from(stdout).toString('base64'),
            time: time,
            memory: 1024
          });
        } else {
          resolve({
            status: { id: 3 },
            stdout: Buffer.from(stdout).toString('base64'),
            stderr: stderr ? Buffer.from(stderr).toString('base64') : '',
            time: time,
            memory: 1024
          });
        }
      });

      child.on('error', async (err) => {
        clearTimeout(timer);
        
        // Cleanup
        try {
          if (codeFile) await unlink(codeFile);
        } catch (e) {}

        resolve({
          status: { id: 7 },
          stderr: Buffer.from(err.message).toString('base64'),
          stdout: '',
          time: 0,
          memory: 0
        });
      });

    } catch (err) {
      console.error('Execute error:', err);
      resolve({
        status: { id: 7 },
        stderr: Buffer.from(err.message).toString('base64'),
        stdout: '',
        time: 0,
        memory: 0
      });
    }
  });
};

export const getLanguageId = (language) => LANGUAGE_IDS[language] || 63;
export { LANGUAGE_IDS };