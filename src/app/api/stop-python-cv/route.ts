import { NextRequest, NextResponse } from 'next/server'

// Import process reference (in production, you'd use a proper process manager)
let pythonCVProcess: any = null

export async function POST(request: NextRequest) {
  try {
    if (pythonCVProcess && !pythonCVProcess.killed) {
      pythonCVProcess.kill('SIGTERM')
      
      // Wait for process to close
      await new Promise(resolve => {
        pythonCVProcess.on('exit', resolve)
        // Force kill after 5 seconds if not closed
        setTimeout(() => {
          if (!pythonCVProcess.killed) {
            pythonCVProcess.kill('SIGKILL')
          }
          resolve(null)
        }, 5000)
      })
      
      pythonCVProcess = null
      
      return NextResponse.json({ 
        success: true, 
        message: 'Python CV server stopped successfully' 
      })
    } else {
      return NextResponse.json(
        { error: 'No Python CV server is currently running' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Error stopping Python CV server:', error)
    return NextResponse.json(
      { error: `Failed to stop Python CV server: ${(error as Error).message}` },
      { status: 500 }
    )
  }
}
