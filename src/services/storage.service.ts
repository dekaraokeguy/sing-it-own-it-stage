
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

// Upload a file to Firebase Storage
export const uploadFile = async (
  file: File,
  path: string,
  useCustomName: boolean = false
): Promise<{url: string; path: string} | null> => {
  try {
    // Generate a unique filename or use the original
    const fileName = useCustomName ? file.name : `${uuidv4()}_${file.name.replace(/\s+/g, '_')}`;
    const fullPath = `${path}/${fileName}`;
    
    // Create storage reference
    const storageRef = ref(storage, fullPath);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      path: fullPath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path: string): Promise<boolean> => {
  try {
    // Create reference to the file
    const storageRef = ref(storage, path);
    
    // Delete the file
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Get a download URL for a file in Firebase Storage
export const getFileUrl = async (path: string): Promise<string | null> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    return null;
  }
};
