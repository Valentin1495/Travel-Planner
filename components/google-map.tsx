'use client';

import { Map } from '@vis.gl/react-google-maps';
import Markers from './markers';
import { Points } from './itinerary-map';
import { Dispatch, SetStateAction } from 'react';

export type GoogleMapProps = Points & {
  hoveredMarker: string;
  setHoveredMarker: Dispatch<SetStateAction<string>>
  content: {
    location: string;
    place_id: string;
    photo: {
      height: number;
      html_attributions: string[];
      photo_reference: string;
      width: number;
    } | null;
  }[][];
};

export default function GoogleMap({
  points,
  hoveredMarker,
  content,
}: GoogleMapProps) {
  return (
    <div className='w-2/5 h-[70vh] sticky top-[128px]'>
      <Map center={points[0]} zoom={10} mapId={process.env.NEXT_PUBLIC_MAP_ID}>
        <Markers
          points={points}
          hoveredMarker={hoveredMarker}
          content={content}
        />
      </Map>
    </div>
  );
}
