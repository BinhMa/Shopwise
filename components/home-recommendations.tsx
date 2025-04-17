"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { supabase, type Product } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function HomeRecommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null)
      try {
        const { data, error } = await supabase.from("products").select("*")

        if (error) {
          console.error("Error fetching products:", error)
          setError("Failed to load products. Please try again.")
          return
        }

        setProducts(data || [])

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data?.map((product) => product.category).filter(Boolean) as string[]),
        )
        setCategories(uniqueCategories)

        // Set initial recommendations (random products)
        const shuffled = [...(data || [])].sort(() => 0.5 - Math.random())
        setRecommendations(shuffled.slice(0, 4))
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleCategoryChange = (category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)

    try {
      let filteredProducts: Product[] = []

      if (category) {
        // Filter by selected category
        filteredProducts = products.filter((product) => product.category === category)
      } else {
        // Random selection if no category
        const shuffled = [...products].sort(() => 0.5 - Math.random())
        filteredProducts = shuffled
      }

      // Take up to 4 products
      setRecommendations(filteredProducts.slice(0, 4))
    } catch (error) {
      console.error("Error generating recommendations:", error)
      setError("Failed to generate recommendations. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="homeCategory">What type of shoes are you interested in?</Label>
          <Select value={selectedCategory || ""} onValueChange={handleCategoryChange}>
            <SelectTrigger id="homeCategory">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any type</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : recommendations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} showDetails={false} />
              ))}
            </div>
            <div className="text-center">
              <Button asChild variant="outline">
                <Link href="/recommendations">Get More Personalized Recommendations</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">No products found in this category</p>
            <Button onClick={() => handleCategoryChange("")}>Show All Products</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
