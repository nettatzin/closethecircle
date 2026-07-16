import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Share2, Copy, Mail, MessageCircle, Send, Check } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ShareMenuProps {
  title: string;
  url: string;
  onShare?: (channel: string) => void;
}

const LABELS = {
  he: {
    share: 'שיתוף',
    whatsapp: 'ווטסאפ',
    email: 'אימייל',
    copy: 'העתקת קישור',
    native: 'עוד…',
    copied: 'הקישור הועתק',
    emailSubject: 'משהו מהמעגל',
    emailBody: (t: string, u: string) => `חשבתי שיעניין אותך:\n\n${t}\n${u}`,
    whatsappText: (t: string, u: string) => `${t}\n${u}`,
  },
  en: {
    share: 'Share',
    whatsapp: 'WhatsApp',
    email: 'Email',
    copy: 'Copy link',
    native: 'More…',
    copied: 'Link copied',
    emailSubject: 'Something from The Circle',
    emailBody: (t: string, u: string) => `Thought you might like this:\n\n${t}\n${u}`,
    whatsappText: (t: string, u: string) => `${t}\n${u}`,
  },
};

export function ShareMenu({ title, url, onShare }: ShareMenuProps) {
  const { lang } = useLang();
  const L = LABELS[lang] ?? LABELS.en;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const close = () => setOpen(false);

  const handleWhatsapp = () => {
    onShare?.('whatsapp');
    const text = encodeURIComponent(L.whatsappText(title, url));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
    close();
  };

  const handleEmail = () => {
    onShare?.('email');
    const subject = encodeURIComponent(L.emailSubject);
    const body = encodeURIComponent(L.emailBody(title, url));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    close();
  };

  const handleCopy = async () => {
    onShare?.('copy');
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* noop */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    toast({ description: L.copied });
    setTimeout(() => { setCopied(false); close(); }, 900);
  };

  const handleNative = async () => {
    onShare?.('native');
    try {
      await navigator.share({ title, text: title, url });
    } catch {
      /* user cancelled */
    }
    close();
  };

  const items: Array<{ key: string; label: string; icon: JSX.Element; onClick: () => void; show: boolean }> = [
    { key: 'whatsapp', label: L.whatsapp, icon: <MessageCircle className="w-4 h-4" />, onClick: handleWhatsapp, show: true },
    { key: 'email', label: L.email, icon: <Mail className="w-4 h-4" />, onClick: handleEmail, show: true },
    { key: 'copy', label: L.copy, icon: copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />, onClick: handleCopy, show: true },
    { key: 'native', label: L.native, icon: <Send className="w-4 h-4" />, onClick: handleNative, show: canNativeShare },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.9 }}
          aria-label={L.share}
          className="p-3 rounded-sm border border-foreground/25 hover:border-foreground/60 transition-all"
        >
          <Share2 className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-56 p-2 rounded-sm border border-foreground/20 bg-card"
      >
        <div className="text-[9px] font-display text-muted-foreground uppercase tracking-[0.25em] px-2 pt-1 pb-2">
          {L.share}
        </div>
        <div className="flex flex-col">
          {items.filter(i => i.show).map(item => (
            <button
              key={item.key}
              onClick={item.onClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-sans-thin tracking-wide text-foreground',
                'hover:bg-foreground/5 transition-colors text-start'
              )}
            >
              <span className="text-muted-foreground">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
