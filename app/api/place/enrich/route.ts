import { getGooglePhotoUrl } from '@/lib/utils';
import { NextResponse } from 'next/server';

/** 📌 일정 데이터 보강 API (enrichDayWithPlaceDetails) */
export async function POST(req: Request) {
  try {
    const { day } = await req.json();
    if (!day || !day.activities) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    const baseUrl = `${new URL(req.url).origin}/api/place`; // ✅ Base URL 설정

    for (const activity of day.activities) {
      if (activity.query) {
        const searchResponse = await fetch(
          `${baseUrl}?type=search&query=${encodeURIComponent(activity.query)}`
        );
        const searchResult = await searchResponse.json();

        if (searchResult && searchResult.results?.length > 0) {
          activity.placeId = searchResult.results[0].place_id;

          const detailsResponse = await fetch(
            `${baseUrl}?type=details&placeId=${activity.placeId}`
          );
          const placeDetails = await detailsResponse.json();

          if (placeDetails && placeDetails.result) {
            if (placeDetails.result.photos) {
              const photos = placeDetails.result.photos.map((p: any) => {
                const photoSrc = getGooglePhotoUrl(p.photo_reference);

                return { photoSrc, ...p };
              });

              placeDetails.result.photos = photos;
            }
            activity.details = placeDetails.result;
          }
        }
      }
    }

    return NextResponse.json(day, { status: 200 });
  } catch (error) {
    console.error('❌ 일정 보강 API 오류:', error);
    return NextResponse.json(
      { error: 'Failed to enrich day' },
      { status: 500 }
    );
  }
}
