import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import axios from 'axios';

const ImageHistory = () => {
  const { getBackendUrl, token, imageHistory, historyLoading, loadImageHistory } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Load history when component mounts
  React.useEffect(() => {
    loadImageHistory();
  }, []);

  // Filter images based on favorite status
  const displayedImages = filter === 'favorites' 
    ? imageHistory.filter(img => img.isFavorite) 
    : imageHistory;

  const handleToggleFavorite = async (imageId) => {
    try {
      setOperationLoading(true);
      const backendUrl = getBackendUrl();
      const { data } = await axios.post(
        `${backendUrl}/api/image/toggle-favorite`,
        { imageId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadImageHistory();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error('Toggle favorite error:', err);
      toast.error('Failed to toggle favorite');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      setOperationLoading(true);
      const backendUrl = getBackendUrl();
      const { data } = await axios.post(
        `${backendUrl}/api/image/delete-image`,
        { imageId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success('Image deleted');
        await loadImageHistory();
        setSelectedImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error('Delete image error:', err);
      toast.error('Failed to delete image');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDownload = (imageUrl, prompt) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `generated-${prompt.slice(0, 20).replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download image');
    }
  };

  if (historyLoading) {
    return (
      <motion.div
        initial={{ opacity: 0.2, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your images...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">📸 Image Gallery</h1>
          
          {/* Filter Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'
              }`}
            >
              📷 All Images ({imageHistory.length})
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                filter === 'favorites'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-600'
              }`}
            >
              ⭐ Favorites ({imageHistory.filter(img => img.isFavorite).length})
            </button>
          </div>
        </div>

        {/* Empty State */}
        {displayedImages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-600 text-xl">
              {filter === 'favorites' 
                ? 'No favorite images yet. Mark some images as favorites!' 
                : 'No generated images yet. Start creating amazing images!'}
            </p>
            <a
              href="/result"
              className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Generate Your First Image
            </a>
          </motion.div>
        ) : (
          /* Image Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedImages.map((image) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div 
                  className="relative group cursor-pointer bg-gray-100 overflow-hidden"
                  onClick={() => setSelectedImage(image)}
                  style={{ paddingBottom: '100%', position: 'relative' }}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image.imageUrl, image.prompt);
                      }}
                      disabled={operationLoading}
                      className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  {/* Prompt */}
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2 font-medium">
                    {image.prompt}
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>
                      📅 {new Date(image.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit'
                      })}
                    </span>
                    {image.generationTime && (
                      <span>⏱️ {(image.generationTime / 1000).toFixed(2)}s</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleFavorite(image._id)}
                      disabled={operationLoading}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 ${
                        image.isFavorite
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {image.isFavorite ? '⭐' : '☆'} Favorite
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image._id)}
                      disabled={operationLoading}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300 disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Full Image Modal */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <div className="sticky top-0 right-0 flex justify-end p-4 bg-white border-b">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Image */}
              <div className="p-4">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="w-full h-auto rounded-lg mb-4"
                />

                {/* Details */}
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Prompt</h2>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                    {selectedImage.prompt}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">📅 Generated</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedImage.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {selectedImage.generationTime && (
                      <div>
                        <p className="text-gray-500">⏱️ Generation Time</p>
                        <p className="font-semibold text-gray-900">
                          {(selectedImage.generationTime / 1000).toFixed(2)} seconds
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.prompt)}
                    disabled={operationLoading}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => {
                      handleToggleFavorite(selectedImage._id);
                      setSelectedImage(null);
                    }}
                    disabled={operationLoading}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 ${
                      selectedImage.isFavorite
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedImage.isFavorite ? '⭐' : '☆'} Favorite
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteImage(selectedImage._id);
                      setSelectedImage(null);
                    }}
                    disabled={operationLoading}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ImageHistory;
