
import React from 'react';
import { Label } from '@/components/ui/label';
import { FileUploadProps } from '@/types/upload.types';
import { useFileDrop } from '@/hooks/useFileDrop';
import { Camera, Upload } from 'lucide-react';
import { toast } from 'sonner';

export const FileUploadBox: React.FC<FileUploadProps> = ({
  id,
  label,
  accept,
  maxSize,
  file,
  onChange,
  errorMessage
}) => {
  const isVideo = accept.includes('video');
  const { isDragging, handleDrop, handleDragOver, handleDragEnter, handleDragLeave } = useFileDrop({
    maxSize,
    fileType: isVideo ? 'video' : 'image'
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > maxSize) {
        const sizeMB = maxSize / (1024 * 1024);
        toast.error(`File must be under ${sizeMB}MB.`);
        return;
      }
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white flex items-center">
        {isVideo ? <Upload className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
        {label}
      </Label>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
          isDragging ? 'border-karaoke-yellow bg-karaoke-yellow/10' : 'border-white/30'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, onChange)}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
          {isVideo ? 
            <Upload className="h-12 w-12 text-white/70 mb-2" /> : 
            <Camera className="h-8 w-8 text-white/70 mb-1" />
          }
          <p className="text-center text-white/80">
            {file ? file.name : `Drag & drop ${isVideo ? 'video' : 'image'} here or click to browse`}
          </p>
          <p className="text-xs text-white/70 mt-1">Max size: {maxSize / (1024 * 1024)}MB</p>
        </label>
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};
