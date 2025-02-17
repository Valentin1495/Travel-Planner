import { Dispatch, SetStateAction } from 'react';
import { Data } from './multi-step-form';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Dict } from '@/lib/types';

type InterestsProps = {
  data: Data;
  setData: Dispatch<SetStateAction<Data>>;
  dict: Dict;
};

export default function Interests({ data, setData, dict }: InterestsProps) {
  const { interests, interestsHeading, interestsParagraph } = dict;
  const toggleInterest = (id: number) => {
    const isAdded = data.interests.some((el) => el.id === id);

    setData((prev) => ({
      ...prev,
      interests: isAdded
        ? prev.interests.filter((el) => el.id !== id)
        : prev.interests.length < 3
        ? [...prev.interests, interests.find((el) => el.id === id)!]
        : prev.interests,
    }));
  };

  return (
    <div className='my-16 flex flex-col items-center'>
      <h1 className='text-3xl font-bold mb-5'>{interestsHeading}</h1>
      <p className='text-sm text-neutral-600 mb-3'>{interestsParagraph}</p>

      <section className='mt-10 flex flex-wrap gap-3 justify-center'>
        {interests.map(({ id, interest }) => {
          const isAdded = data.interests.some((el) => el.id === id);

          return (
            <Button
              key={id}
              onClick={() => toggleInterest(id)}
              variant='outline'
              className={cn(
                'rounded-full min-w-max',
                isAdded &&
                  'bg-primary hover:bg-primary/90 text-white hover:text-white'
              )}
            >
              {isAdded && <Check size={20} className='mr-1' />}
              {interest}
            </Button>
          );
        })}
      </section>
    </div>
  );
}
