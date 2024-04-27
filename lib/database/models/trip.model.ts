import { Document, Schema, model, models } from "mongoose";

export interface TripDocument extends Document {
  sits: number;
  driverId: string;
  startPoint: string;
  endPoint: string;
  status: string;
  currentLocation?: string;
}

const TripSchema = new Schema({
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  startPoint: {
    type: String,
    required: true,
  },
  endPoint: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending"
  },
  currentLocation: {
    type: String
  }
});

const Trip = models?.Trip || model("Trip", TripSchema);

export default Trip;