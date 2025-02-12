import deleteString from '@/lib/delete-string';
import { createApi } from 'unsplash-js';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { interests, tripGroupType } from '@/lib/constants';
import Background from '@/components/background';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Suspense } from 'react';
import PhotoSkeleton from '@/components/photo-skeleton';
import CreateItinerary from '@/components/create-itinerary';

type Params = Promise<{
  place: string;
}>;

type SearchParams = Promise<{
  tripLength: string;
  month: string;
  group: string;
  children: string;
  pets: string;
  interests: string;
}>;

export async function generateMetadata(props: { params: Params }) {
  const { place } = await props.params;
  const decodedPlace = decodeURIComponent(place);
  const replacedPlace = deleteString(decodedPlace);

  return {
    title: `TripTailor - ${replacedPlace} trip`,
  };
}

export default async function Itinerary(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const {
    interests: interestsStr,
    tripLength,
    children,
    group,
    month,
    pets,
  } = await props.searchParams;
  const { place } = await props.params;
  const decodedPlace = decodeURIComponent(place);
  const replacedPlace = deleteString(decodedPlace);

  const unsplash = createApi({ accessKey: process.env.UNSPLASH_API_KEY! });
  const photos = await unsplash.search.getPhotos({ query: replacedPlace });

  if (photos.errors) {
    // handle error here
    console.log('error occurred: ', photos.errors[0]);
    return;
  }

  const feed = photos.response;
  const { total, results } = feed;

  // handle success here
  console.log(`received ${results.length} photos out of ${total}`);
  const randomPhoto = results[Math.floor(Math.random() * results.length)];
  const { blur_hash, description, urls } = randomPhoto;

  const interestArr = interestsStr
    .split(',')
    .map((strEl) => interests.find((el) => el.id === Number(strEl))?.interest);

  const tripInfo = {
    destination: replacedPlace,
    month,
    interests: interestArr,
    tripLength: tripLength === '1' ? '1 day' : tripLength + ' days',
    group: tripGroupType.find((el) => el.id === Number(group))?.group,
    children: children === 'Yes' ? true : false,
    pets: pets === 'Yes' ? true : false,
  };

  const stringifiedInfo = JSON.stringify(tripInfo);
  const prompt = `
      Plan a trip based on this data, and give me day 1 in JSON format. A query should be a specific address so its place id can be searched: \n

      ${stringifiedInfo} \n
       
      e.g. \n
    
    {
      "day": "Day 1",
      "theme": "Charming Paris & Seine River Romance",
      "activities": [
        {
          "name": "Jardin du Luxembourg Stroll",
          "description": "Enjoy a leisurely stroll through the beautiful Jardin du Luxembourg and let your pet explore the designated dog areas.",
          "type": "Exploration, Pet-Friendly",
          "query": "Jardin du Luxembourg, Paris, France"
        },
        {
          "name": "Brunch at Cafe de Flore", 
          "description": "Enjoy brunch at the iconic Cafe de Flore, known for its literary history and often welcoming well-behaved dogs on their terrace.",
          "type": "Foodie, Pet-Friendly",
          "query": "Cafe de Flore, 172 Boulevard Saint-Germain, 75006 Paris, France"
        },
        {
          "name": "Seine River Cruise",
          "description": "Take a romantic Seine River cruise at sunset, admiring the illuminated city landmarks. Many cruise operators allow well-behaved dogs on board.",
          "type": "Romance, Pet-Friendly",
          "query": "75005 Paris, France"
        },
        {
          "name": "Dinner at Brasserie Lipp",
          "description": "Indulge in a delicious French dinner at the classic Brasserie Lipp, known for its charming outdoor terrace and often welcoming dogs.",
          "type": "Foodie, Pet-Friendly",
          "query": "Brasserie Lipp, 151 Boulevard Saint-Germain, 75006 Paris, France"
        }
      ]
    }
`;

  return (
    <main className='max-w-3xl mx-auto py-10 px-5 md:px-3'>
      <Background />

      <div className='text-sm flex items-center gap-x-2 mb-5 justify-center'>
        <section className='p-1 bg-primary/60 rounded-full'>
          <Sparkles
            className='text-gray-600'
            size={20}
            strokeWidth={1.75}
            color='#ffffff'
          />
        </section>
        Powered by AI
      </div>

      <Suspense fallback={<PhotoSkeleton />}>
        <div className='relative mb-5'>
          <div className='w-full sm:w-96 mx-auto relative rounded-lg overflow-hidden'>
            <AspectRatio ratio={16 / 9}>
              <Image
                src={urls.small}
                alt={description || replacedPlace}
                fill
                className='object-cover'
              />
            </AspectRatio>

            <section className='absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent' />
          </div>

          <div className='flex items-center gap-4 text-base font-bold absolute bottom-3 left-3 sm:left-48 text-white z-10'>
            <section className='flex gap-2 items-center'>
              <CalendarDays className='w-5 h-5' strokeWidth={2.5} />

              {tripLength === '1' ? '1 day' : tripLength + ' days'}
            </section>

            <section className='flex items-center gap-2'>
              <MapPin className='w-5 h-5' strokeWidth={2.5} />

              {replacedPlace}
            </section>
          </div>
        </div>
      </Suspense>

      <CreateItinerary input={prompt} tripLength={tripLength} />
    </main>
  );
}
