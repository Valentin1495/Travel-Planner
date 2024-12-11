import Background from '@/components/background';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-4'>
      <Background />
      <div className='flex flex-col items-center gap-5'>
        <Image
          src='/logo.svg'
          alt='Logo'
          width={128}
          height={128}
          className='ml-5'
        />
        <span className='font-semibold text-primary text-sm/6'>
          Powered by AI
        </span>
        <h1 className='font-semibold text-3xl text-gray-900 tracking-tight sm:text-5xl'>
          AI가 추천하는 맞춤형 여행 🔥
        </h1>
        <p className='font-bold text-lg text-gray-500'>
          단 몇 초 만에 여러분만을 위한 여행 아이디어를 만나보세요!
        </p>
      </div>
      <Link
        href='/generate-itinerary'
        className='gap-x-2 default-button flex font-semibold rounded-full'
      >
        <Sparkles size={20} /> 시작하기
      </Link>
    </main>
  );
}
