import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeModal } from '@/components/circle/WelcomeModal';
import { RippleModal } from '@/components/circle/RippleModal';
import { MainContent } from '@/components/circle/MainContent';
import { ArtworksView } from '@/components/circle/ArtworksView';
import { ImpactView } from '@/components/circle/ImpactView';
import { useCircleStore } from '@/hooks/useCircleStore';
import { useLang, useT } from '@/i18n/LanguageContext';
import type { Activity } from '@/data/activities';

type Tab = 'discover' | 'artworks';
type DiscoverMode = 'act' | 'impact';

const Index = () => {
  const store = useCircleStore();
  const { lang, setLang } = useLang();
  const t = useT();
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
          <div className="flex items-center gap-2">
            <div className="relative grid grid-cols-2 gap-1 p-1 border border-foreground/15 rounded-sm bg-card/60 flex-1">
              {(['discover', 'artworks'] as Tab[]).map((tb) => (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  className="relative py-2.5 text-[11px] font-display tracking-[0.25em] uppercase z-10 transition-colors"
                >
                  {tab === tb && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 bg-foreground rounded-sm -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className={tab === tb ? 'text-background' : 'text-foreground/70'}>
                    {tb === 'discover' ? t('tab_discover') : t('tab_artworks')}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
              className="px-3 py-2.5 border border-foreground/15 rounded-sm bg-card/60 text-[11px] font-display tracking-[0.2em] uppercase text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors"
              aria-label="Toggle language"
            >
              {lang === 'en' ? t('lang_he') : t('lang_en')}
            </button>
          </div>

          {/* Act / Impact sub-toggle (only on Discover tab) */}
          <AnimatePresence initial={false}>
            {tab === 'discover' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-center gap-1 pt-3 pb-1">
                  {(['act', 'impact'] as DiscoverMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setDiscoverMode(m)}
                      className="relative px-4 py-1.5 text-[10px] font-display tracking-[0.3em] uppercase transition-colors"
                    >
                      {discoverMode === m && (
                        <motion.span
                          layoutId="discover-mode-underline"
                          className="absolute left-2 right-2 -bottom-0.5 h-px bg-foreground"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className={discoverMode === m ? 'text-foreground' : 'text-foreground/45'}>
                        {m === 'act' ? t('mode_act') : t('mode_impact')}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {tab === 'discover' ? (
        discoverMode === 'act' ? (
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
          <ImpactView />
        )
      ) : (
        <ArtworksView />
      )}
    </>
  );
};

export default Index;