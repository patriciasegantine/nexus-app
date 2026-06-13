'use client'

import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { Tag } from "@/components/ui/tag"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const TAG_GAP = 4
const OVERFLOW_TRIGGER_WIDTH = 32

interface TaskTagsProps {
  tags: string[]
  onTagClick?: (tag: string) => void
}

export function getVisibleTagCount(tagWidths: number[], availableWidth: number) {
  const allTagsWidth = tagWidths.reduce(
    (total, width, index) => total + width + (index > 0 ? TAG_GAP : 0),
    0,
  )

  if (allTagsWidth <= availableWidth) return tagWidths.length

  let usedWidth = OVERFLOW_TRIGGER_WIDTH
  let visibleCount = 0

  for (const width of tagWidths) {
    const nextWidth = usedWidth + width + TAG_GAP
    if (nextWidth > availableWidth) break
    usedWidth = nextWidth
    visibleCount += 1
  }

  return visibleCount
}

export function TaskTags({ tags, onTagClick }: TaskTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measurementRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(tags.length)
  const [tagsOpen, setTagsOpen] = useState(false)

  const updateVisibleCount = useCallback(() => {
    const container = containerRef.current
    const measurement = measurementRef.current
    if (!container || !measurement) return

    const tagWidths = Array.from(measurement.children).map(
      (element) => element.getBoundingClientRect().width,
    )
    setVisibleCount(getVisibleTagCount(tagWidths, container.clientWidth))
  }, [])

  useLayoutEffect(() => {
    updateVisibleCount()

    const resizeObserver = new ResizeObserver(updateVisibleCount)
    if (containerRef.current) resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [tags, updateVisibleCount])

  const hiddenCount = tags.length - visibleCount

  function handleTagClick(tag: string) {
    setTagsOpen(false)
    onTagClick?.(tag)
  }

  return (
    <>
      <div
        ref={containerRef}
        className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden"
      >
        {tags.slice(0, visibleCount).map((tag) => (
          <Tag
            key={tag}
            label={tag}
            onClick={onTagClick ? (event) => {
              event.stopPropagation()
              handleTagClick(tag)
            } : undefined}
            className="max-w-[110px] shrink-0"
          />
        ))}

        {hiddenCount > 0 && (
          <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-8 shrink-0 rounded-full py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={(event) => event.stopPropagation()}
                aria-label={`Show all ${tags.length} tags`}
              >
                +{hiddenCount}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-56 space-y-2 p-3"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="text-xs font-medium text-muted-foreground">All tags</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    label={tag}
                    onClick={onTagClick ? (event) => {
                      event.stopPropagation()
                      handleTagClick(tag)
                    } : undefined}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div
        ref={measurementRef}
        className="pointer-events-none fixed -left-[9999px] top-0 flex items-center gap-1 opacity-0"
        aria-hidden="true"
      >
        {tags.map((tag) => (
          <Tag key={tag} label={tag} className="max-w-[110px] shrink-0" />
        ))}
      </div>
    </>
  )
}
