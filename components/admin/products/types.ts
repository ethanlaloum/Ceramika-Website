export interface Artist {
  id: string
  name: string
  bio?: string
  image?: string
}

export interface Collection {
  id: string
  name: string
  description?: string
  image?: string
  artist?: Artist
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  stock: number
  category?: string
  features: string[]
  images: string[]
  artist: Artist
  collection?: Collection
}

export interface ProductFormData {
  name: string
  description: string
  category: string
  price: number
  originalPrice: number
  stock: number
  artistId: string
  collectionId: string
  features: string
  images?: string[]
}