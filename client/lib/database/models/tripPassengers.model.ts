import { Schema, model, models } from "mongoose";

const TripPassengerSchema = new Schema({
  tripId: {
    type: Schema.Types.ObjectId,
    ref: "Trip",
  },
  passengerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  pickupPoint: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending"
  }
});

const TripPassenger = models?.TripPassenger || model("TripPassenger", TripPassengerSchema);

export default TripPassenger;