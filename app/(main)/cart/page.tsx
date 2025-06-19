"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ArrowLeft, ShoppingBag, Heart, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { FadeIn, Stagger, HoverScale } from "@/components/animations"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, tax, shipping, total, itemCount, addToCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [quantities, setQuantities] = useState<{[key: string]: string}>({})

  // Initialiser les valeurs de quantité au chargement des items
  useEffect(() => {
    const initialQuantities: {[key: string]: string} = {};
    items.forEach(item => {
      initialQuantities[item.productId] = item.quantity.toString();
    });
    setQuantities(initialQuantities);
  }, [items]);

  // Gérer le changement de valeur dans l'input
  const handleQuantityChange = (productId: string, value: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  // Mettre à jour la quantité après validation
  const handleQuantityUpdate = (productId: string, value: string) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(productId, quantity);
    } else {
      // Réinitialiser à la quantité actuelle si valeur invalide
      const currentItem = items.find(item => item.productId === productId);
      if (currentItem) {
        setQuantities(prev => ({
          ...prev,
          [productId]: currentItem.quantity.toString()
        }));
      }
    }
  };

  const finalTotal = total

  const suggestedProducts = [
    {
      id: 4,
      name: "Ceramic Mug Set",
      artist: "Elena Vasquez",
      price: 65,
      image: "/images/ceramic-mug-set.png",
    },
    {
      id: 5,
      name: "Serving Bowl",
      artist: "Marcus Chen",
      price: 89,
      image: "/images/contemporary-serving-bowl.png",
    },
    {
      id: 6,
      name: "Dinner Plate Set",
      artist: "Sofia Andersson",
      price: 145,
      image: "/images/botanical-dinner-set.png",
    },
  ]

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-20">
        <div className="container mx-auto px-4 py-16">
          <FadeIn>
            <div className="text-center max-w-md mx-auto">
              <ShoppingBag className="h-24 w-24 text-stone-300 dark:text-stone-600 mx-auto mb-6" />
              <h1 className="font-playfair text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4">
                Votre panier est vide
              </h1>
              <p className="text-stone-600 dark:text-stone-300 mb-8">
                Découvrez nos magnifiques collections de céramiques et ajoutez une touche artistique à votre intérieur.
              </p>
              <Button asChild size="lg" className="hover:scale-105 transition-transform duration-300">
                <Link href="/">Continuer les Achats</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2">
                Panier d'Achats
              </h1>
              <p className="text-stone-600 dark:text-stone-300">
                {itemCount} {itemCount === 1 ? "article" : "articles"} dans votre panier
              </p>
            </div>
            <Button variant="outline" asChild className="hover:scale-105 transition-transform duration-300">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuer les Achats
              </Link>
            </Button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Stagger staggerDelay={0.1}>
              {items.map((item) => (
                <HoverScale key={item.id} scale={1.01}>
                  <Card className="overflow-hidden bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                          <Image 
                            src={item.product.images[0] || "/placeholder.svg"} 
                            alt={item.product.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg text-stone-800 dark:text-stone-100 mb-1">
                            {item.product.name}
                          </h3>
                          <p className="text-stone-600 dark:text-stone-400 text-sm mb-2">
                            par {item.product.artist.name}
                          </p>
                          <p className="font-bold text-xl text-stone-800 dark:text-stone-100">
                            {item.product.price.toFixed(2)}€
                          </p>
                        </div>

                        <div className="flex flex-col items-end space-y-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 hover:scale-110 transition-transform duration-200"
                              onClick={() => {
                                const newQty = Math.max(1, item.quantity - 1);
                                updateQuantity(item.productId, newQty);
                                setQuantities(prev => ({...prev, [item.productId]: newQty.toString()}));
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={quantities[item.productId] || item.quantity.toString()}
                              onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                              onBlur={(e) => handleQuantityUpdate(item.productId, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.currentTarget.blur();
                                }
                              }}
                              className="w-16 h-8 text-center font-medium text-stone-800 dark:text-stone-100 px-2"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 hover:scale-110 transition-transform duration-200"
                              onClick={() => {
                                const newQty = item.quantity + 1;
                                updateQuantity(item.productId, newQty);
                                setQuantities(prev => ({...prev, [item.productId]: newQty.toString()}));
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Actions */}
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:scale-110 transition-all duration-200"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <p className="font-bold text-lg text-stone-800 dark:text-stone-100">
                            {(item.product.price * item.quantity).toFixed(2)}€
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverScale>
              ))}
            </Stagger>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <FadeIn delay={0.3}>
              <Card className="bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg text-stone-800 dark:text-stone-100 mb-4">Résumé de la commande</h2>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-stone-600 dark:text-stone-300">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-stone-600 dark:text-stone-300">
                      <span>Livraison (0,40€ par pièce)</span>
                      <span>
                        {shipping.toFixed(2)}€
                      </span>
                    </div>
                    {/* La TVA est retirée de l'affichage comme demandé */}
                    <div className="border-t border-stone-200 dark:border-stone-700 pt-3">
                      <div className="flex justify-between text-lg font-bold text-stone-800 dark:text-stone-100">
                        <span>Total</span>
                        <span>{finalTotal.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full mb-4 bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-200 hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    Procéder au Paiement
                  </Button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 text-xs text-stone-600 dark:text-stone-400">
                    <div className="flex flex-col items-center text-center">
                      <Truck className="h-4 w-4 mb-1" />
                      <span>Livraison Gratuite</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Shield className="h-4 w-4 mb-1" />
                      <span>Paiement Sécurisé</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <RotateCcw className="h-4 w-4 mb-1" />
                      <span>Retours Faciles</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>

        {/* Suggested Products */}
        <FadeIn delay={0.6}>
          <div className="mt-16">
            <h2 className="font-playfair text-2xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center">
              Vous aimerez aussi
            </h2>
            <Stagger staggerDelay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedProducts.map((product) => (
                <HoverScale key={product.id} scale={1.03}>
                  <Card className="group cursor-pointer bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-stone-800 dark:text-stone-100 mb-1">{product.name}</h3>
                        <p className="text-stone-600 dark:text-stone-400 text-sm mb-2">par {product.artist}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-stone-800 dark:text-stone-100">{product.price}€</p>
                          <Button
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                            onClick={() => addToCart(product.id.toString())}
                          >
                            Ajouter au Panier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverScale>
              ))}
            </Stagger>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
