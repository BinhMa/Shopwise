"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ProductCard from "@/components/product-card"
import { supabase, type Product } from "@/lib/supabase"
import { Loader2, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RecommendationsPage() {
  const [userInput, setUserInput] = useState("")
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null)
      try {
        const { data, error } = await supabase.from("products").select("*")

        if (error) {
          console.error("Error fetching products:", error)
          setError(`Failed to fetch products: ${error.message}`)
          return
        }

        if (!data || data.length === 0) {
          setError("No products found in the database. Please add some products first.")
          setProducts([])
          return
        }

        setProducts(data)

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((product) => product.category).filter(Boolean) as string[]),
        )
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("An unexpected error occurred while fetching products.")
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim() && !selectedCategory) return

    setIsLoading(true)
    setError(null)

    try {
      // Extract keywords from user input
      const input = userInput.toLowerCase()
      const keywords = extractKeywords(input)

      // Search for products matching keywords and/or category
      let matchedProducts: Product[] = []

      if (selectedCategory) {
        // Filter by selected category
        matchedProducts = products.filter((product) => product.category === selectedCategory)

        // If there are also keywords, further filter the results
        if (keywords.length > 0) {
          matchedProducts = matchedProducts.filter((product) => {
            const productName = product.name.toLowerCase()
            const productDesc = (product.description || "").toLowerCase()

            // Check if any keyword matches
            return keywords.some((keyword) => productName.includes(keyword) || productDesc.includes(keyword))
          })
        }
      } else if (keywords.length > 0) {
        // Search by keywords only if no category is selected
        matchedProducts = products.filter((product) => {
          const productName = product.name.toLowerCase()
          const productDesc = (product.description || "").toLowerCase()

          // Check if any keyword matches
          return keywords.some((keyword) => productName.includes(keyword) || productDesc.includes(keyword))
        })
      }

      // If no matches found, return some random products from the selected category or all products
      if (matchedProducts.length === 0) {
        if (selectedCategory) {
          matchedProducts = products.filter((product) => product.category === selectedCategory)
        }

        if (matchedProducts.length === 0) {
          const shuffled = [...products].sort(() => 0.5 - Math.random())
          matchedProducts = shuffled.slice(0, 3)
        }
      }

      setRecommendations(matchedProducts)
    } catch (error) {
      console.error("Error generating recommendations:", error)
      setError("An error occurred while generating recommendations.")
    } finally {
      setIsLoading(false)
    }
  }

  // Extract meaningful keywords from user input
  const extractKeywords = (input: string): string[] => {
    // Common shoe-related keywords
    const shoeKeywords = [
      "running",
      "casual",
      "formal",
      "sports",
      "athletic",
      "walking",
      "hiking",
      "outdoor",
      "sneakers",
      "boots",
      "sandals",
      "comfortable",
      "leather",
      "canvas",
      "waterproof",
      "breathable",
      "lightweight",
      "durable",
      "stylish",
      "fashion",
      "trendy",
      "classic",
      "modern",
      "work",
      "office",
      "gym",
      "training",
      "jogging",
      "trail",
    ]

    // Find matching keywords in the input
    return shoeKeywords.filter((keyword) => input.includes(keyword))
  }

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Product Recommendations</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">What type of shoes are you looking for?</Label>
              <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any type</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userInput">Tell us more about what you're looking for:</Label>
              <Textarea
                id="userInput"
                placeholder="Example: I need comfortable running shoes for daily jogging"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={isLoading || products.length === 0} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding products...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center my-8">
          <Loader2 className="h-12 w-12 animate-spin" />
        </div>
      )}

      {!isLoading && recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
