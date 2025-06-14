
import React, { useEffect, useState } from 'react';
import userService from '@/services/user.service';
import Navbar from '@/components/navbar';
import { Archive, PackageOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import artPieceService from '@/services/artPiece.service';

interface ArtPiece {
  id: string;
  title: string;
  artist: string;
  year: number;
  price: number;
  url: string;
  publishOnMarket: boolean;    // ← make sure your API returns this
  createdAt: string;
}

const UsersCart: React.FC = () => {
  const [ownedArt, setOwnedArt] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') || '' : '';

  // load art
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const items = await userService.getUsersArtPieces(token);
        setOwnedArt(items);
      } catch {
        setError('Failed to load your art collection.');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, router]);

  const handleToggle = async (id: string) => {
    try {
      const res = await artPieceService.togglePublishArtPiece(id, token!);
      // update only the one that changed:
      setOwnedArt((arts) =>
        arts.map((a) =>
          a.id === id ? { ...a, publishOnMarket: res.publishOnMarket } : a
        )
      );
    } catch (e) {
      console.error(e);
      alert('Could not change publish state. Try again.');
    }
  };

  const formatPrice = (p: number) =>
    p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <div className="min-h-screen bg-[#F4EFE7] text-[#655A4A]">
      <Navbar />
      <div className="max-w-screen-xl mx-auto p-8 pt-10">
        <header className="flex items-center mb-12 justify-between">
          <div className="flex items-center">
            <PackageOpen className="h-7 w-7 text-[#B69985] mr-3" />
            <h1 className="text-3xl font-light tracking-wide">
              My Art Collection
            </h1>
          </div>
          <Link
            href="/addProduct"
            className="border border-[#C8977F] text-[#C8977F] px-5 py-3 hover:bg-[#C8977F]/10"
          >
            Sell Your Art
          </Link>
        </header>

        {loading ? (
          /* … your existing skeleton … */
          <div className="flex justify-center py-16">
            {/* … */}
          </div>
        ) : error ? (
          <div className="bg-[#EFE5DD] border-l-2 border-[#C9A895] p-4 mb-8 rounded">
            <p className="text-[#9D7A64]">{error}</p>
          </div>
        ) : ownedArt.length === 0 ? (
          <div className="text-center py-20 bg-[#EFE5DD] rounded">
            <Archive className="h-12 w-12 text-[#D9CFC2] mx-auto mb-6" />
            <p className="text-lg mb-8 text-[#A3937F]">
              You don’t own any artwork yet
            </p>
            <Link
              href="/gallery"
              className="px-8 py-3 bg-[#B69985] text-[#F4EFE7] hover:bg-[#8A5A3B]"
            >
              Browse Gallery
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {ownedArt.map((art) => (
              <div
                key={art.id}
                className="bg-[#EFE5DD] overflow-hidden group transition-all"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={art.url}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="font-light text-lg line-clamp-1">
                      {art.title}
                    </h2>
                    <span className="text-[#9D7A64] font-light text-sm">
                      €{formatPrice(art.price)}
                    </span>
                  </div>
                  <p className="text-xs text-[#9D7A64]">
                    {art.artist}, {art.year}
                  </p>
                  {/* ← Here’s the toggle slider */}
                  <div className="flex items-center space-x-2">
                    <label
                      htmlFor={`toggle-${art.id}`}
                      className="inline-flex items-center cursor-pointer"
                    >
                      <div className="relative">
                        <input
                          id={`toggle-${art.id}`}
                          type="checkbox"
                          className="sr-only"
                          checked={art.publishOnMarket}
                          onChange={() => handleToggle(art.id)}
                        />
                        <div className="block w-10 h-6 rounded-full bg-gray-300" />
                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                            art.publishOnMarket ? 'translate-x-4' : ''
                          }`}
                        />
                      </div>
                      <span className="ml-3 text-sm">
                        {art.publishOnMarket ? 'Published' : 'Hidden'}
                      </span>
                    </label>
                  </div>
                  <Link
                    href={`/product/${art.id}`}
                    className="block text-sm border border-[#B69985] py-2 text-center hover:bg-[#B69985] hover:text-[#F4EFE7] transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersCart;
