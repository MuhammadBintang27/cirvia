import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

let cvProcess: any = null

export async function POST(request: NextRequest) {
  try {
    // Path ke aplikasi CV
    const cvAppDir = path.join(process.cwd(), 'src', 'app', 'practicum', 'cv-circuit')
    const mainPyFile = 'main.py'
    
    console.log('CV App Dir:', cvAppDir)
    console.log('Working Directory:', cvAppDir)
    
    // Cek jika sudah ada proses yang berjalan
    if (cvProcess && !cvProcess.killed) {
      return NextResponse.json(
        { error: 'CV application is already running' },
        { status: 409 }
      )
    }

    // Spawn Python process - jalankan main.py dari working directory yang benar
    cvProcess = spawn('python', [mainPyFile], {
      cwd: cvAppDir,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      windowsVerbatimArguments: false
    })

    // Handle process events
    cvProcess.on('error', (error: Error) => {
      console.error('CV Process error:', error)
    })

    cvProcess.on('exit', (code: number) => {
      console.log(`CV Process exited with code ${code}`)
      cvProcess = null
    })

    // Log output for debugging
    cvProcess.stdout.on('data', (data: Buffer) => {
      console.log(`CV stdout: ${data.toString()}`)
    })

    cvProcess.stderr.on('data', (data: Buffer) => {
      console.error(`CV stderr: ${data.toString()}`)
    })

    // Wait a moment to check if process started successfully
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (cvProcess && !cvProcess.killed) {
      return NextResponse.json({ 
        success: true, 
        message: 'CV application launched successfully',
        pid: cvProcess.pid 
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to start CV application' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error launching CV app:', error)
    return NextResponse.json(
      { error: `Failed to launch CV application: ${(error as Error).message}` },
      { status: 500 }
    )
  }
}
