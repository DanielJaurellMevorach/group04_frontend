import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/SingleProductPage.module.css';
import paintingImage1 from './public/painting1.webp'
import paintingImage2 from './public/painting2.jpg'
import monaLisaImage from './public/monaLisa.jpg';
import dinner from './public/dinner.jpg';
import Navbar from '@/components/navbar';
import artPieceService from '@/services/artPiece.service';
import { useRouter } from 'next/router';
import useSWR from 'swr';


const SingleProductPage: React.FC = () => {
  const productImages = [paintingImage1, paintingImage2];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringArrow, setIsHoveringArrow] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const artistPaintings = [monaLisaImage, dinner];

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
    );
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || isHoveringArrow) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });

    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleArrowMouseEnter = () => {
    setIsHoveringArrow(true);
    setShowZoom(false);
  };

  const handleArrowMouseLeave = () => {
    setIsHoveringArrow(false);
    setShowZoom(true);
  };

  const [isFavorited, setIsFavorited] = useState(false);

  // Add this handler function
  const handleFavoriteClick = () => {
    setIsFavorited(prevState => !prevState);
  };


  const router = useRouter();
  const { productId } = router.query;

  const getArt = async (id: string) => {
    try {
    const response = await artPieceService.getProductById(id);
      const data = await response.json();
      console.log("Fetched product data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching product data:", error);
      throw new Error("Failed to fetch product data");
    }
  };

  const { data, isLoading, error } = useSWR(
    productId ? `product-${productId}` : null,
    () => getArt(String(productId))
  );


  const getArtsByArtist = async (artist: string, id: string) => {
    const response = await artPieceService.getProductsByArtist(String(artist), String(id));
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Failed to fetch arts by artist");
  }


  const { data: artistData, isLoading: artistLoading, error: artistError } = useSWR(
    data?.artist && data?.id ? `arts-${data.artist}-${data.id}` : null,
    () => {
      if (!data?.artist || !data?.id) return null;
      return getArtsByArtist(data.artist, data.id);
    }
  );


return (
  <div className="min-h-screen bg-[#F9F2EA] text-[#8A5A3B]">
    <Navbar />

    {isLoading ? (
      <p className="text-center py-10">Loading...</p>
    ) : error ? (
      <p className="text-center py-10 text-red-500">Error: {error.message}</p>
    ) : data && (
      <>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[#F9F2EA]/90 z-10"></div>
          </div>
          <div className="container relative z-20 mx-auto px-4 py-2 md:py-2"></div>
        </section>

        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/shop">Shop</Link>
            <span> &gt; </span>
            <Link href={`/shop/${data.artist}`}>{data.artist}</Link>
            <span> &gt; </span>
            <span>{data.title}</span>
          </div>

          <div className={styles.productContent}>
            <div className={styles.productImages}>
              <div className={styles.mainImage}>
                <div
                  className={styles.imageContainer}
                  ref={imageRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => !isHoveringArrow && setShowZoom(true)}
                  onMouseLeave={() => setShowZoom(false)}
                >
                  <img
                    src={data.url}
                    alt={`Product image ${currentImageIndex + 1}`}
                    width={500}
                    height={600}
                    className={styles.slideImage}
                  />

                  {showZoom && !isHoveringArrow && (
                    <div
                      className={styles.zoomWindow}
                      style={{
                        left: `${mousePosition.x}px`,
                        top: `${mousePosition.y}px`,
                        backgroundImage: `url(${data.url})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }}
                    />
                  )}
                </div>

                <div className={styles.indicators}>
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${currentImageIndex === index ? styles.activeIndicator : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-end">
                  <button className={styles.buyNowButton}>BUY NOW</button>
                  <button
                    className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
                    onClick={handleFavoriteClick}
                    aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={isFavorited ? '#e25555' : 'none'}
                      stroke={isFavorited ? '#e25555' : 'currentColor'}
                      strokeWidth="2"
                      className={styles.heartIcon}
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.productDetails}>
              <h1 className={styles.title}>{data.title}</h1>
              <p className={styles.artist}>{data.artist}</p>
              <p className={styles.dimensions}>Made in {data.year}</p>
              <p className={styles.price}>${data.price}</p>
              <p className={styles.description}>{data.description}</p>
            </div>
          </div>

          <div className={styles.moreFromAuthor}>
            <h2 className={styles.moreFromAuthorTitle}>More from artist</h2>
            {artistLoading ? (
              <p>Loading....</p>
            ) : artistData && artistData.length === 0 ? (
              <p>No other painting found</p>
            ) : (
              <div className={styles.moreFromAuthorGrid}>
                {artistData?.map((art: any) => (
                  <div key={art.id} className={styles.moreFromAuthorItem}>
                    <Link href={`/product/${art.id}`}>
                      <div className={styles.moreFromAuthorImageWrapper}>
                        <img
                          src={art.url}
                          alt={`Author product ${art.id}`}
                        />
                      </div>
                      <h3 className={styles.moreFromAuthorItemTitle}>{art.title}</h3>
                      <p className={styles.moreFromAuthorItemPrice}>${art.price}</p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {artistError && <p className="text-red-500 mt-2">{artistError.message}</p>}
          </div>
        </div>
      </>
    )}
  </div>
);
}


export default SingleProductPage;