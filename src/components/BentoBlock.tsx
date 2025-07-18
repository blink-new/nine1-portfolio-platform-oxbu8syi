import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link, ExternalLink, Image, Gamepad2, MapPin, Code, Edit, Trash2 } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Block, LinkBlockData, MediaBlockData, GameBlockData, LocationBlockData, TechStackBlockData } from '../types'

interface BentoBlockProps {
  block: Block
  isEditMode: boolean
  onUpdate: (block: Block) => void
  onDelete: (blockId: string) => void
  isDragging?: boolean
}

export default function BentoBlock({ block, isEditMode, onUpdate, onDelete, isDragging = false }: BentoBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const getBlockIcon = () => {
    switch (block.type) {
      case 'link':
        return <Link className="w-4 h-4" />
      case 'media':
        return <Image className="w-4 h-4" />
      case 'game':
        return <Gamepad2 className="w-4 h-4" />
      case 'location':
        return <MapPin className="w-4 h-4" />
      case 'tech-stack':
        return <Code className="w-4 h-4" />
      default:
        return <Link className="w-4 h-4" />
    }
  }

  const getBlockSize = () => {
    // Different block types can have different sizes
    switch (block.type) {
      case 'media':
        return 'col-span-1 sm:col-span-2 row-span-2'
      case 'tech-stack':
        return 'col-span-1 sm:col-span-2'
      default:
        return 'col-span-1'
    }
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case 'link':
        return <LinkBlock data={block.data as LinkBlockData} />
      case 'media':
        return <MediaBlock data={block.data as MediaBlockData} />
      case 'game':
        return <GameBlock data={block.data as GameBlockData} />
      case 'location':
        return <LocationBlock data={block.data as LocationBlockData} />
      case 'tech-stack':
        return <TechStackBlock data={block.data as TechStackBlockData} />
      default:
        return <div>Unknown block type</div>
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${getBlockSize()} ${isDragging ? 'z-50' : ''}`}
      {...attributes}
      {...(isEditMode ? listeners : {})}
    >
      <Card className={`h-full p-4 hover:shadow-lg transition-all duration-200 ${
        isEditMode ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-indigo-300' : 'cursor-pointer hover:-translate-y-1'
      } ${isSortableDragging ? 'opacity-50' : ''}`}>
        {isEditMode && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {getBlockIcon()}
              <span className="capitalize">{block.type.replace('-', ' ')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-indigo-100"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Open edit modal
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 hover:bg-red-100 text-red-600"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(block.id)
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="h-full">
          {renderBlockContent()}
        </div>
      </Card>
    </div>
  )
}

function LinkBlock({ data }: { data: LinkBlockData }) {
  if (!data || !data.url) {
    return <div className="text-gray-500 text-sm">Invalid link data</div>
  }

  let hostname = ''
  try {
    hostname = new URL(data.url).hostname
  } catch {
    hostname = data.url
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start space-x-3 mb-3">
        {data.icon && (
          <img src={data.icon} alt="" className="w-8 h-8 rounded-lg flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{data.title || 'Untitled'}</h3>
          {data.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{data.description}</p>
          )}
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex items-center text-xs text-indigo-600">
          <ExternalLink className="w-3 h-3 mr-1" />
          <span className="truncate">{hostname}</span>
        </div>
      </div>
    </div>
  )
}

function MediaBlock({ data }: { data: MediaBlockData }) {
  return (
    <div className="flex flex-col h-full">
      {data.type === 'image' ? (
        <div className="flex-1 mb-3">
          <img
            src={data.url}
            alt={data.title || ''}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="flex-1 mb-3">
          <video
            src={data.url}
            className="w-full h-full object-cover rounded-lg"
            controls
          />
        </div>
      )}
      {(data.title || data.description) && (
        <div>
          {data.title && (
            <h3 className="font-semibold text-gray-900 text-sm truncate">{data.title}</h3>
          )}
          {data.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">{data.description}</p>
          )}
        </div>
      )}
    </div>
  )
}

function GameBlock({ data }: { data: GameBlockData }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start space-x-3 mb-3">
        {data.image && (
          <img src={data.image} alt={data.name} className="w-12 h-12 rounded-lg flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{data.name}</h3>
          {data.platform && (
            <p className="text-xs text-gray-500 mt-1">{data.platform}</p>
          )}
        </div>
      </div>
      {data.description && (
        <p className="text-sm text-gray-600 line-clamp-3 mt-auto">{data.description}</p>
      )}
    </div>
  )
}

function LocationBlock({ data }: { data: LocationBlockData }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-3">
        <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
        <h3 className="font-semibold text-gray-900 truncate">{data.name}</h3>
      </div>
      {data.description && (
        <p className="text-sm text-gray-600 line-clamp-3">{data.description}</p>
      )}
      {data.coordinates && (
        <div className="mt-auto pt-3">
          <div className="text-xs text-gray-500">
            {data.coordinates.lat.toFixed(4)}, {data.coordinates.lng.toFixed(4)}
          </div>
        </div>
      )}
    </div>
  )
}

function TechStackBlock({ data }: { data: TechStackBlockData }) {
  if (!data || !Array.isArray(data.technologies)) {
    return <div className="text-gray-500 text-sm">Invalid tech stack data</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-3">
        <Code className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        <h3 className="font-semibold text-gray-900">
          {data.category || 'Tech Stack'}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.technologies.map((tech, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          >
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  )
}