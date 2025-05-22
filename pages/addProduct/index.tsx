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
      className="relative"
      style={{ width: '64px', height: '64px' }}
    >
      <img
        src={image.url}
        alt="Thumbnail"
        className="w-16 h-16 object-cover rounded-lg border shadow-sm"
      />
      <button
        type="button"
        onClick={() => removeImage(image.id)}
        className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-xs text-red-600 hover:bg-gray-100 shadow-sm"
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
      await artPieceService.uploadNewArtPiece({
        images: images.map(img => img.file),
        title,
        description,
        artist,
        price: parseFloat(price) || 0,
        year: parseInt(year, 10) || new Date().getFullYear(),
        tags,
      });

      router.push('/');
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

  return (
    <div className="min-h-screen bg-[#F9F2EA] text-[#8A5A3B]">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#F9F2EA]/90 z-10"></div>
        </div>

        <div className="container relative z-20 mx-auto px-4 py-2 md:py-2"></div>

      </section>
    <div className="max-w-screen-lg mx-auto p-6">
      
      <h1 className="text-3xl font-bold mb-6">Upload A New Art Piece</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">
        {/* Enhanced Image Upload */}
        <div 
          className={`flex-1 border-2 ${isDragActive ? 'border-[#c9a895]' : 'border-dashed border-[#685b5a]'} rounded-lg p-4 flex flex-col justify-between relative`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Main Preview */}
            {images.length > 0 ? (
              <div className="w-full h-70 mb-4 relative">
                <img
                  src={images[0].url}
                  alt="Main Preview"
                  className="max-h-70 w-full object-contain mx-auto"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <svg className="w-20 h-20 text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">Drag and drop images here or</p>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image) => (
                  <Thumbnail
                    key={image.id}
                    image={image}
                    removeImage={removeImage}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleBrowseClick}
            className="mt-4 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center shadow-sm transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {images.length > 0 ? 'Add More Images' : 'Browse Files'}
          </button>
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
        {/* Image Upload End */}

        {/* Form Fields */}
        <div className="flex-1 space-y-4">
          <div>
            <label htmlFor="title" className="block font-semibold mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              autoComplete="off"
              onChange={e => setTitle(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label htmlFor="artist" className="block font-semibold mb-1">Artist</label>
            <input
              id="artist"
              type="text"
              autoComplete="off"
              value={artist}
              onChange={e => setArtist(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-1">Description</label>
            <textarea
              id="description"
              autoComplete="off"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300 resize-y h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block font-semibold mb-1">Price ($)</label>
              <input
                id="price"
                autoComplete="off"
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label htmlFor="year" className="block font-semibold mb-1">Year</label>
              <input
                id="year"
                autoComplete="off"
                type="date"
                value={year}
                onChange={e => setYear(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tag-input" className="block font-semibold mb-1">Tags</label>
            <input
              id="tag-input"
              type="text"
              placeholder="Add a tag and press Enter"
              autoComplete="off"
              value={currentTag}
              onChange={e => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span key={tag} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 focus:outline-none"
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#c9a895] text-white rounded-full hover:bg-[#b58c7a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c9a895] disabled:opacity-50 shadow-sm transition-colors"
            >
              {loading ? 'Saving...' : 'Publish Art Piece'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddProductPage;