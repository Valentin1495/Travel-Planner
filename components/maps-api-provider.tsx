'use client';

import { APIProvider } from '@vis.gl/react-google-maps';

export default function MapsApiProvider({
  children,
}: {
  children: React.ReactNode;
  apiKey: string;
}) {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}
      libraries={['places']}
      language='en'
    >
      {children}
    </APIProvider>
  );
}
