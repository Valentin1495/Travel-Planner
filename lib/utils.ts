import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export const getGooglePhotoUrl = (photoReference: string) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${process.env.GOOGLE_API_KEY}`;
};

export const formatNumber = (num?: number) => {
  if (!num) return null;

  return new Intl.NumberFormat().format(num);
};

export const formatType = (str?: string) => {
  if (!str) return null;

  return str.replace(/_/g, ' ');
};
