import { Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function EmptyState() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Package className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
        <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
      </CardContent>
    </Card>
  )
}
