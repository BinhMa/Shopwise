"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import FeaturedProduct from "@/components/featured-product"
import ProductCard from "@/components/product-card"
import ProductFiltersHome from "@/components/product-filters-home"
import { supabase, type Product } from "@/lib/supabase"
import { ArrowRight, Loader2 } from "lucide-react"
import HomeRecommendations from "@/components/home-recommendations"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase.from("products").select("*")

        if (error) {
          console.error("Error fetching products:", error)
          setError("Failed to load products. Please try again.")
          return
        }

        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    products.forEach((product) => {
      if (product.category) {
        categorySet.add(product.category)
      }
    })
    return Array.from(categorySet)
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Apply sorting
    if (selectedSort) {
      if (selectedSort === "price-asc") {
        result.sort((a, b) => a.price - b.price)
      } else if (selectedSort === "price-desc") {
        result.sort((a, b) => b.price - a.price)
      }
    }

    return result
  }, [products, selectedCategory, selectedSort])

  // Get featured products (first 3)
  const featuredProducts = useMemo(() => {
    return filteredProducts.slice(0, 3)
  }, [filteredProducts])

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">ShopWise – AI with Shopping</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Welcome to ShopWise – where AI helps you find the perfect shoes!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/recommendations">Get AI Recommendations</Link>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Product Filters */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Shop Our Collection</h2>
        <ProductFiltersHome
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSelectedSort}
        />
      </div>

      {/* Featured Products Section */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-gray-500 mt-2">
              {selectedCategory
                ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} shoes`
                : "Check out our most popular shoes"}
            </p>
          </div>
          <Button asChild variant="ghost" className="gap-1">
            <Link href="/products">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="transform transition-transform hover:scale-105">
                <FeaturedProduct product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-gray-500 mb-4">Try adjusting your filters or check back later</p>
            <Button
              onClick={() => {
                setSelectedCategory(null)
                setSelectedSort(null)
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* All Products Section */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">All Products</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-12 w-12 animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.slice(3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-gray-500 mb-4">Try adjusting your filters or check back later</p>
            <Button
              onClick={() => {
                setSelectedCategory(null)
                setSelectedSort(null)
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* AI Recommendations Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Personalized Recommendations</h2>
        <HomeRecommendations />
      </div>

      {/* AI Shopping Assistant Section */}
      <div className="bg-gray-50 p-8 rounded-xl">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">AI Shopping Assistant</h2>
            <p className="text-lg mb-6">
              Not sure what you're looking for? Our AI assistant can help recommend the perfect shoes based on your
              preferences and needs.
            </p>
            <Button asChild size="lg">
              <Link href="/recommendations">Try AI Recommendations</Link>
            </Button>
          </div>
          <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="italic">
                "I need comfortable running shoes for daily jogging, preferably with good arch support."
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-bold">AI</span>
              </div>
              <p>Based on your needs, I recommend the Running Pro Max with advanced cushioning technology.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
