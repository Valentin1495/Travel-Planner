import deleteString from '@/lib/delete-string';
import { createApi } from 'unsplash-js';
import { CalendarDays, MapPin, Sparkles } from 'lucide-react';
import { interests, tripGroupType } from '@/lib/constants';
import Background from '@/components/background';
import { Suspense } from 'react';
import PhotoSkeleton from '@/components/photo-skeleton';
import CreateItinerary from '@/components/create-itinerary';
import ImageCarousel from '@/components/image-carousel';
import { getDictionary } from '../../dictionaries';

type Params = Promise<{
  place: string;
  lang: 'en' | 'ko';
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
  const { place, lang } = await props.params;
  const decodedPlace = decodeURIComponent(place);
  const replacedPlace = deleteString(decodedPlace);
  const dict = await getDictionary(lang);
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
  const randomPhotos = results.slice(0, 10);
  // const { description, urls } = randomPhoto;

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
  const prompt =
    lang === 'en'
      ? `
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
`
      : `이 데이터를 기반으로 여행 계획을 세우고, 첫째 날의 일정을 JSON 형식으로 제공해 주세요.  
query는 특정 주소여야 하며, 이를 통해 장소 ID를 검색할 수 있어야 합니다. 나머지 값들은 한글로 주세요.: \n  

${stringifiedInfo} \n  

예시: \n  

{
"day": "1일차",
"theme": "매력적인 파리 & 센 강의 로맨스",
"activities": [
  {
    "name": "뤽상부르 공원 산책",
    "description": "아름다운 뤽상부르 공원을 여유롭게 산책하며 반려동물이 지정된 공간에서 자유롭게 놀 수 있도록 해보세요.",
    "type": "탐방, 반려동물 친화적",
    "query": "Jardin du Luxembourg, Paris, France"
  },
  {
    "name": "카페 드 플로르에서 브런치",
    "description": "문학적 역사로 유명한 상징적인 카페 드 플로르에서 브런치를 즐기세요. 테라스에서는 예의 바른 반려동물을 동반할 수 있습니다.",
    "type": "미식, 반려동물 친화적",
    "query": "Cafe de Flore, 172 Boulevard Saint-Germain, 75006 Paris, France"
  },
  {
    "name": "센 강 크루즈",
    "description": "해 질 녘에 센 강 크루즈를 타며 조명이 밝히는 도시의 랜드마크를 감상하세요. 일부 크루즈 운영사는 예의 바른 반려동물의 탑승을 허용합니다.",
    "type": "로맨스, 반려동물 친화적",
    "query": "75005 Paris, France"
  },
  {
    "name": "브라세리 립에서 저녁 식사",
    "description": "클래식한 브라세리 립에서 맛있는 프랑스식 저녁을 즐기세요. 이곳은 매력적인 야외 테라스로 유명하며 반려동물을 종종 환영합니다.",
    "type": "미식, 반려동물 친화적",
    "query": "Brasserie Lipp, 151 Boulevard Saint-Germain, 75006 Paris, France"
  }
]
}`;

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

      <div className='flex items-center gap-4 text-base font-semibold justify-center mb-3'>
        <section className='flex gap-2 items-center'>
          <CalendarDays className='w-5 h-5' strokeWidth={2.5} />
          {lang === 'ko'
            ? `${tripLength}일`
            : tripLength === '1'
            ? '1 day'
            : tripLength + ' days'}
        </section>

        <section className='flex items-center gap-2'>
          <MapPin className='w-5 h-5' strokeWidth={2.5} />

          {replacedPlace}
        </section>
      </div>

      <Suspense fallback={<PhotoSkeleton />}>
        <ImageCarousel photos={randomPhotos} place={replacedPlace} />
      </Suspense>

      <CreateItinerary
        input={prompt}
        tripLength={tripLength}
        dict={dict}
        lang={lang}
      />
    </main>
  );
}
