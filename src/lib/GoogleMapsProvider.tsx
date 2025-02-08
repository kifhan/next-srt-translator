'use client';

import { Libraries, useJsApiLoader } from '@react-google-maps/api';
import { ReactNode } from 'react';

// Define a list of libraries to load from the Google Maps API
const libraries = ['maps', 'places', 'drawing', 'geometry', 'localContext', 'marker' ];

export function GoogleMapsProvider({ children }: { children: ReactNode }) {

  // Load the Google Maps JavaScript API asynchronously
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
    libraries: libraries as Libraries,
  });

  if(loadError) return <p>Encountered error while loading google maps: {loadError.message}</p>

  if(!scriptLoaded) return <p>Map Script is loading ...</p>

  // Return the children prop wrapped by this MapProvider component
  return children;
}