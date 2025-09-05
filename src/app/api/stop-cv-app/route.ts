import { NextRequest, NextResponse } from 'next/server'

// Import process reference from launch route (in a real app, you'd use a process manager)
let cvProcess: any = null

export async function POST(request: NextRequest) {
  try {
    if (cvProcess && !cvProcess.killed) {
      cvProcess.kill('SIGTERM')
      
      // Wait for process to close
      await new Promise(resolve => {
        cvProcess.on('exit', resolve)
        // Force kill after 5 seconds if not closed
        setTimeout(() => {
          if (!cvProcess.killed) {
            cvProcess.kill('SIGKILL')
          }
          resolve(null)
        }, 5000)
      })
      
      cvProcess = null
      
      return NextResponse.json({ 
        success: true, 
        message: 'CV application stopped successfully' 
      })
    } else {
      return NextResponse.json(
        { error: 'No CV application is currently running' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Error stopping CV app:', error)
    return NextResponse.json(
      { error: `Failed to stop CV application: ${(error as Error).message}` },
      { status: 500 }
    )
  }
}
