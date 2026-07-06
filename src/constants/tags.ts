export const MAX_TAGS = 5
export const MAX_TAG_LENGTH = 30

export const MAX_TAGS_MESSAGE = `Maximum ${MAX_TAGS} tags allowed`

// Letters/numbers, with single spaces, hyphens or underscores between words.
export const TAG_NAME_REGEX = /^[\p{L}\p{N}]+(?:[ _-][\p{L}\p{N}]+)*$/u
