import { useState } from 'react'
import { Database, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'

interface DatabaseSetupProps {
  onSetupComplete?: () => void
}

export default function DatabaseSetup({ onSetupComplete }: DatabaseSetupProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [setupStatus, setSetupStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleCreateDatabase = async () => {
    setIsCreating(true)
    setSetupStatus('idle')
    setErrorMessage('')

    try {
      // Import the blink client to create tables
      const { blink } = await import('../blink/client')
      
      // Try to create the database tables using the Blink SDK
      await blink.db.users.create({
        id: 'test-init-user',
        username: 'test-init',
        name: 'Test User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      // If successful, delete the test user
      await blink.db.users.delete('test-init-user')
      
      setSetupStatus('success')
      setTimeout(() => {
        if (onSetupComplete) {
          onSetupComplete()
        }
      }, 2000)
    } catch (error: any) {
      console.error('Database creation failed:', error)
      setSetupStatus('error')
      
      if (error.message?.includes('maximum database count') || error.message?.includes('database count of 100 reached')) {
        setErrorMessage('Database limit reached. The platform has reached its database limit. Please use demo mode with sample data.')
      } else if (error.message?.includes('not found')) {
        setErrorMessage('Database service unavailable. Please use demo mode with sample data.')
      } else {
        setErrorMessage(error.message || 'Failed to create database tables. Please use demo mode.')
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleUseMockData = () => {
    setSetupStatus('success')
    if (onSetupComplete) {
      onSetupComplete()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Setup Required</h2>
          <p className="text-gray-600">
            The database tables need to be created before you can use Nine1.dev
          </p>
        </div>

        {setupStatus === 'idle' && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This app requires database tables for users and blocks. You can either create them or use demo mode.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={handleCreateDatabase} 
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Database...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    Create Database Tables
                  </>
                )}
              </Button>

              <Button 
                onClick={handleUseMockData}
                variant="outline"
                className="w-full"
              >
                Continue with Demo Data
              </Button>
            </div>
          </div>
        )}

        {setupStatus === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup Complete!</h3>
              <p className="text-gray-600">You're now using demo mode with sample data.</p>
            </div>
          </div>
        )}

        {setupStatus === 'error' && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={handleUseMockData}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700"
              >
                Continue with Demo Data
              </Button>
              
              <Button 
                onClick={() => setSetupStatus('idle')}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-gray-500">
            Demo mode uses sample data and won't persist changes
          </p>
        </div>
      </Card>
    </div>
  )
}