import { motion } from 'framer-motion';
import { SpiralLine, DottedRing, EllipseLine } from './LineArt';
import { useLang, useT } from '@/i18n/LanguageContext';
import { ExternalLink } from 'lucide-react';

interface CashbackService {
  url: string;
  nameHe: string;
  nameEn: string;
  descHe: string;
  descEn: string;
  benefitType: string;
  benefitSummaryHe: string;
  benefitSummaryEn: string;
}

const SERVICES: CashbackService[] = [
  {
    url: 'https://www.enva.co.il/',
    nameHe: 'ENVA — השקעות אחראיות בפנסיה וגמל',
    nameEn: 'ENVA — Responsible Pension Investments',
    descHe: 'פגישת ייעוץ חינמית להעברת כספי פנסיה, גמל והשתלמות למסלולים נקיים — מפחית עד 75% חשיפה לחברות דלקים, סיגריות, הימורים וזיהום, בלי לפגוע בתשואה.',
    descEn: 'A free consultation that moves your pension, provident and education funds into clean tracks — reducing exposure to fossil fuels, tobacco, gambling and polluting companies by up to 75%, without sacrificing returns or paying higher fees.',
    benefitType: 'improved_terms',
    benefitSummaryHe: 'עד 75% פחות חשיפה מזיקה',
    benefitSummaryEn: 'Up to 75% less harmful exposure',
  },
  {
    url: 'https://lirashapira.org/',
    nameHe: 'לירה שפירא — מטבע מקומי ירוק',
    nameEn: 'Lira Shapira — Local Green Currency',
    descHe: 'קילו זבל אורגני שמופקד בקומפוסטר השכונתי = לירה שפירא אחת לקנייה בעסקי שכונת שפירא ובחווה החקלאית תל חובז. מעל 100 טון פסולת בשנה לא הגיעו למטמנה.',
    descEn: 'Drop a kilo of organic waste into a neighborhood composter and earn one Lira Shapira, redeemable at local Shapira-neighborhood businesses and the Tel Chubez urban farm. Over 100 tons of waste a year stay out of landfill.',
    benefitType: 'alternative_currency',
    benefitSummaryHe: '1 לירה שפירא לכל ק"ג זבל',
    benefitSummaryEn: '1 Lira per kg of compost',
  },
  {
    url: 'https://spareeat.com/',
    nameHe: 'SpareEat — סלי הפתעות בחצי מחיר',
    nameEn: 'SpareEat — Surplus Food Surprise Bags',
    descHe: 'אפליקציה שמחברת בין צרכנים למסעדות, מאפיות ומעדניות שמוכרות עודפי מזון של אותו היום בחצי מחיר או פחות. פעיל בגוש דן, השרון, ירושלים, חיפה, צפון ודרום.',
    descEn: 'An app connecting customers with restaurants, bakeries and delis that sell same-day surplus food in surprise bags at half price or less. Active in Gush Dan, Sharon, Jerusalem, Haifa, North and South.',
    benefitType: 'discount',
    benefitSummaryHe: 'עד 70% הנחה על אוכל',
    benefitSummaryEn: 'Up to 70% off food',
  },
  {
    url: 'https://www.shareitt.co.il/',
    nameHe: 'Shareitt — שיתוף פריטים במטבע פנימי',
    nameEn: 'Shareitt — Peer-to-Peer Item Sharing',
    descHe: 'אפליקציה P2P להחלפת פריטי יד שנייה במטבע פנימי בלי כסף אמיתי. 65K משתמשים, 215K פריטים בשנה. קטגוריות: אופנה, ספרים, צעצועים, כלי בית, מוצרי חשמל ועוד.',
    descEn: 'A peer-to-peer app for trading second-hand items using an internal currency — no real money changes hands. 65K users, 215K items exchanged per year. Categories include fashion, books, toys, homeware and electronics.',
    benefitType: 'alternative_currency',
    benefitSummaryHe: 'פריטים תמורת נקודות, לא כסף',
    benefitSummaryEn: 'Items for points, no cash',
  },
  {
    url: 'https://cellcom.co.il/production/Private/1/energy3/',
    nameHe: 'סלקום אנרג\'י — מסלול 100% חשמל ירוק',
    nameEn: 'Cellcom Energy — 100% Green Electricity Track',
    descHe: 'ספק חשמל פרטי שמוכר חשמל המיוצר 100% ממקורות מתחדשים בשותפות עם משק אנרגיה. הנחה קבועה בנוסף. המסלול הצרכני הראשון בישראל שמאפשר בחירה אקטיבית של חשמל ירוק.',
    descEn: 'A private electricity supplier offering power generated 100% from renewable sources via its partnership with Meshek Energia, plus a fixed discount on the bill. The first Israeli consumer plan that lets you actively choose green power.',
    benefitType: 'discount',
    benefitSummaryHe: 'הנחה קבועה + 100% מתחדש',
    benefitSummaryEn: 'Discount + 100% renewable',
  },
  {
    url: 'https://renewable.energy.gov.il/',
    nameHe: 'האתר הלאומי לאנרגיות מתחדשות — תוכנית 100K גגות',
    nameEn: 'Israel National Renewable Energy Portal',
    descHe: 'סימולטור ממשלתי לחישוב הכנסה, עלות והחזר השקעה מהקמת גג סולארי. בית פרטי ממוצע: 13,000 ₪/שנה הכנסה, החזר השקעה ב-5 שנים. פטור ממס עד 27K ₪/שנה.',
    descEn: 'A government simulator that calculates income, cost and ROI for installing a residential solar roof. Average private home: ₪13,000/year in earnings, 5-year payback, with a tax exemption of up to ₪27,000/year.',
    benefitType: 'income_generation',
    benefitSummaryHe: '13,000 ₪/שנה מהגג שלך',
    benefitSummaryEn: '₪13,000/yr from your roof',
  },
  {
    url: 'https://sunforeveryone.org/',
    nameHe: 'שמש לכולם — ליווי קהילתי להתקנת גגות סולאריים',
    nameEn: 'Sun For Everyone — Community Solar Roof Initiative',
    descHe: 'ארגון לא־ממשלתי שעוזר לבעלי גגות לקבל הצעות מחיר הוגנות וקבוצתיות להקמת מערכת סולארית. מפשט את הבירוקרטיה ומקצוע את הבחירה.',
    descEn: 'A non-profit that helps roof owners secure fair, group-purchased quotes for installing solar systems. Cuts through bureaucracy and brings professional judgment to the choice.',
    benefitType: 'income_generation',
    benefitSummaryHe: 'ליווי להכנסה סולארית הוגנת',
    benefitSummaryEn: 'Fair-price solar consultation',
  },
];

