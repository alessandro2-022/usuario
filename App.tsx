import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SideDrawer from './components/SideDrawer';
import MapPlaceholder from './components/MapPlaceholder';
import ServiceSelector from './components/ServiceSelector';
import LocationSearch from './components/LocationSearch';
import Chatbot from './components/Chatbot';
import TripStatus from './components/TripStatus';
import type { UserLocation, DriverInfo, TripState } from './types';
import { geocodeAddress } from './services/geocodingService';

const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [origin, setOrigin] = useState('Sua localização atual');
  const [destination, setDestination] = useState('');
  const [destinationLocation, setDestinationLocation] = useState<UserLocation | null>(null);
  const [tripState, setTripState] = useState<TripState>('IDLE');
  const [driver, setDriver] = useState<DriverInfo | null>(null);
  const [hasSentArrivingNotification, setHasSentArrivingNotification] = useState(false);

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

  // Effect to simulate real-time driver movement
  useEffect(() => {
    if (tripState !== 'DRIVER_FOUND' || !userLocation) {
      return; // Do nothing if there's no active trip or user location
    }
    
    let intervalId: number | null = window.setInterval(() => {
      setDriver(currentDriver => {
        if (!currentDriver) {
          if (intervalId) clearInterval(intervalId);
          return null;
        }

        const { latitude: driverLat, longitude: driverLng } = currentDriver.location;
        const { latitude: userLat, longitude: userLng } = userLocation;

        const latDiff = userLat - driverLat;
        const lngDiff = userLng - driverLng;
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        // Stop moving when the driver is very close
        if (distance < 0.0001) {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            return currentDriver;
        }

        // Send "arriving soon" notification once
        if (distance < 0.005 && !hasSentArrivingNotification) {
             if (Notification.permission === 'granted') {
                new Notification('Seu motorista está chegando!', {
                    body: 'Prepare-se para encontrar seu motorista em breve.',
                    lang: 'pt-BR'
                });
            }
            setHasSentArrivingNotification(true);
        }
        
        const stepFactor = 0.2; 
        const newLat = driverLat + latDiff * stepFactor;
        const newLng = driverLng + lngDiff * stepFactor;

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


  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleServiceSelect = async () => {
    if (!userLocation) {
        alert("Não foi possível obter sua localização para iniciar a busca.");
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
            latitude: userLocation.latitude + 0.02,
            longitude: userLocation.longitude + 0.02
        }
      };
      setDriver(mockDriver);
      setTripState('DRIVER_FOUND');

      // Send "Driver Found" notification
      if (Notification.permission === 'granted') {
        new Notification('Seu motorista foi encontrado!', {
          body: `${mockDriver.name} está a caminho em um ${mockDriver.carModel}.`,
          lang: 'pt-BR'
        });
      }
    }, 5000);
  };

  const handleCancelTrip = () => {
    setTripState('IDLE');
    setDriver(null);
    setHasSentArrivingNotification(false);
  }

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
          driverLocation={driver?.location || null}
        />
        
        {tripState === 'IDLE' && (
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

        {tripState !== 'IDLE' && <TripStatus state={tripState} driver={driver} onCancel={handleCancelTrip} />}

        <Chatbot isOpen={isChatOpen} onClose={toggleChat} userLocation={userLocation} />
      </main>
    </div>
  );
};

export default App;