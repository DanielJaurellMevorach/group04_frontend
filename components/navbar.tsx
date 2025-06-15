"use client"

import { HeartIcon, LayoutDashboard, Menu, PackageOpen, ShoppingBag, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLogged,setIsLogged] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [isAdmin,setIsAdmin] = useState(false);
  // console.log(userService.decodeJWT(sessionStorage.getItem("token")+"1" || ""));

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setIsLogged(true);
    }
    const user = sessionStorage.getItem("username");
    if (user) {
      setUserName(user);
    }
    if(sessionStorage.getItem("role") === "admin") {
      setIsAdmin(true);
    }
  }, [])
  
  const logoutHandler = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("role");

    setIsMenuOpen(false);
    setIsLogged(false);
    setIsAdmin(false);
  }

  return (
    <header className="w-full bg-[#F9F2EA] text-[#A67C52] font-normal top-0 z-50">
      <div className="flex flex-col justify-center items-center w-full max-w-7xl mx-auto px-4">
        {/* Logo */}
        <div className="py-4 md:py-6">
          <div className="text-center">
            <h1 className="text-xl font-medium tracking-wider">NIMAH</h1>
            <p className="text-xs tracking-widest">ART BOUTIQUE</p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden w-full border-t border-[#E8D7C9] py-3">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center px-3 py-2 text-sm tracking-wider"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 mr-2" /> : <Menu className="h-5 w-5 mr-2" />}
              MENU
            </button>

          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center w-full py-4 border-t border-b border-[#E8D7C9]">
          <div className="flex justify-between w-full max-w-4xl items-center">
            <div className="flex space-x-8">
              <Link
                className="px-3 py-2 text-sm tracking-wider hover:text-[#C8977F] transition-colors duration-200"
                href={"/"}
              >
                HOME
              </Link>
              <Link
                className="px-3 py-2 text-sm tracking-wider hover:text-[#C8977F] transition-colors duration-200"
                href={"/gallery"}
              >
                DISCOVER
              </Link>
              {/* <Link
                className="px-3 py-2 text-sm tracking-wider hover:text-[#C8977F] transition-colors duration-200"
                href={""}
              >
                ARTISTS
              </Link> */}
              <Link
                className="px-3 py-2 text-sm tracking-wider hover:text-[#C8977F] transition-colors duration-200"
                href={"/about"}
              >
                ABOUT
              </Link>
            </div>
            {!isLogged ?
            <div className="flex items-center gap-4">
            
            <Link
                href="/login"
                className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none p-1.5"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            </div> :
            <div className="flex items-center gap-4">
              <button aria-label="Shopping cart" className="p-2 hover:text-[#C8977F] transition-colors duration-200">
                <Link href="/user-cart">
                <ShoppingBag className="h-5 w-5" />
                </Link>
              </button>
              <button aria-label="Shopping cart" className="p-2 hover:text-[#C8977F] transition-colors duration-200">
                <Link href="/liked-items">
                <HeartIcon className="h-5 w-5" />
                </Link>
              </button>
              <button aria-label="Shopping cart" className="p-2 hover:text-[#C8977F] transition-colors duration-200">
                <Link href="/users-art">
                <PackageOpen href="/users-art" className="h-5 w-5" />
                </Link>
              </button>
              {isAdmin &&               
              <button aria-label="Admin Dashboard" className="p-2 hover:text-[#C8977F] transition-colors duration-200">
                <Link href="/admin">
                <LayoutDashboard  href="/admin" className="h-5 w-5"/>
                </Link>
              </button>}
              <Link
                  href="/"
                  className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none p-1.5"
                  onClick={() => logoutHandler()}
                >
                  Log Out, {userName}
                </Link>
            </div>
            }
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden w-full border-b border-[#E8D7C9]">
            <div className="flex flex-col w-full" style={{ animation: "fadeIn 0.3s ease-out forwards" }}>
              <Link
                className="px-4 py-3 text-sm tracking-wider hover:text-[#C8977F] hover:bg-[#F3EAE0] transition-colors duration-200"
                href={"/"}
                onClick={() => setIsMenuOpen(false)}
              >
                HOME
              </Link>
              <Link
                className="px-4 py-3 text-sm tracking-wider hover:text-[#C8977F] hover:bg-[#F3EAE0] transition-colors duration-200"
                href={"/gallery"}
                onClick={() => setIsMenuOpen(false)}
              >
                DISCOVER
              </Link>
              {/* <Link
                className="px-4 py-3 text-sm tracking-wider hover:text-[#C8977F] hover:bg-[#F3EAE0] transition-colors duration-200"
                href={""}
                onClick={() => setIsMenuOpen(false)}
              >
                ARTISTS
              </Link> */}
              <Link
                className="px-4 py-3 text-sm tracking-wider hover:text-[#C8977F] hover:bg-[#F3EAE0] transition-colors duration-200"
                href={"/about"}
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </Link>
              
              <div className="px-4 py-3 flex items-center gap-4">
              <button aria-label="Shopping cart" className="hover:text-[#C8977F] transition-colors duration-200">
                  <Link href="/user-cart">
                  <ShoppingBag className="h-5 w-5" />
                  </Link>
                </button>
                <button aria-label="Shopping cart" className="hover:text-[#C8977F] transition-colors duration-200">
                  <Link href="/liked-items">
                  <HeartIcon className="h-5 w-5" />
                  </Link>
                </button>
                <button aria-label="Shopping cart" className="hover:text-[#C8977F] transition-colors duration-200">
                  <Link href="/users-art">
                  <PackageOpen href="/users-art" className="h-5 w-5" />
                  </Link>
                </button>
                {isAdmin &&               
              <button aria-label="Admin Dashboard" className="p-2 hover:text-[#C8977F] transition-colors duration-200">
                <Link href="/admin">
                <LayoutDashboard  href="/admin" className="h-5 w-5"/>
                </Link>
              </button>}
                </div>

                {!isLogged ?
                 <div className="px-4 py-3 border-t border-[#E8D7C9]">
                 <Link
                   href="/login"
                   className="block w-full py-2 text-center bg-[#C8977F] hover:bg-[#B78370] text-white transition-colors duration-200"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   Sign In
                 </Link>
               </div> :
              <div className="px-4 py-3 border-t border-[#E8D7C9]">
                <Link
                  href="/login"
                  className="block w-full py-2 text-center bg-[#C8977F] hover:bg-[#B78370] text-white transition-colors duration-200"
                  onClick={() => logoutHandler()}
                >
                  Log Out {userName}
                </Link>
              </div>
              }
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
