'use client';

import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Data } from './multi-step-form';
import { Check, MinusCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { months } from '@/lib/constants';
import { Button } from './ui/button';

type Props = { data: Data; setData: Dispatch<SetStateAction<Data>> };

export default function TripLength({ data, setData }: Props) {
  const { tripLength } = data;
  const [deactivateMinus, setDeactivateMinus] = useState(false);
  const [deactivatePlus, setDeactivatePlus] = useState(false);

  const selectMonth = (id: number) => {
    setData((prev) => ({
      ...prev,
      month: months.find((month) => month.id === id) || null,
    }));
  };

  useEffect(() => {
    if (tripLength === 7) {
      setDeactivatePlus(true);
    } else {
      setDeactivatePlus(false);
    }
    if (tripLength === 1) {
      setDeactivateMinus(true);
    } else {
      setDeactivateMinus(false);
    }
  }, [tripLength]);

  const addDays = () => {
    if (tripLength < 7) {
      setData((prev) => {
        return { ...prev, tripLength: tripLength + 1 };
      });
    }
  };

  const subtractDays = () => {
    if (tripLength > 1) {
      setData((prev) => {
        return { ...prev, tripLength: tripLength - 1 };
      });
    }
  };

  return (
    <div className='my-16 flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-5'>When are you going?</h1>
      <p className='text-sm text-neutral-600 mb-3'>
        Choose month and trip length.
      </p>

      <div className='w-full'>
        <div className='my-10'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-3'>
            {months.map(({ id, name }) => (
              <Button
                size='lg'
                variant='outline'
                className={cn(
                  'rounded-full min-w-[200px] font-semibold',
                  `${
                    data.month?.id === id &&
                    'bg-primary hover:bg-primary/90 text-white hover:text-white'
                  }`
                )}
                key={id}
                onClick={() => selectMonth(id)}
              >
                {data.month?.id === id && <Check size={16} className='mr-1' />}
                {name}
              </Button>
            ))}
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <p className='font-semibold'>How many days?</p>
          <div className='flex items-center gap-3'>
            <button
              className={cn(
                'active:text-black/50',
                deactivateMinus &&
                  'text-black/20 cursor-auto active:text-black/20'
              )}
              onClick={subtractDays}
            >
              <MinusCircle className='w-7 h-7' />
            </button>
            <span className='text-lg font-bold'>{tripLength}</span>
            <button
              className={cn(
                'active:text-black/50',
                deactivatePlus &&
                  'text-black/20 cursor-auto active:text-black/20'
              )}
              onClick={addDays}
            >
              <PlusCircle className='w-7 h-7' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
