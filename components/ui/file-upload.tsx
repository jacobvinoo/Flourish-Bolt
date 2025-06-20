'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, FileImage, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  uploading?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  uploading = false,
  disabled = false,
  accept = 'image/*',
  maxSize = 5,
  className = ''
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File is too large. Maximum size is ${maxSize}MB.`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload an image file.');
      } else {
        setError('File upload failed. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
    }
  }, [onFileSelect, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false,
    disabled: disabled || uploading
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile) {
    return (
      <Card className={`border-2 border-dashed border-primary/20 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileImage className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {!uploading && !disabled && (
              <Button
                onClick={onFileRemove}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {uploading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Uploading...</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card 
        {...getRootProps()} 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${
              isDragActive ? 'bg-primary/20' : 'bg-muted'
            }`}>
              <Upload className={`h-8 w-8 ${
                isDragActive ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop your image here' : 'Upload your worksheet'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop an image file, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPEG, PNG, GIF up to {maxSize}MB
              </p>
            </div>
            
            <Button variant="outline" disabled={disabled}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
}