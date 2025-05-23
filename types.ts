export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  features: string[];
  video?: string;
  images: string[];           
  createdAt: string | number; 
}
