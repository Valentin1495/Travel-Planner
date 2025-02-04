import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PlaceDetailsResponse, TextSearchResponse, TripData } from './types';

type Itinerary = {
  date: string;
  course: {
    location: string;
    activity: string;
    formatted_address?: string;
    name?: string;
    geometry?: google.maps.places.PlaceGeometry;
    icon?: string;
    opening_hours?: google.maps.places.PlaceOpeningHours;
    photos?: google.maps.places.PlacePhoto[];
    place_id?: string;
    rating?: number;
    reviews?: google.maps.places.PlaceReview[];
    types?: string[];
    url?: string;
    user_ratings_total?: number;
    website?: string;
  }[];
}[];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPlace(place: string) {
  const comma = place.includes(',');
  const indexOfComma = place.indexOf(',');

  let formattedPlace = '';

  if (comma) {
    formattedPlace = place.slice(0, indexOfComma);
  } else {
    formattedPlace = place.slice(0, place.length);
  }

  return formattedPlace;
}

export const searchTextSearch = async (
  query: string
): Promise<TextSearchResponse | null> => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text(); // Get error details from response body
      console.error(
        `Text Search 요청 실패: ${response.status} - ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data: TextSearchResponse = await response.json();

    if (data.status === 'OK') {
      return data;
    } else {
      console.error('Text Search API 반환 오류:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Text Search 요청 중 오류 발생:', error);
    return null;
  }
};

export const getPlaceDetails = async (
  placeId: string
): Promise<PlaceDetailsResponse | null> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry,name,photos,rating,reviews,types,url,user_ratings_total,website,opening_hours&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Place Details 요청 실패: ${response.status} - ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data: PlaceDetailsResponse = await response.json();

    if (data.status === 'OK') {
      return data;
    } else {
      console.error('Place Details API 반환 오류:', data.status);
      return null;
    }
  } catch (error) {
    console.error('Place Details 요청 중 오류 발생:', error);
    return null;
  }
};

export const enrichTripDataWithPlaceDetails = async (tripData: TripData) => {
  for (const day of tripData.days) {
    for (const activity of day.activities) {
      if (activity.query) {
        const searchResult = await searchTextSearch(activity.query);

        if (searchResult && searchResult.results.length > 0) {
          activity.placeId = searchResult.results[0].place_id;

          const placeDetails = await getPlaceDetails(activity.placeId);
          if (placeDetails && placeDetails.result) {
            activity.details = placeDetails.result;
            console.log(`Enriched ${activity.name} with details.`);
          } else {
            console.log(`Could not retrieve details for ${activity.name}`);
          }
        } else {
          console.log(`Could not find Place ID for ${activity.name}`);
        }
      }
    }
  }
  return tripData; // Return the modified tripData
};

export const getImgSrc = (photo_reference: string) =>
  `https://maps.googleapis.com/maps/api/place/photo?maxwidth=540&photo_reference=${photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

export const formatNumber = (num?: number) => {
  if (!num) return null;

  return new Intl.NumberFormat().format(num);
};

export const formatType = (str?: string) => {
  if (!str) return null;

  return str.replace(/_/g, ' ');
};
