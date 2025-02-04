import { PlaceDetailsResponse } from '@/lib/types';
import { create } from 'zustand';

type PlaceSheetData = PlaceDetailsResponse['result'] & {
  description: string;
};

type PlaceSheetStore = {
  open: boolean;
  data: PlaceSheetData | null;
  openSheet: (data: PlaceSheetData) => void;
  closeSheet: () => void;
};

export const usePlaceSheetStore = create<PlaceSheetStore>((set) => ({
  open: false,
  data: null,
  openSheet: (data: PlaceSheetData) =>
    set({
      open: true,
      data,
    }),
  closeSheet: () =>
    set({
      open: false,
      data: null,
    }),
}));
