'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setLanguagePreference } from '@/app/[lang]/actions';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ko', name: '한국어' },
  //   { code: 'ja', name: '日本語' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const selectedLang = languages.filter(
    (lang) => lang.code === pathname.slice(1, 3)
  )[0].name;
  const switchLanguage = async (langCode: string) => {
    const newPathname = pathname.replace(/^\/[^\/]+/, `/${langCode}`);
    await setLanguagePreference(langCode);
    router.push(newPathname);
  };
  const handleSelectChange = (value: string) => {
    switchLanguage(value);
  };

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={selectedLang} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem value={lang.code} key={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
