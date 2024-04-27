import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import GoogleMaps from "./GoogleMaps";
import { tripRequestAction } from "@/lib/actions/trip.actions";
import RequestGoogleMaps from "./RequestGoogleMaps";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/utils";

interface GoogleMapModalProps {
  onClose: () => void;
  onSelectLocation: (latitude: number, longitude: number) => void;
}

export const RequestConfirmationModal = ({ onClose, lat, lng, passenger, requestId  }: GoogleMapModalProps) => {
const router = useRouter();

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex-between">
          <img
                  src={
                    passenger.photo
                      ? passenger.photo
                      : "https://t3.ftcdn.net/jpg/06/19/26/46/360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg"
                  }
                  alt="Passenger Profile"
                  className="h-10 w-10 rounded-full mr-2"
                />
            <p className="p-16-semibold text-dark-400">{ passenger.firstName} { passenger.lastName}'s Request</p>
          </div>
          <RequestGoogleMaps lat={lat} lng={lng} />
        </AlertDialogHeader>
        <AlertDialogFooter >
          <div className="flex justify-between w-full">
          <div >

          <AlertDialogCancel
            className="button  bg-purple-100 text-dark-400"
            onClick={onClose}
          >
            Close
          </AlertDialogCancel>
          </div>
          <div className="flex ">
          <AlertDialogAction
            className="button bg-red-600 mr-3"
            
                onClick={async() => { await tripRequestAction({ requestId, action: "cancelled", path: "/trips" }); socket.emit("requestStatus", { passengerId: passenger._id, status:"cancelled"});   router.push("/trips")}}
          >
            Cancel
          </AlertDialogAction>
          <AlertDialogAction
            className="button bg-purple-gradient  bg-cover"
                onClick={async() => { await tripRequestAction({ requestId, action: "approved", path: "/trips" }); socket.emit("requestStatus", {  passengerId: passenger._id, status:"approved"});   router.push("/trips")}}
          >
            Approve
          </AlertDialogAction>
            </div>
            </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
