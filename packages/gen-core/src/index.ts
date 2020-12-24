/** Returns a random item from a given array */
export const getRandomItemFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(arr.length * Math.random())]

/** Returns a prefixed and/or suffixed string */
const withPrefixSuffix = (prefix?: string, suffix?: string) => (item: string) =>
  [prefix ?? '', item ?? '', suffix].filter(Boolean).join(' ')

export interface GenerateNameProps {
  prefix?: string
  suffix?: string
}
export const createNameGenerator = (items: string[]) => (
  props?: GenerateNameProps
) => {
  return withPrefixSuffix(
    props?.prefix,
    props?.suffix
  )(getRandomItemFromArray(items))
}
