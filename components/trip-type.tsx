import { Dispatch, SetStateAction, useState } from 'react';
import { Data } from './multi-step-form';
import { tripGroupType, withChildren, withPets } from '@/lib/constants';
import { Button } from './ui/button';
import { Check, Heart, Home, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type TripTypeProps = { data: Data; setData: Dispatch<SetStateAction<Data>> };

export default function TripType({ data, setData }: TripTypeProps) {
  const selectType = (id: number) =>
    setData((prev) => ({
      ...prev,
      tripType: {
        ...prev.tripType,
        group: tripGroupType.find((type) => type.id === id)!,
      },
    }));

  const selectChildren = (id: number) => {
    setData((prev) => ({
      ...prev,
      tripType: {
        ...prev.tripType,
        children: withChildren.find((el) => el.id === id),
      },
    }));
  };
  const selectPets = (id: number) => {
    setData((prev) => ({
      ...prev,
      tripType: {
        ...prev.tripType,
        pets: withPets.find((el) => el.id === id)!,
      },
    }));
  };

  return (
    <div className='mt-16 flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-5'>
        What kind of trip are you planning?
      </h1>
      <p className='text-sm text-neutral-600 mb-3'>Select one.</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-10'>
        {tripGroupType.map(({ id, group }) => {
          const isSelected = id === data.tripType.group.id;

          return (
            <Button
              variant='outline'
              key={id}
              onClick={() => selectType(id)}
              className={cn(
                'flex items-start justify-between w-40 h-24 pt-3 rounded-lg font-semibold',
                `${
                  isSelected &&
                  'bg-primary hover:bg-primary/90 text-white hover:text-white'
                }`
              )}
            >
              <div>
                {id === 1 && <User className='mb-1' size={20} />}
                {id === 2 && <Heart className='mb-1' size={20} />}
                {id === 3 && <Users className='mb-1' size={20} />}
                {id === 4 && <Home className='mb-1' size={20} />}
                <span className='text-sm'>{group}</span>
              </div>
              {isSelected && <Check size={20} />}
            </Button>
          );
        })}
      </div>

      {(data.tripType.group.id === 3 || data.tripType.group.id === 4) && (
        <div className='space-y-5'>
          <p className='text-center'>Are you traveling with children?</p>
          <div className='flex items-center gap-3'>
            {withChildren.map(({ id, answer }) => {
              const isSelected = id === data.tripType.children?.id;

              return (
                <Button
                  className={cn(
                    'rounded-full w-36',
                    `${
                      isSelected &&
                      'bg-primary hover:bg-primary/90 text-white hover:text-white'
                    }`
                  )}
                  variant='outline'
                  key={id}
                  onClick={() => selectChildren(id)}
                >
                  {isSelected && <Check size={20} className='mr-1' />}
                  {answer}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      <div className='space-y-5 mt-3 mb-8'>
        <p className='text-center'>Are you traveling with pets?</p>
        <div className='flex items-center gap-3'>
          {withPets.map(({ id, answer }) => {
            const isSelected = id === data.tripType.pets.id;

            return (
              <Button
                className={cn(
                  'rounded-full w-36 font-semibold',
                  `${
                    isSelected &&
                    'bg-primary hover:bg-primary/90 text-white hover:text-white'
                  }`
                )}
                variant='outline'
                key={id}
                onClick={() => selectPets(id)}
              >
                {isSelected && <Check size={20} className='mr-1' />}
                {answer}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
