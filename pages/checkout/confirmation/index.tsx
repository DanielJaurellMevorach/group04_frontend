import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Download, Mail, Package, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/navbar"
import { useEffect, useState } from "react"
import artPieceService from "@/services/artPiece.service"

export default function ConfirmationPage() {
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const [shipping, setShipping] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number>(0); 
  const [total, setTotal] = useState<number>(0);

  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [transferStatus, setTransferStatus] = useState<'pending' | 'processing' | 'completed' | 'error'>('pending');
  const [transferError, setTransferError] = useState<string>('');
  const [processedItems, setProcessedItems] = useState<Set<string>>(new Set());

  const formatPrice = (p: number | undefined | null) =>
    typeof p === 'number' && !isNaN(p)
      ? p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : '';

  const processArtPieces = async (
    items: any[],
    shipping: number,
    orderDate: string,
    deliveryDate: string
  ) => {
    if (!items || items.length === 0) return;

    setTransferStatus('processing');
    const artPieces = items.flat();
    const artPieceIds: string[] = [];
    const subtotals: number[] = [];

    for (const item of artPieces) {
      if (item.artPiece?.id) {
        artPieceIds.push(item.artPiece.id);
        subtotals.push(item.artPiece.price || 0);
      }
    }

    console.log("processing with parameters:", {
      artPieceIds,
      total,
      subtotals,
      tax,
      shipping,
      orderDate,
      deliveryDate
    })

    try {
      await artPieceService.transferArtPiece(
        artPieceIds,
        total,
        subtotals,
        tax,
        shipping,
        orderDate,
        deliveryDate
      );
      setProcessedItems(new Set(artPieceIds));
      setTransferStatus('completed');
      console.log('All transfers completed successfully');
    } catch (error) {
      console.error('Transfer process failed:', error);
      setTransferError(error instanceof Error ? error.message : 'Unknown error occurred');
      setTransferStatus('error');
    }
  };

  // Load order items from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutItem");
    const parsed = stored ? JSON.parse(stored) : [];
    setOrderItems(parsed);
  }, []);

  // Calculate costs when orderItems change
  useEffect(() => {
    if (orderItems.length > 0) {
      const calculatedSubTotal = orderItems
        .flat()
        .reduce((sum, item) => sum + (item.artPiece?.price || 0), 0);
      
      const calculatedShipping = 3492.99;
      const calculatedTax = calculatedSubTotal * 0.04;
      const calculatedTotal = calculatedSubTotal + calculatedShipping + calculatedTax;

      setSubTotal(calculatedSubTotal);
      setShipping(calculatedShipping);
      setTax(calculatedTax);
      setTotal(calculatedTotal);
    }
  }, [orderItems]);

  // Process transfers when all costs are calculated
  useEffect(() => {
    if (orderItems.length > 0 && total > 0) {
      // Small delay to ensure the confirmation page renders first
      const timer = setTimeout(() => {
        processArtPieces(
          orderItems,
          shipping,
          orderDate,
          "July 15-17, 2025" // or your actual delivery date logic
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [orderItems, total, shipping, orderDate]);

  const getTransferStatusIcon = () => {
    switch (transferStatus) {
      case 'processing':
        return <div className="animate-spin h-5 w-5 border-2 border-[#C8977F] border-t-transparent rounded-full" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-[#C8977F]" />;
    }
  };

  const getTransferStatusText = () => {
    switch (transferStatus) {
      case 'processing':
        return 'Processing ownership transfer...';
      case 'completed':
        return 'Ownership transfer completed successfully';
      case 'error':
        return `Transfer error: ${transferError}`;
      default:
        return 'Preparing ownership transfer...';
    }
  };

  const getTransferStatusColor = () => {
    switch (transferStatus) {
      case 'completed':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-[#A67C52]';
    }
  };

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

          {/* Transfer Status Card */}
          <Card className="border-none shadow-sm rounded-none bg-white mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {getTransferStatusIcon()}
                <div>
                  <h3 className="font-medium text-[#8A5A3B] mb-1">Ownership Transfer</h3>
                  <p className={`text-sm ${getTransferStatusColor()}`}>
                    {getTransferStatusText()}
                  </p>
                  {transferStatus === 'processing' && processedItems.size > 0 && (
                    <p className="text-xs text-[#A67C52] mt-1">
                      Processed {processedItems.size} of {orderItems.flat().length} items
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-none bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-medium text-[#8A5A3B]">Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Order Date</span>
                    <span className="text-[#8A5A3B] font-medium">{orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A67C52]">Payment Method</span>
                    <span className="text-[#8A5A3B] font-medium">•••• •••• •••• 1234</span>
                  </div>
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
                  {orderItems[0]?.map((item: any) => (
                    <div key={item.artPiece.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-[#EFE6DC] rounded-none overflow-hidden">
                        <img
                          src={item.artPiece.url}
                          alt={`${item.artPiece.title}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-[#8A5A3B]">{item.artPiece.title}</h3>
                        <p className="text-sm text-[#A67C52]">by {item.artPiece.artist}</p>
                        {transferStatus === 'completed' && processedItems.has(item.artPiece.id) && (
                          <div className="flex items-center gap-1 mt-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">Ownership transferred</span>
                          </div>
                        )}
                        {transferStatus === 'error' && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3 text-red-600" />
                            <span className="text-xs text-red-600">Transfer failed</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-[#8A5A3B]">
                          {formatPrice(item.artPiece.price)} €
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator className="bg-[#E8D7C9]" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A67C52]">Subtotal</span>
                      <span className="text-[#8A5A3B]">{formatPrice(subTotal)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A67C52]">Shipping</span>
                      <span className="text-[#8A5A3B]">{formatPrice(shipping)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A67C52]">Tax</span>
                      <span className="text-[#8A5A3B]">{formatPrice(tax)} €</span>
                    </div>
                    <Separator className="bg-[#E8D7C9]" />
                    <div className="flex justify-between text-lg font-medium">
                      <span className="text-[#8A5A3B]">Total</span>
                      <span className="text-[#8A5A3B]">{formatPrice(total)} €</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full border-[#C8977F] text-[#C8977F] hover:bg-[#C8977F]/10 rounded-none py-6"
                  asChild
                >
                  <Link href="/gallery">Continue Shopping</Link>
                </Button>
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