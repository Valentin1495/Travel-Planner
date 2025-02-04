'use client';

import { useEffect, useState } from 'react';
import ItineraryAccordion from './itinerary-accordion';
import GoogleMap from './google-map';
import { TripData } from '@/lib/types';

type CardContent = {
  name: string;
  placeId?: string;
  photoReference?: string;
};

export type Points = {
  lat?: number;
  lng?: number;
  placeId?: string;
}[];

type ItineraryMapProps = {
  tripData: TripData;
  points: Points;
};

export default function ItineraryMap({ points, tripData }: ItineraryMapProps) {
  const days = tripData.days;
  const [hoveredMarker, setHoveredMarker] = useState('');
  const [hoverCardContent, setHoveredCardContent] = useState<CardContent>();

  // useEffect(() => {
  //   const getContent = () => {
  //     let content;
  //     for (let i = 0; i < days.length - 1; i++) {
  //       content = days[i].activities.find(
  //         ({ placeId }) => placeId === hoveredMarker
  //       );

  //       if (content) {
  //         setHoveredCardContent({
  //           name: content.name,
  //           placeId: content.placeId,
  //           photoReference: content.details?.photos && content.details?.photos[0].photo_reference
  //         });
  //       }
  //       break;
  //     }
  //   };

  //   getContent();
  // }, [hoveredMarker]);
  // console.log(hoverCardContent);
  return (
    <div className='flex flex-col xl:flex-row mt-6 mx-auto max-w-6xl gap-8'>
      <ItineraryAccordion
        days={days}
        // setHoveredMarker={setHoveredMarker}
      />
      {/* <GoogleMap
        points={points}
        setHoveredMarker={setHoveredMarker}
        hoveredMarker={hoveredMarker}
        content={content}
      /> */}
    </div>
  );
}
