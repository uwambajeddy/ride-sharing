'use client';

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

type Coordinates = {
  latitude: number;
  longitude: number;
};


export default function  GoogleMaps({ onSelectLocation }: { onSelectLocation: any }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocations, setSelectedLocations] = useState<Coordinates[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        version: 'quarterly',
      });

      const { Map } = await loader.importLibrary('maps');
      const { Marker } = await loader.importLibrary('marker');

      const locationInMap = {
        lat: -1.939826787816454,
        lng: 30.0445426438232,
      };

      const options: google.maps.MapOptions = {
        center: locationInMap,
        zoom: 15,
        mapId: 'NEXT_MAPS_TUTS',
      };

      const map = new Map(mapRef.current as HTMLDivElement, options);

      // Add click listener to the map
      map.addListener('click', (e: google.maps.KmlMouseEvent) => {
        const clickedLatLng = e.latLng;
        if (clickedLatLng) {
          const lat = clickedLatLng.lat();
          const lng = clickedLatLng.lng();

          // Call the onSelectLocation function with coordinates
          setSelectedLocations(prevLocations => {
            if (prevLocations.length < 2) {
              const updatedLocations = [...prevLocations, { latitude: lat, longitude: lng }];
              
              onSelectLocation(updatedLocations); // Call onSelectLocation with the updated locations
              return updatedLocations;
            }
            return prevLocations; // Return the previous state if the limit is reached
          });
        }

        // (Optional) Add a marker at the clicked location
        const marker = new Marker({
          map: map,
          position: clickedLatLng,
        });
      });
    };

    initializeMap();
  }, []);

  return <div className="h-[600px]" ref={mapRef} />;
}
 