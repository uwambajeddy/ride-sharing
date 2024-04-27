import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

type RequestGoogleMapsProps = {
  lat: number;
  lng: number;
};

export default function RequestGoogleMaps({ lat, lng }: RequestGoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'quarterly',
      });

      try {
        const google = await loader.load();
        const { Map, Marker } = google.maps;

        const locationInMap = {
          lat: Number(lat),
          lng: Number(lng)
        };

        const options: google.maps.MapOptions = {
          center: locationInMap,
          zoom: 15,
          mapId: 'NEXT_MAPS_TUTS',
        };

        const map = new Map(mapRef.current as HTMLDivElement, options);

        const marker = new Marker({
          map: map,
          position: locationInMap,
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();
  }, [lat, lng]);

  return <div className="h-[600px]" ref={mapRef} />;
}
