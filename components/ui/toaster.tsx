"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { socket } from "@/lib/utils";
import { useEffect } from "react";

export function Toaster({user}: any) {
  const { toasts } = useToast();
  const { toast } = useToast();
  

  useEffect(() => {
    if (user) {
    console.log(user)
      socket.emit("sendUserDetails", { user })
    }
    
    socket.on("userConnected", () => { 
      toast({
        title: `Connected`,
        description: `Real-time tracking enabled`,
        duration: 5000,
        className: 'success-toast' 
      })
    })
  }, []);

  socket.on("tripStatus", ({ trip, status }) => {
    if (status === 'active') {
      toast({
        title: `Driver on the way to pick you up`,
        description: `${trip.driverInfo[0].username} started the trip`,
        duration: 5000,
        className: 'success-toast' 
      })
    }
    if (status === 'completed') {
      toast({
        title: `Trip completed!!`,
        description: `${trip.driverInfo[0].username} marked the trip as completed`,
        duration: 5000,
        className: 'success-toast' 
      })
      
    }

  })
  socket.on("requestStatus", ({  status }) => {

    if (status === 'approved') {
      toast({
        title: `Trip request has been approved`,
        description: ` Your trip request has been approved by the driver`,
        duration: 5000,
        className: 'success-toast' 
      })
      
    }
    if (status === 'cancelled') {
      toast({
        title: 'Trip request has been rejected',
        description:  ` Your trip request has been rejected by the driver`,
        duration: 5000,
        className: 'error-toast' 
      })
      
    }

  })
  socket.on("passengerRequest", () => {

      toast({
        title: `Passenger request`,
        description: ` Incoming passenger request...`,
        duration: 5000,
        className: 'success-toast' 
      })
      

  })

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
