
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SideDrawer from './components/SideDrawer';
import MapPlaceholder from './components/MapPlaceholder';
import ServiceSelector from './components/ServiceSelector';
import LocationSearch from './components/LocationSearch';
import Chatbot from './components/Chatbot';
import TripStatus from './components/TripStatus';
import RatingModal from './components/RatingModal';
import AdminDashboard from './components/AdminDashboard';
import PixModal from './components/PixModal';
import UserProfileModal from './components/UserProfileModal';
import SettingsModal from './components/SettingsModal';
import RideHistoryModal from './components/RideHistoryModal';
import SupportModal from './components/SupportModal';
import type { UserLocation, DriverInfo, TripState, UserProfile, RideHistoryItem } from './types';
import { geocodeAddress } from './services/geocodingService';
import { processPayment, createStaticPixQRCode, PixCharge } from './services/asaasService';

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

// Initial Empty User Data - Ready for Real Auth/Input
const INITIAL_USER: UserProfile = {
    name: "",
    age: 0,
    phone: "",
    email: "",
    address: "",
    avatarUrl: "https://via.placeholder.com/200?text=Foto", // Placeholder generico
    cpfCnpj: "",
    mobilePhone: ""
};

const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileReadOnly, setIsProfileReadOnly] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  
  // User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);

  // Real Data States
  const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>([]); // Starts Empty

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [origin, setOrigin] = useState('Sua localização atual');
  const [destination, setDestination] = useState('');
  const [destinationLocation, setDestinationLocation] = useState<UserLocation | null>(null);
  
  // Trip Logic States
  const [tripState, setTripState] = useState<TripState>('IDLE');
  const [driver, setDriver] = useState<DriverInfo | null>(null); // Starts null, waits for backend
  const [driverEta, setDriverEta] = useState<string | null>(null);
  const [driverDistance, setDriverDistance] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  // Payment States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<PixCharge | null>(null);
  
  // 1. Geolocation Setup
  useEffect(() => {
    const getUserGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setGeolocationError(null);
          },
          (error) => {
            let errorMessage = "Não foi possível obter sua localização.";
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = "Permissão de localização negada.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = "Informações de localização indisponíveis.";
                break;
              case error.TIMEOUT:
                errorMessage = "A requisição expirou.";
                break;
            }
            console.error("Erro de geolocalização: ", error);
            setGeolocationError(errorMessage);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setGeolocationError("Seu navegador não suporta geolocalização.");
      }
    };

    getUserGeolocation();
  }, []);

  // 2. Address Geocoding Logic
  useEffect(() => {
    if (destination.trim().length < 3) {
      setDestinationLocation(null);
      setEstimatedPrice(null);
      return;
    }

    const handler = setTimeout(() => {
      geocodeAddress(destination).then(location => {
        setDestinationLocation(location);
        if (!location) {
          console.warn(`Could not find location for: ${destination}`);
          setEstimatedPrice(null);
        }
      });
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [destination]);

  // 3. Price Calculation Logic
  useEffect(() => {
    if (userLocation && destinationLocation) {
        const dist = calculateDistance(userLocation, destinationLocation);
        // Base R$ 5.00 + R$ 2.00 per KM
        const price = 5.0 + (dist * 2.0);
        setEstimatedPrice(parseFloat(price.toFixed(2)));
    } else {
        setEstimatedPrice(null);
    }
  }, [userLocation, destinationLocation]);


  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const openAdminDashboard = () => setShowAdminDashboard(true);
  
  const openProfileModal = (readOnly: boolean = false) => {
      setIsProfileReadOnly(readOnly);
      setShowProfileModal(true);
  };
  
  const openSettingsModal = () => setShowSettingsModal(true);
  const openHistoryModal = () => setShowHistoryModal(true);
  const openSupportModal = () => setShowSupportModal(true);

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
  };

  const startTripSearch = async () => {
       if ('Notification' in window && Notification.permission !== 'granted') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Permissão para notificações negada.');
        }
    }

    setTripState('SEARCHING');
    // HERE: Socket.emit('request_ride', ...) would happen in a real app
    // The app now waits indefinitely for a driver to accept via backend push
  }

  const handleServiceSelect = async (paymentMethod: string | null) => {
    if (!userLocation || !destinationLocation || !estimatedPrice) {
        alert("Por favor, selecione seu destino para iniciar a busca.");
        return;
    }

    // Handle PIX separately
    if (paymentMethod === 'pix') {
        setIsProcessingPayment(true);
        try {
            const pix = await createStaticPixQRCode(estimatedPrice, currentUser);
            setPixData(pix);
            setIsProcessingPayment(false);
            setShowPixModal(true);
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar Pix. Complete seu cadastro com CPF/CNPJ.");
            setIsProcessingPayment(false);
        }
        return;
    }

    // Process Credit Card / Balance
    setIsProcessingPayment(true);
    try {
        await processPayment(estimatedPrice, paymentMethod || 'creditCard', currentUser);
        setIsProcessingPayment(false);
        startTripSearch();
    } catch (error) {
        console.error(error);
        alert("Erro ao processar pagamento. Verifique seus dados.");
        setIsProcessingPayment(false);
    }
  };

  const handlePixConfirmed = async () => {
    setShowPixModal(false);
    startTripSearch();
  };


  const handleCancelTrip = () => {
    setTripState('IDLE');
    setDriver(null);
    setDriverEta(null); 
    setDriverDistance(null); 
    setDestination('');
    setDestinationLocation(null);
    setEstimatedPrice(null);
    // HERE: Socket.emit('cancel_ride') would happen
  }

  const handleRateDriver = (rating: number | null, feedback: string) => {
    console.log("Driver rated:", rating, "Feedback:", feedback);
    // HERE: API call to submit rating
    setShowRatingModal(false);
    setTripState('IDLE'); 
    setDriver(null); 
    setDriverEta(null);
    setDriverDistance(null);
  };

  return (
    <div className="h-screen w-screen bg-gray-200 font-sans flex flex-col overflow-hidden relative">
      <Header 
        onMenuClick={toggleDrawer} 
        onChatClick={toggleChat} 
        tripState={tripState}
      />
      <SideDrawer 
        isOpen={isDrawerOpen} 
        onClose={toggleDrawer} 
        onOpenAdmin={openAdminDashboard}
        onOpenProfile={openProfileModal}
        onOpenSettings={openSettingsModal}
        onOpenHistory={openHistoryModal}
        onOpenSupport={openSupportModal}
      />
      
      <main className="flex-1 relative">
        {isProcessingPayment && (
            <div className="absolute inset-0 z-50 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-sm animate-fade-in">
                <div className="w-16 h-16 border-4 border-goly-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-bold">Processando Pagamento...</h2>
                <p className="text-goly-blue-light mt-2">Conectando Gateway Asaas</p>
            </div>
        )}

        <MapPlaceholder 
          userLocation={userLocation} 
          destinationLocation={destinationLocation} 
          driverLocation={tripState === 'DRIVER_FOUND' ? driver?.location || null : null}
        />
        
        {tripState === 'IDLE' && !showRatingModal && !isProcessingPayment && ( 
          <>
            <LocationSearch
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
            />
            {destination && <ServiceSelector onServiceSelect={handleServiceSelect} estimatedPrice={estimatedPrice} />}
          </>
        )}

        {/* 
            This view now waits purely for state updates.
            In a real scenario, a WebSocket listener in useEffect would call 
            setDriver() and setTripState('DRIVER_FOUND') when a driver accepts.
        */}
        {(tripState === 'SEARCHING' || tripState === 'DRIVER_FOUND') && 
          <TripStatus 
            state={tripState} 
            driver={driver} 
            eta={driverEta} 
            distance={driverDistance} 
            destinationLocation={destinationLocation} 
            onCancel={handleCancelTrip} 
          />
        }

        <Chatbot isOpen={isChatOpen} onClose={toggleChat} userLocation={userLocation} />

        {showRatingModal && driver && (
          <RatingModal driverName={driver.name} onRatingSubmit={handleRateDriver} />
        )}

        <AdminDashboard isOpen={showAdminDashboard} onClose={() => setShowAdminDashboard(false)} />
        
        <UserProfileModal 
            isOpen={showProfileModal} 
            onClose={() => setShowProfileModal(false)} 
            user={currentUser}
            onUpdateProfile={handleUpdateProfile}
            readOnly={isProfileReadOnly}
        />

        <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

        <RideHistoryModal 
            isOpen={showHistoryModal} 
            onClose={() => setShowHistoryModal(false)} 
            history={rideHistory} 
        />

        <SupportModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />

        {showPixModal && (
            <PixModal 
                pixData={pixData} 
                onConfirm={handlePixConfirmed} 
                onCancel={() => setShowPixModal(false)} 
            />
        )}
      </main>
    </div>
  );
};

export default App;
