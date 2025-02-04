export interface TextSearchResponse {
  results: {
    place_id: string;
    name: string;
    formatted_address?: string;
  }[];
  status: string;
}

export interface PlaceDetailsResponse {
  result?: {
    formatted_address?: string;
    geometry?: {
      location?: {
        lat?: number;
        lng?: number;
      };
    };
    name?: string;
    photos?: {
      photo_reference?: string;
      height?: number;
      width?: number;
    }[];
    rating?: number;
    reviews?: {
      author_name?: string;
      rating?: number;
      text?: string;
      profile_photo_url: string;
      relative_time_description?: string;
      time?: string;
      author_url?: string;
    }[];
    types?: string[];
    url?: string;
    user_ratings_total?: number;
    website?: string;
    opening_hours?: {
      open_now?: boolean;
      periods?: {
        open?: {
          day?: number;
          time?: string;
        };
        close?: {
          day?: number;
          time?: string;
        };
      }[];
      weekday_text?: string[];
    };
  };
  status: string;
}

export interface Activity {
  name: string;
  description: string;
  type: string;
  query?: string;
  googleMapsUrl?: string;
  placeId?: string;
  details?: PlaceDetailsResponse['result'];
}

export interface Day {
  day: string;
  theme: string;
  activities: Activity[];
}

export interface TripData {
  tripName: string;
  days: Day[];
}
