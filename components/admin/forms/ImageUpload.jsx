'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { uploader } from '@/utils/adminApi';

export default function ImageUpload({ 
  label, 
  value, 
  onChange, 
  required = false,
  error 
}) {
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notifyError('لطفاً یک فایل تصویری انتخاب کنید');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notifyError('حجم فایل نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    try {
      setIsUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const response = await uploader.uploadImage(file, authenticatedFetch);
      
      // Construct image URL
      const imageUrl = `/images/${response.data.filename}`;
      
      // Update value
      onChange(imageUrl);
      notifySuccess(getSuccessMessage('upload', ENTITY_NAMES.image));
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.image);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        {/* Preview or upload button */}
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -left-2 p-1 bg-red-500 text-white rounded-full
                       hover:bg-red-600 transition-colors shadow-lg"
              aria-label="حذف تصویر"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-col items-center justify-center w-full h-32
                     border-2 border-dashed border-gray-300 rounded-lg
                     hover:border-primary hover:bg-primary/5
                     transition-colors cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <span className="text-sm text-gray-600">در حال آپلود...</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-700 mb-1">
                  انتخاب تصویر
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF تا 5MB
                </span>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

