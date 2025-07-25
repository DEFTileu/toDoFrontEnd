import React, { useState, useRef } from 'react';
import { Camera, Upload, User, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../common/Button';
import { getInitials } from '../../utils/formatters';

interface AvatarUploadProps {
  currentAvatar?: string;
  userName: string;
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  userName,
  onUpload,
  isUploading = false
}) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await onUpload(selectedFile);
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayAvatar = previewUrl || currentAvatar;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative group">
        {displayAvatar ? (
          <img
            src={displayAvatar}
            alt={userName}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
            {getInitials(userName)}
          </div>
        )}
        
        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <Camera className="w-8 h-8 text-white" />
        </div>
        
        {/* Upload Button Overlay */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute inset-0 rounded-full cursor-pointer disabled:cursor-not-allowed"
          aria-label="Upload avatar"
        />
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Controls */}
      {selectedFile && (
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleUpload}
            loading={isUploading}
            disabled={isUploading}
            size="sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('profile.uploadAvatar')}
          </Button>
          <Button
            onClick={handleCancel}
            variant="secondary"
            size="sm"
            disabled={isUploading}
          >
            <X className="w-4 h-4 mr-2" />
            {t('profile.cancelUpload')}
          </Button>
        </div>
      )}

      {/* Upload Button (when no file selected) */}
      {!selectedFile && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="secondary"
          size="sm"
          disabled={isUploading}
        >
          <Camera className="w-4 h-4 mr-2" />
          {t('profile.changeAvatar')}
        </Button>
      )}

      {/* File Info */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        {t('profile.supportedFormats')}
      </p>
    </div>
  );
};