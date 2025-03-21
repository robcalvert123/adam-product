'use client';

import { useState, useEffect } from 'react';
import { createActivity, getAllTags, addNewTag } from '@/lib/firebase/activityUtils';
import { Activity } from '@/lib/types/activity';

export default function ActivityForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    ageRange: { min: 0, max: 0 },
    price: 0,
    date: '',
    time: '',
    tags: [] as string[],
    imageUrl: '',
  });

  const [newTag, setNewTag] = useState('');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getAllTags();
      setAvailableTags(tags);
    };
    fetchTags();
  }, []);

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

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTag(value);
    
    if (value.trim()) {
      const filtered = availableTags.filter(tag => 
        tag.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleTagKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedTag = newTag.trim();
      if (trimmedTag && !formData.tags.includes(trimmedTag)) {
        await handleAddTag(trimmedTag);
      }
    }
  };

  const handleAddTag = async (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      // If it's a new tag, add it to the available tags
      if (!availableTags.includes(trimmedTag)) {
        await addNewTag(trimmedTag);
        setAvailableTags(prev => [...prev, trimmedTag]);
      }
      
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTag('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activityData = {
        ...formData,
        imageUrl: formData.imageUrl ? extractImageUrl(formData.imageUrl) : '',
      };
      await createActivity(activityData);
      setFormData({
        title: '',
        description: '',
        location: '',
        ageRange: { min: 0, max: 0 },
        price: 0,
        date: '',
        time: '',
        tags: [],
        imageUrl: '',
      });
      setNewTag('');
      setSuggestions([]);
      setShowSuggestions(false);
      alert('Activity created successfully!');
    } catch (error) {
      console.error('Error creating activity:', error);
      alert('Failed to create activity');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'minAge' || name === 'maxAge') {
      setFormData(prev => ({
        ...prev,
        ageRange: {
          ...prev.ageRange,
          [name === 'minAge' ? 'min' : 'max']: parseInt(value),
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minAge" className="block text-sm font-medium text-gray-700">Minimum Age</label>
          <input
            type="number"
            id="minAge"
            name="minAge"
            value={formData.ageRange.min}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700">Maximum Age</label>
          <input
            type="number"
            id="maxAge"
            name="maxAge"
            value={formData.ageRange.max}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-1 relative">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              id="tags"
              value={newTag}
              onChange={handleTagInputChange}
              onKeyDown={handleTagKeyDown}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Type to search or create a new tag"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {showSuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                <ul className="py-1 text-base">
                  {suggestions.length > 0 ? (
                    suggestions.map((tag) => (
                      <li
                        key={tag}
                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                        onClick={() => handleAddTag(tag)}
                      >
                        {tag}
                      </li>
                    ))
                  ) : (
                    <li
                      className="px-4 py-2 text-gray-500 italic"
                    >
                      Press Enter to create "{newTag.trim()}"
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Activity
      </button>
    </form>
  );
} 