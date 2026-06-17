import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

export async function uploadImage(
  file: File,
  folder = 'colchones'
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          reject(new Error('Error al subir la imagen'))
          return
        }
        resolve(result.secure_url)
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteImage(url: string): Promise<void> {
  const publicId = extractPublicId(url)
  if (!publicId) return

  await cloudinary.uploader.destroy(publicId)
}

function extractPublicId(url: string): string | null {
  const regex = /\/v\d+\/(.+)\.\w+$/
  const match = url.match(regex)
  return match ? match[1] : null
}
