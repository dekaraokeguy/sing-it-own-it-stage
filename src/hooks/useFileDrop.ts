
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseFileDropProps {
  maxSize: number;
  fileType: 'video' | 'image';
}

export const useFileDrop = ({ maxSize, fileType }: UseFileDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDrop = useCallback((e: React.DragEvent, setter: (file: File | null) => void) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const isCorrectType = fileType === 'video' ? 
        file.type.startsWith('video/') : 
        file.type.startsWith('image/');
      
      if (!isCorrectType) {
        toast.error(`Please drop a ${fileType} file.`);
        return;
      }
      
      if (file.size > maxSize) {
        toast.error(`${fileType === 'video' ? 'Video' : 'Image'} file must be under ${maxSize / (1024 * 1024)}MB.`);
        return;
      }
      
      setter(file);
    }
  }, [maxSize, fileType]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    handleDrop,
    handleDragOver,
    handleDragEnter,
    handleDragLeave
  };
};
