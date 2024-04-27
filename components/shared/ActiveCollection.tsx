"use client";

import {  useRouter } from "next/navigation";
import { TripDocument } from "@/lib/database/models/trip.model";
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useLoadScript, InfoWindow } from '@react-google-maps/api';

import { Button } from "../ui/button";

import { Key, SetStateAction, useEffect, useState } from "react";
import {  tripAction } from "@/lib/actions/trip.actions";
import { TripCancellation } from "./TripCancellation";
import Image from "next/image";
import { socket } from "@/lib/utils";

export const ActiveCollection = ({
  trips,
  userId
}: {
  trips: TripDocument[];
    userId?: string;
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY ?? ''
  })

  return (
    <>
      {trips.length > 0 && (
         <div className="w-100">
          {trips.map((trip) => (
           <Card key={trip._id} trip={trip} userId={userId} isLoaded={isLoaded} />
         ))}
       </div>
      )}
    </>
  );
};


const Card: React.FC<any> = ({ trip, userId, isLoaded }) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [driverLocation, setDriverLocation] =  useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [directions, setDirections] = useState<any>(null);


  useEffect(() => {
    const intervalId = setInterval(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          setDriverLocation({
            lat: latitude,
            lng: longitude,
          });
         
          socket.emit("startTrip", { trip, coordinates: { lat:latitude, lng: longitude }, passengers: trip.tripPassengers.filter((req: { status: string; })=> req.status == "approved")});
        });
      }
    }, 5000); 
  

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
        const fetchAddress = async () => {
          if (!driverLocation) {
            return;
          }
          
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
          {trip.tripPassengers
            .filter((req: { status: string; }) => req.status === "approved")
            .map((request: SetStateAction<null> | null, index: Key | null | undefined) => {
              if (!request) return null;
              return (
                <Marker
                  key={index}
                  position={{
                    lat: Number(`${(request as unknown as { pickupPoint: string }).pickupPoint.split(", ")[0]}`),
                    lng: Number(`${(request as unknown as { pickupPoint: string }).pickupPoint.split(", ")[1]}`),
                  }}
                  icon={{
                    url: "https://res.cloudinary.com/dvibmdi1y/image/upload/v1714109675/passenger_r2iqwe.png",
                    scaledSize: new window.google.maps.Size(40, 40),
                  }}
                  onClick={() => setSelectedUser(request)}
                />
              );
            })}
            
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
              waypoints: trip.tripPassengers.filter((req: { status: string; })=> req.status == "approved").map((request: { pickupPoint: string; }) => ({ location: {lat:Number(`${request.pickupPoint.split(", ")[0]}`),lng:Number(`${request.pickupPoint.split(", ")[1]}`)} })),
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: true,
            }}
            callback={response => {
              if (response !== null) {
                if (!directions) {
                    const route = response.routes[0];
                    const distance = route.legs.reduce((acc, leg) => {
                        if (leg.distance) {
                            return acc + leg.distance.value;
                        }
                        return acc;
                    }, 0);
            
                    const duration = route.legs.reduce((acc, leg) => {
                        if (leg.duration) {
                            return acc + leg.duration.value;
                        }
                        return acc;
                    }, 0);
            
                    const distanceInKm = distance / 1000;
            
                    const hours = Math.floor(duration / 3600);
                    const minutes = Math.floor((duration % 3600) / 60);
            
                    const durationString = `${hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''},` : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            
                    setDistance(distanceInKm.toFixed(2));
                    setDuration(durationString);
                    setDirections(response);
                }
            }
            
          }}
            />
           { directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      )}
  </div>

  <div className="flex-1 p-4">
    {userId && (
      <div className="mb-4">
        <div className="text-sm font-semibold mb-1">Trip Status:</div>
        <div className="text-gray-600">{ trip.status}</div>
      </div>
    )}

<div className="flex flex-col sm:flex-row  md:flex-row lg:flex-row w-full items-center justify-between  mb-4">
  <div className="flex items-center sm:w-full md:w-1/3 lg:w-1/3 mb-2">
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
  <div className="flex w-full sm:mt-5 justify-center md:mt-0 lg:mt-0 md:w-1/3 lg:w-1/3 md:justify-end">
    <Button
      className="collection-btn mr-2"
      onClick={async () => { 
        await tripAction({ 
          tripId: trip._id, 
          action: "completed", 
          path: "/trips" 
        });  
        socket.emit("tripStatus", { 
          trip, 
          passengers: trip.tripPassengers.filter((req: { status: string; }) => req.status == "approved"), 
          status:"completed"
        }); 
        router.push("/trips")
      }}
    >
      Complete
    </Button>
    <TripCancellation tripId={trip._id} />
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

    {trip.tripPassengers.filter((req: { status: string; })=> req.status == "approved").length > 0 && <div className="mb-4">
          <div className="text-sm font-semibold mb-1">Booked:</div>
          <div className="flex">

          {trip.tripPassengers.filter((req: { status: string; })=> req.status == "approved").map((request: { passengerId: { photo: string | undefined; }; _id: Key | null | undefined; }) => {
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