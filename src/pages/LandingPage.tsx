import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Github, Sparkles, Grid3X3, Users, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { blink } from '../blink/client'
import { User } from '../types'
import { mockUsers } from '../utils/mockData'

interface LandingPageProps {
  user: User | null
}

export default function LandingPage({ user }: LandingPageProps) {
  const [featuredUsers, setFeaturedUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    loadFeaturedUsers()
  }, [])

  const loadFeaturedUsers = async () => {
    try {
      const users = await blink.db.users.list({
        limit: 12,
        orderBy: { createdAt: 'desc' }
      })
      
      // Database is working - use real data or show empty state
      if (users && Array.isArray(users) && users.length > 0) {
        setFeaturedUsers(users)
        setUsingMockData(false)
      } else {
        // Database is working but empty, show mock data for demo purposes
        setFeaturedUsers(mockUsers)
        setUsingMockData(true)
      }
    } catch (error) {
      console.error('Failed to load featured users:', error)
      // Use mock data as fallback when database fails
      setFeaturedUsers(mockUsers)
      setUsingMockData(true)
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubLogin = () => {
    blink.auth.login('/onboarding')
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-amber-500 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-amber-600 bg-clip-text text-transparent">
                Nine1.dev
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to={`/${user.username}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.[0] || user.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link to={`/${user.username}`}>
                    <Button variant="outline" size="sm">
                      My Profile
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button onClick={handleGitHubLogin} className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                  <Github className="w-4 h-4 mr-2" />
                  Sign in with GitHub
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Bento-style portfolio platform
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Showcase yourself with
            <span className="bg-gradient-to-r from-indigo-600 to-amber-600 bg-clip-text text-transparent block">
              beautiful bento grids
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Create stunning personal portfolios with draggable blocks, GitHub integration, 
            and customizable layouts that tell your unique story.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to={`/${user.username}`}>
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                  Go to My Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={handleGitHubLogin}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
              >
                <Github className="w-4 h-4 mr-2" />
                Get Started with GitHub
              </Button>
            )}
            <Button variant="outline" size="lg">
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Users Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              <Users className="w-4 h-4 mr-2" />
              Community Showcase
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Discover amazing portfolios
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get inspired by how others are using Nine1.dev to showcase their work, 
              projects, and personality through beautiful bento layouts.
            </p>
          </div>

          {usingMockData && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">
                Showing example portfolios. Database is temporarily unavailable.
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          ) : featuredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredUsers.map((featuredUser) => (
                <Link key={featuredUser.id} to={`/${featuredUser.username}`}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={featuredUser.avatar} />
                        <AvatarFallback>{featuredUser.name?.[0] || featuredUser.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {featuredUser.name || featuredUser.username}
                        </h3>
                        <p className="text-sm text-gray-500">@{featuredUser.username}</p>
                      </div>
                    </div>
                    {featuredUser.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2">{featuredUser.bio}</p>
                    )}
                    {featuredUser.superpower && (
                      <div className="mt-3 inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-amber-100 text-xs font-medium text-indigo-700">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {featuredUser.superpower}
                      </div>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
              <p className="text-gray-600 mb-6">Be the first to create your bento-style portfolio!</p>
              {!user && (
                <Button onClick={handleGitHubLogin} className="bg-gradient-to-r from-indigo-600 to-indigo-700">
                  <Github className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-amber-500 rounded-md flex items-center justify-center">
                <Grid3X3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Nine1.dev</span>
            </div>
            <p className="text-sm text-gray-600">
              Built with ❤️ for the creative community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}