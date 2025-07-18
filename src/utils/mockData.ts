import { User, Block } from '../types'

// Mock data for when database is unavailable
export const mockUsers: User[] = [
  {
    id: 'mock-user-1',
    username: 'johndoe',
    name: 'John Doe',
    bio: 'Full-stack developer passionate about creating beautiful web experiences',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    superpower: 'Full-stack Developer',
    githubData: {
      login: 'johndoe',
      name: 'John Doe',
      bio: 'Full-stack developer passionate about creating beautiful web experiences',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      public_repos: 42,
      followers: 128,
      following: 89
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'mock-user-2',
    username: 'sarahchen',
    name: 'Sarah Chen',
    bio: 'UI/UX Designer crafting delightful digital experiences',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    superpower: 'UI/UX Designer',
    githubData: {
      login: 'sarahchen',
      name: 'Sarah Chen',
      bio: 'UI/UX Designer crafting delightful digital experiences',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      public_repos: 23,
      followers: 256,
      following: 145
    },
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 'mock-user-3',
    username: 'alexkim',
    name: 'Alex Kim',
    bio: 'Product Manager turning ideas into reality',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    superpower: 'Product Manager',
    githubData: {
      login: 'alexkim',
      name: 'Alex Kim',
      bio: 'Product Manager turning ideas into reality',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      public_repos: 18,
      followers: 89,
      following: 67
    },
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: 'mock-user-4',
    username: 'marialopez',
    name: 'Maria Lopez',
    bio: 'Data Scientist exploring insights through code',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    superpower: 'Data Scientist',
    githubData: {
      login: 'marialopez',
      name: 'Maria Lopez',
      bio: 'Data Scientist exploring insights through code',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      public_repos: 35,
      followers: 167,
      following: 92
    },
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 'mock-user-5',
    username: 'davidwang',
    name: 'David Wang',
    bio: 'Mobile app developer creating seamless user experiences',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    superpower: 'Mobile Developer',
    githubData: {
      login: 'davidwang',
      name: 'David Wang',
      bio: 'Mobile app developer creating seamless user experiences',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      public_repos: 28,
      followers: 134,
      following: 76
    },
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-11T11:20:00Z'
  },
  {
    id: 'mock-user-6',
    username: 'emilyjohnson',
    name: 'Emily Johnson',
    bio: 'DevOps engineer passionate about automation and cloud infrastructure',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    superpower: 'DevOps Engineer',
    githubData: {
      login: 'emilyjohnson',
      name: 'Emily Johnson',
      bio: 'DevOps engineer passionate about automation and cloud infrastructure',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      public_repos: 31,
      followers: 98,
      following: 54
    },
    createdAt: '2024-01-10T08:15:00Z',
    updatedAt: '2024-01-10T08:15:00Z'
  },
  {
    id: 'mock-user-7',
    username: 'mikebrown',
    name: 'Mike Brown',
    bio: 'Cybersecurity specialist protecting digital assets',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
    superpower: 'Security Expert',
    githubData: {
      login: 'mikebrown',
      name: 'Mike Brown',
      bio: 'Cybersecurity specialist protecting digital assets',
      avatar_url: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
      public_repos: 19,
      followers: 76,
      following: 43
    },
    createdAt: '2024-01-09T15:30:00Z',
    updatedAt: '2024-01-09T15:30:00Z'
  },
  {
    id: 'mock-user-8',
    username: 'lisagarcia',
    name: 'Lisa Garcia',
    bio: 'AI/ML researcher exploring the future of artificial intelligence',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    superpower: 'AI Researcher',
    githubData: {
      login: 'lisagarcia',
      name: 'Lisa Garcia',
      bio: 'AI/ML researcher exploring the future of artificial intelligence',
      avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      public_repos: 37,
      followers: 203,
      following: 112
    },
    createdAt: '2024-01-08T12:45:00Z',
    updatedAt: '2024-01-08T12:45:00Z'
  }
]

export const mockBlocks: Block[] = [
  {
    id: 'mock-block-1',
    userId: 'mock-user-1',
    type: 'link',
    position: { x: 0, y: 0 },
    size: { width: 1, height: 1 },
    data: {
      title: 'My Portfolio Website',
      url: 'https://johndoe.dev',
      description: 'Check out my latest projects and work',
      icon: 'https://johndoe.dev/favicon.ico'
    },
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  },
  {
    id: 'mock-block-2',
    userId: 'mock-user-1',
    type: 'tech-stack',
    position: { x: 1, y: 0 },
    size: { width: 2, height: 1 },
    data: {
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
      category: 'Tech Stack'
    },
    createdAt: '2024-01-15T10:40:00Z',
    updatedAt: '2024-01-15T10:40:00Z'
  }
]

export const isDatabaseAvailable = async (): Promise<boolean> => {
  try {
    // Try a simple database operation
    await fetch('/api/health-check')
    return true
  } catch {
    return false
  }
}