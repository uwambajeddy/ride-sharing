"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {  defaultValues } from "@/constants";
import { CustomField } from "./CustomField";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleMapModal } from "./GoogleMapModal";
import { TripFormProps } from "@/types";
import { addTrip, updateTrip } from "@/lib/actions/trip.actions";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const formSchema = z.object({
  startPoint: z.string(),
  endPoint: z.string(),
});

const TripForm = ({
  action,
  data = null,
  userId
}: TripFormProps) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates[]>([]);

  // Function to handle opening the map modal
  const handleInputClick = () => {
    setIsMapModalOpen(true);
  };

  // Function to handle setting the selected location from the map modal
  const handleLocationSelect = (coordinates: [Coordinates]) => {
    setSelectedLocation(coordinates);
    setIsMapModalOpen(false); // Close the modal after selecting the location
  };

  const initialValues =
    data && action === "Update"
      ? {
        startPoint: data?.startPoint,
        endPoint: data?.endPoint
        }
      : defaultValues;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  async function onSubmit() {
    setIsSubmitting(true);

      const tripData = {
        driverId: userId,
        startPoint: `${selectedLocation[0]?.latitude}, ${selectedLocation[0]?.longitude}`,
        endPoint: `${selectedLocation[1]?.latitude}, ${selectedLocation[1]?.longitude}`,
        status: "pending"
      };

      if (action === "Add") {
        try {
          const newTrip = await addTrip({
            ...tripData,
            path: "/", 
          });

          if (newTrip) {
            form.reset();
            router.push(`/trips`);
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (action === "Update" && data?._id) {
        try {
          const updatedImage = await updateTrip({
            ...tripData,
            tripId: data._id,
            path: `/trips`,
          });

          if (updatedImage) {
            router.push(`/trips/`);
          }
        } catch (error) {
          console.log(error);
        }
      }
    

    setIsSubmitting(false);
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="prompt-field">
          <CustomField
            control={form.control}
            name="startPoint"
            formLabel="Start point"
            className="w-full"
            render={({ field }) => (
              <Input
                value={
                  selectedLocation.length
                    ?  `${selectedLocation[0]?.latitude}, ${selectedLocation[0]?.longitude}`
                    : field.value
                }
                className="input-field"
                onClick={handleInputClick} 
              />
            )}
          />
          <CustomField 
            control={form.control}
            name="endPoint"
            formLabel="End Point"
            className="w-full"
            render={({ field }) => (
              <Input
                value={
                  selectedLocation.length
                    ?  `${selectedLocation[1]?.latitude}, ${selectedLocation[1]?.longitude}`
                    : field.value
                }
                className="input-field"
                onClick={handleInputClick} 
              />
            )}
          />


        </div>
        {/* Google Map Modal */}
        {isMapModalOpen && (
          <GoogleMapModal
            onClose={() => setIsMapModalOpen(false)}
            onSelectLocation={handleLocationSelect}
          />
        )}

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TripForm;
