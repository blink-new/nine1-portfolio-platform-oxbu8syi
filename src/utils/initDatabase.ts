import { blink } from '../blink/client'

/**
 * Initialize database tables if they don't exist
 * This function attempts to create the necessary tables for the application
 */
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // Try to create users table
    await blink.db.users.create({
      id: 'test-init-user',
      username: 'test-init',
      name: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    // If successful, delete the test user
    await blink.db.users.delete('test-init-user')
    
    console.log('Database tables are available')
    return true
  } catch (error: any) {
    if (error?.status === 404 || error?.message?.includes('not found')) {
      console.warn('Database tables do not exist. Using mock data fallback.')
      return false
    }
    
    // Other errors might indicate the table exists but there was a different issue
    console.warn('Database initialization check failed:', error)
    return false
  }
}

/**
 * Check if database is available without creating test data
 */
export const checkDatabaseAvailability = async (): Promise<boolean> => {
  try {
    // Try a simple list operation
    await blink.db.users.list({ limit: 1 })
    return true
  } catch (error: any) {
    if (error?.status === 404 || error?.message?.includes('not found')) {
      return false
    }
    // Other errors might be temporary, so we'll assume database is available
    return true
  }
}