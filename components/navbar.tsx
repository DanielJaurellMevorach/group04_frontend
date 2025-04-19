"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full bg-[#F9F2EA] text-[#A67C52] font-normal">
      <div className="flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="py-4 md:py-6">
          <div className="text-center">
            <h1 className="text-xl font-medium tracking-wider">NIMAH</h1>
            <p className="text-xs tracking-widest">ART BOUTIQUE</p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden w-full border-t border-[#E8D7C9] py-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center mx-auto px-3 py-2 text-sm tracking-wider"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 mr-2" /> : <Menu className="h-5 w-5 mr-2" />}
            MENU
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex justify-center w-full py-4 border-t border-b border-[#E8D7C9]">
          <div className="flex justify-between w-full max-w-xl">
            <Link
              className="px-6 py-2 text-sm tracking-wider hover:text-[#8A5A3B] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8D7C9] focus:ring-offset-2 focus:ring-offset-[#F9F2EA] rounded"
              href={""}
            >
              HOME
            </Link>
            <Link
              className="px-6 py-2 text-sm tracking-wider hover:text-[#8A5A3B] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8D7C9] focus:ring-offset-2 focus:ring-offset-[#F9F2EA] rounded"
              href={""}
            >
              SHOP
            </Link>
            <Link
              className="px-6 py-2 text-sm tracking-wider hover:text-[#8A5A3B] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8D7C9] focus:ring-offset-2 focus:ring-offset-[#F9F2EA] rounded"
              href={""}
            >
              ABOUT
            </Link>
            <Link
              className="px-6 py-2 text-sm tracking-wider hover:text-[#8A5A3B] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E8D7C9] focus:ring-offset-2 focus:ring-offset-[#F9F2EA] rounded"
              href={"/login"}
            >
              LOGIN/REGISTER
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="sm:hidden w-full border-b border-[#E8D7C9]">
            <div className="flex flex-col w-full" style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
              <Link
                className="px-4 py-3 text-sm tracking-wider hover:text-[#8A5A3B] hover:bg-[#F3EAE0] transition-colors duration-200 text-center"
                href={""}
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </Link>
              <Link
                className="px-4 py-3 text-sm tracking-wider hover:text-[#8A5A3B] hover:bg-[#F3EAE0] transition-colors duration-200 text-center"
                href={""}
                onClick={() => setIsMenuOpen(false)}
              >
                SHOP
              </Link>
              <Link
                className="px-4 py-3 text-sm tracking-wider hover:text-[#8A5A3B] hover:bg-[#F3EAE0] transition-colors duration-200 text-center"
                href={""}
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </Link>
              <Link
                className="px-4 py-3 text-sm tracking-wider hover:text-[#8A5A3B] hover:bg-[#F3EAE0] transition-colors duration-200 text-center"
                href={"/login"}
                onClick={() => setIsMenuOpen(false)}
              >
                LOGIN/REGISTER
              </Link>
            </div>
          </nav>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  )
}

export default Navbar
