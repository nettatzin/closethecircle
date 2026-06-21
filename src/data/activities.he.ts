// תרגום עברי — אפליקציה למבקרי תערוכת "המעגל" / מוזיאון העיצוב חולון
// הערות תרגום:
// - מזהים, URLs ו-imports של תמונות נשמרו כמו במקור
// - שדות קוד פנימיים (locationFormat, energyLevel, region, id) נשארו באנגלית
// - שמות מותג בינלאומיים מוכרים נשארו בלטינית (Fashion Revolution, Redress וכו')
// - הטקסט שמופיע למבקר תורגם לעברית קולחת ומזמינה

import mitumbaImg from '@/assets/artworks/mitumba.png';
import insectsTypologyImg from '@/assets/artworks/insects-typology.png';
import kiteprideImg from '@/assets/artworks/kitepride.png';
import plasticRiversImg from '@/assets/artworks/plastic-rivers.png';
import cityTransformerImg from '@/assets/artworks/city-transformer.png';
import livingRootBridgesImg from '@/assets/artworks/living-root-bridges.png';

export interface Activity {
  id: number;
  name: string;
  type: string;
  energyLevel: 'low-key' | 'hands-on' | 'deep-work';
  energyLabel: string;
  commitment: string;
  location: string;
  locationFormat: 'physical' | 'digital' | 'hybrid';
  region: 'israel' | 'global';
  gradient: string;
  icon: string;
  description: string;
  tags: {
    values: string[];
    benefits: string[];
    activityType: string[];
    format: string;
    commitment: string;
  };
  draws: string[];
  connectedArtworks: number[];
  saves: number;
  url: string;
  showCommunityMessage: boolean;
}

export const drawOptions = [
  { id: 'explore', icon: '🌱', label: 'להרחיב אופקים' },
  { id: 'meet', icon: '🤝', label: 'להכיר א.נשים' },
  { id: 'make', icon: '🛠️', label: 'ליצור' },
  { id: 'amplify', icon: '📣', label: 'להשמיע קול' },
  { id: 'exchange', icon: '🔄', label: 'למצוא הזדמנויות' },
  { id: 'witness', icon: '👁️', label: 'להתבונן מהצד' }
];

// כותרת השאלה שמופיעה מעל בחירת רמת האנרגיה
export const energyQuestion = 'כמה בפנים אני כעת?';

export const energyOptions = [
  { id: 'low-key', icon: '🪶', label: 'בקטנה', time: 'עד כמה דקות' },
  { id: 'hands-on', icon: '🔥', label: 'בעניין', time: 'עד כשעה בחודש' },
  { id: 'deep-work', icon: '💪', label: 'צלילה פנימה', time: 'עד כמה שעות בחודש' }
];

export type ArtworkTheme =
  | 'פסולת טקסטיל'
  | 'חומר נולד מחדש'
  | 'שדרוג ויצירה'
  | 'אוקיינוס ופלסטיק'
  | 'מערכות עירוניות'
  | 'מערכות חיות';

export type ArtworkSpace =
  | 'אולם ראשי'
  | 'אגף מזרחי'
  | 'גן חיצוני'
  | 'גלריה תחתונה'
  | 'חדר פרויקטים';

export interface ArtworkLink {
  label: string;
  url: string;
  type: 'interview' | 'artist' | 'press' | 'video' | 'web';
}

export interface Artwork {
  id: number;
  name: string;
  artist: string;
  image: string;
  gallery: string[];
  theme: ArtworkTheme;
  space: ArtworkSpace;
  year: string;
  medium: string;
  about: string;
  artistBio: string;
  links: ArtworkLink[];
}

export const artworkThemes: ArtworkTheme[] = [
  'פסולת טקסטיל',
  'חומר נולד מחדש',
  'שדרוג ויצירה',
  'אוקיינוס ופלסטיק',
  'מערכות עירוניות',
  'מערכות חיות',
];

export const artworkSpaces: ArtworkSpace[] = [
  'אולם ראשי',
  'אגף מזרחי',
  'גן חיצוני',
  'גלריה תחתונה',
  'חדר פרויקטים',
];

