
import { Timestamp } from 'firebase/firestore';

// Convert Firestore timestamps to JavaScript dates
export const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  const result: any = { ...data };
  
  Object.keys(result).forEach(key => {
    // Check if the value is a Firestore Timestamp
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    }
    // Check if it's an object (but not an array or null) that might contain nested timestamps
    else if (
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      !(result[key] instanceof Date)
    ) {
      result[key] = convertTimestamps(result[key]);
    }
    // Handle arrays of objects that might contain timestamps
    else if (Array.isArray(result[key])) {
      result[key] = result[key].map((item: any) => {
        if (item && typeof item === 'object') {
          return convertTimestamps(item);
        }
        return item;
      });
    }
  });
  
  return result;
};
