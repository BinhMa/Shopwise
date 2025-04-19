"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, isLoading, checkout } = useCart()
  const { user } = useAuth()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false)
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<"shipping" | "confirmation">("shipping")
  const [orderId, setOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Vietnam",
    paymentMethod: "cod",
  })

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentMethodChange = (value: string) => {
    setShippingInfo((prev) => ({ ...prev, paymentMethod: value }))
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to checkout",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    setShowCheckoutDialog(true)
    setCheckoutStep("shipping")
    setError(null)
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate shipping info
    if (
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required shipping information",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)
    setError(null)

    try {
      // Process checkout
      const result = await checkout()

      if (!result.success) {
        setError(result.error || "Checkout failed. Please try again.")
        setIsCheckingOut(false)
        return
      }

      // Set order ID for confirmation
      setOrderId(result.orderId || null)

      // Show confirmation
      setCheckoutStep("confirmation")
      setIsCheckoutComplete(true)

      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed and is being processed.",
      })
    } catch (error) {
      console.error("Error during checkout:", error)
      setError("There was an error processing your order. Please try again.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleCloseCheckout = () => {
    if (isCheckoutComplete) {
      setShowCheckoutDialog(false)
      router.push("/orders")
    } else {
      setShowCheckoutDialog(false)
    }
  }

  // Calculate additional costs
  const shipping = subtotal > 0 ? 10 : 0
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id || item.product_id} className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product?.image_url || "/placeholder.svg?height=300&width=300"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium">{item.product?.name}</h3>
                    <p className="text-sm text-gray-500">${item.product?.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product_id, Number.parseInt(e.target.value) || 1)}
                      className="w-14 h-8 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-medium">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500"
                    onClick={() => removeItem(item.product_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => clearCart()}>
                Clear Cart
              </Button>
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut || !user}>
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
            </CardFooter>
          </Card>
          {!user && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 mb-2">Please log in to complete your purchase</p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={handleCloseCheckout}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {checkoutStep === "shipping" && "Shipping Information"}
              {checkoutStep === "confirmation" && "Order Confirmation"}
            </DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {checkoutStep === "shipping" && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingInfoChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingInfoChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={shippingInfo.city} onChange={handleShippingInfoChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingInfoChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method *</Label>
                <RadioGroup
                  value={shippingInfo.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="flex flex-col space-y-2 mt-2"
                >
                  <div className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery (COD)</div>
                      <div className="text-sm text-gray-500">Pay with cash when your order is delivered</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">
                  Your order will be processed and delivered within 3-5 business days.
                </p>
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={handleCloseCheckout}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCheckingOut}>
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}

          {checkoutStep === "confirmation" && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
                <p className="text-gray-500 mb-4">
                  Your order has been placed successfully. We'll send you an email confirmation shortly.
                </p>
                <div className="bg-gray-50 p-4 rounded-md w-full">
                  <p className="font-medium">Order ID: {orderId}</p>
                  <p className="text-sm text-gray-500">Please save this for your reference</p>
                  <p className="text-sm text-gray-500 mt-2">Payment Method: Cash on Delivery (COD)</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCloseCheckout}>View My Orders</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
