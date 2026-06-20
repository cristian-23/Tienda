import { headers } from 'next/headers'

export async function getDomainFromHeaders(): Promise<string> {
  const host = (await headers()).get('host') || ''
  
  if (host.includes('localhost')) {
    const parts = host.split('.')
    return (parts.length > 1 && parts[0] !== 'localhost') ? parts[0] : 'colchones'
  }
  
  const parts = host.split('.')
  if (parts.length > 2) {
    return parts[0]
  } else if (parts.length === 2 && !host.includes('vercel.app')) {
    return parts[0]
  }
  return parts[0] || 'colchones'
}
