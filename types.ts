
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  sources?: GroundingSource[];
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface DriverInfo {
    name: string;
    carModel: string;
    licensePlate: string;
    avatarUrl: string;
    location: UserLocation;
}

export interface UserProfile {
    name: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    avatarUrl: string;
    cpfCnpj?: string;
    mobilePhone?: string;
}

export interface RideHistoryItem {
    id: string;
    date: string;
    origin: string;
    destination: string;
    price: number;
    driverName: string;
    driverAvatar: string;
    rating?: number;
    status: 'COMPLETED' | 'CANCELLED';
    paymentMethod: string;
}

export type TripState = 'IDLE' | 'SEARCHING' | 'DRIVER_FOUND' | 'TRIP_COMPLETED';
