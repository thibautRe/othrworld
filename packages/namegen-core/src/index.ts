/** Returns a random item from a given array */
const getRandomItemFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(arr.length * Math.random())]

/** Returns a prefixed and/or suffixed string */
const withPrefixSuffix = (prefix?: string, suffix?: string) => (item: string) =>
  [prefix ?? '', item ?? '', suffix].filter(Boolean).join(' ')

export interface GenerateProps {
  prefix?: string
  suffix?: string
}
export const createGenerator = (items: string[]) => ({
  prefix,
  suffix,
}: GenerateProps) => {
  return withPrefixSuffix(prefix, suffix)(getRandomItemFromArray(items))
}
