import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { WelcomeModal } from '@/components/circle/WelcomeModal';
import { RippleModal } from '@/components/circle/RippleModal';
import { MainContent } from '@/components/circle/MainContent';
import { ArtworksView } from '@/components/circle/ArtworksView';
import { ImpactView } from '@/components/circle/ImpactView';
import { useCircleStore } from '@/hooks/useCircleStore';
import type { Activity } from '@/data/activities';

type Tab = 'discover' | 'artworks';
type DiscoverMode = 'act' | 'impact';

const Index = () => {
  const store = useCircleStore();
  const [tab, setTab] = useState<Tab>('discover');
  const [discoverMode, setDiscoverMode] = useState<DiscoverMode>('act');

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

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-foreground/10 safe-area-top">
        <div className="max-w-lg mx-auto px-5 pt-4 pb-2">
          <div className="relative grid grid-cols-2 gap-1 p-1 border border-foreground/15 rounded-sm bg-card/60">
            {(['discover', 'artworks'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative py-2.5 text-[11px] font-display tracking-[0.25em] uppercase z-10 transition-colors"
              >
                {tab === t && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 bg-foreground rounded-sm -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={tab === t ? 'text-background' : 'text-foreground/70'}>
                  {t === 'discover' ? 'Discover' : 'Artworks'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === 'discover' ? (
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
      ) : (
        <ArtworksView />
      )}
    </>
  );
};

export default Index;