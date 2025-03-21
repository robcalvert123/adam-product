'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import ActivityForm from '@/components/ActivityForm';
import Link from 'next/link';

export default function CreateActivity() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Activity</h1>
        <Link
          href="/admin/activities"
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Activities
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <ActivityForm />
      </div>
    </div>
  );
} 