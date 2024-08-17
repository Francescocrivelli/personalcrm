// app/api/run-selenium/route.ts

import { spawn } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST() {
  const scriptPath = path.join(process.cwd(), 'scripts', 'linkedin_script.py');
 
  return new Promise((resolve) => {
    const pythonProcess = spawn('python3', [scriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      if (code === 0) {
        const filePath = path.join(process.cwd(), 'downloads', 'linkedin_data.zip');
        resolve(
          NextResponse.file(filePath, {
            headers: {
              'Content-Type': 'application/zip',
              'Content-Disposition': 'attachment; filename="linkedin_data.zip"',
            },
          })
        );
      } else {
        resolve(
          NextResponse.json({ error: 'Python script failed' }, { status: 500 })
        );
      }
    });
  });
}
