'use client'

import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tag } from '@/components/ui/tag'
import { MAX_TAG_LENGTH, MAX_TAGS, TAG_NAME_REGEX } from '@/constants/tags'
import { TAG_MESSAGES } from '@/constants/messages'

const MAX_SUGGESTIONS = 6

interface TagsInputProps {
  label?: string
  value: string[]
  onChange: (tags: string[]) => void
  inputValue: string
  onInputChange: (value: string) => void
  suggestions?: string[]
}

export function TagsInput({
  label = 'Tags',
  value,
  onChange,
  inputValue,
  onInputChange,
  suggestions = [],
}: TagsInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const isAtLimit = value.length >= MAX_TAGS

  const query = inputValue.trim().toLowerCase()
  const matchingSuggestions =
    query && !isAtLimit
      ? suggestions
          .filter((tag) => tag.includes(query) && !value.includes(tag))
          .slice(0, MAX_SUGGESTIONS)
      : []

  function addTag(rawTag = inputValue) {
    const newTag = rawTag.trim().toLowerCase()
    if (!newTag || isAtLimit) return
    if (value.includes(newTag)) {
      setError(TAG_MESSAGES.ALREADY_ADDED)
      return
    }
    if (!TAG_NAME_REGEX.test(newTag)) {
      setError(TAG_MESSAGES.INVALID)
      return
    }
    setError(null)
    onChange([...value, newTag])
    onInputChange('')
    inputRef.current?.focus()
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tag-input">{label}</Label>
      <Input
        ref={inputRef}
        id="tag-input"
        value={inputValue}
        onChange={(e) => {
          onInputChange(e.target.value)
          if (error) setError(null)
        }}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag and press Enter"
        maxLength={MAX_TAG_LENGTH}
        disabled={isAtLimit}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {isAtLimit && (
        <p className="text-xs text-muted-foreground">Maximum {MAX_TAGS} tags reached</p>
      )}
      {matchingSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground">Suggestions:</span>
          {matchingSuggestions.map((tag) => (
            <Tag key={tag} label={tag} onClick={() => addTag(tag)} />
          ))}
        </div>
      )}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((tag) => (
            <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} />
          ))}
        </div>
      )}
    </div>
  )
}
