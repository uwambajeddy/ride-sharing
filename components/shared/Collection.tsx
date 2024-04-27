"use client";

import { useRouter } from "next/navigation";
import { TripDocument } from "@/lib/database/models/trip.model";
import { Button } from "../ui/button";
import { Key, useEffect, useState } from "react";
import { RequestModal } from "./RequestModal";
import { requestTrip, tripAction } from "@/lib/actions/trip.actions";
import { TripCancellation } from "./TripCancellation";
import { RequestConfirmationModal } from "./RequestConfirmationModal";
import { socket } from "@/lib/utils";

export const Collection = ({
  hasTitle = false,
  trips,
  userId
}: {
  trips: TripDocument[];
  userId?: string;
  hasTitle?: boolean;
}) => {

  return (
    <>
      <div className="collection-heading">
        {hasTitle && <h2 className="h2-bold text-dark-600">New Posted Trips</h2>}
      </div>

      {trips.length > 0 ? (
         <div className="w-100">
          {trips.map((trip) => (
           <Card key={trip._id} trip={trip} userId={userId} />
         ))}
       </div>
      ) : (
        <div className="collection-empty">
          <p className="p-20-semibold">Empty List</p>
        </div>
      )}

    </>
  );
};

type Coordinates = {
  latitude: number;
  longitude: number;
};


const Card: React.FC<any> = ({trip,userId}) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isRequestMapModalOpen, setIsRequestMapModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAddress = async () => {
      // Fetch start address
      const startResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${trip.endPoint.split(", ")[0]},${trip.startPoint.split(", ")[1]}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`);
      const startData = await startResponse.json();

      const startAddress = startData.results[0].formatted_address;
      setStartAddress(startAddress);

      // Fetch end address
      const endResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${trip.endPoint.split(", ")[0]},${trip.endPoint.split(", ")[1]}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`);
      const endData = await endResponse.json();
      const endAddress = endData.results[0].formatted_address;
      setEndAddress(endAddress);
    };

    fetchAddress();
  }, [trip.startPoint, trip.endPoint]);

  const handleLocationSelect = async (coordinates: [Coordinates]) => {
    await requestTrip({ tripId: trip._id, passengerId: userId, pickupPoint: `${coordinates[0].latitude}, ${coordinates[0].longitude}`, path: `/trips/requests` })
    setIsMapModalOpen(false); 
    console.log("passengerRequest", { driverId: trip.driverInfo[0]._id })
    socket.emit("passengerRequest", { driverId: trip.driverInfo[0]._id }); 
    router.push(`/trips/requests`);

  };

  const handleInputClick = () => {
    setIsMapModalOpen(true);
  };
  const handleRequestClick = () => {
    setIsRequestMapModalOpen(true);
  };
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col lg:flex-row my-5">
  <div className="lg:flex-1">
    {/* Replace the src attribute with the URL to generate the Google Maps route */}
    <iframe
      className="w-full h-60 lg:h-full"
      src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&origin=${trip.startPoint.split(", ").join(",")}&destination=${trip.endPoint.split(", ").join(",")}&mode=driving`}
      allowFullScreen
    />
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

            {trip.driverId == userId ? <>
          { trip.status != "completed" && <Button
                className="collection-btn mr-2"
                onClick={async () => { await tripAction({ tripId: trip._id, action: "active", path: "/trips/active" }); socket.emit("tripStatus", { trip, passengers: trip.tripPassengers.filter((req: { status: string; })=> req.status == "approved"), status:"active"});  router.push("/trips/active")}}
              >
             Start
              </Button>}
              <TripCancellation tripId={ trip._id } />
              </>
              : <Button
                className="collection-btn"
                onClick={()=> { userId? handleInputClick() : router.push('/sign-in')}} 
            >
             Request Trip
          </Button>}
          </div>
    </div>
    
    {isMapModalOpen && (
          <RequestModal
            onClose={() => setIsMapModalOpen(false)}
            onSelectLocation={handleLocationSelect}
          />
        )}

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
    {userId && trip.driverId == userId && <div className="mb-4">
          <div className="text-sm font-semibold mb-1">Requests:</div>
          <div className="flex">

          {trip.tripPassengers.filter((req: { status: string; })=> req.status == "pending").length > 0 ? trip.tripPassengers.filter((req: { status: string; })=> req.status == "pending").map((request: { _id: Key | null | undefined; passengerId: { _id: any; photo: string | undefined; }; pickupPoint: { split: (arg0: string) => number[]; }; }) => {
              return (<>
                {isRequestMapModalOpen && (
                  <RequestConfirmationModal
                    onClose={() => setIsRequestMapModalOpen(false)}
                    requestId={String(request._id)}
                    passenger={request.passengerId}
                    lat={ request.pickupPoint.split(", ")[0]}
                    lng={ request.pickupPoint.split(", ")[1]}
                    key={`${request.passengerId._id}-${trip._id}`}
                  />
                )}
                <img
                  src={
                    request.passengerId.photo
                      ? request.passengerId.photo
                      : "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
                  }
                  onClick={handleRequestClick} 
                  key={request._id}
                  alt="Passenger Profile"
                  className="h-10 w-10 rounded-full mr-2"
                />
              </>)
            }): <div className="text-gray-600">No requests, yet</div>}
            </div>
    </div>}

  </div>
</div>

  );
};