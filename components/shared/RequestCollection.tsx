"use client";

import { TripDocument } from "@/lib/database/models/trip.model";
import { useEffect, useState } from "react";
import { RequestCancellation } from "./RequestCancellation";

export const RequestCollection = ({
  trips,
  userId
}: {
  trips: TripDocument[];
  userId?: string;
  }) => {
  console.log(trips)

  return (
    <>

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

const Card: React.FC<TripCardProps> = ({ trip, userId }) => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      // Fetch start address
      const startResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${trip.tripInfo[0].endPoint.split(", ")[0]},${trip.tripInfo[0].startPoint.split(", ")[1]}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`);
      const startData = await startResponse.json();

      const startAddress = startData.results[0].formatted_address;
      setStartAddress(startAddress);

      // Fetch end address
      const endResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${trip.tripInfo[0].endPoint.split(", ")[0]},${trip.tripInfo[0].endPoint.split(", ")[1]}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`);
      const endData = await endResponse.json();
      const endAddress = endData.results[0].formatted_address;
      setEndAddress(endAddress);
    };

    fetchAddress();
  }, [trip.tripInfo[0].startPoint, trip.tripInfo[0].endPoint]);




  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col lg:flex-row my-5">
  <div className="lg:flex-1">
    <iframe
      className="w-full h-60 lg:h-full"
      src={`https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&origin=${trip.tripInfo[0].startPoint.split(", ").join(",")}&destination=${trip.tripInfo[0].endPoint.split(", ").join(",")}&mode=driving`}
      allowFullScreen
    />
  </div>

  <div className="flex-1 p-4">
    {userId && (
      <div className="mb-4">
        <div className="text-sm font-semibold mb-1">Request Status:</div>
            <div className="text-gray-600">{ trip.status}</div>
      </div>
    )}

    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
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
          <div className="flex w-1/3 justify-end">
            <RequestCancellation requestId={trip._id} />
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
  </div>
</div>

  );
};