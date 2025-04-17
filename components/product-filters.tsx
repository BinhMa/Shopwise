"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ProductFiltersProps {
  minPrice: number
  maxPrice: number
  brands: string[]
  onPriceChange: (min: number, max: number) => void
  onBrandChange: (brands: string[]) => void
  onReset: () => void
}

export default function ProductFilters({
  minPrice,
  maxPrice,
  brands,
  onPriceChange,
  onBrandChange,
  onReset,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])

  // Initialize price range from props
  useEffect(() => {
    setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const handlePriceChange = (value: number[]) => {
    const [min, max] = value as [number, number]
    setPriceRange([min, max])
    onPriceChange(min, max)
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    let newSelectedBrands: string[]

    if (checked) {
      newSelectedBrands = [...selectedBrands, brand]
    } else {
      newSelectedBrands = selectedBrands.filter((b) => b !== brand)
    }

    setSelectedBrands(newSelectedBrands)
    onBrandChange(newSelectedBrands)
  }

  const handleReset = () => {
    setPriceRange([minPrice, maxPrice])
    setSelectedBrands([])
    onReset()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
          Reset Filters
        </Button>
      </div>

      <Accordion type="single" collapsible defaultValue="price">
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                value={priceRange}
                min={minPrice}
                max={maxPrice}
                step={1}
                onValueChange={handlePriceChange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="min-price">Min Price</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">$</span>
                    <Input
                      id="min-price"
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (value >= minPrice && value <= priceRange[1]) {
                          handlePriceChange([value, priceRange[1]])
                        }
                      }}
                      className="w-20"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max-price">Max Price</Label>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">$</span>
                    <Input
                      id="max-price"
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        if (value <= maxPrice && value >= priceRange[0]) {
                          handlePriceChange([priceRange[0], value])
                        }
                      }}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger>Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
