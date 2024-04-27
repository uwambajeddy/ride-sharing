import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import GoogleMaps from "./GoogleMaps";

interface GoogleMapModalProps {
  onClose: () => void;
  onSelectLocation: (latitude: number, longitude: number) => void;
}

export const RequestModal = ({ onClose, onSelectLocation }: GoogleMapModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  // Function to handle saving the selected location and closing the modal
  const handleSaveLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.latitude, selectedLocation.longitude);
      onClose(); // Close the modal after selecting the location
    }
  };

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex-between">
            <p className="p-16-semibold text-dark-400">Mark Pickup Location</p>
          </div>
          <GoogleMaps onSelectLocation={(lat, lng) => setSelectedLocation({ latitude: lat, longitude: lng })} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="button w-full bg-purple-100 text-dark-400"
            onClick={onClose}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="button w-full bg-purple-gradient  bg-cover"
            onClick={handleSaveLocation}
          >
            Request Ride
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
