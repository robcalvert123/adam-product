export interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  ageRange: {
    min: number;
    max: number;
  };
  price: number;
  date: string;
  time: string;
  tags: string[];
  imageUrl?: string;
  createdAt: string;
  createdBy: string;
} 