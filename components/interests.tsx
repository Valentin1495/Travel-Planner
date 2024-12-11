import { Dispatch, SetStateAction } from 'react';
import { Data } from './multi-step-form';
import { Button } from './ui/button';
import { interests } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type InterestsProps = {
  data: Data;
  setData: Dispatch<SetStateAction<Data>>;
};

export default function Interests({ data, setData }: InterestsProps) {
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
      <h1 className='text-3xl font-bold mb-5'>무엇에 관심이 있으신가요?</h1>
      <p className='text-sm text-neutral-600 mb-3'>
        관심사를 최대 3가지 선택하세요.
      </p>

      <section className='mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
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
