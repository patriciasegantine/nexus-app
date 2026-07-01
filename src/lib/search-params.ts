export type SearchParams = { [key: string]: string | string[] | undefined }

export function getStringParam(params: SearchParams, key: string): string | undefined {
  const value = params[key]
  return typeof value === "string" && value ? value : undefined
}

export function getValidatedParam<T extends string>(
  params: SearchParams,
  key: string,
  validValues: Set<T>
): T | undefined {
  const value = getStringParam(params, key)
  return value && validValues.has(value as T) ? (value as T) : undefined
}
