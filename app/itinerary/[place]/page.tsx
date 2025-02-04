import Plan from '@/components/plan';
import deleteString from '@/lib/delete-string';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createApi } from 'unsplash-js';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import {
  data,
  interests,
  mockAnswer,
  mockPhoto,
  tripGroupType,
} from '@/lib/constants';
import Background from '@/components/background';
import ItineraryMap from '@/components/itinerary-map';
import { enrichTripDataWithPlaceDetails } from '@/lib/utils';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Suspense } from 'react';
import PhotoSkeleton from '@/components/photo-skeleton';
import ItinerarySkeleton from '@/components/itinerary-skeleton';

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

// type Locations = {
//   [key: string]: { name: string; description: string; type: string }[];
// };

export async function generateMetadata(props: { params: Params }) {
  const { place } = await props.params;
  const decodedPlace = decodeURIComponent(place);
  const replacedPlace = deleteString(decodedPlace);

  return {
    title: `TripTailor - ${replacedPlace} trip`,
  };
}

export const revalidate = 3600;

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
  // const result = await unsplash.search.getPhotos({ query: replacedPlace });

  // if (result.errors) {
  //   // handle error here
  //   console.log('error occurred: ', result.errors[0]);
  //   return;
  // }

  // const feed = result.response;
  // const { total, results } = feed;

  // // handle success here
  // console.log(`received ${results.length} photos out of ${total}`);
  // const randomPhoto = results[Math.floor(Math.random() * results.length)];
  // const { blur_hash, description, urls } = randomPhoto;
  const { blur_hash, description, urls } = mockPhoto;

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
      Plan a trip based on this data. Add specific address as a query so its place id can be searched: \n
      ${stringifiedInfo} \n
       e.g. \n

    \`\`\`json
{
  "tripName": "Parisian Pet-Friendly Getaway for Two",
  "days": [
    {
      "day": "Day 1",
      "theme": "Charming Paris & Seine River Romance",
      "activities": [
        {
          "name": "Jardin du Luxembourg Stroll",
          "description": "Enjoy a leisurely stroll through the beautiful Jardin du Luxembourg and let your pet explore the designated dog areas.",
          "type": "Exploration, Pet-Friendly",
          "query": "Jardin du Luxembourg, Paris, France", 
          "googleMapsUrl": "https://developers.google.com/maps/documentation/javascript/error-messages" 
        },
        {
          "name": "Brunch at Cafe de Flore", 
          "description": "Enjoy brunch at the iconic Cafe de Flore, known for its literary history and often welcoming well-behaved dogs on their terrace.",
          "type": "Foodie, Pet-Friendly",
          "query": "Cafe de Flore, 172 Boulevard Saint-Germain, 75006 Paris, France", 
          "googleMapsUrl": "https://developers.google.com/maps/documentation/maps-static/error-messages" 
        },
        {
          "name": "Seine River Cruise",
          "description": "Take a romantic Seine River cruise at sunset, admiring the illuminated city landmarks. Many cruise operators allow well-behaved dogs on board.",
          "type": "Romance, Pet-Friendly",
          "query": "Seine River Cruises Paris", 
          "googleMapsUrl": "https://www.google.com/maps/search/Seine+River+Cruise+Paris+Sunset" 
        },
        {
          "name": "Dinner at Brasserie Lipp",
          "description": "Indulge in a delicious French dinner at the classic Brasserie Lipp, known for its charming outdoor terrace and often welcoming dogs.",
          "type": "Foodie, Pet-Friendly",
          "query": "Brasserie Lipp, 151 Boulevard Saint-Germain, 75006 Paris, France", 
          "googleMapsUrl": "https://developers.google.com/maps/documentation/javascript/error-messages#missing-key-map-errorhttp://maps.google.com/maps/api/js?sensor=true®ion=GBLine" 
        }
      ]
    },
    {
      "day": "Day 2",
      "theme": "Shopping & Parisian Chic",
      "activities": [
        {
          "name": "Shopping in Saint-Germain-des-Prés",
          "description": "Explore the charming boutiques and cafes in the Saint-Germain-des-Prés neighborhood.",
          "type": "Shopping",
          "query": "Saint-Germain-des-Prés, Paris, France", 
          "googleMapsUrl": "https://maps.google.com/?cid=87630583782186263542" 
        },
        {
          "name": "Visit Le Bon Marché",
          "description": "Discover Le Bon Marché, a renowned department store offering a wide selection of luxury goods and a gourmet food hall. Check for pet-friendly areas within the store.",
          "type": "Shopping, Foodie",
          "query": "Le Bon Marché, 24 Rue de Sèvres, 75007 Paris, France", 
          "googleMapsUrl": "https://www.google.com/maps/search/Le+Bon+March%C3%A9+Paris" 
        },
        {
          "name": "Coffee Break in the Latin Quarter",
          "description": "Wander through the charming streets of the Latin Quarter and enjoy a coffee at a traditional Parisian café.",
          "type": "Exploration, Foodie",
          "query": "Latin Quarter, Paris, France", 
          "googleMapsUrl": "https://www.google.com/maps/search/Latin+Quarter+Paris" 
        }
      ]
    },
    {
      "day": "Day 3",
      "theme": "Montmartre Magic & Departure",
      "activities": [
        {
          "name": "Explore Montmartre",
          "description": "Explore the artistic neighborhood of Montmartre, visit the Sacré-Cœur Basilica, and enjoy the charming atmosphere. Check for any dog restrictions within the Basilica.",
          "type": "Exploration, Romance, Pet-Friendly",
          "query": "Montmartre, Paris, France", 
          "googleMapsUrl": "https://www.google.com/maps/search/Montmartre+Paris" 
        },
        {
          "name": "Picnic in Jardin du Luxembourg",
          "description": "Enjoy a picnic lunch in the beautiful Jardin du Luxembourg.",
          "type": "Foodie, Pet-Friendly",
          "query": "Jardin du Luxembourg, Paris, France", 
          "googleMapsUrl": "https://developers.google.com/maps/documentation/javascript/error-messages" 
        },
        {
          "name": "Farewell Dinner",
          "description": "Enjoy a final Parisian dinner at a restaurant of your choice before heading to the airport.",
          "type": "Foodie",
          "query": "Restaurants Paris", 
          "googleMapsUrl": "https://www.google.com/maps/search/Paris+Restaurants" 
        }
      ]
    }
  ]
}
\`\`\`

    **Note:** This plan takes into account the "pets" aspect by focusing on activities that are generally pet-friendly (walking tours, open-air areas like Montmartre), but it's crucial to confirm pet policies at specific restaurants and attractions beforehand.  January in Paris is cold, so ensure you pack accordingly for you and your pet.  Pre-booking tickets for popular attractions like the Eiffel Tower and Louvre is highly recommended, especially during peak season (though January is typically less crowded).
    `;

  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  // const result = await model.generateContent(prompt);
  // const answer = result.response.text();

  // 정규 표현식을 사용해 JSON 부분 추출 (백틱과 json 제외)
  const jsonPattern = /```json([\s\S]*?)```/;

  const matchResult = mockAnswer.match(jsonPattern);

  let jsonData;
  let extraText;
  if (matchResult && matchResult.index !== undefined) {
    // 실제 JSON 문자열을 추출
    const jsonString = matchResult[1].trim();
    const fixJson = (str: string): string => {
      return str.replace(/,\s*(\}|])/g, '$1'); // 마지막 항목 뒤의 쉼표를 제거
    };
    const fixedData = fixJson(jsonString);
    // JSON 데이터 파싱
    jsonData = JSON.parse(fixedData);

    // JSON 데이터와 그 이후의 텍스트 분리
    extraText = mockAnswer
      .substring(matchResult.index + matchResult[0].length)
      .trim();
  }

  const enrichedData = await enrichTripDataWithPlaceDetails(jsonData);

  const points = enrichedData.days
    .map((d) =>
      d.activities.map(({ details, placeId }) => ({
        placeId,
        lat: details?.geometry?.location?.lat,
        lng: details?.geometry?.location?.lng,
      }))
    )
    .flat();

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

      <Suspense fallback={<ItinerarySkeleton />}>
        <p>{extraText}</p>

        <ItineraryMap tripData={enrichedData} points={points} />
      </Suspense>
    </main>
  );
}
