import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

let pythonCVProcess: any = null

export async function POST(request: NextRequest) {
  try {
    // Path ke Flask server
    const cvServerPath = path.join(process.cwd(), 'src', 'app', 'practicum', 'cv-circuit', 'web_cv_server.py')
    const cvServerDir = path.join(process.cwd(), 'src', 'app', 'practicum', 'cv-circuit')
    
    console.log('Starting Python CV Flask Server...')
    console.log('Server Path:', cvServerPath)
    console.log('Working Dir:', cvServerDir)
    
    // Cek jika sudah ada proses yang berjalan
    if (pythonCVProcess && !pythonCVProcess.killed) {
      // Check if process is actually alive by trying to kill it with signal 0
      try {
        process.kill(pythonCVProcess.pid, 0)
        return NextResponse.json(
          { error: 'Python CV server is already running' },
          { status: 409 }
        )
      } catch (error) {
        // Process is dead, reset the reference
        pythonCVProcess = null
      }
    }

    // Spawn Python Flask server
    pythonCVProcess = spawn('python', ['web_cv_server.py'], {
      cwd: cvServerDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      windowsVerbatimArguments: false
    })

    // Handle process events
    pythonCVProcess.on('error', (error: Error) => {
      console.error('Python CV Server error:', error)
    })

    pythonCVProcess.on('exit', (code: number) => {
      console.log(`Python CV Server exited with code ${code}`)
      pythonCVProcess = null
    })

    // Log output for debugging
    pythonCVProcess.stdout.on('data', (data: Buffer) => {
      console.log(`Python CV stdout: ${data.toString()}`)
    })

    pythonCVProcess.stderr.on('data', (data: Buffer) => {
      console.error(`Python CV stderr: ${data.toString()}`)
    })

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 3000))

    if (pythonCVProcess && !pythonCVProcess.killed) {
      return NextResponse.json({ 
        success: true, 
        message: 'Python CV Flask server started successfully',
        url: 'http://localhost:5000',
        pid: pythonCVProcess.pid 
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to start Python CV Flask server' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error starting Python CV server:', error)
    return NextResponse.json(
      { error: `Failed to start Python CV server: ${(error as Error).message}` },
      { status: 500 }
    )
  }
}
