'use client'; // Error components must be Client Components

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className='flex items-center justify-center min-h-screen flex-col gap-6'>
      <Image
        src='/logo.svg'
        alt='Logo'
        width={128}
        height={128}
        className='ml-5 mb-10'
      />
      <p>Something went wrong, but don't fret - let's give it another shot.</p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className='rounded-full font-bold'
      >
        Try again
      </Button>
    </div>
  );
}
