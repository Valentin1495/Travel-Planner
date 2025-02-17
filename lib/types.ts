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
      photoSrc: string;
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
  placeId?: string;
  details?: PlaceDetailsResponse['result'];
}

export interface Day {
  day: string;
  theme: string;
  activities: Activity[];
}

export interface Dict {
  heading1: string;
  heading2: string;
  paragraph: string;
  sparkles: string;
  placeHeading: string;
  placeParagraph: string;
  months: {
    id: number;
    name: string;
  }[];
  tripLengthHeading: string;
  tripLengthParagraph: string;
  tripLengthQuestion: string;
  tripTypeHeading: string;
  tripTypeParagraph: string;
  petQuestion: string;
  childrenQuestion: string;
  withChildren: {
    id: number;
    answer: string;
  }[];
  withPets: {
    id: number;
    answer: string;
  }[];
  tripGroupType: {
    id: number;
    group: string;
  }[];
  interests: {
    id: number;
    interest: string;
  }[];
  interestsHeading: string;
  interestsParagraph: string;
  newTrip: string;
  day: string;
}
