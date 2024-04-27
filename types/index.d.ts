/* eslint-disable no-unused-vars */

import { TripDocument } from "@/lib/database/models/trip.model";

// ====== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};


declare type AddTripParams = {
  driverId: string;
  startPoint: string;
  endPoint: string;
  path:string
};
declare type UpdateTripParams = {
  driverId: string;
  tripId: string;
  startPoint?: string;
  endPoint?: string;
  path:string
};


declare type TripFormProps = {
  action: "Add" | "Update";
  userId: string;
  data?: TripDocument | null;
};

