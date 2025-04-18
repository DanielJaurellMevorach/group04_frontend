import React from 'react';
import Image from 'next/image';
import service from '../../services/artPieceService';
import useSWR from 'swr';

const AllProductPage: React.FC = () => {
  const fetcher = async () => {
    const response = await service.getAllProducts();
    const result = await response.json();
    return result;
  };

  const { data, isLoading, error } = useSWR('artPieces', fetcher);

  if (isLoading) return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">Failed to load art pieces</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-10">All Art Pieces</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {data?.map((artPiece: any) => (
          <div
            key={artPiece.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-200"
          >
            <div className="relative w-full h-60">
              <Image
                src={artPiece.url}
                alt={artPiece.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-2xl"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">{artPiece.title}</h2>
              <p className="text-sm text-gray-600">By: {artPiece.artist}</p>
              <p className="text-sm text-gray-500">Year: {artPiece.year}</p>
              <p className="text-sm text-gray-700 font-medium mt-2">{artPiece.price.toLocaleString()} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProductPage;
