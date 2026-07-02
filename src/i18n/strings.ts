export type Lang = 'en' | 'he';

const en = {
  // Tabs / nav
  tab_discover: 'Discover',
  tab_artworks: 'Artworks',
  mode_act: 'act',
  mode_impact: 'impact',
  mode_cashback: 'Cash back',

  // Header
  app_title: 'The Circle',
  app_tagline: 'Designing New Realities',
  app_intro: 'Tap below to tailor the initiatives to your rhythm',

  // CTAs
  shuffle_cta: 'Just show me something',
  or_refine: 'or refine',
  ready_cta: 'Ready to see what suits you?',
  vibe_loading: 'Reading your climate vibe…',
  show_me_all: 'Skip — show me all',
  adapted_for_you: 'Adapted to your preferences',

  // Filter sections
  section_draws: 'What draws you',
  section_energy: 'How to show up',
  section_where: 'Where',
  section_artwork: 'Artwork',
  artwork_hint: 'Tap the artworks that resonate with you',

  // Results
  of_word: 'of',
  activities_word: 'activities',
  works_word: 'works',
  show_all: 'Show all',
  no_activities: 'No activities match your current filters.',
  no_activities_hint: 'Try adjusting your preferences above.',

  // Activity card
  values_label: 'Values',
  benefits_label: 'Benefits',
  more_word: 'more',
  view_details: 'View details',
  hide_details: 'Hide details',
  activity_type_label: 'Activity type',
  all_benefits_label: 'All benefits',
  format_commitment_label: 'Format & Commitment',
  close_circle: 'Close this circle',

  // Location filter
  in_person: '📍 In Person',
  online: '🌐 Online',
  physical_activities: 'Physical Activities',
  digital_activities: 'Digital Activities',
  near_label: 'Near:',
  reach_label: 'Reach:',
  israel_based: '🇮🇱 Israel-based',
  international: '🌍 International',

  // Welcome
  welcome_h1_line1: 'The exhibition sparked it.',
  welcome_h1_line2: 'You keep it alive.',
  welcome_sub: 'Every circle you close opens new ones',
  start_exploring: 'Start exploring',

  // Ripple
  ripple_community: 'This circle exists because others closed circles before',
  ripple_close_cta: 'Close this circle →',
  ripple_your_turn: 'Your turn keeps it growing',
  ripple_done_1: 'Every circle you close',
  ripple_done_2: 'opens new ones',

  // Artworks view
  artworks_title: 'Revisit Your Favorite Artworks',
  artworks_subtitle: 'The Exhibition Catalogue',
  search_placeholder: 'Search artworks, artists, themes…',
  filter_theme: 'Theme',
  filter_space: 'Space',
  all_prefix: 'All',
  no_artworks: 'No artworks match your filters.',
  reset_word: 'Reset',

  // Detail panel
  now_viewing: 'Now viewing',
  about_work: 'About the work',
  about_artist: 'About the artist',
  read_watch: 'Read & watch',
  select_work: 'Select this work',
  selected_remove: 'Selected — tap to remove',

  // Impact
  items_second_life: 'items given a second life',
  out_of_landfill: 'out of landfill',
  washing_machines: 'washing machines not melted down',
  where_happened: 'Where this happened',
  live_now: 'Live — the circle right now',
  actions_today: 'actions today',
  ripples_outward: 'Every action ripples outward',

  // Language toggle
  lang_en: 'EN',
  lang_he: 'עב',
};

const he: typeof en = {
  tab_discover: 'גילוי',
  tab_artworks: 'יצירות',
  mode_act: 'נכנסים למעגל',
  mode_impact: 'השפעה בשטח',
  mode_cashback: 'מרוויחים בחזרה',

  app_title: 'המעגל',
  app_tagline: 'מעצבים מציאות חדשה',
  app_intro: 'בחרו קטגוריה כדי להתאים את היוזמות בדיוק אליכם',

  shuffle_cta: 'פשוט הציעו לי משהו',
  or_refine: 'או דייקו',
  ready_cta: 'מוכנים לראות מה מתאים לכם?',
  vibe_loading: 'קוראים את הוייב הסביבתי שלכם…',
  show_me_all: 'דלג, הראו לי הכל',
  adapted_for_you: 'מותאם להעדפות שלך',

  section_draws: 'מה מושך אותך',
  section_energy: 'מידת המחויבות שלך',
  section_where: 'המימד הכי נוח לך',
  section_artwork: 'היצירות שהכי דיברו אליך',
  artwork_hint: 'געו ביצירות שמהדהדות עבורכם',

  of_word: 'מתוך',
  activities_word: 'פעילויות',
  works_word: 'יצירות',
  show_all: 'הצג הכל',
  no_activities: 'אין פעילויות שתואמות את הסינון.',
  no_activities_hint: 'נסו לשנות את ההעדפות למעלה.',

  values_label: 'ערכים',
  benefits_label: 'תועלות',
  more_word: 'נוספות',
  view_details: 'הצג פרטים',
  hide_details: 'הסתר פרטים',
  activity_type_label: 'סוג פעילות',
  all_benefits_label: 'כל התועלות',
  format_commitment_label: 'פורמט ומחויבות',
  close_circle: 'סגרו את המעגל',

  in_person: '📍 פיזי',
  online: '🌐 אונליין',
  physical_activities: 'פעילויות פיזיות',
  digital_activities: 'פעילויות דיגיטליות',
  near_label: 'בקרבת:',
  reach_label: 'טווח:',
  israel_based: '🇮🇱 מבוסס ישראל',
  international: '🌍 בינלאומי',

  welcome_h1_line1: 'התערוכה הציתה את הניצוץ.',
  welcome_h1_line2: 'אתם שומרים אותו דולק.',
  welcome_sub: 'כל מעגל שאתם סוגרים פותח חדשים',
  start_exploring: 'יוצאים לחקור',

  ripple_community: 'המעגל הזה קיים כי אחרים סגרו מעגלים לפניכם',
  ripple_close_cta: 'סגרו את המעגל הזה ←',
  ripple_your_turn: 'התור שלכם להמשיך לצמוח',
  ripple_done_1: 'כל מעגל שאתם סוגרים',
  ripple_done_2: 'פותח חדשים',

  artworks_title: 'חזרו ליצירות האהובות',
  artworks_subtitle: 'קטלוג התערוכה',
  search_placeholder: 'חיפוש יצירות, אמנים, נושאים…',
  filter_theme: 'נושא',
  filter_space: 'מרחב',
  all_prefix: 'כל ה',
  no_artworks: 'אין יצירות התואמות לסינון.',
  reset_word: 'איפוס',

  now_viewing: 'מציגים כעת',
  about_work: 'על היצירה',
  about_artist: 'על האמן/ית',
  read_watch: 'לקרוא ולצפות',
  select_work: 'בחרו ביצירה',
  selected_remove: 'נבחר — לחצו להסרה',

  items_second_life: 'פריטים שזכו לחיים שניים',
  out_of_landfill: 'מחוץ למטמנה',
  washing_machines: 'מכונות כביסה שלא הותכו',
  where_happened: 'איפה זה קרה',
  live_now: 'בשידור חי — המעגל כעת',
  actions_today: 'פעולות היום',
  ripples_outward: 'כל פעולה גולשת החוצה',

  lang_en: 'EN',
  lang_he: 'עב',
};

export const strings = { en, he };
export type StringKey = keyof typeof en;
