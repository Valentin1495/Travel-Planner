import '@/app/globals.css';
import Background from '@/components/background';
import { Lora } from 'next/font/google';

const lora = Lora({
  subsets: ['latin'],
});

export default function generateItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={lora.className}>
      <Background />

      {children}
    </div>
  );
}
