import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
  const scriptPath = path.join(process.cwd(), 'scripts', 'linkedin_script.py');

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(NextResponse.json({ message: 'Selenium script ran successfully' }));
      } else {
        resolve(NextResponse.json({ error: 'Failed to run Selenium script' }, { status: 500 }));
      }
    });
  });
}
