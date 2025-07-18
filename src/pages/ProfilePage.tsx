import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Edit3, Settings, Grid3X3, Plus, Github, ExternalLink, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'
import { blink } from '../blink/client'
import { User, Block } from '../types'
import BentoGrid from '../components/BentoGrid'
import { mockUsers, mockBlocks } from '../utils/mockData'
import { db } from '../utils/database'

interface ProfilePageProps {
  currentUser: User | null
}

export default function ProfilePage({ currentUser }: ProfilePageProps) {
  const { username } = useParams<{ username: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)

  const isOwner = currentUser?.username === username

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true)
      setNotFound(false)

      // Load user profile
      const users = await db.users.list({
        where: { username: username },
        limit: 1
      })

      if (users.length === 0) {
        // Try to find user in mock data as fallback
        const mockUser = mockUsers.find(u => u.username === username)
        if (mockUser) {
          setUser(mockUser)
          setUsingMockData(true)
          // Load mock blocks for this user
          const userMockBlocks = mockBlocks.filter(b => b.userId === mockUser.id)
          setBlocks(userMockBlocks)
          return
        }
        setNotFound(true)
        return
      }

      const profileUser = users[0]
      setUser(profileUser)
      setUsingMockData(false)

      // Load user's blocks
      const userBlocks = await db.blocks.list({
        where: { userId: profileUser.id },
        orderBy: { createdAt: 'desc' }
      })

      setBlocks(userBlocks)
    } catch (error) {
      console.error('Failed to load profile:', error)
      // Try to find user in mock data as fallback
      const mockUser = mockUsers.find(u => u.username === username)
      if (mockUser) {
        setUser(mockUser)
        setUsingMockData(true)
        // Load mock blocks for this user
        const userMockBlocks = mockBlocks.filter(b => b.userId === mockUser.id)
        setBlocks(userMockBlocks)
      } else {
        console.error('Failed to load profile:', error)
        setNotFound(true)
        setBlocks([])
      }
    } finally {
      setLoading(false)
    }
  }, [username])

  useEffect(() => {
    if (username) {
      loadProfile()
    }
  }, [username, loadProfile])

  const handleBlocksUpdate = (updatedBlocks: Block[]) => {
    setBlocks(updatedBlocks)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (notFound || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid3X3 className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
          <p className="text-gray-600 mb-6">
            The user @{username} doesn't exist or their profile is private.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-amber-500 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-amber-600 bg-clip-text text-transparent">
                Nine1.dev
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {isOwner && (
                <Button
                  variant={isEditMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={isEditMode ? "bg-gradient-to-r from-indigo-600 to-indigo-700" : ""}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Done Editing' : 'Edit Profile'}
                </Button>
              )}
              
              {currentUser && currentUser.username !== username && (
                <Link to={`/${currentUser.username}`}>
                  <Button variant="outline" size="sm">
                    My Profile
                  </Button>
                </Link>
              )}
              
              {!currentUser && (
                <Button onClick={() => blink.auth.login()} size="sm">
                  <Github className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.name?.[0] || user.username?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.name || user.username}
                    </h1>
                    <p className="text-gray-600">@{user.username}</p>
                    {user.superpower && (
                      <Badge className="mt-2 bg-gradient-to-r from-indigo-100 to-amber-100 text-indigo-700 border-0">
                        {user.superpower}
                      </Badge>
                    )}
                  </div>
                  
                  {isOwner && (
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  )}
                </div>
                
                {user.bio && (
                  <p className="text-gray-700 mt-3">{user.bio}</p>
                )}
                
                {user.githubData && (
                  <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Github className="w-4 h-4" />
                      <span>{user.githubData.login}</span>
                    </div>
                    <span>•</span>
                    <span>{user.githubData.public_repos} repos</span>
                    <span>•</span>
                    <span>{user.githubData.followers} followers</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Demo Mode Notice */}
        {usingMockData && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2 text-amber-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Demo Mode</span>
            </div>
            <p className="text-sm text-amber-700 mt-1">
              This is an example portfolio. Database is temporarily unavailable.
            </p>
          </div>
        )}

        {/* Bento Grid */}
        <div className="mb-8">
          {isEditMode && isOwner && (
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-indigo-900">Edit Mode</h3>
                  <p className="text-sm text-indigo-700">
                    Drag blocks to rearrange, click to edit, or add new blocks
                  </p>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Block
                </Button>
              </div>
            </div>
          )}

          <BentoGrid
            blocks={blocks}
            isEditMode={isEditMode && isOwner}
            onBlocksUpdate={handleBlocksUpdate}
            userId={user.id}
          />
        </div>

        {/* Empty State */}
        {blocks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isOwner ? 'Start building your portfolio' : 'No content yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isOwner 
                ? 'Add your first block to showcase your work, projects, or personality'
                : `${user.name || user.username} hasn't added any content yet`
              }
            </p>
            {isOwner && (
              <Button 
                onClick={() => setIsEditMode(true)}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Block
              </Button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <span>Powered by</span>
            <Link to="/" className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700">
              <div className="w-4 h-4 bg-gradient-to-br from-indigo-600 to-amber-500 rounded-sm flex items-center justify-center">
                <Grid3X3 className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="font-medium">Nine1.dev</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}