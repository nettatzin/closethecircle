import { useLang } from './LanguageContext';
import * as enData from '@/data/activities';
import * as heData from '@/data/activities.he';
import type { Activity, Artwork } from '@/data/activities';

export function useDataset() {
  const { lang } = useLang();
  const src = lang === 'he' ? heData : enData;
  return {
    activities: src.activities as unknown as Activity[],
    artworks: src.artworks as unknown as Artwork[],
    artworkThemes: src.artworkThemes as unknown as string[],
    artworkSpaces: src.artworkSpaces as unknown as string[],
    drawOptions: src.drawOptions as { id: string; icon: string; label: string }[],
    energyOptions: src.energyOptions as { id: string; icon: string; label: string; time: string }[],
  };
}
