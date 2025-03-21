import { db } from './firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
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