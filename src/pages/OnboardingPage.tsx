import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Github, User, Sparkles, ArrowRight, Check } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { blink } from '../blink/client'
import { User as UserType } from '../types'
import { db } from '../utils/database'
import toast from 'react-hot-toast'

interface OnboardingPageProps {
  user: UserType | null
}

export default function OnboardingPage({ user }: OnboardingPageProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [githubData, setGithubData] = useState<any>(null)
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    bio: '',
    superpower: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    // Check if user already has a profile
    checkExistingProfile()
    
    // Fetch GitHub data
    fetchGitHubData()
  }, [user, navigate, checkExistingProfile, fetchGitHubData])

  const checkExistingProfile = useCallback(async () => {
    try {
      const existingUser = await db.users.list({
        where: { id: user?.id },
        limit: 1
      })
      
      if (existingUser.length > 0) {
        navigate(`/${existingUser[0].username}`)
      }
    } catch (error) {
      console.error('Error checking existing profile:', error)
      // Continue with onboarding if database check fails
    }
  }, [user?.id, navigate])

  const fetchGitHubData = useCallback(async () => {
    try {
      // Mock GitHub data for now - in real implementation, this would come from GitHub API
      const mockGithubData = {
        login: user?.email?.split('@')[0] || 'user',
        name: user?.displayName || '',
        bio: '',
        avatar_url: user?.photoURL || '',
        public_repos: 12,
        followers: 45,
        following: 23
      }
      
      setGithubData(mockGithubData)
      setFormData(prev => ({
        ...prev,
        username: mockGithubData.login,
        name: mockGithubData.name || mockGithubData.login,
        bio: mockGithubData.bio || ''
      }))
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error)
      toast.error('Failed to fetch GitHub data')
    }
  }, [user?.email, user?.displayName, user?.photoURL])

  const handleNext = () => {
    if (step === 1) {
      if (!formData.username.trim()) {
        toast.error('Username is required')
        return
      }
      setStep(2)
    } else if (step === 2) {
      handleCreateProfile()
    }
  }

  const handleCreateProfile = async () => {
    setLoading(true)
    try {
      // Check if username is available
      const existingUsers = await db.users.list({
        where: { username: formData.username.toLowerCase() },
        limit: 1
      })

      if (existingUsers.length > 0) {
        toast.error('Username is already taken')
        setStep(1)
        setLoading(false)
        return
      }

      // Create user profile
      const newUser = await blink.db.users.create({
        id: user!.id,
        username: formData.username.toLowerCase(),
        name: formData.name,
        bio: formData.bio,
        superpower: formData.superpower,
        avatar: githubData?.avatar_url || user?.photoURL,
        githubData: githubData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      toast.success('Profile created successfully!')
      navigate(`/${newUser.username}`)
    } catch (error) {
      console.error('Failed to create profile:', error)
      toast.error('Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Nine1.dev!
          </h1>
          <p className="text-gray-600">
            Let's set up your bento-style portfolio in just a few steps
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`w-12 h-1 rounded-full ${
              step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
          </div>
        </div>

        <Card className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Choose your username
                </h2>
                <p className="text-gray-600">
                  This will be your unique URL: {formData.username}.nine1.dev
                </p>
              </div>

              {githubData && (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={githubData.avatar_url} />
                    <AvatarFallback>{githubData.name?.[0] || githubData.login?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Github className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{githubData.login}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {githubData.public_repos} repos • {githubData.followers} followers
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="your-username"
                    className="text-center text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {formData.username}.nine1.dev
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Tell us about yourself
                </h2>
                <p className="text-gray-600">
                  This information will be displayed on your portfolio
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell people about yourself..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Superpower <span className="text-gray-400">(optional)</span>
                  </label>
                  <Input
                    value={formData.superpower}
                    onChange={(e) => setFormData(prev => ({ ...prev, superpower: e.target.value }))}
                    placeholder="e.g., Full-stack Developer, Designer, Creator"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-medium text-indigo-900 mb-2">Preview</h3>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={githubData?.avatar_url} />
                    <AvatarFallback>{formData.name?.[0] || formData.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{formData.name || formData.username}</p>
                    <p className="text-sm text-gray-600">@{formData.username}</p>
                    {formData.superpower && (
                      <p className="text-xs text-indigo-600">{formData.superpower}</p>
                    )}
                  </div>
                </div>
                {formData.bio && (
                  <p className="text-sm text-gray-600 mt-2">{formData.bio}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : step === 1 ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Create Profile
                  <User className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}