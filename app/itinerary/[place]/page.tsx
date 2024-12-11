import Map from '@/components/map';
import { MapPinIcon } from '@/components/icons';
import Plan from '@/components/plan';
import deleteString from '@/lib/delete-string';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles } from 'lucide-react';
import { data, interests, tripGroupType } from '@/lib/constants';
import Background from '@/components/background';
import { addPlaceDetailsToItinerary, fetchPlaceDetails } from '@/lib/utils';
import ItineraryAccordion from '@/components/itinerary-accordion';

type ItineraryProps = {
  params: {
    place: string;
  };
  searchParams: {
    tripLength: string;
    month: string;
    group: string;
    children: string;
    pets: string;
    interests: string;
  };
};

type MetadataProp = Pick<ItineraryProps, 'params'>;

type Locations = {
  [key: string]: { name: string; description: string; type: string }[];
};

export async function generateMetadata({ params }: MetadataProp) {
  const { place } = await params;
  const decodedPlace = decodeURIComponent(place);
  const replacedPlace = deleteString(decodedPlace);

  return {
    title: `AIWanderlust - ${replacedPlace} 여행 일정`,
  };
}

export const revalidate = 3600;

export default async function Itinerary({
  params,
  searchParams,
}: ItineraryProps) {
  const {
    interests: interestsStr,
    tripLength,
    children,
    group,
    month,
    pets,
  } = await searchParams;
  const { place } = await params;
  const decodedPlace = decodeURIComponent(place);
  const interestArr = interestsStr
    .split(',')
    .map((strEl) => interests.find((el) => el.id === Number(strEl))?.interest);
  const replacedPlace = deleteString(decodedPlace);
  // const genAI = new GoogleGenerativeAI(process.env.API_KEY!);
  // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const tripInfo = {
    destination: replacedPlace,
    month: month + '월',
    interests: interestArr,
    tripLength: tripLength + '일',
    group: tripGroupType.find((el) => el.id === Number(group))?.group,
    children: Boolean(Number(children)),
    pets: Boolean(Number(pets)),
  };
  const stringifiedInfo = JSON.stringify(tripInfo);
  const prompt = `
  ${stringifiedInfo} \n
  이 데이터를 바탕으로 여행 일정을 예시대로 만들어줘. \n
  예시: \n 
    {
      "destination": "세도나",
      "month": "11월",
      "interests": ["자연 경관", "액티비티/음식", "럭셔리 숙박"],
      "tripLength": "3일",
      "group": "커플",
      "children": false,
      "pets": false,
      "itinerary": [
        {
          "date": "1일차",
          "course": [
            {
              "location": "Bell Rock, Sedona, AZ",
              "activity": "벨록 또는 에어포트 메사에서 일몰 감상",
              "description": "벨록(Bell Rock)은 세도나의 대표적인 붉은 암석 지형 중 하나로, 특히 일몰 시간에 장엄한 풍경을 제공합니다. 이곳에서는 태양이 서서히 지평선 아래로 내려가며 붉은 바위와 하늘이 황금빛으로 물드는 순간을 감상할 수 있습니다. 에어포트 메사(Airport Mesa)는 360도 파노라마 뷰를 제공하며, 세도나의 독특한 암석층과 자연 풍광을 한눈에 담을 수 있는 최고의 일몰 명소입니다."
            },
            {
              "location": "Pink Jeep Tours, Sedona, AZ",
              "activity": "지프 투어로 세도나의 자연 탐험",
              "description": "핑크 지프 투어(Pink Jeep Tour)는 세도나의 험준한 트레일을 탐험하며 대자연의 경이로움을 느낄 수 있는 최고의 액티비티입니다. 투어 중에는 전문 가이드가 세도나의 지질학적 역사, 원주민 전설, 그리고 지역 동식물에 대한 흥미로운 이야기를 들려줍니다. 거친 지형을 달리는 스릴감 넘치는 순간과 함께, 평소 접근하기 어려운 세도나의 숨은 명소를 직접 눈으로 볼 수 있는 기회를 제공합니다."
            },
            {
              "location": "Page Springs Cellars, Cornville, AZ",
              "activity": "투어 후 현지 와이너리에서 와인 시음",
              "description": "Page Springs Cellars는 세도나 근교에 위치한 포도밭으로, 현지에서 생산된 고품질 와인을 맛볼 수 있는 곳입니다. 이곳에서는 와인 제조 과정을 배우고, 아름다운 포도밭 풍경을 즐기며 각종 화이트, 레드, 로제 와인을 시음할 수 있습니다. 여유로운 테라스에서 와인을 음미하며 주변 자연을 감상하는 시간은 낭만적인 분위기를 더해줍니다."
            }
          ]
        },
        {
          "date": "2일차",
          "course": [
            {
              "location": "Mariposa Latin Inspired Grill, Sedona, AZ",
              "activity": "아름다운 경치와 함께하는 로맨틱 디너",
              "description": "Mariposa Latin Inspired Grill은 세도나의 고급 레스토랑 중 하나로, 라틴 아메리카 풍미가 가미된 독특한 요리를 제공합니다. 이 레스토랑은 거대한 유리창을 통해 펼쳐지는 세도나의 붉은 암석 풍경이 특히 인상적이며, 황혼의 색채와 함께 저녁 식사를 즐길 수 있습니다. 고급스러운 메뉴와 로맨틱한 분위기는 커플들에게 완벽한 저녁 시간을 선사합니다."
            },
            {
              "location": "Cathedral Rock Trailhead, Sedona, AZ",
              "activity": "보름달 아래에서의 야간 하이킹",
              "description": "Cathedral Rock은 세도나에서 가장 사진이 많이 찍히는 명소 중 하나로, 보름달 아래에서의 야간 하이킹으로 독특한 경험을 제공합니다. 자연의 고요 속에서 밝게 빛나는 달빛 아래 트레일을 걸으며, 하늘의 별과 주변의 경치를 감상할 수 있습니다. 가이드와 함께 하면 안전하게 산책을 즐기며 세도나의 밤 풍경을 만끽할 수 있습니다."
            },
            {
              "location": "L'Auberge de Sedona, Sedona, AZ",
              "activity": "커플 마사지를 받으며 휴식",
              "description": "L'Auberge de Sedona는 세도나의 최고급 리조트 중 하나로, 호숫가에 위치하여 자연 속에서 휴식을 취할 수 있는 곳입니다. 이곳에서는 커플 마사지를 포함한 다양한 스파 서비스를 제공하며, 전문 테라피스트의 손길을 통해 몸과 마음의 긴장을 풀 수 있습니다. 아름다운 풍경과 평온한 분위기 속에서 특별한 시간을 보낼 수 있습니다."
            }
          ]
        },
        {
          "date": "3일차",
          "course": [
            {
              "location": "Tlaquepaque Arts & Shopping Village, Sedona, AZ",
              "activity": "세도나의 트렌디한 부티크 쇼핑",
              "description": "Tlaquepaque Arts & Shopping Village는 세도나에서 가장 유명한 예술과 쇼핑의 중심지입니다. 멕시코풍 건축 양식과 아름다운 정원으로 둘러싸인 이곳에서는 수공예 보석, 예술 작품, 독특한 기념품 등을 구입할 수 있습니다. 현지 아티스트의 작품을 감상하며 세도나의 독특한 문화를 경험할 수 있습니다."
            },
            {
              "location": "Chapel of the Holy Cross, Sedona, AZ",
              "activity": "세도나의 상징적인 예배당 방문",
              "description": "Chapel of the Holy Cross는 세도나의 붉은 암석에 직접 지어진 상징적인 예배당입니다. 1956년에 건축된 이곳은 건축적 아름다움과 종교적 의미로 많은 방문객을 끌어들입니다. 예배당 안에서는 세도나의 풍경을 한눈에 내려다볼 수 있으며, 영적인 평온함을 느낄 수 있는 장소입니다."
            },
            {
              "location": "Sedona Airport Scenic Lookout, Sedona, AZ",
              "activity": "붉은 암석들의 파노라마 전망 감상",
              "description": "Sedona Airport Scenic Lookout은 세도나의 가장 인기 있는 전망대 중 하나로, 360도 파노라마 뷰를 제공합니다. 이곳에서는 세도나의 붉은 암석 계곡과 주변 자연의 아름다움을 한눈에 감상할 수 있습니다. 특히, 일출이나 일몰 시간에 방문하면 하늘과 땅이 조화를 이루는 황홀한 풍경을 즐길 수 있습니다."
            }
          ]
        }
      ]
    }
`;

  // const result = await model.generateContent(prompt);
  // const locations: Locations = JSON.parse(
  //   result.response.text().replace('```json', '').replace('```', '')
  // );
  // const answer = result.response.text();
  // await addPlaceDetailsToItinerary(answer.itinerary);
  const newItinerary = data;
  // const points = newItinerary.map((date) =>
  //   date.course.map((el) => el.geometry.location)
  // ).map(locations => ...locations)

  // console.log(points);
  return (
    <main className='flex items-center flex-col gap-y-6 my-10'>
      <Background />
      <div className='text-sm flex items-center gap-x-2'>
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
      <h1 className='text-3xl font-bold'>{replacedPlace}</h1>
      <ItineraryAccordion itinerary={newItinerary} />

      {/* <GoogleMap /> */}
    </main>
  );
}