export const artworks: Artwork[] = [
  {
    id: 1,
    name: 'מיטומבה',
    artist: 'מאיה ארזי ומרב גזית',
    image: mitumbaImg,
    gallery: [mitumbaImg, mitumbaImg, mitumbaImg],
    theme: 'פסולת טקסטיל',
    space: 'אולם ראשי',
    year: '2024',
    medium: 'בגדים ממוחזרים, טקסטילים מגוונים, שלד פלדה',
    about:
      'מיטומבה עוקבת אחרי החיים שאחרי של בגדים שנתרמו — חבילות יד שנייה שנשלחות מהצפון העשיר לשווקים במזרח אפריקה. העבודה משחזרת את הזרימות האלו כארכיון פיסולי, ושואלת מי נושא במשקל הבגדים שזרקנו.',
    artistBio:
      'מאיה ארזי ומרב גזית הן מעצבות תל-אביביות הפועלות בצומת של חקר טקסטיל ואקטיביזם חומרי. העבודה שלהן בוחנת שרשראות אספקה קולוניאליות ואת הגיאוגרפיה הנסתרת של פסולת האופנה.',
    links: [
      { label: 'ראיון — Designboom', url: 'https://www.designboom.com', type: 'interview' },
      { label: 'דף האמניות', url: 'https://www.instagram.com/', type: 'artist' },
      { label: 'כתבה — גלובס', url: 'https://www.globes.co.il', type: 'press' },
    ],
  },
  {
    id: 2,
    name: 'טיפולוגיה של חרקים',
    artist: 'אורי אוריסון מרחב',
    image: insectsTypologyImg,
    gallery: [insectsTypologyImg, insectsTypologyImg],
    theme: 'מערכות חיות',
    space: 'אגף מזרחי',
    year: '2023',
    medium: 'פיגמנט קוקיניל, משי, שרף ביולוגי, הדפס ארכיוני',
    about:
      'מחקר טקסונומי על החרקים שעיצבו את צבעי הטקסטיל לאורך מאות שנים. העבודה מציבה מחדש את החרקים מפיקי הפיגמנט כשותפים, לא כמשאבים — ומציעה יחסי גומלין הדדיים יותר בין צבע, חומר ומערכת אקולוגית.',
    artistBio:
      'אורי אוריסון מרחב היא מעצבת וחוקרת שהפרקטיקה שלה מתמקדת בחומרים ביולוגיים ובהיסטוריה התרבותית של הצבע. היא מלמדת באקדמיה לאמנות ועיצוב בצלאל.',
    links: [
      { label: 'ראיון מהסטודיו', url: 'https://www.dezeen.com', type: 'interview' },
      { label: 'אתר האמנית', url: 'https://www.oriorisunmerhav.com', type: 'artist' },
      { label: 'הרצאה — Vimeo', url: 'https://vimeo.com', type: 'video' },
    ],
  },
  {
    id: 3,
    name: 'Kitepride',
    artist: 'מתיאס ותביאה אופליגר',
    image: kiteprideImg,
    gallery: [kiteprideImg, kiteprideImg, kiteprideImg],
    theme: 'שדרוג ויצירה',
    space: 'גן חיצוני',
    year: '2022',
    medium: 'מפרשי קייטסרפינג מודחים, רצועות, חומרה',
    about:
      'Kitepride אוספים מפרשי קייטסרפינג שבורים מחופי הים התיכון והופכים אותם לתיקים ואקססוריז שימושיים. העבודה בתערוכה היא חופה תלויה שעשויה ממפרשים של עונה שלמה.',
    artistBio:
      'מתיאס ותביאה אופליגר הקימו את Kitepride בתל אביב ב-2014 כעסק חברתי שמעסיק אנשים בשולי שוק העבודה הישראלי. היום הסטודיו פועל כסדנה מעגלית מלאה.',
    links: [
      { label: 'ראיון עם המייסדים', url: 'https://www.kitepride.com/blogs', type: 'interview' },
      { label: 'אתר המותג', url: 'https://www.kitepride.com', type: 'web' },
      { label: 'קטע מהסרט הדוקומנטרי', url: 'https://www.youtube.com', type: 'video' },
    ],
  },
  {
    id: 4,
    name: 'נהרות של פלסטיק',
    artist: 'אלוואַרו קטלאן דה אוקון',
    image: plasticRiversImg,
    gallery: [plasticRiversImg, plasticRiversImg],
    theme: 'אוקיינוס ופלסטיק',
    space: 'גלריה תחתונה',
    year: '2021',
    medium: 'שטיחים קשורים ביד, חוט PET ממוחזר',
    about:
      'סדרת שטיחים שהדוגמאות שלהם ממפות את עשרת הנהרות שמובילים את הכמויות הגדולות ביותר של פסולת פלסטיק לאוקיינוסים. כל שטיח ארוג מחוט שטווה מאותו סוג פלסטיק שהנהרות האלה מובילים.',
    artistBio:
      'אלוואַרו קטלאן דה אוקון הוא מעצב תעשייתי מבסיס מדריד, ידוע בעיקר בפרויקט PET Lamp. עבודתו מחברת בין מסורות מלאכה ובין סוגיות סביבתיות עכשוויות.',
    links: [
      { label: 'ראיון ב-Dezeen', url: 'https://www.dezeen.com', type: 'interview' },
      { label: 'אתר הסטודיו', url: 'https://www.acdo.es', type: 'artist' },
      { label: 'סרט הפרויקט', url: 'https://vimeo.com', type: 'video' },
    ],
  },
  {
    id: 5,
    name: 'City Transformer',
    artist: 'נמרוד אליעזר',
    image: cityTransformerImg,
    gallery: [cityTransformerImg, cityTransformerImg, cityTransformerImg],
    theme: 'מערכות עירוניות',
    space: 'חדר פרויקטים',
    year: '2024',
    medium: 'פלדה, אלומיניום ממוחזר, אלקטרוניקה',
    about:
      'אבטיפוס בקנה מידה 1:1 של רכב חשמלי מתקפל לערים צפופות בים התיכון. הרכב מוצג לצד ספריית החלקים שמאפשרת לתחזק ולייצר אותו מחדש לאורך זמן בלתי מוגבל.',
    artistBio:
      'נמרוד אליעזר הוא מעצב תעשייתי ושותף-מייסד של City Transformer, שעוסקת במערכות תחבורה מעגליות לסביבה עירונית.',
    links: [
      { label: 'ראיון עם המייסד', url: 'https://www.calcalist.co.il', type: 'interview' },
      { label: 'אתר החברה', url: 'https://citytransformer.com', type: 'web' },
    ],
  },
  {
    id: 6,
    name: 'גשרי השורשים החיים',
    artist: 'אזור מגהלאיה',
    image: livingRootBridgesImg,
    gallery: [livingRootBridgesImg, livingRootBridgesImg],
    theme: 'מערכות חיות',
    space: 'אולם ראשי',
    year: 'מתמשך',
    medium: 'תיעוד צילומי, שורשי פיקוס ארוגים',
    about:
      'תיעוד של פרקטיקה בת מאות שנים: הכוונת שורשי עצי תאנה לחצות נהרות וליצור גשרים חיים במגהלאיה שבהודו. הגשרים הולכים ומתחזקים עם שימוש וזמן — תמונה הפוכה לתשתיות החד-פעמיות של המודרניות.',
    artistBio:
      'פרויקט שיתופי שמתעד את קהילות הקאסי והג׳איינטיה במגהלאיה, שהידע הבין-דורי שלהן מעצב את המבנים החיים האלה כבר למעלה מחמש מאות שנה.',
    links: [
      { label: 'ראיון מהשטח', url: 'https://www.bbc.com', type: 'interview' },
      { label: 'ארכיון מחקרי', url: 'https://www.livingrootbridges.com', type: 'web' },
      { label: 'סרט תיעודי', url: 'https://www.youtube.com', type: 'video' },
    ],
  },
];

const gradients = [
  'var(--gradient-primary)',
  'var(--gradient-purple)',
  'var(--gradient-pink)',
  'var(--gradient-cyan)',
  'var(--gradient-sunset)',
  'var(--gradient-mint)',
  'var(--gradient-peach)'
];

const getGradient = (index: number) => gradients[index % gradients.length];

