import { Skeleton } from './ui/skeleton';

export default function ItinerarySkeleton() {
  return (
    <div>
      <div className='space-y-1 mb-16'>
        <Skeleton className='bg-neutral-200 h-6 w-full rounded-sm' />
        <Skeleton className='bg-neutral-200 h-6 w-full rounded-sm' />
        <Skeleton className='bg-neutral-200 h-6 w-full rounded-sm' />
      </div>

      <Skeleton className='bg-neutral-200 rounded-lg w-full h-48' />
    </div>
  );
}
