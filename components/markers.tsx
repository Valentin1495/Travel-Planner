'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';
import MapPin from './map-pin';
import { GoogleMapProps } from './google-map';
import { useEffect, useState } from 'react';

type MarkersProps = GoogleMapProps;
type PlaceInfo = {
  location: string;
  place_id: string;
  photo: {
    height: number;
    html_attributions: string[];
    photo_reference: string;
    width: number;
  } | null;
};

export default function Markers({
  points,
  hoveredMarker,
  content,
}: MarkersProps) {
  const [hoveredMapPin, setHoveredMapPin] = useState<PlaceInfo>();

  useEffect(() => {
    const getHoveredMarker = () => {
      let hoveredMapPin;
      for (let i = 0; i < content.length - 1; i++) {
        hoveredMapPin = content[i].find((c) => c.place_id === hoveredMarker);

        if (hoveredMapPin) break;
      }

      return hoveredMapPin;
    };
    const marker = getHoveredMarker();
    setHoveredMapPin(marker);
  }, [content, hoveredMarker]);
  console.log(points);

  return points.map(({ place_id, lat, lng }) => (
    <AdvancedMarker key={place_id} position={{ lat, lng }} onClick={() => setHoveredMapPin()}>
      {place_id === hoveredMapPin?.place_id && (
        <div className='absolute bg-white z-50 min-w-[240px]'>
          {hoveredMapPin?.location}
        </div>
      )}
      <MapPin className='w-8 h-8 text-primary -z-10' />
    </AdvancedMarker>
  ));
}
