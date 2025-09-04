export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  price: '$' | '$$' | '$$$';
  rating: number;
  distance: number; // in miles
  image: string;
  description: string;
  dietary: string[];
  deals?: string;
  estimatedTime: number; // minutes
}

export interface Filters {
  maxPrice: '$' | '$$' | '$$$';
  maxDistance: number;
  dietary: string[];
  minRating: number;
}