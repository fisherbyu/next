// components/ImageUpload.tsx
'use client';

import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

const ImageUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      setUploadStatus('Please drop an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);

    // Prepare form data for upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadStatus('Uploading...');
      const response = await fetch('/api/uploadPhoto', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      setPreview(data.url);
      setUploadStatus('Upload successful!');
    } catch (error) {
      if (error instanceof Error) {
        setUploadStatus('Upload failed: ' + error.message);
      } else {
        setUploadStatus('Upload failed: Unknown error');
      }
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop your image here
        </p>
        <p className="text-xs text-gray-500">
          Supports: JPG, PNG, GIF
        </p>
        
        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto rounded"
            />
          </div>
        )}
        
        {uploadStatus && (
          <p className="mt-2 text-sm text-gray-600">
            {uploadStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;