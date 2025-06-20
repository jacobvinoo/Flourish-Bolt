'use client';

import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, FileImage, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  uploading?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  showPreview?: boolean;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  uploading = false,
  disabled = false,
  accept = 'image/jpeg,image/png,image/jpg',
  maxSize = 10,
  className,
  showPreview = true,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate preview URL when file is selected
  React.useEffect(() => {
    if (selectedFile && showPreview) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [selectedFile, showPreview]);

  const validateFile = (file: File): string | null => {
    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return fileType.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      return `Please select a valid file type. Accepted formats: ${accept}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size must be less than ${maxSize}MB. Current size: ${fileSizeMB.toFixed(2)}MB`;
    }

    return null;
  };

  const handleFileSelection = useCallback((file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    onFileSelect(file);
  }, [onFileSelect, accept, maxSize]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, [disabled, uploading, handleFileSelection]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  }, [handleFileSelection]);

  const handleRemove = useCallback(() => {
    setError(null);
    setPreview(null);
    onFileRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileRemove]);

  const openFileDialog = useCallback(() => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, uploading]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Main upload area */}
      {!selectedFile ? (
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
            dragActive
              ? 'border-primary bg-primary/5 scale-[1.02]'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary/50',
            disabled || uploading
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50',
            error && 'border-red-300 bg-red-50 dark:bg-red-900/20'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
              error 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-gray-100 dark:bg-gray-800'
            )}>
              {uploading ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : error ? (
                <AlertCircle className="h-8 w-8 text-red-500" />
              ) : (
                <Upload className={cn(
                  'h-8 w-8 transition-colors',
                  dragActive ? 'text-primary' : 'text-gray-400'
                )} />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {uploading ? 'Uploading...' : 'Drop your image here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or <span className="text-primary font-medium">click to browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: {accept.replace(/image\//g, '').toUpperCase()} • Max size: {maxSize}MB
              </p>
            </div>
          </div>

          {dragActive && (
            <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center">
              <p className="text-primary font-medium">Drop to upload</p>
            </div>
          )}
        </div>
      ) : (
        /* Selected file preview */
        <div className="space-y-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-900">
            <div className="flex items-start space-x-4">
              {/* File preview */}
              {preview && showPreview ? (
                <div className="flex-shrink-0">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <FileImage className="h-8 w-8 text-gray-400" />
                </div>
              )}

              {/* File details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Ready to upload
                      </span>
                    </div>
                  </div>

                  {/* Remove button */}
                  <Button
                    onClick={handleRemove}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                    disabled={uploading}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload progress */}
            {uploading && (
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Replace file option */}
          <div className="text-center">
            <Button
              onClick={openFileDialog}
              variant="outline"
              size="sm"
              disabled={uploading}
              className="text-xs"
            >
              <Upload className="h-3 w-3 mr-1" />
              Choose different file
            </Button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Upload tips */}
      {!selectedFile && !error && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
            📸 Tips for best results:
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Ensure good lighting with no shadows</li>
            <li>• Take photo straight on (not at an angle)</li>
            <li>• Make sure all text is clearly visible</li>
            <li>• Include the entire worksheet in frame</li>
          </ul>
        </div>
      )}
    </div>
  );
}