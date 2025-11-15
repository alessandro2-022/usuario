import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SideDrawer from './components/SideDrawer';
import MapPlaceholder from './components/MapPlaceholder';
import ServiceSelector from './components/ServiceSelector';
import LocationSearch from './components/LocationSearch';
import Chatbot from './components/Chatbot';
import TripStatus from './components/TripStatus';
import RatingModal from './components/RatingModal'; // Import the new RatingModal
import EmergencyButton from './components/EmergencyButton'; // Import the new EmergencyButton
import type { UserLocation, DriverInfo, TripState } from './types';
import { geocodeAddress } from './services/geocodingService';

// Helper function to calculate distance between two lat/lng points (Haversine formula)
const calculateDistance = (loc1: UserLocation, loc2: UserLocation): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
};

// Helper function to estimate travel time based on distance (simple linear model for simulation)
const estimateTravelTimeMinutes = (distanceKm: number): number => {
    // Assume average speed of 30 km/h = 0.5 km/min for simplicity
    const speedKmPerMin = 0.5; 
    return Math.max(1, Math.round(distanceKm / speedKmPerMin)); // Minimum 1 minute
};


const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [origin, setOrigin] = useState('Sua localização atual');
  const [destination, setDestination] = useState('');
  const [destinationLocation, setDestinationLocation] = useState<UserLocation | null>(null);
  const [tripState, setTripState] = useState<TripState>('IDLE');
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [driverEta, setDriverEta] = useState<string | null>(null); // New state for driver ETA
  const [driverDistance, setDriverDistance] = useState<string | null>(null); // New state for driver distance
  const [hasSentArrivingNotification, setHasSentArrivingNotification] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false); // New state for rating modal

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting geolocation: ", error);
      }
    );
  }, []);

  // Debounced geocoding effect
  useEffect(() => {
    if (destination.trim().length < 3) {
      setDestinationLocation(null);
      return;
    }

    const handler = setTimeout(() => {
      geocodeAddress(destination).then(location => {
        setDestinationLocation(location);
        if (!location) {
          console.warn(`Could not find location for: ${destination}`);
        }
      });
    }, 1000); // 1-second debounce after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [destination]);

  // Effect to simulate real-time driver movement and trip completion
  useEffect(() => {
    if (tripState !== 'DRIVER_FOUND' || !userLocation) {
      // Clear ETA and distance when not in DRIVER_FOUND state
      setDriverEta(null);
      setDriverDistance(null);
      return;
    }
    
    let intervalId: number | null = window.setInterval(() => {
      setDriver(currentDriver => {
        if (!currentDriver) {
          // If driver somehow becomes null while interval is active, stop it.
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          return null;
        }

        const { latitude: driverLat, longitude: driverLng } = currentDriver.location;
        const { latitude: userLat, longitude: userLng } = userLocation;

        const distance = calculateDistance(currentDriver.location, userLocation);
        
        // Update ETA and distance dynamically
        const etaMinutes = estimateTravelTimeMinutes(distance);
        setDriverEta(`${etaMinutes} min`);
        setDriverDistance(`${distance.toFixed(1)} km`);

        // Stop moving when the driver is very close (arrived)
        if (distance < 0.05) { // Threshold for "arrival"
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            setTripState('TRIP_COMPLETED'); // Transition to completed state
            // Keep currentDriver for the rating modal to access driver's name
            return currentDriver;
        }

        // Send "arriving soon" notification once
        if (distance < 0.5 && !hasSentArrivingNotification) { // Driver within 0.5 km
             if (Notification.permission === 'granted') {
                new Notification('Seu motorista está chegando!', {
                    body: 'Prepare-se para encontrar seu motorista em breve.',
                    lang: 'pt-BR'
                });
            }
            setHasSentArrivingNotification(true);
        }
        
        const stepFactor = 0.005; // Smaller step factor for smoother simulation
        const bearing = Math.atan2(userLng - driverLng, userLat - driverLat);
        const newLat = driverLat + Math.cos(bearing) * stepFactor;
        const newLng = driverLng + Math.sin(bearing) * stepFactor;

        return {
          ...currentDriver,
          location: {
            latitude: newLat,
            longitude: newLng,
          },
        };
      });
    }, 2000);

    return () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
  }, [tripState, userLocation, hasSentArrivingNotification]);

  // Effect to show rating modal after trip completion
  useEffect(() => {
    if (tripState === 'TRIP_COMPLETED') {
      // Small delay to allow UI to settle before showing modal
      const timer = setTimeout(() => {
        setShowRatingModal(true);
        // Clear driver info and destination after the rating modal is shown
        // This resets the map and state for a new trip
        setDestination('');
        setDestinationLocation(null);
      }, 1500); // 1.5 seconds delay

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [tripState]);


  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleServiceSelect = async () => {
    if (!userLocation || !destinationLocation) {
        alert("Por favor, selecione seu destino para iniciar a busca.");
        return;
    }

    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Permissão para notificações negada. Você não receberá atualizações da viagem.');
        }
    }

    setHasSentArrivingNotification(false); // Reset for new trip
    setTripState('SEARCHING');

    // Simulate finding a driver after 5 seconds
    setTimeout(() => {
      const mockDriver: DriverInfo = {
        name: 'Carlos Silva',
        carModel: 'Chevrolet Onix - Prata',
        licensePlate: 'BRA-1234',
        avatarUrl: 'https://i.pravatar.cc/150?img=68',
        location: {
            // Driver starts a bit away from userLocation
            latitude: userLocation.latitude + 0.015,
            longitude: userLocation.longitude + 0.015
        }
      };
      setDriver(mockDriver);
      setTripState('DRIVER_FOUND');

      // Calculate initial ETA and distance
      const initialDistance = calculateDistance(mockDriver.location, userLocation);
      const initialEta = estimateTravelTimeMinutes(initialDistance);
      setDriverEta(`${initialEta} min`);
      setDriverDistance(`${initialDistance.toFixed(1)} km`);


      // Send "Driver Found" notification
      if (Notification.permission === 'granted') {
        new Notification('Seu motorista foi encontrado!', {
          body: `${mockDriver.name} está a caminho em um ${mockDriver.carModel}. Chega em ${initialEta} min.`,
          lang: 'pt-BR'
        });
      }
    }, 5000);
  };

  const handleCancelTrip = () => {
    setTripState('IDLE');
    setDriver(null);
    setDriverEta(null); // Clear ETA
    setDriverDistance(null); // Clear Distance
    setHasSentArrivingNotification(false);
    // Clear destination if trip is cancelled
    setDestination('');
    setDestinationLocation(null);
  }

  const handleRateDriver = (rating: number | null, feedback: string) => {
    console.log("Driver rated:", rating, "Feedback:", feedback);
    setShowRatingModal(false);
    setTripState('IDLE'); // Reset to idle after rating/skipping
    setDriver(null); // Clear driver info
    setDriverEta(null);
    setDriverDistance(null);
    setHasSentArrivingNotification(false); // Reset
  };

  const handleEmergencyClick = () => {
    alert("Botão de Emergência Acionado!");
    // In a real app, this would trigger emergency contacts or safety features.
  };

  return (
    <div className="h-screen w-screen bg-gray-200 font-sans flex flex-col overflow-hidden relative">
      <Header 
        onMenuClick={toggleDrawer} 
        onChatClick={toggleChat} 
        tripState={tripState}
      />
      <SideDrawer isOpen={isDrawerOpen} onClose={toggleDrawer} />
      
      <main className="flex-1 relative">
        <MapPlaceholder 
          userLocation={userLocation} 
          destinationLocation={destinationLocation} 
          // Only pass driver location if trip is active and driver is found
          driverLocation={tripState === 'DRIVER_FOUND' ? driver?.location || null : null}
        />
        
        {tripState === 'IDLE' && !showRatingModal && ( // Only show service selector and location search when IDLE and no rating modal
          <>
            <LocationSearch
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
            />
            {destination && <ServiceSelector onServiceSelect={handleServiceSelect} />}
          </>
        )}

        {/* Show trip status if not idle and not completed */}
        {(tripState === 'SEARCHING' || tripState === 'DRIVER_FOUND') && 
          <TripStatus 
            state={tripState} 
            driver={driver} 
            eta={driverEta} // Pass ETA
            distance={driverDistance} // Pass distance
            destinationLocation={destinationLocation} // Pass destination location for route on map
            onCancel={handleCancelTrip} 
          />
        }

        <Chatbot isOpen={isChatOpen} onClose={toggleChat} userLocation={userLocation} />

        {showRatingModal && driver && (
          <RatingModal driverName={driver.name} onRatingSubmit={handleRateDriver} />
        )}

        <EmergencyButton onEmergencyClick={handleEmergencyClick} />
      </main>
    </div>
  );
};

export default App;