'use client';

import { useEffect, useState } from 'react';
import ItineraryAccordion from './itinerary-accordion';
import { Button } from './ui/button';
import { Day, Dict } from '@/lib/types';
import ItinerarySkeleton from './itinerary-skeleton';
import Link from 'next/link';

type CreateItineraryProps = {
  input: string;
  tripLength: string;
  dict: Dict;
  lang: 'en' | 'ko';
};

type Message = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export default function CreateItinerary({
  input,
  tripLength,
  dict,
  lang,
}: CreateItineraryProps) {
  const { newTrip } = dict;
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [days, setDays] = useState<Day[]>([]);

  const fetchData = async (url: string, method: string, body?: any) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      return response.json();
    } catch (error) {
      console.error(`❌ API 요청 오류 (${url}):`, error);
      return null; // 에러 발생 시 null 반환
    }
  };

  const createItinerary = async (day: string) => {
    setIsLoading(true);

    const chatResponse = await fetchData('/api/chat', 'POST', {
      history: messages,
      message: day || input,
    });

    if (!chatResponse) {
      setIsLoading(false);
      return;
    }

    const newMessage: Message = {
      role: 'user',
      parts: [{ text: day || input }],
    };

    setMessages((prev) => [...prev, newMessage]);

    const aiMessage = chatResponse.message.trim();

    setMessages((prev) => [
      ...prev,
      { role: 'model', parts: [{ text: aiMessage }] },
    ]);

    // ✅ JSON만 추출하는 정규식
    const jsonMatch = aiMessage.match(/```json([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : aiMessage;
    const cleanJSON = jsonString
      .replace(/\/\/.*$/gm, '') // 한 줄 주석 제거
      .replace(/\/\*[\s\S]*?\*\//g, '') // 여러 줄 주석 제거
      .trim();

    // ✅ JSON 파싱 예외 처리
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJSON);
    } catch (error) {
      console.error('❌ JSON 파싱 실패:', cleanJSON);
      setIsLoading(false);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { role: 'model', parts: [{ text: cleanJSON }] },
    ]);

    const enrichedDay = await fetchData('/api/place/enrich', 'POST', {
      day: parsedData,
    });

    if (enrichedDay) setDays((prevDays) => [...prevDays, enrichedDay]);

    setIsLoading(false);
    setCurrentDay((prev) => prev + 1);
  };

  const isLastDay = currentDay === Number(tripLength) + 1;

  useEffect(() => {
    createItinerary('');
  }, []);

  return (
    <div className='flex flex-col mt-6 mx-auto max-w-6xl gap-8'>
      <Button
        disabled={isLoading || isLastDay}
        onClick={() =>
          createItinerary(
            lang === 'en' ? `Day ${currentDay}` : `${currentDay}일차)`
          )
        }
      >
        {lang === 'en'
          ? isLoading
            ? 'Generating...'
            : isLastDay
            ? 'Last day generated'
            : 'Generate Day'
          : isLoading
          ? '일정 생성 중...'
          : isLastDay
          ? '일정 생성 완료'
          : '일정 생성'}
      </Button>

      {days.length === 0 && <ItinerarySkeleton />}

      <ItineraryAccordion days={days} />

      {isLastDay && (
        <Link
          href='/generate-itinerary'
          className='inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
        >
          {newTrip}
        </Link>
      )}
    </div>
  );
}
