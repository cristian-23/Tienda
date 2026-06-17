export type ImageDTO = {
  id: string
  url: string
  order: number
}

export type ReorderImagesInput = {
  productId: string
  imageIds: string[]
}

export type UploadImageResult = {
  url: string
  imageId: string
}
