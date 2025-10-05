import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Camera, 
  Upload, 
  X, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ProblemFormData {
  title: string;
  description: string;
  location: string;
  category: string;
  priority: string;
  tags: string;
}

const CreateProblem: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<ProblemFormData>();

  const categories = [
    'Infrastructure', 'Environment', 'Social', 'Technology', 
    'Health', 'Education', 'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });
        
        // Reverse geocoding to get address
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=YOUR_API_KEY`)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              const address = data.results[0].formatted;
              setValue('location', address);
            }
          })
          .catch(() => {
            setValue('location', `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          });
      },
      (error) => {
        toast.error('Unable to retrieve your location');
        console.error('Geolocation error:', error);
      }
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        // For demo purposes, we'll use a placeholder image URL
        // In production, you'd upload to Cloudinary or similar service
        const mockImageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
        return mockImageUrl;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedImages]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProblemFormData) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (!coordinates) {
      toast.error('Please allow location access or enter coordinates manually');
      return;
    }

    try {
      const problemData = {
        ...data,
        images,
        coordinates,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await axios.post('/api/problems', problemData);
      toast.success('Problem posted successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post problem');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a Problem</h1>
        <p className="text-gray-600">
          Share a problem you've noticed in your community. Include photos and location details to help others understand the issue.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Problem Details</h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Problem Title *
              </label>
              <input
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 5, message: 'Title must be at least 5 characters' }
                })}
                type="text"
                className="input-field"
                placeholder="Brief description of the problem"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description *
              </label>
              <textarea
                {...register('description', {
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' }
                })}
                rows={4}
                className="input-field"
                placeholder="Provide detailed information about the problem, its impact, and any relevant context..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  {...register('priority')}
                  className="input-field"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                {...register('tags')}
                type="text"
                className="input-field"
                placeholder="e.g., traffic, safety, maintenance"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add relevant tags to help others find and categorize this problem
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="btn-secondary flex items-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Use Current Location</span>
              </button>
              {coordinates && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">Location detected</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location Address *
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className="input-field"
                placeholder="Enter the specific location or address"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {coordinates && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Coordinates:</p>
                <p className="text-sm font-mono">
                  Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Images</h2>
          
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-gray-600">Upload photos of the problem</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn-primary inline-flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Choose Images</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Problem image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800 text-sm">
                    At least one image is required to help others understand the problem.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Posting Problem...
              </>
            ) : (
              'Post Problem'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblem;

