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

export type TripState = 'IDLE' | 'SEARCHING' | 'DRIVER_FOUND' | 'TRIP_COMPLETED';