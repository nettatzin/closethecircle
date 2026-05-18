import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Share2, Bookmark, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Activity } from '@/data/activities';
import { cn } from '@/lib/utils';
import { useT } from '@/i18n/LanguageContext';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onCloseCircle: (activity: Activity) => void;
}

export function ActivityCard({ activity, index, onCloseCircle }: ActivityCardProps) {
  const t = useT();
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
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
      className="bg-card rounded-sm overflow-hidden border border-foreground/15 hover:border-foreground/40 transition-all"
    >
      {/* Oval gradient header — inspired by the poster cutouts */}
      <div className="relative bg-background pt-6 pb-4 flex items-center justify-center">
        <div
          className="w-44 h-32 flex items-center justify-center relative"
          style={{
            background: activity.gradient,
            borderRadius: '50% / 50%',
            transform: 'rotate(-4deg)',
          }}
        >
          <span className="text-5xl drop-shadow-md" style={{ transform: 'rotate(4deg)' }}>{activity.icon}</span>
        </div>

        {/* Saves badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 border border-foreground/20 rounded-full flex items-center gap-1.5 text-[11px] font-sans-thin text-foreground bg-background">
          <Heart className="w-3 h-3" />
          {activity.saves}
        </div>

        {/* Energy badge */}
        <div className="absolute bottom-2 left-3 px-2.5 py-1 border border-foreground/20 rounded-full text-[11px] font-display tracking-wider uppercase text-foreground bg-background flex items-center gap-1.5">
          {activity.energyLevel === 'low-key' ? '🪶' : activity.energyLevel === 'hands-on' ? '🔥' : '💪'} {activity.energyLabel}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2">
        <h3 className="font-display text-xl text-foreground mb-2 leading-snug tracking-wide">
          {activity.name}
        </h3>

        <p className="text-xs text-muted-foreground mb-5 flex items-center gap-1.5 font-sans-thin tracking-wide">
          <MapPin className="w-3 h-3" />
          {activity.location} · {activity.commitment}
        </p>

        {/* Values tags */}
        <div className="mb-3">
          <div className="text-[9px] font-display text-muted-foreground uppercase tracking-[0.25em] mb-2">
            {t('values_label')}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activity.tags.values.map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 border border-foreground/30 text-foreground rounded-full font-sans-thin tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits tags */}
        <div className="mb-5">
          <div className="text-[9px] font-display text-muted-foreground uppercase tracking-[0.25em] mb-2">
            {t('benefits_label')}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activity.tags.benefits.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2.5 py-1 border border-foreground/15 text-muted-foreground rounded-full font-sans-thin"
              >
                {tag}
              </span>
            ))}
            {activity.tags.benefits.length > 3 && (
              <span className="text-[10px] px-2.5 py-1 border border-foreground/15 text-muted-foreground rounded-full font-sans-thin italic">
                +{activity.tags.benefits.length - 3} {t('more_word')}
              </span>
            )}
          </div>
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
            onClick={() => setSaved(!saved)}
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