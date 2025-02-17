'use server';

import { cookies } from 'next/headers';

export async function setLanguagePreference(lang: string) {
  const cookieStore = await cookies();
  cookieStore.set('NEXT_LOCALE', lang);
}
