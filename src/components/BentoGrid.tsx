import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Block } from '../types'
import BentoBlock from './BentoBlock'

interface BentoGridProps {
  blocks: Block[]
  isEditMode: boolean
  onBlocksUpdate: (blocks: Block[]) => void
  userId: string
}

export default function BentoGrid({ blocks, isEditMode, onBlocksUpdate, userId }: BentoGridProps) {
  const [activeBlock, setActiveBlock] = useState<Block | null>(null)

  // Ensure blocks is always an array
  const safeBlocks = Array.isArray(blocks) ? blocks : []

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const block = safeBlocks.find(b => b.id === active.id)
    setActiveBlock(block || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveBlock(null)

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = safeBlocks.findIndex(block => block.id === active.id)
    const newIndex = safeBlocks.findIndex(block => block.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const newBlocks = [...safeBlocks]
      const [movedBlock] = newBlocks.splice(oldIndex, 1)
      newBlocks.splice(newIndex, 0, movedBlock)
      onBlocksUpdate(newBlocks)
    }
  }

  if (safeBlocks.length === 0) {
    return null
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={safeBlocks.map(b => b.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          {safeBlocks.map((block) => (
            <BentoBlock
              key={block.id}
              block={block}
              isEditMode={isEditMode}
              onUpdate={(updatedBlock) => {
                const newBlocks = safeBlocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
                onBlocksUpdate(newBlocks)
              }}
              onDelete={(blockId) => {
                const newBlocks = safeBlocks.filter(b => b.id !== blockId)
                onBlocksUpdate(newBlocks)
              }}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeBlock ? (
          <BentoBlock
            block={activeBlock}
            isEditMode={false}
            onUpdate={() => {}}
            onDelete={() => {}}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}