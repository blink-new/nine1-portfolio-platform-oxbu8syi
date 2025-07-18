import { blink } from '../blink/client'

/**
 * Database wrapper with proper error handling
 * Now that database tables exist, we can use direct calls
 */
export const db = {
  users: {
    list: async (options?: any) => {
      try {
        const result = await blink.db.users.list(options)
        return Array.isArray(result) ? result : []
      } catch (error) {
        console.error('Failed to list users:', error)
        throw error
      }
    },
    create: async (data: any) => {
      try {
        return await blink.db.users.create(data)
      } catch (error) {
        console.error('Failed to create user:', error)
        throw error
      }
    },
    update: async (id: string, data: any) => {
      try {
        return await blink.db.users.update(id, data)
      } catch (error) {
        console.error('Failed to update user:', error)
        throw error
      }
    },
    delete: async (id: string) => {
      try {
        return await blink.db.users.delete(id)
      } catch (error) {
        console.error('Failed to delete user:', error)
        throw error
      }
    }
  },
  blocks: {
    list: async (options?: any) => {
      try {
        const result = await blink.db.blocks.list(options)
        return Array.isArray(result) ? result : []
      } catch (error) {
        console.error('Failed to list blocks:', error)
        throw error
      }
    },
    create: async (data: any) => {
      try {
        return await blink.db.blocks.create(data)
      } catch (error) {
        console.error('Failed to create block:', error)
        throw error
      }
    },
    update: async (id: string, data: any) => {
      try {
        return await blink.db.blocks.update(id, data)
      } catch (error) {
        console.error('Failed to update block:', error)
        throw error
      }
    },
    delete: async (id: string) => {
      try {
        return await blink.db.blocks.delete(id)
      } catch (error) {
        console.error('Failed to delete block:', error)
        throw error
      }
    }
  }
}

/**
 * Check if database is available
 */
export const isDatabaseAvailable = async (): Promise<boolean> => {
  try {
    await blink.db.users.list({ limit: 1 })
    return true
  } catch (error) {
    console.error('Database availability check failed:', error)
    return false
  }
}