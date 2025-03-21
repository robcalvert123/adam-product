import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Activity } from '../types/activity';

export const createActivity = async (activity: Omit<Activity, 'id' | 'createdAt' | 'createdBy'>) => {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activity,
      createdAt: new Date().toISOString(),
      createdBy: 'user-id', // This will be replaced with actual user ID from AuthContext
    });
    return { id: docRef.id, ...activity };
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

export const getActivities = async (): Promise<Activity[]> => {
  try {
    const activitiesQuery = query(collection(db, 'activities'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(activitiesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Activity));
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

export const getAllTags = async (): Promise<string[]> => {
  try {
    const tagsDoc = await getDoc(doc(db, 'metadata', 'tags'));
    if (tagsDoc.exists()) {
      return tagsDoc.data().tags || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

export const addNewTag = async (tag: string): Promise<void> => {
  try {
    const tagsDocRef = doc(db, 'metadata', 'tags');
    const tagsDoc = await getDoc(tagsDocRef);
    
    if (!tagsDoc.exists()) {
      // Create the document if it doesn't exist
      await setDoc(tagsDocRef, {
        tags: [tag]
      });
    } else {
      const currentTags = tagsDoc.data().tags || [];
      if (!currentTags.includes(tag)) {
        await updateDoc(tagsDocRef, {
          tags: [...currentTags, tag]
        });
      }
    }
  } catch (error) {
    console.error('Error adding tag:', error);
    throw error;
  }
}; 