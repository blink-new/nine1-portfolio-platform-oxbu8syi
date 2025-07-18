export interface User {
  id: string
  username: string
  name: string
  bio?: string
  avatar?: string
  superpower?: string
  githubData?: {
    login: string
    name: string
    bio: string
    avatar_url: string
    public_repos: number
    followers: number
    following: number
  }
  createdAt: string
  updatedAt: string
}

export interface Block {
  id: string
  userId: string
  type: 'link' | 'media' | 'game' | 'location' | 'tech-stack'
  position: { x: number; y: number }
  size: { width: number; height: number }
  data: LinkBlockData | MediaBlockData | GameBlockData | LocationBlockData | TechStackBlockData
  createdAt: string
  updatedAt: string
}

export interface LinkBlockData {
  title: string
  url: string
  description?: string
  icon?: string
}

export interface MediaBlockData {
  type: 'image' | 'video'
  url: string
  title?: string
  description?: string
}

export interface GameBlockData {
  name: string
  platform?: string
  image?: string
  description?: string
}

export interface LocationBlockData {
  name: string
  coordinates?: { lat: number; lng: number }
  description?: string
}

export interface TechStackBlockData {
  technologies: string[]
  category?: string
}