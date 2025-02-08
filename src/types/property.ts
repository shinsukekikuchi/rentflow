export interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  features: string[];
  available: boolean;
  pet_friendly: boolean;
  distance_to_station: number;
  freelancer_friendly: boolean;
}
