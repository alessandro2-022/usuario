
import React, { useEffect, useRef } from 'react';
import type { UserLocation } from '../types';

declare const L: any; 

interface MapProps {
  userLocation: UserLocation | null;
  destinationLocation: UserLocation | null;
  driverLocation: UserLocation | null;
}

const MapView: React.FC<MapProps> = ({ userLocation, destinationLocation, driverLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const userMarkerInstance = useRef<any>(null);
  const destinationMarkerInstance = useRef<any>(null);
  const driverMarkerInstance = useRef<any>(null);
  const driverToUserRoute = useRef<any>(null); // New ref for driver to user polyline
  const userToDestinationRoute = useRef<any>(null); // New ref for user to destination polyline


  const defaultCenter: [number, number] = [-23.55052, -46.633301];

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = L.map(mapContainer.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });
      
      // Changed to CartoDB Positron (Light) for a cleaner, more professional look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(mapInstance.current);
    }
  }, []);

  // Effect for user location
  useEffect(() => {
    if (mapInstance.current && userLocation) {
      const userLatLng: [number, number] = [userLocation.latitude, userLocation.longitude];

      // Only set view to user if no other specific markers are being tracked for bounds
      if (!destinationLocation && !driverLocation) {
        mapInstance.current.setView(userLatLng, 15);
      }

      if (userMarkerInstance.current) {
        userMarkerInstance.current.setLatLng(userLatLng);
      } else {
        // Create a custom pulsing blue dot for user location
        const userIcon = L.divIcon({
            className: 'css-icon',
            html: '<div class="w-4 h-4 bg-goly-blue rounded-full border-2 border-white shadow-lg relative"><div class="absolute inset-0 bg-goly-blue rounded-full animate-ping opacity-75"></div></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });
        userMarkerInstance.current = L.marker(userLatLng, { icon: userIcon }).addTo(mapInstance.current);
      }
      userMarkerInstance.current.bindPopup("<b>Você está aqui!</b>");
    }
  }, [userLocation]);

  // Effect for destination and driver markers, and map bounds
  useEffect(() => {
    if (!mapInstance.current) return;

    // Handle destination marker
    if (destinationLocation) {
      const destLatLng: [number, number] = [destinationLocation.latitude, destinationLocation.longitude];
      const destIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png', // Changed to black for contrast on light map
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      if (destinationMarkerInstance.current) {
        destinationMarkerInstance.current.setLatLng(destLatLng);
      } else {
        destinationMarkerInstance.current = L.marker(destLatLng, { icon: destIcon }).addTo(mapInstance.current);
      }
      destinationMarkerInstance.current.bindPopup("<b>Destino</b>").openPopup();

    } else if (destinationMarkerInstance.current) {
      mapInstance.current.removeLayer(destinationMarkerInstance.current);
      destinationMarkerInstance.current = null;
    }

    // Handle driver marker
    if (driverLocation) {
      const driverLatLng: [number, number] = [driverLocation.latitude, driverLocation.longitude];
      const carIcon = L.divIcon({
          html: `<svg class="h-10 w-10 text-goly-dark drop-shadow-lg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
          className: 'bg-transparent border-0',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
      });

      if (driverMarkerInstance.current) {
        driverMarkerInstance.current.setLatLng(driverLatLng);
      } else {
        driverMarkerInstance.current = L.marker(driverLatLng, { icon: carIcon }).addTo(mapInstance.current);
      }
       driverMarkerInstance.current.bindPopup("<b>Seu motorista</b>");
    } else if (driverMarkerInstance.current) {
        mapInstance.current.removeLayer(driverMarkerInstance.current);
        driverMarkerInstance.current = null;
    }

    // Handle route polylines
    // Clear existing routes
    if (driverToUserRoute.current) {
        mapInstance.current.removeLayer(driverToUserRoute.current);
        driverToUserRoute.current = null;
    }
    if (userToDestinationRoute.current) {
        mapInstance.current.removeLayer(userToDestinationRoute.current);
        userToDestinationRoute.current = null;
    }

    if (userLocation && destinationLocation && driverLocation) {
        const driverLatLng: [number, number] = [driverLocation.latitude, driverLocation.longitude];
        const userLatLng: [number, number] = [userLocation.latitude, userLocation.longitude];
        const destLatLng: [number, number] = [destinationLocation.latitude, destinationLocation.longitude];

        // Draw driver to user route (dashed line)
        driverToUserRoute.current = L.polyline([driverLatLng, userLatLng], {color: '#555', weight: 4, dashArray: '10, 10', opacity: 0.7}).addTo(mapInstance.current);
        
        // Draw user to destination route (solid line)
        // Using Goly Blue for the main route
        userToDestinationRoute.current = L.polyline([userLatLng, destLatLng], {color: '#007BFF', weight: 5, opacity: 0.9}).addTo(mapInstance.current);
    }

    // Adjust map bounds to fit all markers and route
    const markers = [userLocation, destinationLocation, driverLocation].filter(Boolean) as UserLocation[];
    if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map(m => [m.latitude, m.longitude]));
        mapInstance.current.fitBounds(bounds.pad(0.2)); // pad adds some margin
    } else if (markers.length === 1) {
        mapInstance.current.setView([markers[0].latitude, markers[0].longitude], 15);
    }

  }, [userLocation, destinationLocation, driverLocation]);

  return <div ref={mapContainer} className="absolute inset-0 z-10" />;
};

export default MapView;
