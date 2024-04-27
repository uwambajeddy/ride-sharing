"use client";
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useLoadScript, InfoWindow } from '@react-google-maps/api';

import { useEffect, useState } from "react";
import Image from "next/image";
import { socket } from "@/lib/utils";

export const ActiveDriverCollection = ({
  user
}: {
  user: any
  }) => {
  
    const [driverLocation, setDriverLocation] = useState(null);
    const [trips, setTrips] = useState([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY ?? ''
  })

  socket.on("tripCoordinates", ({ trip, coordinates }) => {
    console.log("tripCoordinates", trip, coordinates)
    setDriverLocation(coordinates)
    setTrips([trip])
  })

  return (
    <>
      {trips.length > 0 && (
         <div className="w-100">
          {trips.map((trip) => (
           <Card key={trip._id} trip={trip} isLoaded={isLoaded} driverLocation={driverLocation} />
         ))}
       </div>
      )}
    </>
  );
};



const Card: React.FC<TripCardProps> = ({ trip, isLoaded, driverLocation }) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [duration, setDuration] = useState(null);
  const [distance, setDistance] = useState(null);
  const [directions, setDirections] = useState(null);


  useEffect(() => {
    const fetchAddress = async () => {
      // Fetch start address
      const startResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${driverLocation.lat},${driverLocation.lng}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`);
      const startData = await startResponse.json();
      
      const startAddress = startData.results[0].formatted_address;
      setStartAddress(startAddress);

      // Fetch end address
      const endResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${trip.endPoint.split(", ")[0]},${trip.endPoint.split(", ")[1]}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`);
      const endData = await endResponse.json();
      const endAddress = endData.results[0].formatted_address;
      setEndAddress(endAddress);
    };

if(driverLocation) fetchAddress();
  }, [trip.startPoint, trip.endPoint, driverLocation]);


  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col my-5">
       <section className="profile">
        <div className="profile-balance">
          <p className="p-14-medium md:p-16-medium">DURATION</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/time.png"
              alt="Duration"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{duration ?`${duration}`: `calculating...`}</h2>
          </div>
        </div>

        <div className="profile-image-manipulation">
          <p className="p-14-medium md:p-16-medium">DISTANCE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/maps.png"
              alt="maps"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="h2-bold text-dark-600">{distance ?`${distance} km`: `calculating...`}</h2>
          </div>
        </div>
      </section>
  <div className="flex-2 h-96">
 
        {isLoaded && driverLocation && (
        <GoogleMap
          center={driverLocation}
          zoom={13}
            mapContainerStyle={{ width: '100%', height: '400px' }}
            options={{ disableDefaultUI: true, clickableIcons: false, styles:[
              {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [
                        { visibility: "off" }
                  ]
              }
          ] }}    
          >
           
          <Marker position={driverLocation} icon={{
        url: "https://res.cloudinary.com/dvibmdi1y/image/upload/v1714105602/pngwing.com_54_rgo5ul.png",
        scaledSize: new window.google.maps.Size(80, 60)
        
            }}
              
            />

          {/* Markers for pickup points */}
          {trip.tripPassengers.map((request, index) => 
            <Marker key={index} position={{lat:Number(`${request.pickupPoint.split(", ")[0]}`),lng:Number(`${request.pickupPoint.split(", ")[1]}`)}}  icon={{
              url: "https://res.cloudinary.com/dvibmdi1y/image/upload/v1714109675/passenger_r2iqwe.png",
              scaledSize: new window.google.maps.Size(40, 40)
              
            }}
            onClick={() => setSelectedUser(request)}
            
            />
            )}
            
            {selectedUser && (
        <InfoWindow
          position={{ lat: Number(`${selectedUser.pickupPoint.split(", ")[0]}`), lng: Number(`${selectedUser.pickupPoint.split(", ")[1]}`) }}
          onCloseClick={() => setSelectedUser(null)}
        >
          <div  style={{ display:"flex", flexDirection:"column",alignItems:"center"}}>
            <img src={selectedUser.passengerId.photo} alt={selectedUser.passengerId.fullName} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
            <h2 style={{marginTop:5}}>{selectedUser.passengerId.firstName} {selectedUser.passengerId.lastName}</h2>
            <h2 style={{marginTop:5}}>{selectedUser.passengerId.email}</h2>
  
          </div>
        </InfoWindow>
      )}

          {/* Directions */}
          <DirectionsService
            options={{
              destination:`${trip.endPoint.split(", ")[0]},${trip.endPoint.split(", ")[1]}`,
              origin:  driverLocation,
              waypoints: trip.tripPassengers.map(request => ({ location: {lat:Number(`${request.pickupPoint.split(", ")[0]}`),lng:Number(`${request.pickupPoint.split(", ")[1]}`)} })),
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: true,
            }}
              callback={response => {
                if (response !== null) {
                  if (!directions) {
                    const route = response.routes[0];
                    const distance = route.legs.reduce((acc, leg) => acc + leg.distance.value, 0); // Total distance in meters
                    const duration = route.legs.reduce((acc, leg) => acc + leg.duration.value, 0); // Total duration in seconds
                    
                    // Convert distance from meters to kilometers
                    const distanceInKm = distance / 1000;
                
                    // Calculate hours and minutes for duration
                    const hours = Math.floor(duration / 3600);
                    const minutes = Math.floor((duration % 3600) / 60);
                
                    // Format duration string
                    const durationString = `${hours > 0?`${hours} hour${hours !== 1 ? 's' : ''},`:""} ${minutes} minute${minutes !== 1 ? 's' : ''}`;

                    setDistance(distanceInKm.toFixed(2))
                    setDuration(durationString)
                    setDirections(response)
                  }
              }
            }}
            />
           { directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
  </div>

  <div className="flex-1 p-4">
    
      <div className="mb-4">
        <div className="text-sm font-semibold mb-1">Trip Status:</div>
        <div className="text-gray-600">{ trip.status}</div>
      </div>

    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center w-1/3">
        <img
          src={
            trip.driverInfo[0].photo
              ? trip.driverInfo[0].photo
              : "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
          }
          alt="Driver Profile"
          className="h-10 w-10 rounded-full mr-2"
        />
        <div>
          <div className="font-semibold">
            {trip.driverInfo[0].firstName} {trip.driverInfo[0].lastName}  
          </div>
        </div>
          </div>
    </div>

    <div className="mb-4">
      <div className="text-sm font-semibold mb-1">Start Address:</div>
      <div className="text-gray-600">{startAddress}</div>
    </div>
    <div className="mb-4">
      <div className="text-sm font-semibold mb-1">End Address:</div>
      <div className="text-gray-600">{endAddress}</div>
    </div>

    {trip.tripPassengers.filter(req=> req.status == "approved").length > 0 && <div className="mb-4">
          <div className="text-sm font-semibold mb-1">Booked:</div>
          <div className="flex">

          {trip.tripPassengers.filter(req=> req.status == "approved").map(request => {
              return (
                <img
                  src={
                    request.passengerId.photo
                      ? request.passengerId.photo
                      : "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
                  }
                  key={request._id}
                  alt="Passenger Profile"
                  className="h-10 w-10 rounded-full mr-2"
                />)
            })}
            </div>
    </div>}

  </div>
</div>

  );
};