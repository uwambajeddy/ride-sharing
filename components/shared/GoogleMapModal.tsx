import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import GoogleMaps from "./GoogleMaps";

interface GoogleMapModalProps {
  onClose: () => void;
  onSelectLocation: (latitude: number, longitude: number) => void;
}

export const GoogleMapModal = ({ onClose, onSelectLocation }: GoogleMapModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  const handleSaveLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.latitude, selectedLocation.longitude);
      onClose(); 
    }
  };

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex-between">
            <p className="p-16-semibold text-dark-400">Mark START And END Points</p>
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
            Set Location
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
