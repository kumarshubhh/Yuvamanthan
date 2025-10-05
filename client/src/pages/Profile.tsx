import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Camera
} from 'lucide-react';

interface ProfileFormData {
  name: string;
  bio: string;
  location: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleCancel = () => {
    reset({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || ''
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a service like Cloudinary
      // For demo purposes, we'll use a placeholder
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-primary-600" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 cursor-pointer hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {user?.name}
            </h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            
            {user?.bio && (
              <p className="text-gray-700 text-sm mb-4">{user.bio}</p>
            )}
            
            {user?.location && (
              <div className="flex items-center justify-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  type="text"
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field pl-10 bg-gray-50"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Email address cannot be changed
                </p>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  {...register('bio', {
                    maxLength: { value: 500, message: 'Bio must be less than 500 characters' }
                  })}
                  rows={4}
                  disabled={!isEditing}
                  className={`input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Brief description about yourself and your interests
                </p>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...register('location')}
                    type="text"
                    disabled={!isEditing}
                    className={`input-field pl-10 ${!isEditing ? 'bg-gray-50' : ''}`}
                    placeholder="City, State, Country"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Your general location (optional)
                </p>
              </div>
            </form>
          </div>

          {/* Account Statistics */}
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Account Statistics
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">0</div>
                <div className="text-gray-600">Problems Posted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">0</div>
                <div className="text-gray-600">Solutions Provided</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-2">0</div>
                <div className="text-gray-600">Total Votes</div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="card mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Account Actions
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Change Password</h3>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <button className="btn-outline">
                  Change Password
                </button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Download Data</h3>
                  <p className="text-sm text-gray-600">Download a copy of your data</p>
                </div>
                <button className="btn-outline">
                  Download
                </button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-600">Permanently delete your account</p>
                </div>
                <button className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

