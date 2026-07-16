import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Share2, Bookmark, ChevronDown, ChevronUp, ExternalLink, Feather, Flame, Dumbbell } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Activity } from '@/data/activities';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/LanguageContext';
import { getActivityVisual } from '@/lib/activityVisual';
import { CircleIcon } from '@/components/circle/CircleIcon';
import { useSession, markFirstSaveShown, wasFirstSaveShown } from '@/hooks/useSession';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onCloseCircle: (activity: Activity) => void;
  onSaved?: (wasFirst: boolean) => void;
}

export function ActivityCard({ activity, index, onCloseCircle, onSaved }: ActivityCardProps) {
  const t = useT();
  const { isSaved, toggleSave, logEvent } = useSession();
  const [expanded, setExpanded] = useState(false);
  const [valuesOpen, setValuesOpen] = useState(false);
  const [benefitsOpen, setBenefitsOpen] = useState(false);
  const activityIdStr = String(activity.id);
  const saved = isSaved(activityIdStr);
  const { iconName, color: categoryColor, tint: categoryTint, ring: categoryRing } = getActivityVisual(activity.type);
  const EnergyIcon = activity.energyLevel === 'low-key' ? Feather : activity.energyLevel === 'hands-on' ? Flame : Dumbbell;

  // fire initiative_view once when card mounts
  useEffect(() => {
    logEvent('initiative_view', { id: activityIdStr });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityIdStr]);

  const handleToggleSave = () => {
    const { saved: nowSaved, wasFirst } = toggleSave(activityIdStr);
    if (nowSaved && wasFirst && !wasFirstSaveShown()) {
      markFirstSaveShown();
      onSaved?.(true);
    }
  };



  const handleShare = async () => {
    logEvent('initiative_share', { id: activityIdStr });
    const shareData = {
      title: activity.name,
      text: `Check out this circular design activity: ${activity.name}`,
      url: activity.url
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(activity.url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className="rounded-2xl overflow-hidden border-2 bg-card transition-all"
      style={{ borderColor: categoryRing }}
    >
      {/* Designed header — color band + floating ellipse */}
      <div
        className="relative px-4 pt-3 pb-3"
        style={{
          background: `linear-gradient(135deg, ${categoryTint} 0%, ${categoryTint}88 100%)`,
        }}
      >
        {/* Decorative offset ring */}
        <div
          aria-hidden
          className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-40"
          style={{ border: `1px dashed ${categoryColor}` }}
        />

        {/* Top row: energy pill + saves pill */}
        <div className="relative flex items-center justify-between mb-3">
          <div
            className="px-2.5 py-1 rounded-full text-[10px] font-display tracking-wider uppercase flex items-center gap-1.5 shadow-sm"
            style={{ backgroundColor: categoryColor, color: 'hsl(var(--background))' }}
          >
            <EnergyIcon className="w-3 h-3" strokeWidth={2.25} />
            {activity.energyLabel}
          </div>
          <div
            className="px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-sans-thin bg-background/80"
            style={{ color: categoryColor, border: `1px solid ${categoryRing}` }}
          >
            <Heart className="w-3 h-3" fill="currentColor" />
            {activity.saves}
          </div>
        </div>

        {/* Ellipse */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-24 h-16 flex items-center justify-center"
            style={{
              background: `radial-gradient(ellipse at 30% 30%, ${categoryTint} 0%, ${categoryRing} 100%)`,
              borderRadius: '50% / 50%',
              transform: 'rotate(-4deg)',
              boxShadow: `inset 0 0 0 1.5px ${categoryColor}55, 0 4px 12px ${categoryColor}22`,
            }}
          >
            <CircleIcon
              name={iconName}
              style={{ color: categoryColor, transform: 'rotate(4deg)' }}
              accent={categoryColor}
              className="w-9 h-9"
            />

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2">
        <h3 className="font-display text-base text-foreground mb-1.5 leading-snug tracking-wide">
          {activity.name}
        </h3>

        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 font-sans-thin tracking-wide">
          <MapPin className="w-3 h-3" />
          {activity.location} · {activity.commitment}
        </p>

        {/* Values tags — single row, expand to show all */}
        <div className="mb-3">
          <div className="text-[9px] font-display text-muted-foreground uppercase tracking-[0.25em] mb-2">
            {t('values_label')}
          </div>
          <div
            className={cn(
              'flex flex-wrap gap-1.5 overflow-hidden transition-[max-height] duration-300',
              valuesOpen ? 'max-h-40' : 'max-h-7'
            )}
          >
            {activity.tags.values.map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 border border-foreground/30 text-foreground rounded-full font-sans-thin tracking-wide whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
          {activity.tags.values.length > 2 && (
            <button
              onClick={() => setValuesOpen(v => !v)}
              className="mt-1.5 text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {valuesOpen ? t('hide_details') : `+${activity.tags.values.length} ${t('more_word')}`}
              {valuesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Benefits tags — single row, expand to show all */}
        <div className="mb-5">
          <div className="text-[9px] font-display text-muted-foreground uppercase tracking-[0.25em] mb-2">
            {t('benefits_label')}
          </div>
          <div
            className={cn(
              'flex flex-wrap gap-1.5 overflow-hidden transition-[max-height] duration-300',
              benefitsOpen ? 'max-h-60' : 'max-h-7'
            )}
          >
            {activity.tags.benefits.map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 border border-foreground/15 text-muted-foreground rounded-full font-sans-thin whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
          {activity.tags.benefits.length > 2 && (
            <button
              onClick={() => setBenefitsOpen(v => !v)}
              className="mt-1.5 text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {benefitsOpen ? t('hide_details') : `+${activity.tags.benefits.length} ${t('more_word')}`}
              {benefitsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Expand/Collapse button */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.99 }}
          className="w-full py-2.5 mb-3 rounded-sm font-display text-[11px] tracking-[0.2em] uppercase text-foreground border border-foreground/25 bg-transparent hover:bg-foreground/5 transition-all flex items-center justify-center gap-2"
        >
          {expanded ? t('hide_details') : t('view_details')}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </motion.button>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 border border-foreground/15 rounded-sm overflow-hidden bg-muted/40"
            >
              <p className="text-sm text-foreground leading-relaxed mb-4 font-sans-thin">
                {activity.description}
              </p>

              <div className="mb-4">
                <h4 className="text-[9px] font-display text-muted-foreground uppercase tracking-[0.25em] mb-2">
                  {t('activity_type_label')}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activity.tags.activityType.map((type, i) => (
                    <span key={i} className="text-[10px] px-2.5 py-1 border border-foreground/15 text-muted-foreground rounded-full font-sans-thin">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-[9px] font-display text-muted-foreground uppercase tracking-[0.25em] mb-2">
                  {t('all_benefits_label')}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activity.tags.benefits.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2.5 py-1 border border-foreground/15 text-muted-foreground rounded-full font-sans-thin"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[9px] font-display text-muted-foreground uppercase tracking-[0.25em] mb-2">
                  {t('format_commitment_label')}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2.5 py-1 border border-foreground/30 text-foreground rounded-full font-sans-thin">
                    {activity.tags.format}
                  </span>
                  <span className="text-[10px] px-2.5 py-1 border border-foreground/30 text-foreground rounded-full font-sans-thin">
                    {activity.tags.commitment}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => onCloseCircle(activity)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex-1 py-3 rounded-sm font-display text-[11px] tracking-[0.25em] uppercase flex items-center justify-center gap-2 bg-foreground text-background hover:bg-foreground/90 transition-colors"
          >
            {t('close_circle')}
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            onClick={handleToggleSave}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'p-3 rounded-sm border transition-all',
              saved ? 'bg-foreground border-foreground' : 'border-foreground/25 hover:border-foreground/60'
            )}
          >
            <Bookmark className={cn('w-4 h-4', saved ? 'text-background fill-background' : 'text-muted-foreground')} />
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-sm border border-foreground/25 hover:border-foreground/60 transition-all"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}