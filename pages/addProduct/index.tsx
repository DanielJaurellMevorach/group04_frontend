import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import artPieceService from '../../services/artPiece.service';
import Navbar from '@/components/navbar';

interface ImageItem {
  id: string;
  file: File;
  url: string;
}

interface ThumbnailProps {
  image: ImageItem;
  removeImage: (id: string) => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  image,
  removeImage
}) => {
  return (
    <div
      className="relative group"
      style={{ width: '80px', height: '80px' }}
    >
      <img
        src={image.url}
        alt="Thumbnail"
        className="w-20 h-20 object-cover rounded-xl border-2 border-[#E5D5C8] shadow-md group-hover:shadow-lg transition-all duration-200"
      />
      <button
        type="button"
        onClick={() => removeImage(image.id)}
        className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="Remove image"
      >
        ✕
      </button>
    </div>
  );
};

// Main component
const AddProductPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.url));
    };
  }, [images]);
  
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

  // Optimized function to add image files
  const addImageFiles = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      id: `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, []);

  // Memoized handler for file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      addImageFiles(filesArray);
      
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [addImageFiles]);

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Optimized tag handling
  const handleTagKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = currentTag.trim();
      if (tag && !tags.includes(tag)) {
        setTags(prev => [...prev, tag]);
        setCurrentTag('');
      }
    }
  }, [currentTag, tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  }, []);

  // Improved image removal by ID
  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const handleCancel = useCallback(() => router.back(), [router]);

  // Optimize form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (images.length === 0) {
      setError('Please add at least one image');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      
      const url = await artPieceService.uploadImageToBlob(images[0].file);

      console.log(`url of the newly created image ${url}`);

      await artPieceService.uploadNewArtPiece({
        title,
        description,
        artist,
        price: parseFloat(price) || 0,
        year: parseInt(year, 10) || new Date().getFullYear(),
        tags,
        url: url
      });

      router.push('/users-art');
    } catch (err) {
      console.error(err);
      setError('Failed to upload art piece. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handling for the main container
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        addImageFiles(imageFiles);
      }
    }
  }, [addImageFiles]);

  const formatPrice = (priceValue: string) => {
    const numPrice = parseFloat(priceValue) || 0;
    return `${Number(numPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  };

  return (
    <div className="min-h-screen bg-[#F9F2EA] text-[#8A5A3B]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#F9F2EA] via-[#F5EDE4] to-[#E8DDD4] py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#c9a895] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-[#8A5A3B] rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-screen-xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#8A5A3B] mb-4 leading-tight">
              Add New Art Piece
            </h1>
            <p className="text-lg text-[#8A5A3B]/80 max-w-2xl mx-auto">
              Share your masterpiece with the world. Upload high-quality images and provide detailed information about your artwork.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Image Upload Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#8A5A3B] mb-2">Artwork Images</h2>
              <p className="text-[#8A5A3B]/70">Upload high-quality images of your artwork</p>
            </div>
            
            <div 
              className={`border-2 ${isDragActive ? 'border-[#c9a895] bg-[#c9a895]/5' : 'border-dashed border-[#c9a895]/50'} rounded-2xl p-8 transition-all duration-300 ${isDragActive ? 'scale-[1.02]' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Main Preview */}
              {images.length > 0 ? (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg">
                    <img
                      src={images[0].url}
                      alt="Main Preview"
                      className="w-full h-80 object-contain bg-gray-50"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-[#8A5A3B]">Primary Image</span>
                    </div>
                  </div>
                  
                  {/* Thumbnails */}
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <div key={image.id} className="flex-shrink-0">
                        <Thumbnail
                          image={image}
                          removeImage={removeImage}
                        />
                        {index === 0 && (
                          <div className="text-xs text-center mt-1 text-[#8A5A3B]/60">Main</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 bg-[#c9a895]/10 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#c9a895]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#8A5A3B] mb-2">Upload Artwork Images</h3>
                  <p className="text-[#8A5A3B]/60 mb-6">Drag and drop your images here, or click to browse</p>
                  
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="inline-flex items-center px-8 py-4 bg-[#c9a895] text-white rounded-xl hover:bg-[#b58c7a] focus:outline-none focus:ring-4 focus:ring-[#c9a895]/30 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Choose Files
                  </button>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading}
              />
            </div>
          </div>

          {/* Form Fields Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#8A5A3B] mb-2">Artwork Details</h2>
              <p className="text-[#8A5A3B]/70">Provide information about your artwork</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-[#8A5A3B] mb-3">
                    Artwork Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    autoComplete="off"
                    onChange={e => setTitle(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-[#E5D5C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a895] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter artwork title"
                  />
                </div>

                <div>
                  <label htmlFor="artist" className="block text-sm font-semibold text-[#8A5A3B] mb-3">
                    Artist Name *
                  </label>
                  <input
                    id="artist"
                    type="text"
                    autoComplete="off"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-[#E5D5C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a895] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                    placeholder="Enter artist name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-[#8A5A3B] mb-3">
                  Description *
                </label>
                <textarea
                  id="description"
                  autoComplete="off"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  disabled={loading}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#E5D5C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a895] focus:border-transparent bg-white/80 backdrop-blur-sm resize-none transition-all duration-200"
                  placeholder="Describe your artwork, its inspiration, techniques used..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-[#8A5A3B] mb-3">
                    Price (€) *
                  </label>
                  <div className="relative">
                    <input
                      id="price"
                      autoComplete="off"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 border border-[#E5D5C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a895] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                      placeholder="0.00"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8A5A3B]/60 font-medium">
                      €
                    </div>
                  </div>
                  {price && (
                    <p className="mt-2 text-sm text-[#8A5A3B]/60">
                      Display price: {formatPrice(price)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-semibold text-[#8A5A3B] mb-3">
                    Creation Date *
                  </label>
                  <input
                    id="year"
                    autoComplete="off"
                    type="date"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border border-[#E5D5C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a895] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tag-input" className="block text-sm font-semibold text-[#8A5A3B] mb-3">
                  Tags
                </label>
                <input
                  id="tag-input"
                  type="text"
                  placeholder="Add tags (press Enter to add)"
                  autoComplete="off"
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-[#E5D5C8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a895] focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200"
                />
                <div className="flex flex-wrap gap-3 mt-4">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center bg-[#c9a895]/10 text-[#8A5A3B] px-4 py-2 rounded-full border border-[#c9a895]/20">
                      <span className="font-medium">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-[#8A5A3B]/60 hover:text-[#8A5A3B] focus:outline-none transition-colors"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-8 border-t border-[#E5D5C8]">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-4 bg-[#c9a895] text-white rounded-xl hover:bg-[#b58c7a] focus:outline-none focus:ring-4 focus:ring-[#c9a895]/30 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg flex items-center justify-center min-w-[200px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Publish Art Piece
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-4 border-2 border-[#c9a895] text-[#8A5A3B] rounded-xl hover:bg-[#c9a895]/5 focus:outline-none focus:ring-4 focus:ring-[#c9a895]/30 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-lg min-w-[200px]"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;