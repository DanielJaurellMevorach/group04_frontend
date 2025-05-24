import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Brush, Clock, Globe, Heart, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F2EA] text-[#8A5A3B]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#F9F2EA]/90 z-10"></div>
        </div>

        <div className="container relative z-20 mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wider mb-6">
              About <span className="font-medium">NIMAH</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-[#A67C52] max-w-2xl mx-auto">
              Connecting artists and collectors through a passion for exceptional art and cultural expression.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F9F2EA] to-transparent"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-light tracking-wider mb-6">
                Our <span className="font-medium">Story</span>
              </h2>
              <p className="text-lg mb-6 text-[#8A5A3B]">
                NIMAH Art Boutique was founded in 2020 with a simple yet powerful vision: to create a platform where art could transcend geographical boundaries and connect creators directly with appreciative audiences.
              </p>
              <p className="text-lg mb-6 text-[#8A5A3B]">
                What began as a small collective of passionate artists and curators has grown into a global community celebrating creativity in all its forms. We believe that art is not just decoration—it tells stories, preserves culture, and creates meaningful connections.
              </p>
              <p className="text-lg mb-6 text-[#8A5A3B]">
                Today, NIMAH represents thousands of artists from over 70 countries, offering a diverse range of styles, mediums, and perspectives that reflect the rich tapestry of human creativity.
              </p>
            </div>
            <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden bg-[#EFE6DC]">
              <img
                src="/about-story.jpg"
                alt="NIMAH Art Studio"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-[#EFE6DC]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-center mb-16">
            Our <span className="font-medium">Mission & Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-sm rounded-none">
              <CardContent className="pt-8">
                <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mb-6">
                  <Heart className="h-6 w-6 text-[#C8977F]" />
                </div>
                <h3 className="text-xl font-medium mb-4">Artist Support</h3>
                <p className="text-[#8A5A3B]">
                  We believe in fair compensation and recognition for artists. Our platform is designed to maximize artist exposure while ensuring they receive the majority of sales revenue.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm rounded-none">
              <CardContent className="pt-8">
                <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mb-6">
                  <Globe className="h-6 w-6 text-[#C8977F]" />
                </div>
                <h3 className="text-xl font-medium mb-4">Global Access</h3>
                <p className="text-[#8A5A3B]">
                  Art should be accessible to everyone. We've created a platform that transcends geographical boundaries, language barriers, and traditional art world gatekeeping.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-sm rounded-none">
              <CardContent className="pt-8">
                <div className="bg-[#C8977F]/10 p-3 rounded-full w-fit mb-6">
                  <Brush className="h-6 w-6 text-[#C8977F]" />
                </div>
                <h3 className="text-xl font-medium mb-4">Artistic Integrity</h3>
                <p className="text-[#8A5A3B]">
                  We celebrate authentic expression and believe in preserving the integrity of each artwork and the vision of its creator without compromise.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-center mb-4">
            Meet Our <span className="font-medium">Team</span>
          </h2>
          <p className="text-center text-[#A67C52] max-w-2xl mx-auto mb-16">
            A diverse group of art enthusiasts, technology experts, and business innovators working together to connect creators with collectors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                name: "Maya Patel",
                title: "Founder & Creative Director",
                bio: "Former gallery curator with a passion for discovering emerging artists and making art accessible to all.",
                image: "/team-maya.jpg"
              },
              {
                name: "David Chen",
                title: "Chief Technology Officer",
                bio: "Technology innovator focused on creating intuitive platforms that serve both artists and collectors seamlessly.",
                image: "/team-david.jpg"
              },
              {
                name: "Sofia Gonzalez",
                title: "Artist Relations Manager",
                bio: "Contemporary artist and advocate dedicated to supporting creators and amplifying diverse voices in art.",
                image: "/team-sofia.jpg"
              },
            ].map((member, index) => (
              <div key={index} className="group">
                <div className="relative aspect-square overflow-hidden bg-[#EFE6DC] mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-sm text-[#C8977F] mb-2">{member.title}</p>
                <p className="text-[#8A5A3B]">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-[#EFE6DC]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-center mb-16">
            Frequently <span className="font-medium">Asked Questions</span>
          </h2>

          <div className="max-w-3xl mx-auto grid gap-8">
            {[
              {
                question: "How does NIMAH select its artists?",
                answer: "We have an open submission process where artists can apply to join our platform. Our curatorial team reviews applications based on quality, originality, and fit with our community. We strive to maintain a diverse collection of styles and perspectives."
              },
              {
                question: "What commission does NIMAH take on sales?",
                answer: "We take a 15% commission on sales, which is significantly lower than traditional galleries (typically 50%). This allows artists to earn more from their work while still supporting our platform operations and marketing efforts."
              },
              {
                question: "How do you ensure artwork authenticity?",
                answer: "Each artwork sold on NIMAH comes with a certificate of authenticity. For digital works, we leverage blockchain technology to verify provenance. We also have a satisfaction guarantee and authentication process for physical pieces."
              },
              {
                question: "Do you ship internationally?",
                answer: "Yes, we ship to most countries worldwide. Shipping costs are calculated at checkout based on the artwork dimensions, weight, and delivery location. Artists handle shipping, but we provide guidance and support to ensure safe delivery."
              },
            ].map((faq, index) => (
              <div key={index} className="border-b border-[#E8D7C9] pb-6">
                <h3 className="text-lg font-medium mb-3">{faq.question}</h3>
                <p className="text-[#8A5A3B]">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="mb-6 text-[#A67C52]">Still have questions? We're here to help.</p>
            <Button className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none">
              <MessageSquare className="h-4 w-4 mr-2" /> Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-center mb-4">
            Our <span className="font-medium">Journey</span>
          </h2>
          <p className="text-center text-[#A67C52] max-w-2xl mx-auto mb-16">
            From a small idea to a global art marketplace
          </p>

          <div className="max-w-4xl mx-auto">
            {[
              {
                year: "2020",
                title: "The Beginning",
                description: "NIMAH was founded with 50 curated artists and a mission to democratize art."
              },
              {
                year: "2021",
                title: "Growing Community",
                description: "Expanded to 500+ artists across 25 countries and launched our mobile app."
              },
              {
                year: "2022",
                title: "Technological Innovation",
                description: "Introduced augmented reality features to visualize art in collectors' spaces."
              },
              {
                year: "2023",
                title: "Global Expansion",
                description: "Reached 2,500+ artists from 70+ countries and facilitated over 10,000 sales."
              },
              {
                year: "2024",
                title: "Community Impact",
                description: "Launched our Arts Education Initiative to support emerging artists in underserved communities."
              },
            ].map((milestone, index) => (
              <div key={index} className="relative pl-12 pb-12 border-l border-[#C8977F] last:border-0 last:pb-0">
                <div className="absolute left-[-10px] bg-[#F9F2EA] p-1">
                  <Clock className="h-5 w-5 text-[#C8977F]" />
                </div>
                <div className="mb-2">
                  <span className="text-sm font-light bg-[#C8977F]/10 text-[#C8977F] px-2 py-1">
                    {milestone.year}
                  </span>
                </div>
                <h3 className="text-xl font-medium mb-2">{milestone.title}</h3>
                <p className="text-[#8A5A3B]">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#EFE6DC]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light tracking-wider mb-4">
              Be Part of <span className="font-medium">Our Story</span>
            </h2>
            <p className="text-lg mb-8 text-[#A67C52]">
              Whether you're an artist looking to share your work or a collector searching for meaningful pieces, we invite you to join our growing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gallery" className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none px-5 py-3">
                Explore Gallery
              </Link>
              <Link href="/login"
                className="border border-[#C8977F] text-[#C8977F] hover:bg-[#C8977F]/10 rounded-none px-5 py-3"
              >
                Join NIMAH
              </Link>
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
                  <Link href="/gallery" className="hover:text-[#C8977F]">
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
                  <Link href="/addProduct" className="hover:text-[#C8977F]">
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
                  <Link href="/about" className="hover:text-[#C8977F]">
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