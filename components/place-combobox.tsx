'use client';

import { Dispatch, SetStateAction, useState, useRef, useEffect } from 'react';
import { useAutocomplete } from '@vis.gl/react-google-maps';
import { Data } from './multi-step-form';
import { Search } from 'lucide-react';
import { Dict } from '@/lib/types';

type PlaceComboboxProps = {
  setData: Dispatch<SetStateAction<Data>>;
  dict: Dict;
};

export default function PlaceCombobox({ setData, dict }: PlaceComboboxProps) {
  const { placeHeading, placeParagraph } = dict;
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const onPlaceChanged = (place: any) => {
    if (place) {
      setInputValue(place.formatted_address || place.name);
    }

    // Keep focus on input element
    inputRef.current && inputRef.current.focus();
  };

  const autocompleteInstance = useAutocomplete({
    inputField: inputRef && inputRef.current,
    onPlaceChanged,
  });

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (autocompleteInstance?.getPlace()) {
      const { formatted_address, name } = autocompleteInstance.getPlace();

      setData((prev) => {
        return {
          ...prev,
          place: formatted_address || name,
        };
      });
    }
  }, [inputValue, autocompleteInstance, setData]);

  return (
    <div className='mt-16 flex flex-col items-center'>
      <h1 className='text-2xl font-bold mb-5'>{placeHeading}</h1>
      <p className='text-sm'>{placeParagraph}</p>

      <div className='rounded-full border-2 border-gray-200 shadow-md px-6 py-3 min-w-[300px] sm:min-w-[400px] my-10 flex items-center gap-3 '>
        <Search strokeWidth={1.75} />
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          placeholder='choose a city or town'
          className='w-full outline-none bg-transparent'
        />
      </div>
    </div>
  );
}
