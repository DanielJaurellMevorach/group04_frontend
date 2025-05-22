import Navbar from '@/components/navbar';
import { Archive, PackageOpen, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import userService from '../../services/user.service';

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

const UsersArt: React.FC = () => {
  const [ownedArt, setOwnedArt] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchOwnedArt = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      return [];
    }
    const result = await userService.getUsersArtPieces(token);
    return result;
  };

  const loadOwnedArt = async () => {
    setLoading(true);
    setError('');
    try {
      const items = await fetchOwnedArt();
      setOwnedArt(items);
    } catch (err) {
      setError('Failed to load your art collection.');
      console.error("failed to load art: ", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadOwnedArt();
  }, []);

  // Format price with commas
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen bg-[#F4EFE7] text-[#655A4A]">
      <Navbar />
      
      <div className="max-w-screen-xl mx-auto p-8 pt-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-12 justify-between">
            <div className='flex items-center'>

            <PackageOpen className="h-7 w-7 text-[#B69985] mr-3" />
            <h1 className="text-3xl font-light tracking-wide">My Art Collection</h1>
            </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/addProduct`}
              className="border border-[#C8977F] text-[#C8977F] hover:bg-[#C8977F]/10 rounded-none px-5 py-3"
            >
              Sell Your Art
            </Link>
            </div>
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
          
          {!loading && ownedArt.length === 0 && (
            <div className="text-center py-20 bg-[#EFE5DD] rounded">
              <Archive className="h-12 w-12 text-[#D9CFC2] mx-auto mb-6" />
              <p className="text-lg mb-8 text-[#A3937F]">You don't own any artwork yet</p>
              <Link href="/gallery" className="px-8 py-3 bg-[#B69985] text-[#F4EFE7] rounded-none hover:bg-[#8A5A3B] transition-colors">
                Browse Gallery
              </Link>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ownedArt.map((item) => {
              // Unwrap if needed
              const art = (item as any).artPiece ? (item as any).artPiece : item;
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
                      <ShoppingCart className="h-5 w-5 text-[#C87D55]" />
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
                        href={`/art/${art.id}`}
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
        </div>
      </div>
    </div>
  );
};

export default UsersArt;