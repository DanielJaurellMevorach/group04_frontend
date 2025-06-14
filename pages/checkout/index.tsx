"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Lock, Shield, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutItem");
    const parsed = stored ? JSON.parse(stored) : [];
    setOrderItems(parsed);
  }, []);

  // const orderItems = [
  //   {
  //     id: 1,
  //     title: "Abstract Harmony",
  //     artist: "Amara Nwosu",
  //     price: 450,
  //     image: "/placeholder.svg?height=200&width=200&text=Abstract%20Harmony",
  //     quantity: 1,
  //   },
  //   {
  //     id: 2,
  //     title: "Urban Reflections",
  //     artist: "Marcus Chen",
  //     price: 320,
  //     image: "/placeholder.svg?height=200&width=200&text=Urban%20Reflections",
  //     quantity: 1,
  //   },
  // ]

  const formatPrice = (p: number | undefined | null) =>
    typeof p === 'number' && !isNaN(p)
      ? p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : '';

  const subtotal = orderItems
  .flat()
  .reduce((sum, item) => sum + (item.artPiece?.price || 0), 0);
  const shipping = 25
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to confirmation page
    window.location.href = "/checkout/confirmation"
  }

  return (
    <div className="min-h-screen bg-[#F9F2EA]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-[#A67C52]">
          <Link href="/gallery" className="hover:text-[#C8977F] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link href="/user-cart" className="hover:text-[#C8977F] transition-colors">
            Cart
          </Link>
          <span>/</span>
          <span className="text-[#8A5A3B] font-medium">Checkout</span>
        </div>

        {/* Back to Cart */}
        <Link
          href="/user-cart"
          className="inline-flex items-center gap-2 text-[#C8977F] hover:text-[#B78370] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-none bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-[#8A5A3B] flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-base font-medium text-[#8A5A3B] mb-4 block">Payment Method</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border border-[#E8D7C9] rounded-none">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-[#C8977F]" />
                        Credit / Debit Card
                      </Label>
                      <div className="flex gap-2">
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-[#E8D7C9] rounded-none">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                        PayPal
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-[#E8D7C9] rounded-none">
                      <RadioGroupItem value="apple" id="apple" />
                      <Label htmlFor="apple" className="flex items-center gap-2 cursor-pointer flex-1">
                        Apple Pay
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-[#E8D7C9] rounded-none">
                      <RadioGroupItem value="google" id="google" />
                      <Label htmlFor="google" className="flex items-center gap-2 cursor-pointer flex-1">
                        Google Pay
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Card Details Form */}
                {paymentMethod === "card" && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="text-[#8A5A3B]">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="text-[#8A5A3B]">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-[#8A5A3B]">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName" className="text-[#8A5A3B]">
                        Cardholder Name
                      </Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                        required
                      />
                    </div>
                  </form>
                )}

                {/* Digital Wallet Buttons */}
                {paymentMethod !== "card" && (
                  <div className="space-y-3">
                    {paymentMethod === "paypal" && (
                      <Button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white rounded-none py-6"
                      >
                        {isProcessing ? "Processing..." : "Continue with PayPal"}
                      </Button>
                    )}
                    {paymentMethod === "apple" && (
                      <Button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="w-full bg-black hover:bg-gray-800 text-white rounded-none py-6"
                      >
                        {isProcessing ? "Processing..." : "Pay with Apple Pay"}
                      </Button>
                    )}
                    {paymentMethod === "google" && (
                      <Button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white rounded-none py-6"
                      >
                        {isProcessing ? "Processing..." : "Pay with Google Pay"}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card className="border-none shadow-sm rounded-none bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-[#8A5A3B]">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-[#8A5A3B]">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-[#8A5A3B]">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-[#8A5A3B]">
                    Address
                  </Label>
                  <Input
                    id="address"
                    className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-[#8A5A3B]">
                      City
                    </Label>
                    <Input
                      id="city"
                      className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-[#8A5A3B]">
                      State
                    </Label>
                    <Select>
                      <SelectTrigger className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zip" className="text-[#8A5A3B]">
                      ZIP Code
                    </Label>
                    <Input
                      id="zip"
                      className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F]"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-none bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-[#8A5A3B]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems[0]?.map((item : any) => (
                  
                  <div key={item.artPiece.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-[#EFE6DC] rounded-none overflow-hidden">
                    <img
                    src={item.artPiece.url}
                    alt={`${item.artPiece.title}`}
                    className=""
                    style={{objectFit:"cover"}}
                  />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#8A5A3B]">{item.artPiece.title}</h3>
                      <p className="text-sm text-[#A67C52]">by {item.artPiece.artist}</p>
                      {/* <p className="text-sm text-[#A67C52]">Qty: {item.quantity}</p> */}
                    </div>
                    <div className="text-right">
                      {/* <p className="font-medium text-[#8A5A3B]">${item.artPiece.price}</p> */}
                      <p className="font-medium text-[#8A5A3B]">€{formatPrice(item.artPiece.price)}</p>
                    </div>
                  </div>
                ))}

                <Separator className="bg-[#E8D7C9]" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A67C52]">Subtotal</span>
                    <span className="text-[#8A5A3B]">€{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A67C52]">Shipping</span>
                    <span className="text-[#8A5A3B]">€{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A67C52]">Tax</span>
                    <span className="text-[#8A5A3B]">€{formatPrice(tax)}</span>
                  </div>
                  <Separator className="bg-[#E8D7C9]" />
                  <div className="flex justify-between text-lg font-medium">
                    <span className="text-[#8A5A3B]">Total</span>
                    <span className="text-[#8A5A3B]">€{formatPrice(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="border-none shadow-sm rounded-none bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-medium text-[#8A5A3B] flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Estimated Delivery</span>
                    <span className="text-[#8A5A3B] font-medium">5-7 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Shipping Method</span>
                    <span className="text-[#8A5A3B] font-medium">Standard Shipping</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Tracking</span>
                    <span className="text-[#8A5A3B] font-medium">Included</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-none shadow-sm rounded-none bg-[#EFE6DC]">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-[#C8977F] mt-0.5" />
                  <div>
                    <h3 className="font-medium text-[#8A5A3B] mb-1">Secure Payment</h3>
                    <p className="text-sm text-[#A67C52]">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complete Order Button */}
            {paymentMethod === "card" && (
              <Button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none py-6 text-lg"
              >
                {/* {isProcessing ? "Processing Payment..." : `Complete Order - $${total.toFixed(2)}`} */}
                {isProcessing ? "Processing Payment..." : `Complete Order - €${formatPrice(total)}`}
              </Button>
            )}

            <p className="text-xs text-[#A67C52] text-center">
              By completing your order, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[#C8977F]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-[#C8977F]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}