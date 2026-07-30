import { useEffect, useState } from 'react';

export type AppMode = 'act' | 'my_list' | 'impact' | 'cashback' | 'artworks';

const MODE_KEY = 'circle.mode';
const MODES: AppMode[] = ['act', 'my_list', 'impact', 'cashback', 'artworks'];

export function useCircleStore() {
  const [mode, setMode] = useState<AppMode>(() => {
    if (typeof window === 'undefined') return 'act';
    const stored = localStorage.getItem(MODE_KEY) as AppMode | null;
    return stored && MODES.includes(stored) ? stored : 'act';
  });

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedDraws, setSelectedDraws] = useState<string[]>([]);
  const [selectedEnergy, setSelectedEnergy] = useState<string[]>([]);
  const [locationFormat, setLocationFormat] = useState<string[]>([]);
  const [physicalLocation, setPhysicalLocation] = useState('Tel Aviv');
  const [physicalRadius, setPhysicalRadius] = useState('15km');
  const [digitalReach, setDigitalReach] = useState<string[]>([]);
  const [selectedArtworks, setSelectedArtworks] = useState<number[]>([]);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [showRipple, setShowRipple] = useState<false | 'community' | 'ripple'>(false);
  const [rippleActivity, setRippleActivity] = useState<any>(null);

  const toggleDraw = (id: string) => {
    setSelectedDraws(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleFormat = (format: string) => {
    setLocationFormat(prev => 
      prev.includes(format) ? prev.filter(x => x !== format) : [...prev, format]
    );
  };

  const toggleDigitalReach = (reach: string) => {
    setDigitalReach(prev => 
      prev.includes(reach) ? prev.filter(x => x !== reach) : [...prev, reach]
    );
  };

  const toggleArtwork = (id: number) => {
    setSelectedArtworks(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleEnergy = (id: string) => {
    setSelectedEnergy(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedDraws([]);
    setSelectedEnergy([]);
    setLocationFormat([]);
    setDigitalReach([]);
    setSelectedArtworks([]);
  };

  return {
    mode,
    setMode,
    showWelcome,
    setShowWelcome,
    selectedDraws,
    toggleDraw,
    selectedEnergy,
    toggleEnergy,
    locationFormat,
    toggleFormat,
    physicalLocation,
    setPhysicalLocation,
    physicalRadius,
    setPhysicalRadius,
    digitalReach,
    toggleDigitalReach,
    selectedArtworks,
    toggleArtwork,
    expandedActivity,
    setExpandedActivity,
    showRipple,
    setShowRipple,
    rippleActivity,
    setRippleActivity,
    resetFilters,
  };
}