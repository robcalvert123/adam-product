'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getActivities } from '@/lib/firebase/activityUtils';
import { Activity } from '@/lib/types/activity';
import Link from 'next/link';

export default function AdminActivities() {
  const { loading: authLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Activities</h1>
        <Link
          href="/admin/activities/create"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Activity
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {activity.description}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="mr-4">📍 {activity.location}</span>
                      <span className="mr-4">👥 Ages {activity.ageRange.min}-{activity.ageRange.max}</span>
                      <span className="mr-4">💰 ${activity.price}</span>
                      <span>📅 {activity.date} at {activity.time}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {activity.category}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 