function benefitBadgeColor(type: string): string {
  switch (type) {
    case 'improved_terms':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'alternative_currency':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'discount':
      return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'income_generation':
      return 'bg-violet-100 text-violet-800 border-violet-200';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

export function CashbackView() {
  const { lang } = useLang();
  const t = useT();
  const isHe = lang === 'he';

  return (
    <div className="min-h-screen pb-8 safe-area-bottom relative overflow-hidden">
      <SpiralLine className="absolute -top-10 -right-16 w-72 h-72 opacity-[0.06] pointer-events-none" />
      <DottedRing className="absolute top-60 -left-20 w-56 h-56 opacity-[0.08] pointer-events-none" count={12} />
      <EllipseLine className="absolute bottom-40 -right-20 w-80 h-80 opacity-[0.05] pointer-events-none" />

      <div className="max-w-lg mx-auto px-5 pt-6 relative space-y-4">
        {/* Intro card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/70 backdrop-blur-sm border border-foreground/15 rounded-sm p-5 shadow-soft"
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isHe
              ? 'שירותים שמאפשרים לכם לחסוך, להרוויח או להפוך בחירות יומיומיות לירוקות יותר — מבלי לוותר על תשואה או נוחות.'
              : 'Services that let you save, earn, or turn everyday choices greener — without sacrificing returns or convenience.'}
          </p>
        </motion.div>

        {/* Service cards */}
        {SERVICES.map((service, i) => (
          <motion.a
            key={service.url}
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="block bg-card/70 backdrop-blur-sm border border-foreground/15 rounded-sm p-5 shadow-soft hover:shadow-medium transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-[15px] text-foreground leading-snug mb-1.5">
                  {isHe ? service.nameHe : service.nameEn}
                </h3>
                <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-sm border mb-2.5 ${benefitBadgeColor(service.benefitType)}`}>
                  {isHe ? service.benefitSummaryHe : service.benefitSummaryEn}
                </span>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {isHe ? service.descHe : service.descEn}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground/60 group-hover:text-foreground shrink-0 mt-0.5 transition-colors" />
            </div>
          </motion.a>
        ))}

        <p className="text-center text-[10px] font-display tracking-[0.25em] uppercase text-muted-foreground/60 pt-2">
          {isHe ? 'כל בחירה קטנה יוצרת השפעה גדולה' : 'Every small choice creates big impact'}
        </p>
      </div>
    </div>
  );
}
