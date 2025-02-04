'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type ImageSliderProps = {
  imgSrcList: string[];
};

export default function ImageSlider({ imgSrcList }: ImageSliderProps) {
  const [order, setOrder] = useState(0);
  const slideRight = () =>
    setOrder((prev) => {
      if (prev === imgSrcList.length - 1) return 0;
      return prev + 1;
    });
  const slideLeft = () =>
    setOrder((prev) => {
      if (order === 0) return imgSrcList.length - 1;
      return prev - 1;
    });

  if (imgSrcList.length === 0) return null;

  return (
    <div className='relative group'>
      <button
        onClick={slideLeft}
        className='absolute left-1.5 top-1/2 -translate-y-1/2 z-50 bg-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity arrow'
      >
        <ArrowLeft color='white' />
      </button>
      <button
        onClick={slideRight}
        className='absolute z-50 right-1.5 top-1/2 -translate-y-1/2 bg-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity arrow'
      >
        <ArrowRight color='white' />
      </button>
      <div className='absolute bottom-2 z-50 left-1/2 -translate-x-1/2 space-x-1.5 sm:space-x-3'>
        {imgSrcList.map((_, idx) => {
          const currentOrder = order === idx;
          return (
            <button
              onClick={() => setOrder(idx)}
              key={idx}
              className={cn(
                'rounded-full',
                currentOrder ? 'w-2 h-2 bg-white' : 'w-1.5 h-1.5 bg-gray-400'
              )}
            />
          );
        })}
      </div>

      <div className='flex w-[5400px]'>
        {imgSrcList.map((el, idx) => (
          <div
            key={idx}
            className='relative aspect-[10/6] w-[540px]'
            style={{
              transform: `translateX(${order * -100}%)`,
              transition: 'transform 300ms ease-in-out',
            }}
          >
            <Image
              src={el}
              alt={`photo ${idx + 1}`}
              className='object-cover '
              fill
            />
            <div className='absolute z-10 w-full h-1/3 bottom-0 bg-gradient-to-t from-black' />
          </div>
        ))}
      </div>
    </div>
  );
}
