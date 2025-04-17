"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface FeaturedProductProps {
  product: Product
}

export default function FeaturedProduct({ product }: FeaturedProductProps) {
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
      <div className="relative">
        <div className="aspect-[4/3] relative">
          <Image
            src={product.image_url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <Badge className="absolute top-3 right-3 bg-white text-black hover:bg-white">Featured</Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" asChild className="flex-1">
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
        <Button className="flex-1" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
