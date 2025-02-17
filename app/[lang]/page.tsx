import Background from '@/components/background';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from './dictionaries';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: 'en' | 'ko' }>;
}) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  const { heading1, heading2, paragraph, sparkles } = dict;
  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-4 max-w-5xl mx-auto px-8 sm:px-16'>
      <Background />
      <div className='flex flex-col items-center gap-5'>
        <Image
          src='/icon.svg'
          alt='Logo'
          width={128}
          height={128}
          className='ml-5'
        />
        <h1 className='font-bold text-4xl sm:text-6xl text-primary'>
          {heading1}
        </h1>

        <h2 className='font-bold text-3xl text-gray-900 tracking-tight sm:text-5xl'>
          {heading2}
        </h2>
        <p className='font-semibold text-lg text-gray-500'>{paragraph}</p>
      </div>
      <Link
        href='/generate-itinerary'
        className='gap-x-2 default-button flex font-semibold rounded-full'
      >
        <Sparkles size={20} /> {sparkles}
      </Link>
    </main>
  );
}
