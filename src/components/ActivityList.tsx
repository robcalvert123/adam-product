'use client';

import { useEffect, useState } from 'react';
import { getActivities } from '@/lib/firebase/activityUtils';
import { Activity } from '@/lib/types/activity';
import Image from 'next/image';

export default function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const extractImageUrl = (url: string): string => {
    try {
      // If it's a Google Images URL, extract the actual image URL
      if (url.includes('google.com/imgres')) {
        const imgurlMatch = url.match(/imgurl=([^&]+)/);
        if (imgurlMatch) {
          return decodeURIComponent(imgurlMatch[1]);
        }
      }
      return url;
    } catch (error) {
      console.error('Error extracting image URL:', error);
      return url;
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivities();
        // Process the activities to extract direct image URLs
        const processedData = data.map(activity => ({
          ...activity,
          imageUrl: activity.imageUrl ? extractImageUrl(activity.imageUrl) : '',
        }));
        setActivities(processedData);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading activities...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          {activity.imageUrl && (
            <div className="relative h-48 w-full">
              <Image
                src={activity.imageUrl}
                alt={activity.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{activity.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {activity.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {activity.date} at {activity.time}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${activity.price}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Ages {activity.ageRange.min}-{activity.ageRange.max}
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {activity.category}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 