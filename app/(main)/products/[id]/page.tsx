import { prisma } from "@/lib/prisma"
import ProductDetail from "@/components/product/product-detail"
import { notFound } from "next/navigation"

export default async function ProductIdPage({ params }: { params: { id: string } }) {
  const id = params.id

  const product = await prisma.product.findUnique({
    where: { id },
    include: { artist: true, collection: true },
  })

  if (!product) return notFound()

  // Serialize dates to strings (prisma returns Date objects)
  const safeProduct = {
    ...product,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        <ProductDetail product={safeProduct} />
      </div>
    </div>
  )
}
