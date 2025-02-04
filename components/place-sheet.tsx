'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { usePlaceSheetStore } from '@/hooks/use-place-details-store';
import ImageSlider from './image-slider';
import { formatNumber, formatType, getImgSrc } from '@/lib/utils';
import StarRatings from 'react-star-ratings';
import PopUp from './pop-up';
import { Clock, LinkIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from './ui/badge';

export default function PlaceSheet() {
  const { open, data, closeSheet } = usePlaceSheetStore();
  const imgSrcList =
    data && data.photos
      ? data.photos.map((el) =>
          el.photo_reference ? getImgSrc(el.photo_reference) : ''
        )
      : [];

  if (!data) return null;

  const {
    formatted_address,
    name,
    opening_hours,
    rating,
    reviews,
    types,
    url,
    user_ratings_total,
    website,
  } = data;

  return (
    <Sheet open={open} onOpenChange={closeSheet}>
      <SheetContent className='py-10 px-0 min-w-full sm:min-w-[540px] overflow-hidden overflow-y-scroll'>
        <ImageSlider imgSrcList={imgSrcList} />
        <div className='p-6'>
          <SheetHeader>
            <SheetTitle className='text-3xl font-bold'>{name}</SheetTitle>
          </SheetHeader>

          <div className='space-y-2 mt-2'>
            <div className='flex flex-wrap gap-2'>
              {types?.map((el, idx) => (
                <Badge variant='secondary' key={idx}>
                  {formatType(el)}
                </Badge>
              ))}
            </div>

            <div className='flex items-center gap-3'>
              {opening_hours && (
                <PopUp
                  trigger={
                    <div className='flex items-center gap-1'>
                      <Clock
                        className='text-gray-500'
                        size={18}
                        strokeWidth={2.5}
                      />
                      {opening_hours.open_now ? (
                        <span className='text-green-500 underline underline-offset-4'>
                          Open
                        </span>
                      ) : (
                        <span className='text-red-500 underline'>Closed</span>
                      )}
                    </div>
                  }
                >
                  {opening_hours.weekday_text ? (
                    <section className='space-y-1 p-3'>
                      {opening_hours.weekday_text.map((el, idx) => (
                        <p key={idx} className='text-base'>
                          {el}
                        </p>
                      ))}
                    </section>
                  ) : (
                    <p>No data</p>
                  )}
                </PopUp>
              )}

              {website && (
                <div className='flex items-center gap-1'>
                  <LinkIcon
                    size={18}
                    strokeWidth={2.5}
                    className='text-gray-500'
                  />
                  <Link href={website} target='_blank' className='underline'>
                    Website
                  </Link>
                </div>
              )}
            </div>

            <div className='flex items-center gap-1'>
              <MapPin size={18} strokeWidth={2.5} className='text-gray-500' />
              {url ? (
                <Link href={url} className='underline' target='_blank'>
                  {formatted_address}
                </Link>
              ) : (
                <p>{formatted_address}</p>
              )}
            </div>
          </div>

          {(rating || reviews) && (
            <h2 className='text-xl font-bold mt-4'>Reviews</h2>
          )}
          <div>
            {rating && (
              <div className='flex flex-col sm:flex-row items-start sm:items-center sm:gap-x-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-lg'>{rating}</span>

                  <div className='mb-1'>
                    <StarRatings
                      rating={rating}
                      starRatedColor='#ffd500'
                      starDimension='20px'
                      starSpacing='2px'
                    />
                  </div>
                </div>

                <span className='text-lg'>
                  {formatNumber(user_ratings_total)} reviews
                </span>
              </div>
            )}

            <div className='mt-4 space-y-3'>
              {reviews?.map(
                ({
                  author_name,
                  profile_photo_url,
                  relative_time_description,
                  text,
                  time,
                  author_url,
                  rating,
                }) => (
                  <div key={time}>
                    <div className='flex items-center gap-2'>
                      {author_url ? (
                        <Link href={author_url}>
                          <Image
                            src={profile_photo_url}
                            alt='profile picture'
                            width={60}
                            height={60}
                            className='object-cover aspect-square hover:darken'
                          />
                        </Link>
                      ) : (
                        <Image
                          src={profile_photo_url}
                          alt='profile picture'
                          width={60}
                          height={60}
                          className='object-cover aspect-square'
                        />
                      )}
                      {author_url ? (
                        <div className='flex flex-col'>
                          <Link
                            href={author_url}
                            className='text-lg font-semibold hover:underline'
                          >
                            {author_name}
                          </Link>
                          <span className='text-sm'>
                            {relative_time_description}
                          </span>
                        </div>
                      ) : (
                        <div className='flex flex-col'>
                          <h3 className='text-lg font-semibold'>
                            {author_name}
                          </h3>
                          <span className='text-sm'>
                            {relative_time_description}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='flex gap-2'>
                      <StarRatings
                        rating={rating}
                        starRatedColor='#ffd500'
                        starDimension='20px'
                        starSpacing='2px'
                      />
                      <span className='mt-0.5 text-lg'>{rating}</span>
                    </div>

                    <p>{text}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
