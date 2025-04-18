import React, { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/SingleProductPage.module.css';
import paintingImage1 from './public/painting1.webp'
import paintingImage2 from './public/painting2.jpg'
import monaLisaImage from './public/monaLisa.jpg';
import dinner from './public/dinner.jpg';

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
  
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/shop">Shop</Link>
          <span> &gt; </span>
          <Link href="/shop/leonardo-da-vinci">Leonardo da Vinci</Link>
          <span> &gt; </span>
          <span>Vitruvian Man</span>
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
                <Image 
                  src={productImages[currentImageIndex]}
                  alt={`Product image ${currentImageIndex + 1}`}
                  width={500} 
                  height={600}
                  objectFit="cover"
                  className={styles.slideImage}
                />
                
                {showZoom && !isHoveringArrow && (
                  <div 
                    className={styles.zoomWindow}
                    style={{
                      left: `${mousePosition.x}px`,
                      top: `${mousePosition.y}px`,
                      backgroundImage: `url(${productImages[currentImageIndex].src})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                    }}
                  />
                )}
                
                {productImages.length > 1 && (
                  <>
                    <button 
                      className={`${styles.arrowButton} ${styles.prevButton}`}
                      onClick={goToPrevImage}
                      onMouseEnter={handleArrowMouseEnter}
                      onMouseLeave={handleArrowMouseLeave}
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    
                    <button 
                      className={`${styles.arrowButton} ${styles.nextButton}`}
                      onClick={goToNextImage}
                      onMouseEnter={handleArrowMouseEnter}
                      onMouseLeave={handleArrowMouseLeave}
                      aria-label="Next image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {productImages.length > 1 && (
                <div className={styles.indicators}>
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.indicator} ${
                      currentImageIndex === index ? styles.activeIndicator : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {productImages.length > 1 && (
                <div className={styles.thumbnailGallery}>
                  {productImages.map((image, index) => (
                    <div 
                      key={index}
                      className={`${styles.thumbnail} ${
                      currentImageIndex === index ? styles.activeThumbnail : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <div className={styles.thumbnailImageWrapper}>
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        <div className={styles.productDetails}>
          <h1 className={styles.title}>Vitruvian Man</h1>
          <p className={styles.artist}>Leonardo da Vinci</p>
          <p className={styles.dimensions}>8X12</p>
          
          <p className={styles.price}>$10,000,000.00</p>
          
          <p className={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          
          <div className={styles.actions}>
            <button className={styles.addToCartButton}>ADD TO CART</button>
            
            <button 
            className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={isFavorited ? "#e25555" : "none"} 
                stroke={isFavorited ? "#e25555" : "currentColor"} 
                strokeWidth="2" 
                className={styles.heartIcon}
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            </button>

          </div>
          
          <div className={styles.buyNowBidButtons}>
            <button className={styles.buyNowButton}>BUY NOW</button>
            <button className={styles.placeBidButton}>PLACE BID</button>
          </div>
        </div>
      </div>
        
        <div className={styles.moreLikeThis}>
        <h2 className={styles.moreLikeThisTitle}>More like this</h2>
        <div className={styles.moreLikeThisGrid}>
            {[...Array(4)].map((_, index) => (
            <div key={index} className={styles.moreLikeThisItem}>
                <Link href={`/shop/product/${index + 1}`}>
                <div className={styles.moreLikeThisImageWrapper}>
                    <Image 
                    src={paintingImage1} 
                    alt={`Similar product ${index + 1}`} 
                    layout="fill"
                    objectFit="cover"
                    />
                </div>
                <h3 className={styles.moreLikeThisItemTitle}>
                    {index === 0 ? "Woman Portrait" : 
                    index === 1 ? "Abstract Form" : 
                    index === 2 ? "Color Study" : 
                    "Renaissance Collection"}
                </h3>
                <p className={styles.moreLikeThisItemPrice}>
                    ${(200 + index * 50).toLocaleString()}.00
                </p>
                </Link>
            </div>
            ))}
        </div>
        </div>

        <div className={styles.moreFromAuthor}>
          <h2 className={styles.moreFromAuthorTitle}>More from artist</h2>
          <div className={styles.moreFromAuthorGrid}>
            {artistPaintings.map((image, index) => (
              <div key={index} className={styles.moreFromAuthorItem}>
                <Link href={`/shop/author/${index + 1}`}>
                  <div className={styles.moreFromAuthorImageWrapper}>
                    <Image 
                      src={image} 
                      alt={`Author product ${index + 1}`} 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h3 className={styles.moreFromAuthorItemTitle}>
                    {index === 0 ? "Mona Lisa" : "The Last Supper"}
                  </h3>
                  <p className={styles.moreFromAuthorItemPrice}>
                    ${(300 + index * 100).toLocaleString()}.00
                  </p>
                </Link>
              </div>
            ))}
          </div>
          </div>
    
    </div>
      
  );
};

export default SingleProductPage;