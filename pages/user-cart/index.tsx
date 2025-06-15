import Navbar from '@/components/navbar';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import userService from '../../services/user.service';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

interface ArtPiece {
  id: string;
  title: string;
  description: string;
  artist: string;
  price: number;
  tags: string[];
  year: number;
  url: string;
  createdAt: string;
}

interface CartItem {
  artPiece: ArtPiece;
}

const UserCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const handlePayment = (
    product: any[] // explicitly an array
  ) => {
    sessionStorage.setItem("checkoutItem", JSON.stringify([product]));
    window.location.href = "/checkout";
  };

  const router = useRouter();
  const [token, setToken] = useState<string>("");
    useEffect(() => { 
      // Fetch token from localStorage or any other secure storage
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        console.error('No token found');
        router.push('/login'); // Redirect to login if no token
      }
    }, []);

  const fetchProducts = async () => {
    console.log("Fetching cart items...");
    const token = sessionStorage.getItem("token");
    if (!token) {
      return [];
    }
    const result = await userService.getUsersCartItems(token);
    return result;
  };

  const fetchCartItems = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await fetchProducts();
      setCartItems(items);
    } catch (err) {
      setError('Failed to load cart items.');
      console.error("failed to load art: ", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCartItems();
  }, []);

  const toggleCart = async (token: string, itemId: string) => {
    await userService.toggleCartItem(token, itemId)
    fetchCartItems();
  }

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen bg-[#F4EFE7] text-[#655A4A]">
      <Navbar />
      
      <div className="max-w-screen-xl mx-auto p-8 pt-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-12">
            <ShoppingCart className="h-7 w-7 text-[#B69985] mr-3" />
            <h1 className="text-3xl font-light tracking-wide">Your Shopping Cart</h1>
          </div>
          
          {loading && (
            <div className="flex justify-center py-16">
              <div className="animate-pulse space-y-6 w-full max-w-md">
                <div className="h-3 bg-[#DAD2C6] rounded w-3/4"></div>
                <div className="h-3 bg-[#DAD2C6] rounded w-1/2"></div>
                <div className="h-3 bg-[#DAD2C6] rounded w-5/6"></div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-[#EFE5DD] border-l-2 border-[#C9A895] p-4 mb-8 rounded">
              <p className="text-[#9D7A64]">{error}</p>
            </div>
          )}
          
          {!loading && cartItems.length === 0 && (
            <div className="text-center py-20 bg-[#EFE5DD] rounded">
              <ShoppingCart className="h-12 w-12 text-[#D9CFC2] mx-auto mb-6" />
              <p className="text-lg mb-8 text-[#A3937F]">Your cart is empty</p>
              <Link href="/gallery" className="px-8 py-3 bg-[#B69985] text-[#F4EFE7] rounded-none hover:bg-[#8A5A3B] transition-colors">
                Explore Gallery
              </Link>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {cartItems.map((item) => {
              const art = item.artPiece;
              return (
                <div
                  key={art.id}
                  className="bg-[#EFE5DD] overflow-hidden group transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={art.url}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <ShoppingCart className="h-5 w-5 text-[#C87D55]" onClick={() => {
                        const token = sessionStorage.getItem("token");
                        if (token) {
                          toggleCart(token, art.id);
                        }
                      }}/>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <h2 className="font-light text-lg tracking-wide line-clamp-1">{art.title}</h2>
                      <div className="text-[#9D7A64] font-light text-sm">
                        €{formatPrice(art.price)}
                      </div>
                    </div>
                    
                    <p className="text-xs text-[#9D7A64]">
                      {art.artist}, {art.year}
                    </p>
                    
                    <div className="pt-4">
                      <Link
                        href={`/product/${art.id}`}
                        className="text-sm block border border-[#B69985] text-[#8A5A3B] py-2 px-4 text-center hover:bg-[#B69985] hover:text-[#F4EFE7] transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='flex justify-center'> 
          {!loading && cartItems.length > 0 && (
            <div className="text-center mt-10 bg-[#EFE5DD] rounded" onClick={() => handlePayment(cartItems)}>
              <Link href="/gallery" className="px-8 py-3 bg-[#B69985] text-[#F4EFE7] rounded-none hover:bg-[#8A5A3B] transition-colors">
                BUY NOW
              </Link>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCartPage;