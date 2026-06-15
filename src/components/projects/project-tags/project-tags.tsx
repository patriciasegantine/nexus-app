'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react"
import { Loader2, Plus } from "lucide-react"
import { addProjectTag, removeProjectTag } from "@/actions/projects"
import { MAX_TAG_LENGTH, MAX_TAGS } from "@/constants/tags"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"
import { toast } from "@/hooks/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const TAG_GAP = 4
const OVERFLOW_TRIGGER_WIDTH = 32

interface ProjectTagsProps {
  projectId: string
  tags: string[]
  onTagClick?: (tag: string) => void
}

export function ProjectTags({ projectId, tags, onTagClick }: ProjectTagsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measurementRef = useRef<HTMLDivElement>(null)
  const [currentTags, setCurrentTags] = useState(tags)
  const [visibleCount, setVisibleCount] = useState(0)
  const [tagsOpen, setTagsOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setCurrentTags(tags)
  }, [tags])

  const updateVisibleCount = useCallback(() => {
    const container = containerRef.current
    const measurement = measurementRef.current
    if (!container || !measurement) return

    const tagWidths = Array.from(measurement.children).map(
      (el) => el.getBoundingClientRect().width,
    )

    const allWidth = tagWidths.reduce((total, w, i) => total + w + (i > 0 ? TAG_GAP : 0), 0)
    if (allWidth <= container.clientWidth) {
      setVisibleCount(tagWidths.length)
      return
    }

    let used = OVERFLOW_TRIGGER_WIDTH
    let count = 0
    for (const w of tagWidths) {
      if (used + w + TAG_GAP > container.clientWidth) break
      used += w + TAG_GAP
      count++
    }
    setVisibleCount(count)
  }, [])

  useLayoutEffect(() => {
    updateVisibleCount()
    const ro = new ResizeObserver(updateVisibleCount)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [currentTags, updateVisibleCount])

  const hiddenCount = currentTags.length - visibleCount
  const canAddTag = currentTags.length < MAX_TAGS

  function handleTagClick(tag: string) {
    setTagsOpen(false)
    onTagClick?.(tag)
  }

  function handleRemoveTag(tag: string) {
    startTransition(async () => {
      const result = await removeProjectTag(projectId, tag)
      if (!result.success) {
        toast({ title: result.error, variant: "destructive" })
        return
      }
      setCurrentTags(result.data)
    })
  }

  function handleAddTag() {
    const tag = tagInput.trim().toLowerCase()
    if (!tag) return

    startTransition(async () => {
      const result = await addProjectTag(projectId, tag)
      if (!result.success) {
        toast({ title: result.error, variant: "destructive" })
        return
      }
      setCurrentTags(result.data)
      setTagInput("")
      setAddOpen(false)
      toast({ title: "Tag added." })
    })
  }

  return (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-1">
        {canAddTag && (
          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:bg-muted hover:text-foreground"
                      aria-label="Add tag"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">Add tag</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent align="start" className="w-64 space-y-3 p-3">
              <div>
                <p className="text-sm font-medium">Add tag</p>
                <p className="text-xs text-muted-foreground">
                  {currentTags.length} of {MAX_TAGS} tags used
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); handleAddTag() }
                  }}
                  placeholder="Tag name"
                  maxLength={MAX_TAG_LENGTH}
                  disabled={isPending}
                  autoFocus
                />
                <Button
                  size="icon"
                  className="shrink-0"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || isPending}
                  aria-label="Save tag"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <div ref={containerRef} className="flex min-w-0 flex-1 items-center gap-1">
          {currentTags.slice(0, visibleCount).map((tag) => (
            <Tag
              key={tag}
              label={tag}
              onClick={onTagClick ? (e) => { e.stopPropagation(); handleTagClick(tag) } : undefined}
              onRemove={() => handleRemoveTag(tag)}
              removePosition="corner"
              className="max-w-[110px] shrink-0"
            />
          ))}

          {hiddenCount > 0 && (
            <Popover open={tagsOpen} onOpenChange={setTagsOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-8 shrink-0 rounded-full py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={`Show all ${currentTags.length} tags`}
                >
                  +{hiddenCount}
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 space-y-2 p-3">
                <p className="text-xs font-medium text-muted-foreground">All tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentTags.map((tag) => (
                    <Tag
                      key={tag}
                      label={tag}
                      onClick={onTagClick ? () => handleTagClick(tag) : undefined}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div
        ref={measurementRef}
        className="pointer-events-none fixed -left-[9999px] top-0 flex items-center gap-1 opacity-0"
        aria-hidden="true"
      >
        {currentTags.map((tag) => (
          <Tag key={tag} label={tag} className="max-w-[110px] shrink-0" />
        ))}
      </div>
    </>
  )
}
