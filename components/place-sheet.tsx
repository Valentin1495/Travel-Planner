'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { usePlaceSheetStore } from '@/hooks/use-place-details-store';
import ImageSlider from './image-slider';
import {
  formatNumber,
  formatType,
  getImgSrc,
  translateDays,
} from '@/lib/utils';
import StarRatings from 'react-star-ratings';
import PopUp from './pop-up';
import { BadgeInfo, Clock, LinkIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PlaceSheet() {
  const { open, data, closeSheet } = usePlaceSheetStore();
  const imgSrcList =
    data && data.photos
      ? data.photos.map((el) => getImgSrc(el.photo_reference))
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
    description,
  } = data;

  return (
    <Sheet open={open} onOpenChange={closeSheet}>
      <SheetContent className='py-10 px-0 min-w-[540px] overflow-hidden overflow-y-scroll'>
        <ImageSlider imgSrcList={imgSrcList} />
        <div className='p-6'>
          <SheetHeader>
            <SheetTitle className='text-3xl font-bold'>{name}</SheetTitle>
          </SheetHeader>

          <div className='space-y-2'>
            <div className='flex flex-col'>
              {types?.map((el, idx) => (
                <span key={idx}>{formatType(el)}</span>
              ))}
            </div>

            <div className='flex items-center gap-3'>
              <PopUp
                trigger={
                  <div className='flex items-center gap-1'>
                    <Clock
                      className='text-gray-500'
                      size={18}
                      strokeWidth={2.5}
                    />
                    {opening_hours?.open_now ? (
                      <span className='text-green-500 underline underline-offset-4'>
                        영업 중
                      </span>
                    ) : (
                      <span className='text-red-500 underline'>영업 종료</span>
                    )}
                  </div>
                }
              >
                {opening_hours ? (
                  <section className='space-y-1'>
                    {opening_hours.weekday_text.map((el, idx) => (
                      <p key={idx}>{translateDays(el)}</p>
                    ))}
                  </section>
                ) : (
                  <p>영업 시간 미제공</p>
                )}
              </PopUp>

              {website && (
                <div className='flex items-center gap-1'>
                  <LinkIcon
                    size={18}
                    strokeWidth={2.5}
                    className='text-gray-500'
                  />
                  <Link href={website} target='_blank' className='underline'>
                    웹사이트
                  </Link>
                </div>
              )}
            </div>

            <div className='flex gap-1'>
              <BadgeInfo
                className='min-w-fit text-gray-500'
                strokeWidth={2.5}
                size={18}
              />
              <p>{description}</p>
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

          <h2 className='text-xl font-bold mt-4'>리뷰</h2>
          <div>
            {rating && (
              <div className='space-x-2 flex items-center'>
                <span className='text-lg'>{rating}</span>

                <div className='mb-1'>
                  <StarRatings
                    rating={rating}
                    starRatedColor='#ffd500'
                    starDimension='20px'
                    starSpacing='2px'
                  />
                </div>

                <span className='text-lg'>
                  리뷰 {formatNumber(user_ratings_total)}개
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
