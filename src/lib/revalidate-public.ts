import { revalidatePath, revalidateTag } from 'next/cache'

export function revalidatePublicContent() {
  revalidateTag('products')
  revalidateTag('categories')
  revalidateTag('settings')
  revalidatePath('/')
  revalidatePath('/productos')
  revalidatePath('/categorias')
}
