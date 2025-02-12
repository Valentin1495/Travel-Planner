'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BadgeInfo, Clock } from 'lucide-react';
import Image from 'next/image';
import StarRatings from 'react-star-ratings';
import PopUp from './pop-up';
import { usePlaceSheetStore } from '@/hooks/use-place-details-store';
import { formatNumber } from '@/lib/utils';
import { Day } from '@/lib/types';
import { AspectRatio } from './ui/aspect-ratio';

type ItineraryAccordionProps = { days: Day[] };

export default function ItineraryAccordion({ days }: ItineraryAccordionProps) {
  const { openSheet } = usePlaceSheetStore();

  return (
    <div>
      <Accordion type='multiple' className='min-w-[280px] sm:min-w-[500px]'>
        {days.map(({ day, activities, theme }, idx) => (
          <AccordionItem value={day} key={idx}>
            <AccordionTrigger className='text-xl font-semibold'>
              {day + ' - ' + theme}
            </AccordionTrigger>
            <AccordionContent>
              {activities.map(
                ({ placeId, details, name, description, type }, idx) => {
                  if (!details) return;
                  const {
                    photos,
                    formatted_address,
                    opening_hours,
                    rating,
                    reviews,
                    types,
                    url,
                    user_ratings_total,
                    website,
                    name: placeName,
                  } = details;
                  return (
                    <div key={idx}>
                      <div
                        className='rounded-md border border-gray-300 p-3 flex flex-col sm:flex-row gap-3 cursor-pointer transition shadow-md hover:shadow-xl'
                        onClick={() =>
                          openSheet({
                            photos,
                            user_ratings_total,
                            rating,
                            types,
                            opening_hours,
                            reviews,
                            url,
                            website,
                            formatted_address,
                            name: placeName,
                            description,
                          })
                        }
                      >
                        {photos && (
                          <div className='min-w-[200px]'>
                            <AspectRatio ratio={1 / 1}>
                              <Image
                                src={photos[0].photoSrc}
                                alt='Featured'
                                fill
                                className='object-cover rounded-md'
                              />
                            </AspectRatio>
                          </div>
                        )}
                        <div>
                          <h3 className='text-lg font-medium'>{name}</h3>
                          <p className='text-base'>{description}</p>
                          {rating && (
                            <div className='space-x-2 flex'>
                              <span className='text-sm mt-0.5'>{rating}</span>

                              <div>
                                <StarRatings
                                  rating={rating}
                                  starRatedColor='#ffd500'
                                  starDimension='16px'
                                  starSpacing='2px'
                                />
                              </div>

                              <span className='text-sm mt-0.5'>
                                ({formatNumber(user_ratings_total)})
                              </span>
                            </div>
                          )}
                          <section className='my-2 flex items-center gap-1'>
                            <BadgeInfo
                              className='text-gray-500'
                              size={20}
                              strokeWidth={2.5}
                            />
                            {type}
                          </section>
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
                                    <span className='text-green-500 text-sm underline'>
                                      Open
                                    </span>
                                  ) : (
                                    <span className='text-red-500 text-sm underline'>
                                      Closed
                                    </span>
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
                        </div>
                      </div>
                      {idx < activities.length - 1 && (
                        <div className='bg-gray-300 h-10 w-0.5 mx-auto' />
                      )}
                    </div>
                  );
                }
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
