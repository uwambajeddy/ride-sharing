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
  sits: number;
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

declare type UpdateImageParams = {
  image: {
    _id: string;
    title: string;
    publicId: string;
    transformationType: string;
    width: number;
    height: number;
    config: any;
    secureURL: string;
    transformationURL: string;
    aspectRatio: string | undefined;
    prompt: string | undefined;
    color: string | undefined;
  };
  userId: string;
  path: string;
};

declare type trips = {
  restore?: boolean;
  fillBackground?: boolean;
  remove?: {
    prompt: string;
    removeShadow?: boolean;
    multiple?: boolean;
  };
  recolor?: {
    prompt?: string;
    to: string;
    multiple?: boolean;
  };
  removeBackground?: boolean;
};


declare type TripFormProps = {
  action: "Add" | "Update";
  userId: string;
  data?: TripDocument | null;
};

