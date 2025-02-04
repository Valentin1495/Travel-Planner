import PlaceSheet from '@/components/place-sheet';
import './globals.css';
import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import MapsApiProvider from '@/components/maps-api-provider';

export const metadata: Metadata = {
  title: 'TripTailor - AI-Powered Trip Builder',
  description:
    "TripTailor is your ultimate companion for planning memorable and personalized travel experiences. Say goodbye to hours of researching and organizing, and let our AI-powered Travel Itinerary Planner take care of the hard work for you. Whether you're a globetrotter or a casual traveler, TripTailor will create a tailor-made itinerary that matches your interests, preferences, and schedule.",
};

const lora = Lora({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={lora.className} suppressHydrationWarning>
      <body>
        <MapsApiProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}>
          {children}
        </MapsApiProvider>
        <PlaceSheet />
      </body>
    </html>
  );
}
