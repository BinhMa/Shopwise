"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface ProductFiltersHomeProps {
  categories: string[]
  onCategoryChange: (category: string | null) => void
  onSortChange: (sort: string | null) => void
}

export default function ProductFiltersHome({ categories, onCategoryChange, onSortChange }: ProductFiltersHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSort, setSelectedSort] = useState<string | null>(null)

  const handleCategoryChange = (value: string) => {
    const category = value === "all" ? null : value
    setSelectedCategory(category)
    onCategoryChange(category)
  }

  const handleSortChange = (value: string) => {
    const sort = value === "default" ? null : value
    setSelectedSort(sort)
    onSortChange(sort)
  }

  const handleReset = () => {
    setSelectedCategory(null)
    setSelectedSort(null)
    onCategoryChange(null)
    onSortChange(null)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3">
            <Label htmlFor="category" className="mb-2 block">
              Category
            </Label>
            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3">
            <Label htmlFor="sort" className="mb-2 block">
              Sort By
            </Label>
            <Select value={selectedSort || "default"} onValueChange={handleSortChange}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3">
            <Button variant="outline" onClick={handleReset} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
