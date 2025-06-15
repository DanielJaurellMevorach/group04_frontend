import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import service from '../../services/artPiece.service';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AllProductPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArtist, setSelectedArtist] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await service.getAllProducts();
        console.log("Parsed JSON result:", result);

        let artPieces: any[] = [];
        if (result.artPieces && Array.isArray(result.artPieces.artPieces)) {
          console.log("Returning result.artPieces.artPieces:", result.artPieces.artPieces);
          artPieces = result.artPieces.artPieces;
        } else if (Array.isArray(result.artPieces)) {
          console.log("Returning result.artPieces:", result.artPieces);
          artPieces = result.artPieces;
        } else if (Array.isArray(result)) {
          console.log("Returning result:", result);
          artPieces = result;
        } else {
          console.log("Returning empty array");
          artPieces = [];
        }
        setData(artPieces);
      } catch (e) {
        console.error("Error in fetcher:", e);
        setError("Failed to load art pieces");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const artists = [...new Set(data?.map((piece: any) => piece.artist))];

  const filteredData = data
    ?.filter((artPiece: any) =>
      artPiece.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((artPiece: any) =>
      selectedArtist ? artPiece.artist === selectedArtist : true
    );

  if (loading) return <p className="text-center text-[#A67C52] mt-10">Loading...</p>;
  if (error) return (
    <>
      <p className="text-center text-[#B78370] mt-10">{error}</p>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F9F2EA] text-[#8A5A3B]">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#F9F2EA]/90 z-10"></div>
        </div>
        <div className="container relative z-20 mx-auto px-4 py-2 md:py-2"></div>
      </section>

      <div className="container mx-auto px-4 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-light tracking-wider text-center mb-6">All Art Pieces</h1>

        <div className="flex justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-[#C8977F] rounded-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C8977F]"
          />

          <div className="relative">
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-[#C8977F] rounded-none shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C8977F]"
            >
              <option value="">All Artists</option>
              {(artists as string[])?.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => setSelectedArtist('')}
            className="px-4 py-2 bg-[#C8977F] hover:bg-[#B78370] text-white rounded-none"
          >
            Reset Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredData?.map((artPiece: any) => (
            <div
              key={artPiece.id}
              className="bg-white rounded-none shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-[#E8D7C9]"
            >
              <div className="relative w-full h-60 overflow-hidden">
                <img
                  src={artPiece.url}
                  alt={artPiece.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-[#8A5A3B] mb-1">{artPiece.title}</h2>
                <p className="text-sm text-[#A67C52]">By: {artPiece.artist}</p>
                <p className="text-sm text-[#A67C52]">Year: {artPiece.year}</p>
                <div className='flex w-full justify-between'>
                  <p className="text-sm text-[#8A5A3B] font-medium mt-2">
                    {Number(artPiece.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                  <Link href={`/product/${artPiece.id}`}>
                    <Button size="sm" className="bg-[#C8977F] hover:bg-[#B78370] text-white border-none rounded-none cursor-pointer">
                      More info
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProductPage;