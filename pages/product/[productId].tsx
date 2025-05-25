import React, { useState, useRef, MouseEvent, useEffect, useCallback } from 'react';
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
import userService from '@/services/user.service';

const SingleProductPage: React.FC = () => {
  const productImages = [paintingImage1, paintingImage2];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringArrow, setIsHoveringArrow] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

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

  const [token, setToken] = useState<string>("");

  const getUsersCart = async () => {
  try {
    const response = await userService.getUsersCartItems(token);
    // Flatten the cart items to just the artPiece objects for easier use
    if (Array.isArray(response)) {
      const formatted = response
        .map((item: any) => item.artPiece)
        .filter(Boolean); // Remove undefined/null
      return formatted;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user's cart:", error);
    throw new Error("Failed to fetch user's cart");
  }
}

const getUserLikedItems = async () => {
  try {
    const response = await userService.getUsersLikedItems(token);
    // Flatten the liked items to just the artPiece objects for easier use
    if (Array.isArray(response)) {
      const formatted = response
        .map((item: any) => item.artPiece)
        .filter(Boolean); // Remove undefined/null
      return formatted;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user's liked items:", error);
    throw new Error("Failed to fetch user's liked items");
  }
}

const [userCart, setUserCart] = useState<any[]>([]);
  const [userLikedItems, setUserLikedItems] = useState<any[]>([]);

  const [isInCart, setIsInCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const router = useRouter();
  const { productId } = router.query;

  // State for product and artist data
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const [artistData, setArtistData] = useState<any[]>([]);
  const [artistLoading, setArtistLoading] = useState(false);
  const [artistError, setArtistError] = useState<any>(null);

  // State for seller's other paintings
  const [sellerData, setSellerData] = useState<any[]>([]);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState<any>(null);

  const addToCart = async (productId: string) => {
    try {

      if (!productId) {
        throw new Error('Product ID is required to add to cart');
      }

      if (!token) {
        throw new Error('User is not authenticated');
      }

      await artPieceService.addProductToUsersCart(productId, token);
      
    }
    catch (error) {
      console.error('Error adding product to cart:', error);
      setError(error);
    }
  }

  // Fetch product data
  useEffect(() => {
    setToken(sessionStorage.getItem('token') || '');
    if (!productId) return;
    setIsLoading(true);
    setError(null);
    artPieceService.getProductById(String(productId))
      .then((response: any) => {
        const art = response?.artPiece ? response.artPiece : response;
        setData(art);
        setIsLoading(false);
      })
      .catch((err: any) => {
        setError(err);
        setIsLoading(false);
      });
  }, [productId]);

  // Fetch artist data
  useEffect(() => {
    if (!data?.artist || !data?.id) return;
    setArtistLoading(true);
    setArtistError(null);
    artPieceService.getProductsByArtist(String(data.artist))
      .then((response: any) => {
        setArtistData(response);
        setArtistLoading(false);
      })
      .catch((err: any) => {
        setArtistError(err);
        setArtistLoading(false);
      });
  }, [data?.artist, data?.id]);

  // Fetch seller data
  useEffect(() => {
    if (!data?.userId) return;
    setSellerLoading(true);
    setSellerError(null);
    artPieceService.getProductsToSellByUser(String(data.userId))
      .then((response: any) => {
        setSellerData(response);
        setSellerLoading(false);
      })
      .catch((err: any) => {
        setSellerError(err);
        setSellerLoading(false);
      });
  }, [data?.userId]);

  // Fetch cart & liked items
  const fetchCartAndLiked = useCallback(async () => {
    if (!token || !data?.id) return;
    try {
      const [cartResp, likedResp] = await Promise.all([
        userService.getUsersCartItems(token),
        userService.getUsersLikedItems(token)
      ]);

      const cart = Array.isArray(cartResp)
        ? cartResp.map((i: any) => i.artPiece).filter(Boolean)
        : [];
      const liked = Array.isArray(likedResp)
        ? likedResp.map((i: any) => i.artPiece).filter(Boolean)
        : [];

      setUserCart(cart);
      setUserLikedItems(liked);
      setIsInCart(cart.some((it: any) => it.id === data.id));
      setIsFavorited(liked.some((it: any) => it.id === data.id));
    } catch (e) {
      console.error('Error refreshing cart/likes', e);
    }
  }, [token, data]);

  useEffect(() => {
    fetchCartAndLiked();
  }, [fetchCartAndLiked]);

  // Handlers
  const handleCartClick = async () => {
    if (!data?.id) return;
    try {
      await artPieceService.addProductToUsersCart(data.id, token);
      await fetchCartAndLiked();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFavoriteClick = async () => {
    if (!data?.id) return;
    try {
      await artPieceService.addToLikedItems(data.id, token);
      await fetchCartAndLiked();
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-[#B78370]">Error: {error.message}</p>;


  return (
    <div className="min-h-screen bg-[#F9F2EA] text-[#8A5A3B]">
      <Navbar />

      {isLoading ? (
        <p className="text-center py-10">Loading...</p>
      ) : error ? (
        <p className="text-center py-10 text-[#B78370]">Error: {error.message}</p>
      ) : data && (
        <>
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[#F9F2EA]/90 z-10"></div>
            </div>
            <div className="container relative z-20 mx-auto px-4 py-2 md:py-2"></div>
          </section>

          <div className={styles.container}>
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
                </div>
              </div>

              <div className={styles.productDetails}>
                <h1 className={styles.title}>{data.title}</h1>
                <p className={styles.artist}>{data.artist}</p>
                <p className={styles.dimensions}>Made in {data.year}</p>
                <p className={styles.price}>
                  {Number(data.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </p>
                <p className={styles.description}>{data.description}</p>
                
                {/* Authentication and delivery badges */}
                <div className="flex gap-4 mt-5 mb-4">
                  <div className="bg-[#F0E6D9] px-3 py-1 rounded-md text-xs flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Authenticity Guaranteed
                  </div>
                  <div className="bg-[#F0E6D9] px-3 py-1 rounded-md text-xs flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Delivery in 3-5 business days
                  </div>
                </div>
                
                {/* Action buttons moved here */}
                <div className="flex items-center gap-2 mt-4">
            <button
              className={styles.buyNowButton}
              onClick={handleCartClick}
            >
              {isInCart ? 'REMOVE FROM CART' : 'ADD TO CART'}
            </button>

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
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
              </div>
            </div>

            {/* More from artist */}
            <div className={styles.moreFromAuthor}>
              <h2 className={styles.moreFromAuthorTitle}>More from artist</h2>
              {(() => {
                if (artistLoading) {
                  return <p>Loading....</p>;
                } else if (artistData && artistData.length === 0) {
                  return <p>No other paintings found</p>;
                } else {
                  return (
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
                            <p className={styles.moreFromAuthorItemPrice}>
                              {Number(art.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                            </p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  );
                }
              })()}
              {artistError && <p className="text-[#B78370] mt-2">{artistError.message}</p>}
            </div>

            {/* More from seller */}
            <div className={styles.moreFromAuthor}>
              <h2 className={styles.moreFromAuthorTitle}>More from seller</h2>
              {sellerLoading ? (
                <p>Loading....</p>
              ) : sellerData && sellerData.length === 0 ? (
                <p>No other paintings found</p>
              ) : (
                <div className={styles.moreFromAuthorGrid}>
                  {sellerData?.map((art: any) => (
                    <div key={art.id} className={styles.moreFromAuthorItem}>
                      <Link href={`/product/${art.id}`}>
                        <div className={styles.moreFromAuthorImageWrapper}>
                          <img
                            src={art.url}
                            alt={`Seller product ${art.id}`}
                          />
                        </div>
                        <h3 className={styles.moreFromAuthorItemTitle}>{art.title}</h3>
                        <p className={styles.moreFromAuthorItemPrice}>
                          {Number(art.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {sellerError && <p className="text-[#B78370] mt-2">{sellerError.message}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SingleProductPage;