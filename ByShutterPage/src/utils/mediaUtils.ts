export function getMediaUrlPath(fileName: string) {
  return `${import.meta.env.VITE_IMAGE_SOURCE_ORIGIN}${encodeURIComponent(fileName)}`
}
