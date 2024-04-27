/* eslint-disable prefer-const */
/* eslint-disable no-prototype-builtins */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import io from "socket.io-client";

let socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);

socket.on("connect", () => {
  console.log("Connected to the Socket.IO server! ✅");
});
socket.on("connect_error", (error) => {
  console.error("Connection to the Socket.IO server failed:⚠️", error);
});
socket.on("disconnect", () => {
  console.log("Disconnected from the Socket.IO server! ❌"); 
});
  

export { socket };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ERROR HANDLER
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};