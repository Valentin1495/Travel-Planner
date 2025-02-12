'use client';

import { APIProvider } from '@vis.gl/react-google-maps';

export default function MapsApiProvider({
  children,
  apiKey,
}: {
  children: React.ReactNode;
  apiKey: string;
}) {
  return (
    <APIProvider apiKey={apiKey} libraries={['places']} language='en'>
      {children}
    </APIProvider>
  );
}
