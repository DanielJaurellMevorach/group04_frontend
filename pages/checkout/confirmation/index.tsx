import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Download, Mail, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import { useEffect, useState } from "react"

export default function ConfirmationPage() {
  // const orderNumber = "NIMAH-2024-001234"
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

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

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0)
  const shipping = 25
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-[#F9F2EA]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h1 className="text-3xl font-light tracking-wider text-[#8A5A3B] mb-2">Order Confirmed!</h1>
            <p className="text-lg text-[#A67C52]">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-none bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-[#8A5A3B]">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* <div className="flex justify-between"> */}
                    {/* <span className="text-[#A67C52]">Order Number</span> */}
                    {/* <span className="text-[#8A5A3B] font-medium">{orderNumber}</span> */}
                  {/* </div> */}
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Order Date</span>
                    <span className="text-[#8A5A3B] font-medium">{orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Payment Method</span>
                    <span className="text-[#8A5A3B] font-medium">•••• •••• •••• 1234</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-[#A67C52]">Email</span>
                    <span className="text-[#8A5A3B] font-medium">customer@example.com</span>
                  </div> */}
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-none bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-[#8A5A3B] flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-[#8A5A3B] font-medium">John Doe</p>
                    {/* <p className="text-[#A67C52]">123 Art Street</p>
                    <p className="text-[#A67C52]">San Francisco, CA 94102</p> */}
                  </div>
                  <Separator className="bg-[#E8D7C9]" />
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Estimated Delivery</span>
                    <span className="text-[#8A5A3B] font-medium">July 15-17, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Tracking Number</span>
                    <span className="text-[#8A5A3B] font-medium">Will be provided via email</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-none bg-[#EFE6DC]">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#C8977F] mt-0.5" />
                    <div>
                      <h3 className="font-medium text-[#8A5A3B] mb-1">Confirmation Email Sent</h3>
                      <p className="text-sm text-[#A67C52]">
                        We've sent a confirmation email with your order details and tracking information to your email
                        address.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-none bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-[#8A5A3B]">Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems[0]?.map((item) => (
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
                        <p className="font-medium text-[#8A5A3B]">${item.artPiece.price}</p>
                      </div>
                    </div>
                  ))}

                  <Separator className="bg-[#E8D7C9]" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A67C52]">Subtotal</span>
                      <span className="text-[#8A5A3B]">${subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A67C52]">Shipping</span>
                      <span className="text-[#8A5A3B]">${shipping}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A67C52]">Tax</span>
                      <span className="text-[#8A5A3B]">${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-[#E8D7C9]" />
                    <div className="flex justify-between text-lg font-medium">
                      <span className="text-[#8A5A3B]">Total</span>
                      <span className="text-[#8A5A3B]">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {/* <Button className="w-full bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none py-6">
                  <Download className="h-5 w-5 mr-2" />
                  Download Receipt
                </Button> */}

                <Button
                  variant="outline"
                  className="w-full border-[#C8977F] text-[#C8977F] hover:bg-[#C8977F]/10 rounded-none py-6"
                  asChild
                >
                  <Link href="/gallery">Continue Shopping</Link>
                </Button>

                {/* <Button
                  variant="outline"
                  className="w-full border-[#C8977F] text-[#C8977F] hover:bg-[#C8977F]/10 rounded-none py-6"
                  asChild
                >
                  <Link href="/account/orders">View Order History</Link>
                </Button> */}
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <Card className="border-none shadow-sm rounded-none bg-white mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-[#8A5A3B]">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mx-auto mb-3">
                    <Package className="h-6 w-6 text-[#C8977F]" />
                  </div>
                  <h3 className="font-medium text-[#8A5A3B] mb-2">Order Processing</h3>
                  <p className="text-sm text-[#A67C52]">
                    Your order is being carefully prepared and will be shipped within 1-2 business days.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mx-auto mb-3">
                    <Mail className="h-6 w-6 text-[#C8977F]" />
                  </div>
                  <h3 className="font-medium text-[#8A5A3B] mb-2">Tracking Updates</h3>
                  <p className="text-sm text-[#A67C52]">
                    You'll receive email updates with tracking information once your order ships.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-[#C8977F]" />
                  </div>
                  <h3 className="font-medium text-[#8A5A3B] mb-2">Delivery</h3>
                  <p className="text-sm text-[#A67C52]">
                    Your artwork will be carefully packaged and delivered to your doorstep.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}