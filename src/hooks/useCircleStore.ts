import { useState } from 'react';

export function useCircleStore() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedDraws, setSelectedDraws] = useState<string[]>(['explore', 'meet', 'make']);
  const [selectedEnergy, setSelectedEnergy] = useState<string[]>(['hands-on']);
  const [locationFormat, setLocationFormat] = useState<string[]>(['physical']);
  const [physicalLocation, setPhysicalLocation] = useState('Tel Aviv');
  const [physicalRadius, setPhysicalRadius] = useState('15km');
  const [digitalReach, setDigitalReach] = useState<string[]>(['israel', 'global']);
  const [selectedArtworks, setSelectedArtworks] = useState<number[]>([2]);
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