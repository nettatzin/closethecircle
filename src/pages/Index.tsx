import { Helmet } from 'react-helmet-async';
import { WelcomeModal } from '@/components/circle/WelcomeModal';
import { RippleModal } from '@/components/circle/RippleModal';
import { MainContent } from '@/components/circle/MainContent';
import { ArtworksView } from '@/components/circle/ArtworksView';
import { MyCircleView } from '@/components/circle/MyCircleView';
import { CashbackView } from '@/components/circle/CashbackView';
import { MyListView } from '@/components/circle/MyListView';
import { AppNav } from '@/components/circle/AppNav';
import { useCircleStore } from '@/hooks/useCircleStore';
import type { Activity } from '@/data/activities';

const Index = () => {
  const store = useCircleStore();
  const mode = store.mode;

  // Desktop: open a tab synchronously on tap (async window.open gets blocked),
  // then point it at the URL after the ripple animation.
  // Mobile: opening a blank tab immediately steals focus and hides the ripple
  // popup, so we let the animation play and then navigate in the same tab.
  const openLater = (url?: string) => {
    if (!url) return;
    const isMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

    let win: Window | null = null;
    if (!isMobile) {
      try {
        win = window.open('', '_blank');
      } catch {
        win = null;
      }
    }

    setTimeout(() => {
      if (win && !win.closed) {
        win.location.href = url;
        setTimeout(() => store.setShowRipple(false), 2000);
      } else {
        store.setShowRipple(false);
        window.location.href = url;
      }
    }, 2000);
  };


  const handleCloseCircle = (activity: Activity) => {
    if (activity.showCommunityMessage) {
      store.setRippleActivity(activity);
      store.setShowRipple('community');
    } else {
      store.setRippleActivity(activity);
      store.setShowRipple('ripple');
      openLater(activity.url);
    }
  };

  const handleCommunityConfirm = () => {
    store.setShowRipple('ripple');
    openLater(store.rippleActivity?.url);
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

      <AppNav mode={mode} setMode={store.setMode} />

      {mode === 'act' ? (
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
      ) : mode === 'my_list' ? (
        <MyListView onCloseCircle={handleCloseCircle} setMode={store.setMode} />
      ) : mode === 'impact' ? (
        <MyCircleView />
      ) : mode === 'cashback' ? (
        <CashbackView />
      ) : (
        <ArtworksView />
      )}

    </>
  );
};

export default Index;