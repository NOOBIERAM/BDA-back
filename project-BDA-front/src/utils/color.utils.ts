const hashValue = (value: string): number => {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash)
    hash |= 0
  }

  return Math.abs(hash)
}

export const getStableBackgroundColor = (value: string): string => {
  const hash = hashValue(value)
  const hue = hash % 360
  const saturation = 70
  const lightness = 90

  return `hsl(${hue} ${saturation}% ${lightness}%)`
}
