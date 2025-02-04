import Background from '@/components/background';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-4 max-w-3xl mx-auto px-8 sm:px-16'>
      <Background />
      <div className='flex flex-col items-center gap-5'>
        <Image
          src='/logo.svg'
          alt='Logo'
          width={128}
          height={128}
          className='ml-5'
        />
        <h1 className='font-bold text-4xl sm:text-6xl text-primary'>
          TripTailor
        </h1>

        <h2 className='font-bold text-3xl text-gray-900 tracking-tight sm:text-5xl'>
          Get custom recs for your next trip
        </h2>
        <p className='font-semibold text-lg text-gray-500'>
          Find great eats, experiences, and more — inspired by things you love.
        </p>
      </div>
      <Link
        href='/generate-itinerary'
        className='gap-x-2 default-button flex font-semibold rounded-full'
      >
        <Sparkles size={20} /> Start a trip with AI
      </Link>
    </main>
  );
}
