import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Share2, Bookmark, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Activity } from '@/data/activities';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  onCloseCircle: (activity: Activity) => void;
}

export function ActivityCard({ activity, index, onCloseCircle }: ActivityCardProps) {
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
      className="bg-card rounded-2xl overflow-hidden border-2 border-border/30 shadow-soft hover:shadow-medium hover:border-primary/30 transition-all"
    >
      {/* Gradient header */}
      <div 
        className="h-40 relative flex items-center justify-center"
        style={{ background: activity.gradient }}
      >
        <span className="text-6xl drop-shadow-lg">{activity.icon}</span>
        
        {/* Saves badge */}
        <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold text-foreground">
          <Heart className="w-4 h-4" />
          {activity.saves}
        </div>
        
        {/* Energy badge */}
        <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-foreground flex items-center gap-1.5">
          {activity.energy} {activity.energyLabel}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-xl font-bold text-foreground mb-1.5 leading-tight">
          {activity.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {activity.location} • {activity.commitment}
        </p>

        {/* Values tags */}
        <div className="mb-3">
          <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
            Values
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activity.tags.values.map(tag => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 bg-primary/15 text-foreground rounded-full font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Benefits tags */}
        <div className="mb-4">
          <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1.5">
            Benefits
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activity.tags.benefits.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-1 bg-muted text-muted-foreground rounded-full font-semibold"
              >
                {tag}
              </span>
            ))}
            {activity.tags.benefits.length > 3 && (
              <span className="text-[11px] px-2.5 py-1 bg-muted text-muted-foreground rounded-full font-semibold">
                +{activity.tags.benefits.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Expand/Collapse button */}
        <motion.button
          onClick={() => setExpanded(!expanded)}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 mb-3 rounded-xl font-bold text-sm text-primary border-2 border-primary/30 bg-transparent hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          {expanded ? 'Hide details' : 'View details'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </motion.button>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-primary/5 rounded-xl overflow-hidden"
            >
              <p className="text-sm text-foreground leading-relaxed mb-4">
                {activity.description}
              </p>

              <div className="mb-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  What to expect:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1.5 pl-4">
                  {activity.expectations.map((exp, i) => (
                    <li key={i} className="list-disc">{exp}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  All benefits:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activity.tags.benefits.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 bg-card border border-border/40 rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  Connected artworks:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activity.connectedArtworks.map(artwork => (
                    <span
                      key={artwork}
                      className="text-[11px] px-2.5 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary font-semibold"
                    >
                      ↻ {artwork}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => onCloseCircle(activity)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 rounded-xl font-bold text-sm shadow-glow flex items-center justify-center gap-2"
            style={{ background: 'var(--gradient-primary)', color: 'hsl(var(--primary-foreground))' }}
          >
            Close this circle
            <ExternalLink className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            onClick={() => setSaved(!saved)}
            whileTap={{ scale: 0.9 }}
            className={cn(
              'p-3 rounded-xl border-2 transition-all',
              saved ? 'bg-primary/15 border-primary' : 'border-border/40 hover:border-primary/50'
            )}
          >
            <Bookmark className={cn('w-5 h-5', saved ? 'text-primary fill-primary' : 'text-muted-foreground')} />
          </motion.button>
          
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-xl border-2 border-border/40 hover:border-primary/50 transition-all"
          >
            <Share2 className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}