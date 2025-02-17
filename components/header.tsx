import { formatPlace } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import LanguageSwitcher from './language-switcher';

type HeaderProps = {
  place?: string;
  currentStep: number;
};
export default function Header({ place, currentStep }: HeaderProps) {
  const progress = (currentStep / 4) * 100;
  const progressPct = progress.toString() + '%';
  const formattedPlace = place ? formatPlace(place) : '';

  return (
    <div>
      <div className='flex flex-col items-center justify-center'>
        <div className='text-sm flex items-center gap-x-2'>
          <section className='p-1 bg-primary/60 rounded-full'>
            <Sparkles
              className='text-gray-600'
              size={20}
              strokeWidth={1.75}
              color='#ffffff'
            />
          </section>
          Powered by AI
        </div>
        {formattedPlace && (
          <h4 className='font-semibold text-sm my-1'>{formattedPlace} trip</h4>
        )}
        <span className='text-sm mb-3'>{currentStep} of 4</span>
        <LanguageSwitcher />
      </div>

      <div className='relative h-1.5 rounded-full overflow-hidden mt-16'>
        <div className='absolute left-0 bg-gray-300 h-full w-full' />
        <div
          className='bg-gray-900 h-full absolute left-0 rounded-r-full'
          style={{
            width: progressPct,
            transition: 'width 0.15s linear',
          }}
        />
      </div>
    </div>
  );
}
