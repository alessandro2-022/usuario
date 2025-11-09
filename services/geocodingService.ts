import type { UserLocation } from '../types';

/**
 * Converts an address string into geographic coordinates using the Nominatim API.
 * @param address The address to geocode.
 * @returns A promise that resolves to a UserLocation object or null if not found.
 */
export const geocodeAddress = async (address: string): Promise<UserLocation | null> => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding service returned status ${response.status}`);
    }
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
