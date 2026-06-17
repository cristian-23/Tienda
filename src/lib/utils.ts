export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
  }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '')
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}

export function buildWhatsAppProductMessage(
  productName: string,
  productPrice: number,
  productUrl?: string
): string {
  let msg = `Hola, estoy interesado en el siguiente producto:\n\n` +
    `Nombre: ${productName}\n` +
    `Precio: Bs. ${productPrice.toFixed(2)}\n\n`
    
  if (productUrl) {
    msg += `Enlace: ${productUrl}\n\n`
  }
  
  msg += `¿Podrían brindarme más información?`
  
  return msg
}
