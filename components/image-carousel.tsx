'use client';

import { Basic } from 'unsplash-js/dist/methods/photos/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { AspectRatio } from './ui/aspect-ratio';
import Image from 'next/image';

type ImageCarouselProps = {
  photos: Basic[];
  place: string;
};

export default function ImageCarousel({ photos, place }: ImageCarouselProps) {
  return (
    <Carousel
      className='w-full sm:w-96 mx-auto'
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {photos.map(({ description, urls, alt_description, id }) => (
          <CarouselItem key={id}>
            <div className='w-full relative rounded-lg overflow-hidden'>
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={urls.small}
                  alt={description || alt_description || place}
                  fill
                  className='object-cover'
                />
              </AspectRatio>
              <section className='absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent' />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  );
}
