'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const testFirebaseConnection = async () => {
      try {
        console.log('Starting Firebase connection test...');
        
        // Try to add a test document
        const testCollection = collection(db, 'test_connection');
        console.log('Attempting to add document...');
        
        const docRef = await addDoc(testCollection, {
          timestamp: new Date(),
          test: 'connection'
        });
        console.log('Document added successfully:', docRef.id);

        // Try to read it back
        console.log('Attempting to read document...');
        const querySnapshot = await getDocs(testCollection);
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Documents retrieved:', documents);

        setStatus('success');
      } catch (err) {
        console.error('Detailed Firebase error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('error');
      }
    };

    testFirebaseConnection();
  }, []);

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-xl font-semibold mb-2">Firebase Connection Test</h2>
      {status === 'loading' && (
        <p className="text-blue-500">Testing Firebase connection...</p>
      )}
      {status === 'success' && (
        <p className="text-green-500">✅ Firebase connection successful!</p>
      )}
      {status === 'error' && (
        <div className="text-red-500">
          <p>❌ Firebase connection failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
} 