'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  createProfile,
  getProfile,
  updateProfile,
} from '@/action/profile/profile.action';
import {
  ProfileAuthenticatedResponse,
  ProfilePayload,
  ProfileUpdatePayload,
} from '@/types/profile.types';

interface FormErrors {
  [key: string]: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  const [profile, setProfile] = useState<ProfileAuthenticatedResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<
    ProfilePayload & { id?: string }
  >({
    full_name: '',
    summary: '',
    headline: '',
    resume_link: '',
    cover_letter_link: '',
    links: [],
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!authLoading && !token) {
      router.push('/login');
      return;
    }

    if (token && !profile && !isLoading) {
      fetchProfile();
    }
  }, [token, authLoading, router]);

  const fetchProfile = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getProfile(token);

      if (result.success && result.data) {
        setProfile(result.data);
        setFormData({
          id: result.data.id,
          full_name: result.data.full_name,
          summary: result.data.summary || '',
          headline: result.data.headline || '',
          resume_link: result.data.resume_link || '',
          cover_letter_link: result.data.cover_letter_link || '',
          links: result.data.links || [],
        });
        setIsEditing(false);
      } else {
        setProfile(null);
        setIsEditing(true);
      }
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    fetchProfile();
  }, [token, authLoading]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.full_name?.trim()) {
      errors.full_name = 'Full name is required';
    }

    if (
      formData.resume_link &&
      !isValidUrl(formData.resume_link)
    ) {
      errors.resume_link = 'Invalid resume link URL';
    }

    if (
      formData.cover_letter_link &&
      !isValidUrl(formData.cover_letter_link)
    ) {
      errors.cover_letter_link = 'Invalid cover letter link URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts editing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError('Authentication token not found');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let result;

      if (profile) {
        // Update existing profile
        const updatePayload: ProfileUpdatePayload = {
          full_name: formData.full_name,
          summary: formData.summary || undefined,
          headline: formData.headline || undefined,
          resume_link: formData.resume_link || undefined,
          cover_letter_link: formData.cover_letter_link || undefined,
          links: formData.links && formData.links.length > 0 ? formData.links : undefined,
        };

        result = await updateProfile(token, updatePayload);
      } else {
        // Create new profile
        const createPayload: ProfilePayload = {
          full_name: formData.full_name,
          summary: formData.summary || undefined,
          headline: formData.headline || undefined,
          resume_link: formData.resume_link || undefined,
          cover_letter_link: formData.cover_letter_link || undefined,
          links: formData.links && formData.links.length > 0 ? formData.links : undefined,
        };

        result = await createProfile(createPayload, token);
      }

      if (result.success) {
        setSuccessMessage(
          profile ? 'Profile updated successfully!' : 'Profile created successfully!',
        );
        setIsEditing(false);
        // Refresh profile data
        await fetchProfile();
      } else {
        setError(result.message || 'Failed to save profile');
      }
    } catch (err) {
      setError('An error occurred while saving profile');
      console.error('Error saving profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {profile ? 'Your Profile' : 'Create Your Profile'}
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {profile && !isEditing ? (
          // Display profile
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <p className="mt-1 text-gray-900">{profile.full_name}</p>
            </div>

            {profile.headline && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Headline
                </label>
                <p className="mt-1 text-gray-900">{profile.headline}</p>
              </div>
            )}

            {profile.summary && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Summary
                </label>
                <p className="mt-1 text-gray-900">{profile.summary}</p>
              </div>
            )}

            {profile.resume_link && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Resume
                </label>
                <a
                  href={profile.resume_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-700 underline"
                >
                  View Resume
                </a>
              </div>
            )}

            {profile.cover_letter_link && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cover Letter
                </label>
                <a
                  href={profile.cover_letter_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-blue-600 hover:text-blue-700 underline"
                >
                  View Cover Letter
                </a>
              </div>
            )}

            <div className="pt-4 flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          // Edit/Create form
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.full_name
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />
              {formErrors.full_name && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.full_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="headline"
                className="block text-sm font-medium text-gray-700"
              >
                Headline
              </label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-gray-700"
              >
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label
                htmlFor="resume_link"
                className="block text-sm font-medium text-gray-700"
              >
                Resume Link
              </label>
              <input
                type="url"
                id="resume_link"
                name="resume_link"
                value={formData.resume_link}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.resume_link
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="https://example.com/resume.pdf"
              />
              {formErrors.resume_link && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.resume_link}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cover_letter_link"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Letter Link
              </label>
              <input
                type="url"
                id="cover_letter_link"
                name="cover_letter_link"
                value={formData.cover_letter_link}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.cover_letter_link
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="https://example.com/cover-letter.pdf"
              />
              {formErrors.cover_letter_link && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.cover_letter_link}
                </p>
              )}
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
              >
                {isSubmitting
                  ? 'Saving...'
                  : profile
                    ? 'Update Profile'
                    : 'Create Profile'}
              </button>
              {profile && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;