"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface ProductCardProps {
  product: Product
  showDetails?: boolean
}

export default function ProductCard({ product, showDetails = true }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem(product, 1)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    })
  }

  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-square relative h-40 sm:h-48">
        <Image
          src={product.image_url || "/placeholder.svg?height=300&width=300"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <CardHeader className="p-3">
        <CardTitle className="text-base">{product.name}</CardTitle>
        <p className="font-bold text-base">${product.price.toFixed(2)}</p>
      </CardHeader>
      {showDetails && (
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        </CardContent>
      )}
      <CardFooter className="p-3 flex gap-2">
        <Button variant="outline" className="flex-1 text-xs h-8" asChild>
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
        <Button className="flex-1 text-xs h-8" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
