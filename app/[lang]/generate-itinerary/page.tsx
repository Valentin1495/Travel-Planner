import MultiStepForm from '@/components/multi-step-form';
import { getDictionary } from '../dictionaries';

export default async function GenerateItinerary({
  params,
}: {
  params: Promise<{ lang: 'en' | 'ko' }>;
}) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return (
    <main className='max-w-3xl mx-auto px-8 sm:px-16'>
      <MultiStepForm dict={dict} />
    </main>
  );
}
