import { type NextRequest, NextResponse } from 'next/server';

export const revalidate = 86400;
export const dynamic = 'force-dynamic'; // ✅ 동적 렌더링 강제

const API_KEY = process.env.GOOGLE_API_KEY;

/** 🔍 Google Places API - 장소 검색 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type'); // "search" | "details"
    const query = searchParams.get('query');
    const placeId = searchParams.get('placeId');

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'Google API Key is missing' },
        { status: 500 }
      );
    }

    if (type === 'search' && query) {
      return await handleTextSearch(query);
    }

    if (type === 'details' && placeId) {
      return await handlePlaceDetails(placeId);
    }

    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('❌ API 요청 중 오류 발생:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/** 📌 장소 검색 API (textSearch) */
async function handleTextSearch(query: string) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedQuery}&key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const data = await response.json();
    if (data.status === 'OK') {
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Text Search API Error', status: data.status },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Text Search API 오류:', error);
    return NextResponse.json(
      { error: 'Failed to fetch text search results' },
      { status: 500 }
    );
  }
}

/** 📌 장소 상세 정보 API (getPlaceDetails) */
async function handlePlaceDetails(placeId: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,geometry,name,photos,rating,reviews,types,url,user_ratings_total,website,opening_hours&key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const data = await response.json();
    if (data.status === 'OK') {
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(
        { error: 'Place Details API Error', status: data.status },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Place Details API 오류:', error);
    return NextResponse.json(
      { error: 'Failed to fetch place details' },
      { status: 500 }
    );
  }
}
