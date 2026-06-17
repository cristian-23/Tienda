export const APP_NAME = 'Colchones & Descanso'

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  ADMIN_PAGE_SIZE: 20,
} as const

export const WHATSAPP = {
  MESSAGE_TEMPLATE: 'Hola, estoy interesado en el siguiente producto:',
} as const

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/productos',
  CATEGORIES: '/categorias',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PRODUCTS: '/admin/productos',
    CATEGORIES: '/admin/categorias',
    SETTINGS: '/admin/configuracion',
  },
} as const
