export interface Product {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  images: string[]
  inStock: boolean
  stock: number
  featured: boolean
  category?: string
  features: string[]
  artistId: string
  collectionId?: string
  createdAt: Date
  updatedAt: Date
  artist: Artist
  collection?: Collection
}

export interface Artist {
  id: string
  name: string
  email: string
  bio?: string
  specialty?: string
  location?: string
  experience?: string
  image?: string
  featured: boolean
  awards: string[]
  createdAt: Date
  updatedAt: Date
  products?: Product[]
  collections?: Collection[]
}

export interface Collection {
  id: string
  name: string
  description?: string
  image?: string
  featured: boolean
  priceRange?: string
  artistId?: string
  createdAt: Date
  updatedAt: Date
  artist?: Artist
  products?: Product[]
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role: "CUSTOMER" | "ADMIN" | "ARTIST"
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  total: number
  subtotal: number
  tax: number
  shipping: number
  createdAt: Date
  updatedAt: Date
  user: User
  items: OrderItem[]
  address?: Address
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  createdAt: Date
  product: Product
}

export interface Address {
  id: string
  userId: string
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface CartItem {
  id: string
  name: string
  artist: string
  price: number
  image: string
  quantity: number
}
