'use client';

import { useState } from 'react';
import PlaceCombobox from './place-combobox';
import Header from './header';
import { cn, formatPlace } from '@/lib/utils';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import TripLength from './trip-length';
import TripType from './trip-type';
import Interests from './interests';
import { Dict } from '@/lib/types';

export type Data = {
  place?: string;
  interests: {
    id: number;
    interest: string;
  }[];
  tripLength: number;
  month: {
    id: number;
    name: string;
  } | null;
  tripType: {
    group: { id: number; group: string };
    children?: {
      id: number;
      answer: string;
    };
    pets: {
      id: number;
      answer: string;
    };
  };
};

type MultiStepFormProps = {
  dict: Dict;
};

export default function MultiStepForm({ dict }: MultiStepFormProps) {
  const initialData: Data = {
    place: undefined,
    interests: [],
    tripLength: 3,
    month: null,
    tripType: {
      group: { id: 1, group: 'Solo trip' },
      children: {
        id: 2,
        answer: 'No',
      },
      pets: {
        id: 2,
        answer: 'No',
      },
    },
  };

  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(1);
  const firstStep = currentStep === 1;
  const lastStep = currentStep === 4;
  const router = useRouter();
  const { place } = data;

  const back = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const redirectToPhotos = () => {
    const { interests, month, place, tripLength, tripType } = data;
    const params = new URLSearchParams();
    params.set('interests', interests.map((el) => el.id).join(','));
    const formattedPlace = formatPlace(place!);
    router.push(
      `/itinerary/${formattedPlace}?tripLength=${tripLength}&month=${
        month?.id
      }&group=${tripType.group.id}&children=${
        tripType.children?.id === 1 ? 'yes' : 'no'
      }&pets=${tripType.pets.id === 1 ? 'yes' : 'no'}&${params.toString()}`
    );
  };

  const nextOrRedirect = () => {
    if (!lastStep) {
      setCurrentStep((prev) => prev + 1);
    } else {
      redirectToPhotos();
    }
  };

  return (
    <div className='w-full flex flex-col min-h-screen py-20'>
      <Header place={place} currentStep={currentStep} />

      {currentStep === 1 && (
        <div className='space-y-3'>
          <PlaceCombobox setData={setData} dict={dict} />
        </div>
      )}

      {currentStep === 2 && (
        <TripLength data={data} setData={setData} dict={dict} />
      )}
      {currentStep === 3 && (
        <TripType data={data} setData={setData} dict={dict} />
      )}
      {currentStep === 4 && (
        <Interests data={data} setData={setData} dict={dict} />
      )}

      <div
        className={cn(
          firstStep ? 'justify-end' : 'justify-between',
          'flex items-center mt-auto'
        )}
      >
        {!firstStep && (
          <Button
            size='lg'
            variant='link'
            className='font-bold text-base text-gray-900'
            onClick={back}
            type='button'
          >
            Back
          </Button>
        )}

        <Button
          size='lg'
          className='font-bold rounded-full bg-gray-900 hover:bg-gray-900/90 text-base'
          onClick={nextOrRedirect}
          disabled={
            lastStep &&
            (!data.place || !data.month || data.interests.length === 0)
          }
        >
          {lastStep ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
