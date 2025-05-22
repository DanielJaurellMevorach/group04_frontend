import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Brush, CreditCard, Globe, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import artPieceService from "@/services/artPiece.service"
import useSWR from "swr"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

export default function LandingPage() {



  const getProducts = async () => {
    const response = await artPieceService.getAllProducts();
    if (response.ok) {
      const products = await response.json();
<<<<<<< HEAD
      // Always return an array
      if (Array.isArray(products)) return products;
      if (products && Array.isArray(products.artPieces)) return products.artPieces;
      return [];
    }
    return [];
  };
=======
      return products;
    }
  }

  const { data, isLoading, error } = useSWR("products", getProducts);


>>>>>>> 3b22d095fcae219be7b100de3b6f0af0c40e4366

  const { data = [], isLoading, error } = useSWR("products", getProducts);

  return (
    <div className="min-h-screen bg-[#F9F2EA] text-[#8A5A3B]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#F9F2EA]/90 z-10"></div>
          {/* <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Art Gallery Background"
            fill
            className="object-cover"
            priority
          /> */}
        </div>

        <div className="container relative z-20 mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider mb-6">
              Discover & Collect <span className="font-medium">Exceptional Art</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-[#A67C52] max-w-2xl mx-auto">
              A curated marketplace connecting artists with art lovers. Showcase your creativity or find your next
              masterpiece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={"/gallery"} className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none px-5 py-3">
                Browse Gallery
              </Link>
              <Link href={`/addProduct`}
                className="border border-[#C8977F] text-[#C8977F] hover:bg-[#C8977F]/10 rounded-none px-5 py-3"
              >
                Sell Your Art
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F9F2EA] to-transparent"></div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-2xl md:text-3xl font-light tracking-wider">
              Featured <span className="font-medium">Artworks</span>
            </h2>
            <Link href="/gallery" className="flex items-center text-[#C8977F] hover:text-[#B78370] transition-colors">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
<<<<<<< HEAD
            {!isLoading && Array.isArray(data) ? data.slice(0, 4).map((item: any) => (
=======
            {!isLoading ? (data as any[])?.slice(0, 4).map((item) => (
>>>>>>> 3b22d095fcae219be7b100de3b6f0af0c40e4366
              <div key={item.id} className="group hover:bg-[#EFE6DC] duration-100 cursor-pointer p-2">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-[#EFE6DC]">
                  <Image
                    src={item.url}
                    alt={`Featured Artwork ${item.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-[#A67C52] mb-2">{item.artist}</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">${item.price}</span>
                  <Button size="sm" className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none cursor-pointer">
                    More info
                  </Button>
                </div>
              </div>
<<<<<<< HEAD
            )) : isLoading ? <p>Loading.......</p> : null}
=======
            )) : <p>Loading.......</p>}
>>>>>>> 3b22d095fcae219be7b100de3b6f0af0c40e4366
            {error ? <p>error</p> : null}
          </div>
        </div>
      </section>

      {/* Artist Spotlight */}
      <section className="py-16 md:py-24 bg-[#EFE6DC]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-center mb-12">
            Artist <span className="font-medium">Spotlight</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative aspect-square">
              <Image
                src={data ? data[6]?.url : "/"}
                alt="Featured Artist"
                fill
                quality={100}
                className="object-cover"
              />
            </div>
            <div className="max-w-xl">
              <h3 className="text-xl md:text-2xl font-medium mb-2">Amara Nwosu</h3>
              <p className="text-[#A67C52] mb-6">Contemporary African Art</p>
              <p className="mb-6 text-lg">
                "My work explores the intersection of traditional African aesthetics and contemporary global influences.
                Each piece tells a story of cultural heritage and modern identity."
              </p>
              <p className="mb-8">
                Amara's distinctive style has earned recognition in galleries across three continents. Her pieces
                combine vibrant colors with powerful symbolism, creating works that are both visually striking and
                deeply meaningful.
              </p>
              <Button className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none">
<<<<<<< HEAD
                <Link href={'/gallery'}>
                View Collection
=======
                <Link href={'/allProductPage'}>
                  View Collection
>>>>>>> 3b22d095fcae219be7b100de3b6f0af0c40e4366
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-center mb-4">
            Why Choose <span className="font-medium">NIMAH</span>
          </h2>
          <p className="text-center text-[#A67C52] max-w-2xl mx-auto mb-16">
            Our platform is designed to support artists and delight collectors with a seamless experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <Card className="bg-white border-none shadow-sm rounded-none">
              <CardContent className="pt-8">
                <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mb-6">
                  <Brush className="h-6 w-6 text-[#C8977F]" />
                </div>
                <h3 className="text-xl font-medium mb-2">For Artists</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Global exposure to art collectors and enthusiasts</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Simple upload process and inventory management</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Secure payments with competitive commission rates</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Professional artist profile and portfolio</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm rounded-none">
              <CardContent className="pt-8">
                <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mb-6">
                  <ShoppingBag className="h-6 w-6 text-[#C8977F]" />
                </div>
                <h3 className="text-xl font-medium mb-2">For Collectors</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Discover unique artworks from around the world</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Direct connection with artists</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Secure transactions and buyer protection</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Curated collections and personalized recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* <Card className="bg-white border-none shadow-sm rounded-none md:col-span-2 lg:col-span-1">
              <CardContent className="pt-8">
                <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mb-6">
                  <Globe className="h-6 w-6 text-[#C8977F]" />
                </div>
                <h3 className="text-xl font-medium mb-2">Our Community</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Join a thriving community of art enthusiasts</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Participate in virtual exhibitions and events</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Learn through artist interviews and behind-the-scenes content</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 shrink-0 text-[#C8977F]" />
                    <span>Support diverse artists from around the globe</span>
                  </li>
                </ul>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-[#EFE6DC]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <Users className="h-8 w-8 text-[#C8977F]" />
              </div>
              <div className="text-4xl font-light mb-2">2,500+</div>
              <div className="text-[#A67C52]">Active Artists</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <Brush className="h-8 w-8 text-[#C8977F]" />
              </div>
              <div className="text-4xl font-light mb-2">10,000+</div>
              <div className="text-[#A67C52]">Artworks</div>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <CreditCard className="h-8 w-8 text-[#C8977F]" />
              </div>
              <div className="text-4xl font-light mb-2">15,000+</div>
              <div className="text-[#A67C52]">Happy Collectors</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light tracking-wider mb-4">
              Ready to <span className="font-medium">Join Us?</span>
            </h2>
            <p className="text-lg mb-8 text-[#A67C52]">
              Whether you're an artist looking to showcase your work or a collector searching for your next masterpiece,
              NIMAH Art Boutique is the perfect platform for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none px-8 py-6">
                <Link href={"/login"}>
                  Create Account
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-[#C8977F] text-[#C8977F] hover:bg-[#C8977F]/10 rounded-none px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#EFE6DC] py-12 border-t border-[#E8D7C9]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-medium tracking-wider">NIMAH</h3>
                <p className="text-xs tracking-widest">ART BOUTIQUE</p>
              </div>
              <p className="text-sm text-[#A67C52] mb-4">Connecting artists and art lovers around the world.</p>
            </div>

            <div>
              <h4 className="font-medium mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Browse Art
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Featured Artists
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Virtual Exhibitions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">For Artists</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Sell Your Art
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Artist Resources
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Pricing & Fees
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#C8977F]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E8D7C9] mt-8 pt-8 text-sm text-[#A67C52] text-center">
            © {new Date().getFullYear()} NIMAH Art Boutique. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
