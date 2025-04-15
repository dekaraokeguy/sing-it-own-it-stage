
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  orderBy, 
  updateDoc,
  doc,
  where,
  increment,
  getDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// Performance types
export interface Performance {
  id: string;
  title: string;
  url: string;
  uploader_name: string;
  votes: number;
  photo_url: string;
  created_at: Date;
}

// Get all performances
export const getPerformances = async (): Promise<Performance[]> => {
  try {
    const performancesQuery = query(
      collection(db, 'performances'), 
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(performancesQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || data.song_title,
        url: data.url || data.video_url,
        uploader_name: data.uploader_name,
        votes: data.votes || 0,
        photo_url: data.photo_url || data.thumbnail_url || '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png',
        created_at: data.created_at?.toDate() || new Date()
      };
    });
  } catch (error) {
    console.error('Error getting performances:', error);
    return [];
  }
};

// Add a new performance
export const addPerformance = async (
  title: string, 
  videoFile: File, 
  uploaderName: string,
  thumbnailFile?: File
) => {
  try {
    // Upload video to storage
    const videoRef = ref(storage, `performances/${Date.now()}-${videoFile.name}`);
    const videoSnapshot = await uploadBytes(videoRef, videoFile);
    const videoUrl = await getDownloadURL(videoSnapshot.ref);
    
    // Upload thumbnail if provided
    let thumbnailUrl = '';
    if (thumbnailFile) {
      const thumbnailRef = ref(storage, `thumbnails/${Date.now()}-${thumbnailFile.name}`);
      const thumbnailSnapshot = await uploadBytes(thumbnailRef, thumbnailFile);
      thumbnailUrl = await getDownloadURL(thumbnailSnapshot.ref);
    }
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'performances'), {
      title,
      song_title: title, // for backwards compatibility
      url: videoUrl,
      video_url: videoUrl, // for backwards compatibility
      uploader_name: uploaderName,
      votes: 0,
      photo_url: thumbnailUrl,
      thumbnail_url: thumbnailUrl, // for backwards compatibility
      created_at: Timestamp.now()
    });
    
    return { id: docRef.id, error: null };
  } catch (error: any) {
    console.error('Error adding performance:', error);
    return { id: null, error: error.message };
  }
};

// Vote for a performance
export const voteForPerformance = async (
  performanceId: string, 
  userId: string, 
  rating: number
) => {
  try {
    // Record the vote
    await addDoc(collection(db, 'votes'), {
      performance_id: performanceId,
      user_id: userId,
      rating,
      created_at: Timestamp.now()
    });
    
    // Increment the vote count on the performance
    const performanceRef = doc(db, 'performances', performanceId);
    await updateDoc(performanceRef, {
      votes: increment(1)
    });
    
    return { error: null };
  } catch (error: any) {
    console.error('Error voting:', error);
    return { error: error.message };
  }
};

// Check if a user has already voted for a performance
export const hasUserVoted = async (performanceId: string, userId: string) => {
  try {
    const votesQuery = query(
      collection(db, 'votes'),
      where('performance_id', '==', performanceId),
      where('user_id', '==', userId)
    );
    
    const querySnapshot = await getDocs(votesQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking vote status:', error);
    return false;
  }
};

// Save user profile
export const saveUserProfile = async (userId: string, phoneNumber: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      phone_number: phoneNumber,
      created_at: Timestamp.now()
    }, { merge: true });
    
    return { error: null };
  } catch (error: any) {
    console.error('Error saving user profile:', error);
    return { error: error.message };
  }
};

// Get user profile by ID
export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return { profile: docSnap.data(), error: null };
    } else {
      return { profile: null, error: 'User not found' };
    }
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    return { profile: null, error: error.message };
  }
};
