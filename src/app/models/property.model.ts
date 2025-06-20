export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  images: string[];
  agent: {
    name: string;
    phone: string;
    agency: string;
  };
  year_built: number;
  property_type: string;
  listing_status: string;
}
