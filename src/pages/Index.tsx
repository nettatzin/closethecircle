import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { WelcomeModal } from '@/components/circle/WelcomeModal';
import { RippleModal } from '@/components/circle/RippleModal';
import { MainContent } from '@/components/circle/MainContent';
import { ArtworksView } from '@/components/circle/ArtworksView';
import { useCircleStore } from '@/hooks/useCircleStore';
import type { Activity } from '@/data/activities';

type Tab = 'discover' | 'artworks';

const Index = () => {
  const store = useCircleStore();
  const [tab, setTab] = useState<Tab>('discover');

  const handleCloseCircle = (activity: Activity) => {
    if (activity.showCommunityMessage) {
      store.setRippleActivity(activity);
      store.setShowRipple('community');
    } else {
      store.setRippleActivity(activity);
      store.setShowRipple('ripple');
      setTimeout(() => {
        window.open(activity.url, '_blank');
        setTimeout(() => store.setShowRipple(false), 2000);
      }, 2000);
    }
  };

  const handleCommunityConfirm = () => {
    store.setShowRipple('ripple');
    setTimeout(() => {
      window.open(store.rippleActivity?.url, '_blank');
      setTimeout(() => store.setShowRipple(false), 2000);
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>The Circle - Discover Circular Design Activities</title>
        <meta name="description" content="Discover activities that resonate with your vision of circular design. Find workshops, communities, and hands-on experiences near you." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#4a7c6f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>

      <WelcomeModal 
        isOpen={store.showWelcome} 
        onClose={() => store.setShowWelcome(false)} 
      />

      <RippleModal
        mode={store.showRipple}
        activity={store.rippleActivity}
        onConfirm={handleCommunityConfirm}
        onClose={() => store.setShowRipple(false)}
      />

      <MainContent
        selectedDraws={store.selectedDraws}
        toggleDraw={store.toggleDraw}
        selectedEnergy={store.selectedEnergy}
        toggleEnergy={store.toggleEnergy}
        locationFormat={store.locationFormat}
        toggleFormat={store.toggleFormat}
        physicalLocation={store.physicalLocation}
        setPhysicalLocation={store.setPhysicalLocation}
        physicalRadius={store.physicalRadius}
        setPhysicalRadius={store.setPhysicalRadius}
        digitalReach={store.digitalReach}
        toggleDigitalReach={store.toggleDigitalReach}
        selectedArtworks={store.selectedArtworks}
        toggleArtwork={store.toggleArtwork}
        onCloseCircle={handleCloseCircle}
        resetFilters={store.resetFilters}
      />
    </>
  );
};

export default Index;