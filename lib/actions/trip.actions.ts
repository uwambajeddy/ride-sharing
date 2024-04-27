"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Trip from "../database/models/trip.model";
import { redirect } from "next/navigation";

import { AddTripParams, UpdateTripParams } from "@/types";
import mongoose from "mongoose";
import TripPassenger from "../database/models/tripPassengers.model";


// ADD TRIP
export async function addTrip({
  driverId,
  startPoint,
  endPoint,
  path }: AddTripParams) {
  try {
    await connectToDatabase();

    const newTrip = await Trip.create({  driverId, startPoint, endPoint })

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newTrip));
  } catch (error) {
    handleError(error)
  }
}

export async function requestTrip({
  tripId,
  passengerId,
  pickupPoint,
  path }: {tripId:string, passengerId:string, pickupPoint:string, path:string}) {
  try {
    await connectToDatabase();

    const newRequest = await TripPassenger.create({ tripId,
      passengerId,
      pickupPoint, status:"pending" })

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newRequest));
  } catch (error) {
    handleError(error)
  }
}

// UPDATE TRIP
export async function tripRequestAction({ requestId, action, path }) {
  try {
    await connectToDatabase();

    const updatedRequest = await TripPassenger.findByIdAndUpdate(
      requestId,
      { status:action },
      { new: true }
    )

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedRequest));
  } catch (error) {
    handleError(error)
  }
}

export async function tripAction({ tripId, action, path }) {
  try {
    await connectToDatabase();

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { status:action },
      { new: true }
    )

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedTrip));
  } catch (error) {
    handleError(error)
  }
}
export async function updateTrip({ tripId,userId, startPoint, endPoint, path }: UpdateTripParams) {
  try {
    await connectToDatabase();

    const tripToUpdate = await Trip.findById(tripId);

    if (!tripToUpdate || tripToUpdate.driverId.toHexString() !== userId) {
      throw new Error("Unauthorized or trip not found");
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripToUpdate._id,
      { startPoint, endPoint },
      { new: true }
    )

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedTrip));
  } catch (error) {
    handleError(error)
  }
}

// CANCEL TRIP
export async function cancelTrip(tripId: string) {
  try {
    await connectToDatabase();

    await Trip.findByIdAndUpdate(tripId,{status: 'cancelled'});
  } catch (error) {
    handleError(error)
  } finally{
    redirect('/')
  }
}

// GET TRIP
export async function getTripById(id: string) {
  try {
    await connectToDatabase();

    const trip = await Trip.aggregate([
      {
        $match: {
          $where: {_id:id}
        }
      },
      {
        $lookup: {
          from: "users",
          as: "drivers",
          let: { driverId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$driverId", "$$driverId"] } } }
          ]
        }
      },
      {
        $lookup: {
          from: "tripPassengers",
          as: "tripPassengers",
          let: { tripId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$tripId", "$$tripId"] } } }
          ]
        }
      },

    ]);
    

    if(!trip) throw new Error("Trip not found");

    return JSON.parse(JSON.stringify(trip));
  } catch (error) {
    handleError(error)
  }
}

// GET TRIP
export async function getAllTrips({userId }: {
  userId?: string;
}) {
  try {
    await connectToDatabase();


    // Fetch trips with driverInfo
    const tripsWithDriverInfo = await Trip.aggregate([
      // Match conditionally based on the availability of userId
      { $match: {status: "pending"}},
      ...(userId ? [{ $match: { driverId: { $ne: new mongoose.Types.ObjectId(userId) } } }] : []),

      // Lookup driverInfo
      {
        $lookup: {
          from: 'users',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driverInfo',
        },
      },
      // Sort
      { $sort: { updatedAt: -1 } }
    ]);

    const tripsWithPassengers = await Promise.all(tripsWithDriverInfo.map(async (trip) => {
      const tripId = trip._id;
      const tripPassengers = await TripPassenger.find({ tripId }).populate('passengerId');
      return { ...trip, tripPassengers };
    }));

    let filteredTrips;

    if (userId) {
      filteredTrips = tripsWithPassengers.filter(trip =>
        !trip.tripPassengers.some(passenger => passenger.passengerId.toString() != userId)
      );
      
    }
    const savedTrips = await Trip.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify( userId? filteredTrips: tripsWithPassengers)),
      savedTrips,
    };
  } catch (error) {
    handleError(error);
  }
}





export async function getMyRequests(userId: string) {
  try {
    await connectToDatabase();
    const trips = await TripPassenger.aggregate([
      {
        $match: { passengerId:  new mongoose.Types.ObjectId(userId)}
      },
      {
        $lookup: {
          from: 'trips',
          localField: 'tripId',
          foreignField: '_id',
          as: 'tripInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'tripInfo.driverId',
          foreignField: '_id',
          as: 'driverInfo'
        }
      }
    ]);
    
    
    

    return {
      data: JSON.parse(JSON.stringify(trips)),
    };
  } catch (error) {
    handleError(error);
  }
}
export async function getMyTrips(userId: string) {
  try {
    await connectToDatabase();

         // Fetch trips with driverInfo
     const tripsWithDriverInfo = await Trip.aggregate([
      // Match conditionally based on the availability of userId
      {
         $match: {
           driverId: new mongoose.Types.ObjectId(userId),
            status: { $ne: "active" }
         } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driverInfo',
        },
      }
    ]);

    const tripsWithPassengers = await Promise.all(tripsWithDriverInfo.map(async (trip) => {
      const tripId = trip._id;
      const tripPassengers = await TripPassenger.find({ tripId }).populate('passengerId');
      return { ...trip, tripPassengers };
    }));

    const filteredTrips = tripsWithPassengers.filter(trip =>
      !trip.tripPassengers.some(passenger => passenger.passengerId.toString() == userId)
    );

  
    return {
      data: JSON.parse(JSON.stringify(filteredTrips)),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function getActiveTrips(userId: string) {
  try {
    await connectToDatabase();

         // Fetch trips with driverInfo
     const tripsWithDriverInfo = await Trip.aggregate([
      // Match conditionally based on the availability of userId
      {
        $match: { driverId: new mongoose.Types.ObjectId(userId), status:"active" } 
      },
      {
        $lookup: {
          from: 'users',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driverInfo',
        },
      }
    ]);

    const tripsWithPassengers = await Promise.all(tripsWithDriverInfo.map(async (trip) => {
      const tripId = trip._id;
      const tripPassengers = await TripPassenger.find({ tripId }).populate('passengerId');
      return { ...trip, tripPassengers };
    }));

    const filteredTrips = tripsWithPassengers.filter(trip =>
      !trip.tripPassengers.some(passenger => passenger.passengerId.toString() == userId)
    );

  
    return {
      data: JSON.parse(JSON.stringify(filteredTrips)),
    };
  } catch (error) {
    handleError(error);
  }
}


export async function deleteTrip(tripId: string) {
  try {
    await connectToDatabase();

    await Trip.findByIdAndDelete(tripId);
    await TripPassenger.deleteMany({tripId});
  } catch (error) {
    handleError(error)
  } finally{
    redirect('/trips')
  }
}
export async function deleteRequest(requestId: string) {
  try {
    await connectToDatabase();

    await TripPassenger.findByIdAndDelete(requestId);
  } catch (error) {
    handleError(error)
  } finally{
    redirect('/trips/requests')
  }
}