export const activities: Activity[] = [
  // === פעילויות אונליין גלובליות ===
  {
    id: 1,
    name: 'תחרות Redress Design Award 2026',
    type: 'תחרות',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'תהליך עיצוב של חודשים',
    location: 'אונליין (גלובלי)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(0),
    icon: '🏆',
    description: 'תחרות עיצוב האופנה המקיימת הגדולה בעולם. ההגשות נפתחות בינואר בכל שנה.',
    tags: {
      values: ['מעגליות טכנית', 'מעורבות קהילתית'],
      benefits: ['פרסים שפותחים דלתות', 'בוטקמפ ומסלול תצוגה בהונג קונג', 'חשיפה גלובלית'],
      activityType: ['תחרות', 'עיצוב', 'תיק עבודות'],
      format: 'אונליין',
      commitment: 'חודשים'
    },
    draws: ['make', 'meet', 'amplify'],
    connectedArtworks: [1, 3],
    saves: 234,
    url: 'https://2025.redressdesignaward.com/',
    showCommunityMessage: false
  },
  {
    id: 2,
    name: 'Fashion Revolution גלובלי (@fash_rev)',
    type: 'לעקוב ברשת',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'אונליין (גלובלי)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(1),
    icon: '📱',
    description: 'תנועת האקטיביזם הגדולה בעולם לאופנה. תוכן יומי על שקיפות וצדק בתעשייה. 529 אלף עוקבים.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['עדכונים מקמפיינים גלובליים', 'השראה אקטיביסטית', 'השתתפות ב-#WhoMadeMyClothes'],
      activityType: ['רשתות חברתיות', 'אקטיביזם', 'חינוך'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['amplify', 'explore'],
    connectedArtworks: [1, 4],
    saves: 529,
    url: 'https://www.instagram.com/fash_rev/',
    showCommunityMessage: true
  },
  {
    id: 3,
    name: 'Fashion Revolution Week — השבוע העולמי',
    type: 'אירוע שנתי',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות לאירוע',
    location: 'אונליין + 80 מדינות',
    locationFormat: 'hybrid',
    region: 'global',
    gradient: getGradient(2),
    icon: '🌍',
    description: 'שבוע פעולה בינלאומי: תיקון במרחב הציבורי, קמפיין #WhoMadeMyClothes, אירועים מקומיים ווירטואליים. אפריל 2026.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['סולידריות עולמית', 'מיומנויות אקטיביסטיות', 'השתתפות בקמפיין'],
      activityType: ['אירועים', 'רשתות חברתיות', 'אקטיביזם'],
      format: 'משולב',
      commitment: 'שבוע בשנה'
    },
    draws: ['amplify', 'meet', 'make'],
    connectedArtworks: [1, 2, 4],
    saves: 412,
    url: 'https://www.fashionrevolution.org/frw-25/',
    showCommunityMessage: true
  },
  {
    id: 4,
    name: 'ניוזלטר של Fashion Revolution',
    type: 'ניוזלטר',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'אונליין (גלובלי)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(3),
    icon: '📧',
    description: 'עדכונים דו-שבועיים על קמפיינים, מקורות מידע ואקטיביזם גלובלי.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['עדכוני קמפיינים', 'גישה למקורות', 'רשת גלובלית'],
      activityType: ['ניוזלטר', 'חינוך'],
      format: 'אונליין',
      commitment: 'דו-שבועי'
    },
    draws: ['explore', 'amplify'],
    connectedArtworks: [4],
    saves: 189,
    url: 'https://www.fashionrevolution.org/about/get-involved/',
    showCommunityMessage: false
  },
  {
    id: 5,
    name: 'FutureLearn: קורס אופנה וקיימות',
    type: 'קורס חינמי',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'כמה שבועות, בקצב שלך',
    location: 'אונליין (גלובלי)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(4),
    icon: '🎓',
    description: 'קורס חינמי מאוניברסיטאות בריטיות על יסודות האופנה המקיימת.',
    tags: {
      values: ['ראייה מערכתית', 'מעגליות טכנית'],
      benefits: ['רצינות אקדמית', 'לימוד בקצב שלך', 'מבט-על על התעשייה'],
      activityType: ['קורס', 'חינוך', 'בקצב שלך'],
      format: 'אונליין',
      commitment: 'כמה שבועות'
    },
    draws: ['explore'],
    connectedArtworks: [2, 4],
    saves: 567,
    url: 'https://www.futurelearn.com/courses/fashion-and-sustainability',
    showCommunityMessage: false
  },
  {
    id: 6,
    name: 'קורסים אונליין של Centre for Sustainable Fashion',
    type: 'סדרת קורסים',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'תלוי בקורס',
    location: 'אונליין (גלובלי)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(5),
    icon: '📚',
    description: 'Fashion Values, Fashion Economy ועוד — קורסים של חוקרים מובילים מ-UAL.',
    tags: {
      values: ['ראייה מערכתית', 'כוונת התחדשות'],
      benefits: ['רמה של University of the Arts London', 'אתגרי חשיבה עיצובית', 'מרצים מומחים'],
      activityType: ['קורס', 'אקדמי', 'מחקר'],
      format: 'אונליין',
      commitment: 'משתנה'
    },
    draws: ['explore'],
    connectedArtworks: [2, 6],
    saves: 234,
    url: 'https://www.sustainable-fashion.com/onlinecourses',
    showCommunityMessage: false
  },
  {
    id: 7,
    name: 'Wardrobe Crisis Academy',
    type: 'אקדמיה אונליין',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'בקצב שלך',
    location: 'אונליין (גלובלי)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(6),
    icon: '👗',
    description: 'קורסים אונליין בנגישות כלכלית על עסקי אופנה מקיימת: מטרה, יצירה, צמיחה ותקשורת.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['פוקוס על עסקים קטנים', 'ראיונות עם מומחים', 'קהילה ייעודית'],
      activityType: ['קורס', 'עסקים', 'קהילה'],
      format: 'אונליין',
      commitment: 'בקצב שלך'
    },
    draws: ['explore', 'meet'],
    connectedArtworks: [1, 3],
    saves: 156,
    url: 'https://thewardrobecrisis.com/academy',
    showCommunityMessage: true
  },
  {
    id: 8,
    name: 'Falmouth University: תואר שני באופנה מקיימת',
    type: 'תואר שני',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'שנתיים, חלקי',
    location: 'אונליין (גלובלי)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(0),
    icon: '🎓',
    description: 'תואר שני מקצועי באופנה מקיימת. 12,150 ליש"ט סה"כ, אפשרויות תשלום.',
    tags: {
      values: ['ראייה מערכתית', 'מעגליות טכנית'],
      benefits: ['תואר מוכר', 'הסמכה מקצועית', 'גמישות של לימודים אונליין'],
      activityType: ['תואר', 'אקדמי', 'מקצועי'],
      format: 'אונליין',
      commitment: 'שנתיים'
    },
    draws: ['explore', 'make'],
    connectedArtworks: [2, 4, 5],
    saves: 89,
    url: 'https://www.falmouth.ac.uk/study/online/postgraduate/sustainable-fashion',
    showCommunityMessage: false
  },

  // === רשתות חברתיות לעקוב ===
  {
    id: 9,
    name: '@dressed_to_save_the_world',
    type: 'לעקוב ברשת',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'אונליין (גלובלי)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(1),
    icon: '📱',
    description: 'ד"ר מיטל פלג מזרחי — חוקרת ומובילת דעה באופנה מקיימת. חינוך לסלואו פאשן.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['דפוסי צריכה ביקורתיים', 'ביקורת על תעשיית האופנה'],
      activityType: ['רשתות חברתיות', 'חינוך'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['witness', 'amplify'],
    connectedArtworks: [1, 4],
    saves: 78,
    url: 'https://www.instagram.com/dressed_to_save_the_world/',
    showCommunityMessage: false
  },
  {
    id: 10,
    name: '@sustainable_fashion_forum',
    type: 'לעקוב ברשת',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'אונליין (ישראל)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(2),
    icon: '📱',
    description: 'הקהילה האינסטגרמית של הפורום הישראלי לאופנה מקיימת.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['קישורים לתעשייה', 'תוכן חינוכי'],
      activityType: ['רשתות חברתיות', 'קהילה'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['witness', 'amplify'],
    connectedArtworks: [1, 2],
    saves: 145,
    url: 'https://www.instagram.com/sustainable_fashion_forum/',
    showCommunityMessage: true
  },
  {
    id: 11,
    name: '@tombekerdesigns (תום בקר)',
    type: 'מעצב לעקוב',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'אונליין (מבוסס בנגב)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🪂',
    description: 'סטריטוור משודרג ממצנחים, ברזנטים ועפיפונים. מעצב מהנגב.',
    tags: {
      values: ['מעגליות טכנית', 'כוונת התחדשות'],
      benefits: ['השראה לשינוי חומרים', 'שדרוג מקסימליסטי'],
      activityType: ['רשתות חברתיות', 'השראה עיצובית'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['witness', 'explore'],
    connectedArtworks: [3, 5],
    saves: 234,
    url: 'https://www.instagram.com/tombekerdesigns/',
    showCommunityMessage: false
  },
  {
    id: 12,
    name: '@flea_market_haifa',
    type: 'לעקוב ברשת',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'חיפה',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(4),
    icon: '🛍️',
    description: 'עדכוני וינטג׳ ויד שנייה משוק הפשפשים של חיפה.',
    tags: {
      values: ['מעורבות קהילתית', 'מעגליות טכנית'],
      benefits: ['תרבות שימוש חוזר מקומית', 'גילוי יד שנייה'],
      activityType: ['רשתות חברתיות', 'מקומי'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 3],
    saves: 67,
    url: 'https://www.instagram.com/flea_market_haifa/',
    showCommunityMessage: false
  },
  {
    id: 13,
    name: '@fashionrevolution_israel',
    type: 'לעקוב ברשת',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'אונליין (ישראל)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(5),
    icon: '✊',
    description: 'הסניף הישראלי של Fashion Revolution — פעילויות וקמפיינים.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['שקיפות בעבודה', 'אקטיביזם בשרשרת אספקה'],
      activityType: ['רשתות חברתיות', 'אקטיביזם'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['amplify', 'explore'],
    connectedArtworks: [1, 4],
    saves: 189,
    url: 'https://www.instagram.com/fashionrevolution_israel/',
    showCommunityMessage: true
  },
  {
    id: 14,
    name: '@dorinfrank (דורין פרנקפורט)',
    type: 'מעצבת לעקוב',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'תל אביב',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(6),
    icon: '👔',
    description: 'חלוצת אופנה ישראלית משדרגת כבר 40 שנה — וגם מובילת ייצור מקומי.',
    tags: {
      values: ['מעגליות טכנית', 'מעורבות קהילתית'],
      benefits: ['פרספקטיבה היסטורית', 'תמיכה בייצור מקומי'],
      activityType: ['רשתות חברתיות', 'השראה עיצובית'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['witness', 'explore'],
    connectedArtworks: [1, 2],
    saves: 312,
    url: 'https://www.instagram.com/dorinfrank/',
    showCommunityMessage: false
  },

  // === קבוצות פייסבוק וניוזלטרים ===
  {
    id: 15,
    name: 'זה לא יושב בול',
    type: 'קבוצת פייסבוק',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מ-5 דקות',
    location: 'אונליין (ישראל)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(0),
    icon: '👕',
    description: '50,000+ חברים מחליפים בגדים שלא ישבו בול. כ-100 פוסטים ביום.',
    tags: {
      values: ['מעורבות קהילתית', 'מעגליות טכנית'],
      benefits: ['הארכת חיי בגדים', 'החלפה ישירה בין אנשים', 'סולידריות קהילתית'],
      activityType: ['קהילה', 'החלפה'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['exchange', 'meet'],
    connectedArtworks: [1, 3],
    saves: 456,
    url: 'https://www.facebook.com/groups/',
    showCommunityMessage: true
  },
  {
    id: 16,
    name: 'מתלבשות על נובמבר',
    type: 'קבוצת פייסבוק',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מ-5 דקות',
    location: 'אונליין (ישראל)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🍂',
    description: 'אקטיביזם של אופנה מקיימת, אירועי החלפה וקמפיין שנתי בנובמבר. הוקמה ב-2019.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['ביקורת על אופנה מהירה', 'פעולה קולקטיבית', 'גישה לאירועי החלפה'],
      activityType: ['קהילה', 'אקטיביזם', 'אירועים'],
      format: 'אונליין',
      commitment: 'גמיש'
    },
    draws: ['amplify', 'meet', 'exchange'],
    connectedArtworks: [1, 4],
    saves: 234,
    url: 'https://www.facebook.com/groups/',
    showCommunityMessage: true
  },
  {
    id: 17,
    name: 'ניוזלטר הפורום הישראלי לאופנה מקיימת',
    type: 'ניוזלטר',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'אונליין (ישראל)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(2),
    icon: '📧',
    description: 'עדכונים חודשיים, אירועים וחדשות תעשייה מהפורום הישראלי.',
    tags: {
      values: ['ראייה מערכתית', 'מעורבות קהילתית'],
      benefits: ['התפתחויות בתעשייה', 'הודעות על אירועים'],
      activityType: ['ניוזלטר', 'מקומי'],
      format: 'אונליין',
      commitment: 'חודשי'
    },
    draws: ['explore'],
    connectedArtworks: [2, 4],
    saves: 178,
    url: 'https://www.sustainablefashionforum.com/',
    showCommunityMessage: false
  },
  {
    id: 18,
    name: 'ניוזלטר אופנה של גרינפיס ישראל',
    type: 'ניוזלטר',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מדקה',
    location: 'אונליין (ישראל)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🌿',
    description: 'עדכוני קמפיינים, אירועי החלפה והישגים רגולטוריים בנוף האופנה הישראלי.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['הזדמנויות לאקטיביזם', 'מודעות רגולטורית'],
      activityType: ['ניוזלטר', 'אקטיביזם'],
      format: 'אונליין',
      commitment: 'קבוע'
    },
    draws: ['amplify', 'explore'],
    connectedArtworks: [4, 6],
    saves: 145,
    url: 'https://www.greenpeace.org/israel/act/fashion/',
    showCommunityMessage: false
  },

  // === אירועים פיזיים בישראל ===
  {
    id: 19,
    name: 'שבוע Fashion Revolution ישראל',
    type: 'אירוע שנתי',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות לאירוע',
    location: 'תל אביב ואונליין',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(4),
    icon: '✊',
    description: 'יום תיקון פומבי (26 באפריל), קמפיין #WhoMadeMyClothes ופעולה מקומית עם השראה גלובלית.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['שקיפות בעבודה', 'תרבות של תיקון גלוי', 'קהילת אקטיביסטיות'],
      activityType: ['אירועים', 'אקטיביזם', 'יצירה'],
      format: 'משולב',
      commitment: 'שבוע בשנה'
    },
    draws: ['amplify', 'meet', 'make'],
    connectedArtworks: [1, 3, 4],
    saves: 289,
    url: 'https://www.fashionrevolution.org/asia/israel/',
    showCommunityMessage: true
  },
  {
    id: 20,
    name: 'יריד Dress Code',
    type: 'יריד אופנה',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'בית ציוני אמריקה, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(5),
    icon: '🛍️',
    description: '15+ מעצבות ומעצבים ישראלים עצמאיים, עד 70% הנחה על עונות קודמות. 22-24 במאי 2025.',
    tags: {
      values: ['מעורבות קהילתית', 'מעגליות טכנית'],
      benefits: ['גילוי מעצבים מקומיים', 'אופנה איטית במחיר נגיש'],
      activityType: ['יריד', 'קניות', 'מעצבים'],
      format: 'פיזי',
      commitment: 'חד-פעמי'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 5],
    saves: 178,
    url: 'https://www.jpost.com/consumerism/article-854408',
    showCommunityMessage: false
  },
  {
    id: 21,
    name: 'שבוע האופנה בתל אביב',
    type: 'אירוע רב-יומי',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'כמה ימים',
    location: 'מתחם קרמניצקי, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '👗',
    description: '28 תצוגות אופנה, פרזנטציה של שנקר ומפגש עם המערכת האקולוגית של העיצוב הישראלי. 26-30 באוקטובר 2025.',
    tags: {
      values: ['ראייה מערכתית', 'מעורבות קהילתית'],
      benefits: ['טבילה בתעשייה', 'גילוי מעצבים'],
      activityType: ['אירוע', 'אופנה', 'תעשייה'],
      format: 'פיזי',
      commitment: 'כמה ימים'
    },
    draws: ['witness', 'explore', 'meet'],
    connectedArtworks: [1, 2, 5],
    saves: 345,
    url: 'https://conartmag.com/tel-aviv-fashion-week-returns-in-2025',
    showCommunityMessage: false
  },
  {
    id: 22,
    name: 'בזאר הצדקה של "מתלבשות על זה"',
    type: 'אירוע צדקה',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '💜',
    description: 'מהדורה 22 — לטובת מרכז סיוע לנפגעות תקיפה מינית בירושלים.',
    tags: {
      values: ['מעורבות קהילתית', 'כוונת התחדשות'],
      benefits: ['כלכלה מעגלית במפגש עם השפעה חברתית', 'בניית קהילה'],
      activityType: ['צדקה', 'החלפה', 'קהילה'],
      format: 'פיזי',
      commitment: 'שנתי'
    },
    draws: ['exchange', 'meet', 'amplify'],
    connectedArtworks: [1, 4],
    saves: 267,
    url: 'https://mitlabshot.com/',
    showCommunityMessage: true
  },
  {
    id: 23,
    name: 'Swap & Shop for Charity TLV',
    type: 'אירוע החלפה',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🔄',
    description: 'אירועי החלפת בגדים שתורמים לעמותות מקומיות.',
    tags: {
      values: ['מעורבות קהילתית', 'כוונת התחדשות'],
      benefits: ['רענון ארון', 'תרומה לצדקה', 'מפגש חברתי'],
      activityType: ['החלפה', 'צדקה', 'חברתי'],
      format: 'פיזי',
      commitment: 'חד-פעמי'
    },
    draws: ['exchange', 'meet'],
    connectedArtworks: [1, 3],
    saves: 189,
    url: 'https://www.secrettelaviv.com/tickets/swap-shop-for-charity-tlv',
    showCommunityMessage: true
  },
  {
    id: 24,
    name: 'אירועי החלפה לילדים — Treehouse',
    type: 'החלפה משפחתית',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'אבן גבירול 188, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '🧒',
    description: 'החלפת בגדים לילדים בגילי 0-7. לטובת עמותת Mothers Make a Difference.',
    tags: {
      values: ['מעורבות קהילתית', 'כוונת התחדשות'],
      benefits: ['השתתפות משפחתית', 'כלכלה מעגלית לילדים', 'השפעה חברתית'],
      activityType: ['משפחה', 'החלפה', 'צדקה'],
      format: 'פיזי',
      commitment: 'חד-פעמי'
    },
    draws: ['exchange', 'meet'],
    connectedArtworks: [3, 5],
    saves: 134,
    url: 'https://www.treehousegeneration.com/',
    showCommunityMessage: true
  },
  {
    id: 25,
    name: 'יריד שוקיימות',
    type: 'יריד מקיים',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'דיזנגוף סנטר, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🌱',
    description: 'דוכנים מקיימים, סדנאות שדרוג והחלפת בגדים בשיתוף גרינפיס.',
    tags: {
      values: ['מעורבות קהילתית', 'מעגליות טכנית'],
      benefits: ['גילוי צריכה אלטרנטיבית', 'גישה לסדנאות'],
      activityType: ['יריד', 'סדנה', 'החלפה'],
      format: 'פיזי',
      commitment: 'חד-פעמי'
    },
    draws: ['meet', 'make', 'exchange'],
    connectedArtworks: [2, 3, 4],
    saves: 223,
    url: 'https://www.greenpeace.org/israel/',
    showCommunityMessage: true
  },

  // === מדיה וחינוך ===
  {
    id: 26,
    name: 'הסרטון "חשבת שחולצה ב-30 שקל?"',
    type: 'סרט תיעודי',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מרבע שעה',
    location: 'אונליין (ישראל)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(4),
    icon: '🎬',
    description: 'סרטון בעברית על המחיר האמיתי של האופנה — מהפורום הישראלי לאופנה מקיימת.',
    tags: {
      values: ['ראייה מערכתית'],
      benefits: ['מודעות צרכנית', 'חינוך על שרשרת אספקה'],
      activityType: ['וידאו', 'חינוך'],
      format: 'אונליין',
      commitment: 'חד-פעמי'
    },
    draws: ['explore'],
    connectedArtworks: [1, 4],
    saves: 456,
    url: 'https://www.sustainablefashionforum.com/',
    showCommunityMessage: false
  },
  {
    id: 27,
    name: 'פודקאסט "אלטרנטיבה" פרק 99',
    type: 'פודקאסט',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מרבע שעה',
    location: 'אונליין (ישראל)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(5),
    icon: '🎙️',
    description: 'פרק בעברית עם ד"ר מיטל פלג מזרחי על אופנה מקיימת ופסולת טקסטיל בגאנה.',
    tags: {
      values: ['ראייה מערכתית', 'מעורבות קהילתית'],
      benefits: ['הבנת המסע הגלובלי של פסולת', 'שיקולים אתיים'],
      activityType: ['פודקאסט', 'חינוך'],
      format: 'אונליין',
      commitment: 'חד-פעמי'
    },
    draws: ['explore'],
    connectedArtworks: [1, 4, 6],
    saves: 189,
    url: 'https://alternativabyuptous.podbean.com/',
    showCommunityMessage: false
  },

  // === קניות פיזיות ושווקים ===
  {
    id: 28,
    name: 'נחלת בנימין — רובע הבדים',
    type: 'אזור קניות',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'רבע שעה עד שעה',
    location: 'ליד שוק הכרמל, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '🧵',
    description: '30+ מוכרי בדים: עודפי ייצור, ריפוד וסיומות גלילים — עד 75% פחות.',
    tags: {
      values: ['מעגליות טכנית', 'מעורבות קהילתית'],
      benefits: ['מקור חומרים', 'שרשרת אספקה מקומית', 'גילוי עודפי ייצור'],
      activityType: ['קניות', 'חומרים', 'מקומי'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 2, 4],
    saves: 345,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },
  {
    id: 29,
    name: 'רה:קונספט',
    type: 'מרקטפלייס יד שנייה',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מרבע שעה',
    location: 'אונליין + 400 נקודות איסוף',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(0),
    icon: '📦',
    description: 'מרקטפלייס בין אנשים ליד שנייה, עם 400 לוקרים לאיסוף. המוכרים מקבלים 80%.',
    tags: {
      values: ['מעגליות טכנית', 'מעורבות קהילתית'],
      benefits: ['השתתפות בכלכלה מעגלית', 'החלפה נוחה'],
      activityType: ['מרקטפלייס', 'בין אנשים', 'דיגיטלי'],
      format: 'משולב',
      commitment: 'גמיש'
    },
    draws: ['exchange', 'witness'],
    connectedArtworks: [3, 5],
    saves: 567,
    url: 'https://thereconcept.com/',
    showCommunityMessage: false
  },
  {
    id: 30,
    name: 'אפליקציית Chelsy True Closet',
    type: 'אפליקציית וינטג׳',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מרבע שעה',
    location: 'תל אביב וגבעתיים',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(1),
    icon: '📱',
    description: 'אפליקציה לדפדוף בכ-7,000 פריטי וינטג׳ נבחרים מחנויות פיזיות.',
    tags: {
      values: ['מעגליות טכנית', 'חיבור פנימי'],
      benefits: ['יד שנייה איכותית', 'וינטג׳ מאוצר'],
      activityType: ['אפליקציה', 'וינטג׳', 'מאוצר'],
      format: 'משולב',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 2],
    saves: 234,
    url: 'https://chelsy.co.il/',
    showCommunityMessage: false
  },
  {
    id: 31,
    name: 'שוק הפשפשים ביפו',
    type: 'שוק פשפשים',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'ליד מגדל השעון, יפו',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '🏺',
    description: 'שוק הפשפשים הגדול בארץ: יפת, מרגוזה, עמיעד ועולי ציון.',
    tags: {
      values: ['מעורבות קהילתית', 'מעגליות טכנית'],
      benefits: ['תרבות שימוש חוזר אותנטית', 'מקור חומרים', 'מערכת אקולוגית של יד שנייה'],
      activityType: ['שוק', 'וינטג׳', 'תרבות'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange', 'meet'],
    connectedArtworks: [1, 4, 6],
    saves: 678,
    url: 'https://www.google.com/maps',
    showCommunityMessage: true
  },
  {
    id: 32,
    name: 'שוק הפשפשים בחיפה',
    type: 'שוק פשפשים',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'רחוב קיבוץ גלויות, חיפה',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🏛️',
    description: 'שוק בן 150+ שנה. שוק המוכרים בשבת (~120 דוכנים), הדוכן המיתולוגי "בובא זהבה".',
    tags: {
      values: ['מעורבות קהילתית', 'מעגליות טכנית'],
      benefits: ['תרבות שימוש חוזר היסטורית', 'היסטוריה של טקסטיל', 'יד שנייה אותנטית'],
      activityType: ['שוק', 'וינטג׳', 'היסטורי'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange', 'meet'],
    connectedArtworks: [1, 2, 6],
    saves: 345,
    url: 'https://www.instagram.com/flea_market_haifa/',
    showCommunityMessage: true
  },

  // === סדנאות ומרחבי יוצרים ===
  {
    id: 33,
    name: 'סדנת השדרוג של Dome',
    type: 'סדנת תיקון',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'תל אביב ואונליין',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(4),
    icon: '🧶',
    description: 'מפגשי תיקון פתוחים: תיקון יצירתי, טכניקות שדרוג והדרכה להארכת חיי בגדים.',
    tags: {
      values: ['מעגליות טכנית', 'כוונת התחדשות'],
      benefits: ['מיומנויות תיקון גלוי', 'הארכת חיי מוצר', 'פרקטיקה של אופנה איטית'],
      activityType: ['סדנה', 'יצירה', 'בניית מיומנויות'],
      format: 'משולב',
      commitment: 'בלי הרשמה'
    },
    draws: ['make', 'explore', 'meet'],
    connectedArtworks: [2, 3, 4],
    saves: 289,
    url: 'https://domeupcycling.com/',
    showCommunityMessage: true
  },
  {
    id: 34,
    name: 'תמ"י — Tel Aviv Makers Institute',
    type: 'מרחב יוצרים',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות לביקור',
    location: 'קיבוץ גלויות 45, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(5),
    icon: '🔧',
    description: 'מכונות תפירה, חיתוך לייזר, מדפסות תלת-ממד. גישה פתוחה ליוצרים.',
    tags: {
      values: ['מעגליות טכנית', 'מעורבות קהילתית'],
      benefits: ['אופנת DIY', 'ניסויי חומרים', 'גישה לכלים'],
      activityType: ['מרחב יוצרים', 'כלים', 'קהילה'],
      format: 'פיזי',
      commitment: 'מנוי גמיש'
    },
    draws: ['make', 'explore', 'meet'],
    connectedArtworks: [2, 3, 5],
    saves: 456,
    url: 'https://telavivmakers.org/',
    showCommunityMessage: true
  },
  {
    id: 35,
    name: 'MakeLab Israel',
    type: 'מרחב יוצרים',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות לביקור',
    location: 'אברהם גירון 3א, יהוד',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '⚙️',
    description: 'תפירה, חיתוך לייזר, הדפסה תלת-ממדית ומכונות CNC. גישה ציבורית עם ליווי.',
    tags: {
      values: ['מעגליות טכנית', 'מעורבות קהילתית'],
      benefits: ['מיומנויות יוצרים', 'גישה לפרוטוטייפ'],
      activityType: ['מרחב יוצרים', 'כלים', 'הדרכה'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [3, 5],
    saves: 234,
    url: 'https://www.makelab.org.il/',
    showCommunityMessage: false
  },
  {
    id: 36,
    name: 'ירוק מייקרספייס',
    type: 'מרחב יוצרים',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'רחובות',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '🪚',
    description: 'תפירה, חיתוך לייזר ועבודות עץ. קורסי מיומנויות יוצרים.',
    tags: {
      values: ['מעגליות טכנית'],
      benefits: ['פיתוח מיומנויות מלאכה', 'גישה לציוד'],
      activityType: ['מרחב יוצרים', 'קורסים'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [5, 6],
    saves: 167,
    url: 'https://makerspace.co.il/',
    showCommunityMessage: false
  },

  // === קורסי תפירה ומלאכה ===
  {
    id: 37,
    name: 'תפר Workshop',
    type: 'קורס תפירה',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'קורסים של 8 שבועות',
    location: 'תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🪡',
    description: 'קורסי תפירה לטווח קצר וארוך: מכונת תפירה, גזרות ואוברלוק.',
    tags: {
      values: ['מעגליות טכנית'],
      benefits: ['בניית בגדים', 'מיומנויות תיקון', 'שליטה בגזרות'],
      activityType: ['קורס', 'תפירה', 'מקצועי'],
      format: 'פיזי',
      commitment: '8 שבועות'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [1, 2],
    saves: 312,
    url: 'https://www.tefer-workshop.com/',
    showCommunityMessage: false
  },
  {
    id: 38,
    name: 'סטודיו בוטון',
    type: 'קורס תפירה',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'קורסים רב-מפגשיים',
    location: 'חומה ומגדל 16, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '🧵',
    description: 'מכונות תעשייתיות וביתיות, קבוצות קטנות, מדריכה בוגרת שנקר עם 25+ שנות ניסיון.',
    tags: {
      values: ['מעגליות טכנית'],
      benefits: ['מיומנויות תפירה מקצועיות', 'היכרות עם ציוד'],
      activityType: ['קורס', 'תפירה', 'מקצועי'],
      format: 'פיזי',
      commitment: 'רב-מפגשי'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [1, 2],
    saves: 234,
    url: 'https://www.boutonstudio.com/',
    showCommunityMessage: false
  },
  {
    id: 39,
    name: 'סטודיו FaMoMa',
    type: 'קורס תפירה',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'סדרת מפגשים',
    location: 'בזל 33, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(3),
    icon: '✂️',
    description: 'יסודות תפירה, גזרות ובניית בגדים. בעברית ובאנגלית.',
    tags: {
      values: ['מעגליות טכנית'],
      benefits: ['הוראה דו-לשונית', 'אווירה משפחתית'],
      activityType: ['קורס', 'תפירה', 'דו-לשוני'],
      format: 'פיזי',
      commitment: 'סדרת מפגשים'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [1, 2],
    saves: 189,
    url: 'https://studiofamoma.com/',
    showCommunityMessage: false
  },
  {
    id: 40,
    name: 'המתפרה',
    type: 'קורס תפירה',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'סדרת מפגשים',
    location: 'כיכר אתרים, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(4),
    icon: '👙',
    description: 'תפירה, גזרות, התמחות בבגדי ים ואקססוריז.',
    tags: {
      values: ['מעגליות טכנית'],
      benefits: ['התמחות בסוגי בגדים', 'מיקום על קו החוף'],
      activityType: ['קורס', 'תפירה', 'התמחות'],
      format: 'פיזי',
      commitment: 'סדרת מפגשים'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [3, 5],
    saves: 156,
    url: 'https://hamatpera.com/',
    showCommunityMessage: false
  },
  {
    id: 41,
    name: 'תפור עלי',
    type: 'סטודיו מלאכה',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'סדרת מפגשים',
    location: 'גנות האלה 80, מודיעין',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(5),
    icon: '🎨',
    description: 'תפירה, רקמה, סריגה וחרוזים — לילדים (8-12) ולמבוגרים.',
    tags: {
      values: ['מעגליות טכנית', 'חיבור פנימי'],
      benefits: ['מיומנויות בין-דוריות', 'מגוון מלאכות'],
      activityType: ['קורס', 'מלאכה', 'משפחה'],
      format: 'פיזי',
      commitment: 'סדרת מפגשים'
    },
    draws: ['make', 'meet'],
    connectedArtworks: [2, 6],
    saves: 123,
    url: 'https://www.tafuralai.com/',
    showCommunityMessage: true
  },
  {
    id: 42,
    name: 'הגילדה — סנדלרות',
    type: 'הכשרה מקצועית',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'סדנאות של כמה ימים',
    location: 'דרום תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '👟',
    description: 'סנדלרות ברמה עולמית בהובלת נינה רוזן (מאז 2007): נעלי ספורט, כובעים וחגורות עור.',
    tags: {
      values: ['מעגליות טכנית', 'חיבור פנימי'],
      benefits: ['טכניקות עור מסורתיות', 'חדשנות בחומרים', 'מיומנות מלאכה'],
      activityType: ['קורס', 'מלאכה', 'מקצועי'],
      format: 'פיזי',
      commitment: 'כמה ימים או קורסים'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [2, 5],
    saves: 267,
    url: 'https://www.google.com/search?q=HaGilda+shoemaking+tel+aviv',
    showCommunityMessage: false
  },
  {
    id: 43,
    name: 'בית האיכות בירושלים',
    type: 'סדנת מלאכה',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: '2.5-3 שעות',
    location: 'רחוב חברון 12, ירושלים',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '🏛️',
    description: '23 סדנאות כולל עיבוד עור — בבניין מהמאה ה-18. גלריה וסיורי גג.',
    tags: {
      values: ['מעגליות טכנית', 'חיבור פנימי'],
      benefits: ['מיקום היסטורי', 'אומנות מסורתית', 'חקירת חומרים'],
      activityType: ['סדנה', 'מורשת', 'סיור'],
      format: 'פיזי',
      commitment: 'מפגש אחד'
    },
    draws: ['make', 'explore', 'witness'],
    connectedArtworks: [2, 6],
    saves: 345,
    url: 'https://www.itraveljerusalem.com/ent/jerusalem-house-of-quality-workshops/',
    showCommunityMessage: false
  },

  // === מורשת תרבותית ===
  {
    id: 44,
    name: 'שדרה לקייה — אריגה בדואית',
    type: 'חוויה תרבותית',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות',
    location: 'לקייה, נגב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🪢',
    description: '38 נשים בדואיות שומרות על אריגה בת 4,000 שנה. חומרים טבעיים, צמר כבשי אווסי.',
    tags: {
      values: ['חיבור פנימי', 'מעורבות קהילתית', 'כוונת התחדשות'],
      benefits: ['טכניקות מסורתיות', 'העצמת נשים', 'צביעה טבעית'],
      activityType: ['תרבותי', 'מורשת', 'ביקור'],
      format: 'פיזי',
      commitment: 'בתיאום מראש'
    },
    draws: ['explore', 'meet', 'witness'],
    connectedArtworks: [4, 6],
    saves: 412,
    url: 'https://sidreh.org/',
    showCommunityMessage: true
  },
  {
    id: 45,
    name: 'בן ציון דוד — אומנות תימנית',
    type: 'חוויה תרבותית',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: '2-3 שעות',
    location: 'יפו העתיקה',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '✨',
    description: 'דור 8 של פיליגרן ורקמה. מסורות תימניות שכמעט נכחדו.',
    tags: {
      values: ['חיבור פנימי', 'כוונת התחדשות'],
      benefits: ['שימור מלאכת אבות', 'מורשת תרבותית'],
      activityType: ['תרבותי', 'מורשת', 'סדנה'],
      format: 'פיזי',
      commitment: 'בתיאום מראש'
    },
    draws: ['make', 'explore', 'witness'],
    connectedArtworks: [2, 6],
    saves: 289,
    url: 'https://www.google.com/search?q=Ben+Zion+David+Old+Jaffa',
    showCommunityMessage: false
  },

  // === חנויות וינטג׳ ===
  {
    id: 46,
    name: 'Flashback Vintage',
    type: 'חנות וינטג׳',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'רבע שעה עד שעה',
    location: 'קינג ג׳ורג׳ 72 ושינקין 33, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(3),
    icon: '👗',
    description: 'וינטג׳ מקורי מהשנים 50-90. מחירי ביניים.',
    tags: {
      values: ['מעגליות טכנית', 'חיבור פנימי'],
      benefits: ['וינטג׳ מאוצר', 'יד שנייה איכותית'],
      activityType: ['קניות', 'וינטג׳'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 2],
    saves: 456,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },
  {
    id: 47,
    name: 'ארגמן — וינטג׳ לוקסוס',
    type: 'וינטג׳ יוקרה',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'רבע שעה עד שעה',
    location: 'ליד אדרת, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(4),
    icon: '💎',
    description: 'יד שנייה של מותגי יוקרה: גוצ׳י, שאנל ופריטי מעצבים. בקצה הגבוה של הסקאלה.',
    tags: {
      values: ['מעגליות טכנית', 'מעורבות קהילתית'],
      benefits: ['יוקרה מעגלית', 'יד שנייה ברמה גבוהה'],
      activityType: ['קניות', 'יוקרה', 'יד שנייה'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 5],
    saves: 234,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },
  {
    id: 48,
    name: 'Buy Kilo Vintage',
    type: 'חנות וינטג׳',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'רבע שעה עד שעה',
    location: 'רחוב מונטיפיורי, תל אביב',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(5),
    icon: '⚖️',
    description: 'בגדי וינטג׳ במחיר לפי משקל. נגיש לכיס.',
    tags: {
      values: ['מעגליות טכנית'],
      benefits: ['יד שנייה במחיר נגיש', 'ציד אוצרות'],
      activityType: ['קניות', 'וינטג׳', 'בתקציב'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 3],
    saves: 567,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },
  {
    id: 49,
    name: 'Loni Vintage',
    type: 'וינטג׳ יוקרה',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'רבע שעה עד שעה',
    location: 'יועזר 6, יפו',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '👠',
    description: 'וינטג׳ יוקרה ופריטי מעצבים. בקצה הגבוה.',
    tags: {
      values: ['מעגליות טכנית', 'חיבור פנימי'],
      benefits: ['וינטג׳ יוקרה מאוצר', 'פריטי השקעה איכותיים'],
      activityType: ['קניות', 'יוקרה', 'וינטג׳'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 2],
    saves: 312,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },
  {
    id: 50,
    name: 'גולדה יד שנייה',
    type: 'חנות וינטג׳',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'שעה–3 שעות עם הנסיעה',
    location: 'הרצליה',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '🏡',
    description: 'וינטג׳ בבית משנות ה-20 של המאה הקודמת. מבצעי "10 שקל" מפורסמים.',
    tags: {
      values: ['מעגליות טכנית', 'חיבור פנימי'],
      benefits: ['מיקום היסטורי', 'מציאות זולות'],
      activityType: ['קניות', 'וינטג׳', 'חוויה'],
      format: 'פיזי',
      commitment: 'יציאה לכל היום'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 6],
    saves: 289,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },

  // === אקדמיה ומקצוע ===
  {
    id: 51,
    name: 'שנקר — המחלקה לעיצוב אופנה',
    type: 'תוכנית אקדמית',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'תואר 4 שנים',
    location: 'רמת גן',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🎓',
    description: 'תואר B.Des בן 4 שנים עם מסלול קיימות "Rebooting Fashion", פרויקט FISHSkin ומרכז החדשנות CIRTex.',
    tags: {
      values: ['מעגליות טכנית', 'ראייה מערכתית'],
      benefits: ['הכשרה מקצועית באופנה מקיימת', 'קישורים לתעשייה'],
      activityType: ['תואר', 'אקדמי', 'מקצועי'],
      format: 'פיזי',
      commitment: '4 שנים'
    },
    draws: ['explore', 'make', 'meet'],
    connectedArtworks: [2, 4, 5],
    saves: 412,
    url: 'https://www.shenkar.ac.il/en/departments/design-fashion-department/',
    showCommunityMessage: false
  },
  {
    id: 52,
    name: 'בצלאל — עיצוב מקיים',
    type: 'קורס אקדמי',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'סמסטר/שנה',
    location: 'ירושלים (קמפוס מנדל)',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '📐',
    description: '"עיצוב מקיים ופיתוח" (באנגלית). פוקוס על Slow Design וייצור מקומי.',
    tags: {
      values: ['ראייה מערכתית', 'מעגליות טכנית'],
      benefits: ['רצינות אקדמית', 'חינוך עיצובי', 'חשיבה מערכתית'],
      activityType: ['קורס', 'אקדמי', 'עיצוב'],
      format: 'פיזי',
      commitment: 'סמסטר+'
    },
    draws: ['explore', 'make'],
    connectedArtworks: [4, 5, 6],
    saves: 234,
    url: 'https://www.bezalel.ac.il/en/',
    showCommunityMessage: false
  },
  {
    id: 53,
    name: 'האקדמיה הירוקה — אופנה מקיימת',
    type: 'קורס מקצועי',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'קורס של 8 שבועות',
    location: 'אונליין (בעברית)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🌿',
    description: '8 מפגשים החל מ-19 באפריל 2026 (20:00-21:30). שדרוג, אפס פסולת וחומרים חדשניים. 3,900 ש"ח.',
    tags: {
      values: ['ראייה מערכתית', 'מעגליות טכנית'],
      benefits: ['פיתוח מקצועי', 'שיתוף עם בר-אילן', 'תוכנית יזמות ירוקה של האיחוד האירופי'],
      activityType: ['קורס', 'מקצועי', 'אונליין'],
      format: 'אונליין',
      commitment: '8 שבועות'
    },
    draws: ['explore', 'meet'],
    connectedArtworks: [2, 4],
    saves: 178,
    url: 'https://greenacademy.co.il/courses/sustain_fashion/',
    showCommunityMessage: true
  },

  // === קהילה והתנדבות ===
  {
    id: 54,
    name: 'הפורום הישראלי לאופנה מקיימת',
    type: 'פורום קהילתי',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'אירועים של שעה–3',
    location: 'תל אביב ואונליין',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(4),
    icon: '🤝',
    description: 'פורומים פתוחים, הרצאות, הקרנות של "The True Cost" ופרויקט ספריית הבגדים. הוקם בספטמבר 2016.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['קישורים לתעשייה', 'אירועים חינמיים/בהמלצת תרומה', 'בניית קהילה'],
      activityType: ['פורום', 'קהילה', 'אירועים'],
      format: 'משולב',
      commitment: 'חברות מתמשכת'
    },
    draws: ['meet', 'explore', 'amplify'],
    connectedArtworks: [1, 4],
    saves: 534,
    url: 'https://www.sustainablefashionforum.com/',
    showCommunityMessage: true
  },
  {
    id: 55,
    name: 'התנדבות ב-Fashion Revolution ישראל',
    type: 'תפקיד התנדבותי',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'מתמשך',
    location: 'משולב (תל אביב + אונליין)',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(5),
    icon: '✊',
    description: 'תפקידי התנדבות לקראת שבוע Fashion Revolution וקמפיינים מתמשכים.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית'],
      benefits: ['מיומנויות אקטיביזם', 'השתתפות בקמפיינים', 'רשת גלובלית'],
      activityType: ['התנדבות', 'אקטיביזם', 'קמפיין'],
      format: 'משולב',
      commitment: 'מתמשך'
    },
    draws: ['amplify', 'meet', 'explore'],
    connectedArtworks: [1, 4],
    saves: 189,
    url: 'https://www.fashionrevolution.org/asia/israel/',
    showCommunityMessage: true
  },
  {
    id: 56,
    name: 'התנדבות באופנה בגרינפיס ישראל',
    type: 'תפקיד התנדבותי',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'מתמשך',
    location: 'משולב (ישראל + אונליין)',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(6),
    icon: '🌍',
    description: 'שווקי פופ-אפ ליד שנייה, סנגור וחקירת פסולת טקסטיל.',
    tags: {
      values: ['מעורבות קהילתית', 'ראייה מערכתית', 'כוונת התחדשות'],
      benefits: ['ניסיון אקטיביסטי', 'מעורבות במדיניות', 'ארגון קהילתי'],
      activityType: ['התנדבות', 'אקטיביזם', 'שווקים'],
      format: 'משולב',
      commitment: 'מתמשך'
    },
    draws: ['amplify', 'meet', 'exchange'],
    connectedArtworks: [4, 6],
    saves: 234,
    url: 'https://www.greenpeace.org/israel/act/fashion/',
    showCommunityMessage: true
  },
  {
    id: 57,
    name: 'המציון — עסק חברתי',
    type: 'עסק חברתי',
    energyLevel: 'hands-on',
    energyLabel: 'בעניין',
    commitment: 'גמיש',
    location: 'רמת גן וירושלים',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '💜',
    description: 'להתנדב/לתרום/לקנות בחנויות יד שנייה שמעסיקות אנשים עם מוגבלויות.',
    tags: {
      values: ['מעורבות קהילתית', 'כוונת התחדשות'],
      benefits: ['השפעה חברתית במפגש עם כלכלה מעגלית', 'תעסוקה מכלילה'],
      activityType: ['עסק חברתי', 'התנדבות', 'קניות'],
      format: 'פיזי',
      commitment: 'גמיש'
    },
    draws: ['meet', 'exchange', 'amplify'],
    connectedArtworks: [1, 4],
    saves: 345,
    url: 'https://hamezion.co.il/en/',
    showCommunityMessage: true
  },

  // === חדשנות ומחקר ===
  {
    id: 58,
    name: 'Re-Fresh Global / Re-Born Textiles',
    type: 'מרכז חדשנות',
    energyLevel: 'deep-work',
    energyLabel: 'צלילה פנימה',
    commitment: 'יצירת קשר לשותפות',
    location: 'מרכז קיפוד, כפר סבא',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🔬',
    description: 'טכנולוגיית SMART-UP™ — הפיכה אנזימטית של פסולת טקסטיל לחוט. 10 טון בשבועות פיילוט.',
    tags: {
      values: ['מעגליות טכנית', 'כוונת התחדשות'],
      benefits: ['שינוי פסולת בקנה מידה תעשייתי', 'גישה לחדשנות'],
      activityType: ['חדשנות', 'מחקר', 'שותפות'],
      format: 'פיזי',
      commitment: 'שותפות'
    },
    draws: ['explore', 'meet'],
    connectedArtworks: [2, 4],
    saves: 156,
    url: 'https://re-fresh.global/',
    showCommunityMessage: false
  },
  {
    id: 59,
    name: 'תעשיות מיחזור KMM',
    type: 'תשתית מיחזור',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'פחות מ-5 דקות',
    location: 'מכלים ברחבי הארץ',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '♻️',
    description: 'מכלי איסוף לטקסטיל. במצב טוב→שימוש חוזר; שחוק→סמרטוטים; צמר/אקריליק→מיחזור.',
    tags: {
      values: ['מעגליות טכנית'],
      benefits: ['תשתית עירונית', 'גישה לתרומת טקסטיל'],
      activityType: ['תרומה', 'מיחזור', 'תשתית'],
      format: 'פיזי',
      commitment: 'חד-פעמי'
    },
    draws: ['exchange', 'amplify'],
    connectedArtworks: [4],
    saves: 678,
    url: 'https://kmm.org.il/textile-recycling/?lang=en',
    showCommunityMessage: false
  },
  {
    id: 60,
    name: 'מחקר Algaeing',
    type: 'מחקר חדשנות',
    energyLevel: 'low-key',
    energyLabel: 'בקטנה',
    commitment: 'רבע שעה של מחקר',
    location: 'קיבוץ קטורה',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🧬',
    description: 'סיבים מתכלים וצבעים טבעיים מאצות. הפחתה של 80% במים, אפס פסולת.',
    tags: {
      values: ['מעגליות טכנית', 'כוונת התחדשות'],
      benefits: ['חומרים מקיימים מהדור הבא', 'חדשנות ביו-חומרים'],
      activityType: ['מחקר', 'חדשנות'],
      format: 'מחקר אונליין',
      commitment: 'גמיש'
    },
    draws: ['explore'],
    connectedArtworks: [2, 6],
    saves: 234,
    url: 'https://www.google.com/search?q=Algaeing+Renana+Krebs',
    showCommunityMessage: false
  }
];
