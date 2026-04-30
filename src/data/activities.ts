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
  draws: string[]; // matches drawOptions ids
  connectedArtworks: number[]; // artwork ids
  saves: number;
  url: string;
  showCommunityMessage: boolean;
}

export const drawOptions = [
  { id: 'explore', icon: '🌱', label: 'Explore & learn' },
  { id: 'meet', icon: '🤝', label: 'Meet people' },
  { id: 'make', icon: '🛠️', label: 'Make things' },
  { id: 'amplify', icon: '📣', label: 'Amplify voices' },
  { id: 'exchange', icon: '🔄', label: 'Exchange' },
  { id: 'witness', icon: '👁️', label: 'Just looking' }
];

export const energyOptions = [
  { id: 'low-key', icon: '🪶', label: 'Low key', time: 'Minutes to an hour' },
  { id: 'hands-on', icon: '🔥', label: 'Hands-on', time: 'A few hours' },
  { id: 'deep-work', icon: '💪', label: 'Deep work', time: 'Ongoing commitment' }
];

export type ArtworkTheme =
  | 'Textile Waste'
  | 'Material Reinvention'
  | 'Upcycling'
  | 'Ocean & Plastic'
  | 'Urban Systems'
  | 'Living Systems';

export type ArtworkSpace =
  | 'Main Hall'
  | 'East Wing'
  | 'Outdoor Garden'
  | 'Lower Gallery'
  | 'Project Room';

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
  'Textile Waste',
  'Material Reinvention',
  'Upcycling',
  'Ocean & Plastic',
  'Urban Systems',
  'Living Systems',
];

export const artworkSpaces: ArtworkSpace[] = [
  'Main Hall',
  'East Wing',
  'Outdoor Garden',
  'Lower Gallery',
  'Project Room',
];

export const artworks: Artwork[] = [
  {
    id: 1,
    name: 'Mitumba',
    artist: 'Maya Arazi & Merav Gazit',
    image: mitumbaImg,
    gallery: [mitumbaImg, mitumbaImg, mitumbaImg],
    theme: 'Textile Waste',
    space: 'Main Hall',
    year: '2024',
    medium: 'Reclaimed garments, mixed textiles, steel armature',
    about:
      'Mitumba traces the global afterlife of donated clothing — the bales of secondhand garments shipped from the Global North to East African markets. The work reconstructs these flows as a sculptural archive, asking who carries the weight of our discarded wardrobes.',
    artistBio:
      'Maya Arazi and Merav Gazit are Tel Aviv–based designers working at the intersection of textile research and material activism. Their practice investigates colonial supply chains and the hidden geographies of fashion waste.',
    links: [
      { label: 'Interview — Designboom', url: 'https://www.designboom.com', type: 'interview' },
      { label: 'Artist page', url: 'https://www.instagram.com/', type: 'artist' },
      { label: 'Press feature — Globes', url: 'https://www.globes.co.il', type: 'press' },
    ],
  },
  {
    id: 2,
    name: 'Insects Typology',
    artist: 'Ori Orisun Merhav',
    image: insectsTypologyImg,
    gallery: [insectsTypologyImg, insectsTypologyImg],
    theme: 'Living Systems',
    space: 'East Wing',
    year: '2023',
    medium: 'Cochineal pigment, silk, bio-resin, archival print',
    about:
      'A taxonomic study of the insects that have shaped textile colour for centuries. The work reframes pigment-producing species as collaborators rather than resources, proposing a more reciprocal relationship between dye, material, and ecosystem.',
    artistBio:
      'Ori Orisun Merhav is a designer and researcher whose practice focuses on biological materials and the cultural histories of colour. She teaches at Bezalel Academy of Arts and Design.',
    links: [
      { label: 'Studio interview', url: 'https://www.dezeen.com', type: 'interview' },
      { label: 'Artist website', url: 'https://www.oriorisunmerhav.com', type: 'artist' },
      { label: 'Lecture — Vimeo', url: 'https://vimeo.com', type: 'video' },
    ],
  },
  {
    id: 3,
    name: 'Kitepride',
    artist: 'Matthias and Tabea Oppliger',
    image: kiteprideImg,
    gallery: [kiteprideImg, kiteprideImg, kiteprideImg],
    theme: 'Upcycling',
    space: 'Outdoor Garden',
    year: '2022',
    medium: 'Decommissioned kitesurfing sails, webbing, hardware',
    about:
      'Kitepride salvages broken kitesurfing sails from beaches around the Mediterranean and reworks them into functional bags and accessories. The exhibition piece is a suspended canopy made from one full season of retired sails.',
    artistBio:
      'Matthias and Tabea Oppliger founded Kitepride in Tel Aviv in 2014 as a social enterprise employing people on the margins of the Israeli labour market. Today the studio operates as a fully circular workshop.',
    links: [
      { label: 'Founders interview', url: 'https://www.kitepride.com/blogs', type: 'interview' },
      { label: 'Brand site', url: 'https://www.kitepride.com', type: 'web' },
      { label: 'Documentary clip', url: 'https://www.youtube.com', type: 'video' },
    ],
  },
  {
    id: 4,
    name: 'Plastic Rivers',
    artist: 'Álvaro Catalán de Ocón',
    image: plasticRiversImg,
    gallery: [plasticRiversImg, plasticRiversImg],
    theme: 'Ocean & Plastic',
    space: 'Lower Gallery',
    year: '2021',
    medium: 'Hand-knotted rugs, recycled PET yarn',
    about:
      'A series of rugs whose patterns map the ten rivers carrying the largest volumes of plastic waste into the world\'s oceans. Each rug is woven from yarn spun from the same kind of plastic those rivers transport.',
    artistBio:
      'Álvaro Catalán de Ocón is a Madrid-based industrial designer known for the PET Lamp project. His work bridges craft traditions with contemporary environmental concerns.',
    links: [
      { label: 'Dezeen interview', url: 'https://www.dezeen.com', type: 'interview' },
      { label: 'Studio website', url: 'https://www.acdo.es', type: 'artist' },
      { label: 'Project film', url: 'https://vimeo.com', type: 'video' },
    ],
  },
  {
    id: 5,
    name: 'City Transformer',
    artist: 'Nimrod Eliezer',
    image: cityTransformerImg,
    gallery: [cityTransformerImg, cityTransformerImg, cityTransformerImg],
    theme: 'Urban Systems',
    space: 'Project Room',
    year: '2024',
    medium: 'Steel, recycled aluminium, electronics',
    about:
      'A 1:1 prototype of a folding electric micro-vehicle designed for dense Mediterranean cities. The piece is presented alongside the parts library that allows it to be repaired and remanufactured indefinitely.',
    artistBio:
      'Nimrod Eliezer is an industrial designer and co-founder of City Transformer, working on circular mobility systems for urban environments.',
    links: [
      { label: 'Founder interview', url: 'https://www.calcalist.co.il', type: 'interview' },
      { label: 'Company site', url: 'https://citytransformer.com', type: 'web' },
    ],
  },
  {
    id: 6,
    name: 'Living Root Bridges',
    artist: 'Meghalaya district',
    image: livingRootBridgesImg,
    gallery: [livingRootBridgesImg, livingRootBridgesImg],
    theme: 'Living Systems',
    space: 'Main Hall',
    year: 'Ongoing',
    medium: 'Photographic documentation, woven Ficus elastica roots',
    about:
      'A documentation of the centuries-old practice of guiding fig tree roots across rivers to form living bridges in Meghalaya, India. The bridges grow stronger with use and age — a counter-image to the disposable infrastructures of modernity.',
    artistBio:
      'A collaborative project documenting the Khasi and Jaintia communities of Meghalaya, whose intergenerational knowledge has shaped these living structures for over five centuries.',
    links: [
      { label: 'Field interview', url: 'https://www.bbc.com', type: 'interview' },
      { label: 'Research archive', url: 'https://www.livingrootbridges.com', type: 'web' },
      { label: 'Documentary', url: 'https://www.youtube.com', type: 'video' },
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
  // === GLOBAL ONLINE ACTIVITIES ===
  {
    id: 1,
    name: 'Redress Design Award 2026 Application',
    type: 'Competition',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Multi-month design process',
    location: 'Online (Global)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(0),
    icon: '🏆',
    description: "World's largest sustainable fashion design competition. Applications open annually ~January.",
    tags: {
      values: ['Technical Circularity', 'Community Engagement'],
      benefits: ['Career-changing prizes', 'Hong Kong bootcamp + runway show', 'Global exposure'],
      activityType: ['Competition', 'Design', 'Portfolio'],
      format: 'Online',
      commitment: 'Multi-month'
    },
    draws: ['make', 'meet', 'amplify'],
    connectedArtworks: [1, 3],
    saves: 234,
    url: 'https://2025.redressdesignaward.com/',
    showCommunityMessage: false
  },
  {
    id: 2,
    name: 'Fashion Revolution Global (@fash_rev)',
    type: 'Social Follow',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Online (Global)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(1),
    icon: '📱',
    description: "Follow world's largest fashion activism movement. Daily content on transparency & justice. 529K followers.",
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Global campaign updates', 'Activist inspiration', '#WhoMadeMyClothes participation'],
      activityType: ['Social Media', 'Activism', 'Education'],
      format: 'Online',
      commitment: 'Flexible'
    },
    draws: ['amplify', 'explore'],
    connectedArtworks: [1, 4],
    saves: 529,
    url: 'https://www.instagram.com/fash_rev/',
    showCommunityMessage: true
  },
  {
    id: 3,
    name: 'Fashion Revolution Week Global',
    type: 'Annual Event',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours per event',
    location: 'Online + 80 countries',
    locationFormat: 'hybrid',
    region: 'global',
    gradient: getGradient(2),
    icon: '🌍',
    description: 'Annual week of action: Mend in Public, #WhoMadeMyClothes, local/virtual events worldwide. April 2026.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Global solidarity', 'Activist skills', 'Campaign participation'],
      activityType: ['Events', 'Social Media', 'Activism'],
      format: 'Hybrid',
      commitment: 'One week annually'
    },
    draws: ['amplify', 'meet', 'make'],
    connectedArtworks: [1, 2, 4],
    saves: 412,
    url: 'https://www.fashionrevolution.org/frw-25/',
    showCommunityMessage: true
  },
  {
    id: 4,
    name: 'Fashion Revolution Newsletter',
    type: 'Newsletter',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Online (Global)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(3),
    icon: '📧',
    description: 'Bi-weekly updates on campaigns, resources, global activism.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Campaign updates', 'Resource access', 'Global network'],
      activityType: ['Newsletter', 'Education'],
      format: 'Online',
      commitment: 'Bi-weekly'
    },
    draws: ['explore', 'amplify'],
    connectedArtworks: [4],
    saves: 189,
    url: 'https://www.fashionrevolution.org/about/get-involved/',
    showCommunityMessage: false
  },
  {
    id: 5,
    name: 'FutureLearn: Fashion and Sustainability Course',
    type: 'Free Course',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: 'Multi-week, self-paced',
    location: 'Online (Global)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(4),
    icon: '🎓',
    description: 'Free online course from UK universities on sustainable fashion fundamentals.',
    tags: {
      values: ['Systems Awareness', 'Technical Circularity'],
      benefits: ['Academic rigor', 'Self-paced learning', 'Industry overview'],
      activityType: ['Course', 'Education', 'Self-paced'],
      format: 'Online',
      commitment: 'Multi-week'
    },
    draws: ['explore'],
    connectedArtworks: [2, 4],
    saves: 567,
    url: 'https://www.futurelearn.com/courses/fashion-and-sustainability',
    showCommunityMessage: false
  },
  {
    id: 6,
    name: 'Centre for Sustainable Fashion Online Courses',
    type: 'Course Series',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: 'Course-based, varies',
    location: 'Online (Global)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(5),
    icon: '📚',
    description: 'Fashion Values, Fashion Economy, Nature/Society/Economy/Cultures courses by world-leading researchers at UAL.',
    tags: {
      values: ['Systems Awareness', 'Regenerative Intention'],
      benefits: ['University of the Arts London quality', 'Design thinking challenges', 'Expert teaching'],
      activityType: ['Course', 'Academic', 'Research'],
      format: 'Online',
      commitment: 'Varies'
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
    type: 'Online Academy',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: 'Self-paced',
    location: 'Online (Global)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(6),
    icon: '👗',
    description: 'Affordable online courses on sustainable fashion business: purpose, create, grow, communicate.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Small business focus', 'Guest expert interviews', 'Special community'],
      activityType: ['Course', 'Business', 'Community'],
      format: 'Online',
      commitment: 'Self-paced'
    },
    draws: ['explore', 'meet'],
    connectedArtworks: [1, 3],
    saves: 156,
    url: 'https://thewardrobecrisis.com/academy',
    showCommunityMessage: true
  },
  {
    id: 8,
    name: 'Falmouth University: Sustainable Fashion MA',
    type: "Master's Degree",
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: '2-year part-time',
    location: 'Online (Global)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(0),
    icon: '🎓',
    description: "Master's degree in Sustainable Fashion. £12,150 total, payment plans available.",
    tags: {
      values: ['Systems Awareness', 'Technical Circularity'],
      benefits: ['Accredited degree', 'Professional qualification', 'Online flexibility'],
      activityType: ['Degree', 'Academic', 'Professional'],
      format: 'Online',
      commitment: '2 years'
    },
    draws: ['explore', 'make'],
    connectedArtworks: [2, 4, 5],
    saves: 89,
    url: 'https://www.falmouth.ac.uk/study/online/postgraduate/sustainable-fashion',
    showCommunityMessage: false
  },

  // === SOCIAL MEDIA TO FOLLOW ===
  {
    id: 9,
    name: '@dressed_to_save_the_world',
    type: 'Social Follow',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Online (Global)',
    locationFormat: 'digital',
    region: 'global',
    gradient: getGradient(1),
    icon: '📱',
    description: 'Research-driven sustainable fashion advocate Meital Peleg Mizrachi. Slow fashion education.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Critical consumption patterns', 'Fashion industry critique'],
      activityType: ['Social Media', 'Education'],
      format: 'Online',
      commitment: 'Flexible'
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
    type: 'Social Follow',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Online (Israel)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(2),
    icon: '📱',
    description: "Israeli Sustainable Fashion Forum's Instagram community.",
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Industry connections', 'Educational content'],
      activityType: ['Social Media', 'Community'],
      format: 'Online',
      commitment: 'Flexible'
    },
    draws: ['witness', 'amplify'],
    connectedArtworks: [1, 2],
    saves: 145,
    url: 'https://www.instagram.com/sustainable_fashion_forum/',
    showCommunityMessage: true
  },
  {
    id: 11,
    name: '@tombekerdesigns (Tom Beker)',
    type: 'Designer Follow',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Online (Negev-based)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🪂',
    description: 'Upcycled streetwear from parachutes, tarps, kites. Negev-based designer.',
    tags: {
      values: ['Technical Circularity', 'Regenerative Intention'],
      benefits: ['Material transformation inspiration', 'Maximalist upcycling'],
      activityType: ['Social Media', 'Design Inspiration'],
      format: 'Online',
      commitment: 'Flexible'
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
    type: 'Social Follow',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Haifa, Israel',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(4),
    icon: '🛍️',
    description: "Vintage and secondhand community updates for Haifa's flea market.",
    tags: {
      values: ['Community Engagement', 'Technical Circularity'],
      benefits: ['Local reuse culture', 'Secondhand discovery'],
      activityType: ['Social Media', 'Local'],
      format: 'Online',
      commitment: 'Flexible'
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
    type: 'Social Follow',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Online (Israel)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(5),
    icon: '✊',
    description: 'Fashion Revolution Israel chapter activities and campaigns.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Labor transparency', 'Supply chain activism'],
      activityType: ['Social Media', 'Activism'],
      format: 'Online',
      commitment: 'Flexible'
    },
    draws: ['amplify', 'explore'],
    connectedArtworks: [1, 4],
    saves: 189,
    url: 'https://www.instagram.com/fashionrevolution_israel/',
    showCommunityMessage: true
  },
  {
    id: 14,
    name: '@dorinfrank (Dorin Frankfurt)',
    type: 'Designer Follow',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Tel Aviv, Israel',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(6),
    icon: '👔',
    description: '40-year pioneer of upcycled Israeli fashion, local manufacturing.',
    tags: {
      values: ['Technical Circularity', 'Community Engagement'],
      benefits: ['Historical perspective', 'Local production advocacy'],
      activityType: ['Social Media', 'Design Inspiration'],
      format: 'Online',
      commitment: 'Flexible'
    },
    draws: ['witness', 'explore'],
    connectedArtworks: [1, 2],
    saves: 312,
    url: 'https://www.instagram.com/dorinfrank/',
    showCommunityMessage: false
  },

  // === FACEBOOK GROUPS & NEWSLETTERS ===
  {
    id: 15,
    name: "זה לא יושב בול (It Doesn't Fit Me)",
    type: 'Facebook Group',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 5 min',
    location: 'Online (Israel)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(0),
    icon: '👕',
    description: "50,000+ members exchanging clothing that didn't fit. ~100 daily posts.",
    tags: {
      values: ['Community Engagement', 'Technical Circularity'],
      benefits: ['Garment lifecycle extension', 'P2P exchange', 'Community solidarity'],
      activityType: ['Community', 'Exchange'],
      format: 'Online',
      commitment: 'Flexible'
    },
    draws: ['exchange', 'meet'],
    connectedArtworks: [1, 3],
    saves: 456,
    url: 'https://www.facebook.com/groups/',
    showCommunityMessage: true
  },
  {
    id: 16,
    name: 'מתלבשות על נובמבר (Dressed in November)',
    type: 'Facebook Group',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 5 min',
    location: 'Online (Israel)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🍂',
    description: 'Sustainable fashion activism, swap events, November campaign. Founded 2019.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Fast fashion critique', 'Collective action', 'Swap event access'],
      activityType: ['Community', 'Activism', 'Events'],
      format: 'Online',
      commitment: 'Flexible'
    },
    draws: ['amplify', 'meet', 'exchange'],
    connectedArtworks: [1, 4],
    saves: 234,
    url: 'https://www.facebook.com/groups/',
    showCommunityMessage: true
  },
  {
    id: 17,
    name: 'Sustainable Fashion Forum Newsletter',
    type: 'Newsletter',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Online (Israel)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(2),
    icon: '📧',
    description: 'Monthly updates, events, industry news from Israeli forum.',
    tags: {
      values: ['Systems Awareness', 'Community Engagement'],
      benefits: ['Industry developments', 'Event announcements'],
      activityType: ['Newsletter', 'Local'],
      format: 'Online',
      commitment: 'Monthly'
    },
    draws: ['explore'],
    connectedArtworks: [2, 4],
    saves: 178,
    url: 'https://www.sustainablefashionforum.com/',
    showCommunityMessage: false
  },
  {
    id: 18,
    name: 'Greenpeace Israel Fashion Newsletter',
    type: 'Newsletter',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 1 min',
    location: 'Online (Israel)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🌿',
    description: 'Campaign updates, swap events, policy wins in Israeli fashion landscape.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Activism opportunities', 'Policy awareness'],
      activityType: ['Newsletter', 'Activism'],
      format: 'Online',
      commitment: 'Regular'
    },
    draws: ['amplify', 'explore'],
    connectedArtworks: [4, 6],
    saves: 145,
    url: 'https://www.greenpeace.org/israel/act/fashion/',
    showCommunityMessage: false
  },

  // === ISRAEL PHYSICAL EVENTS ===
  {
    id: 19,
    name: 'Fashion Revolution Week Israel',
    type: 'Annual Event',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours per event',
    location: 'Tel Aviv & online',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(4),
    icon: '✊',
    description: 'Mend in Public Day (April 26), #WhoMadeMyClothes campaign, "Think Globally, Act Locally".',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Labor transparency', 'Visible mending culture', 'Activist community'],
      activityType: ['Events', 'Activism', 'Making'],
      format: 'Hybrid',
      commitment: 'Annual week'
    },
    draws: ['amplify', 'meet', 'make'],
    connectedArtworks: [1, 3, 4],
    saves: 289,
    url: 'https://www.fashionrevolution.org/asia/israel/',
    showCommunityMessage: true
  },
  {
    id: 20,
    name: 'Dress Code Fashion Fair',
    type: 'Fashion Fair',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Beit Zionei America, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(5),
    icon: '🛍️',
    description: '15+ independent Israeli designers, up to 70% off past seasons. May 22-24, 2025.',
    tags: {
      values: ['Community Engagement', 'Technical Circularity'],
      benefits: ['Designer discovery', 'Affordable slow fashion'],
      activityType: ['Fair', 'Shopping', 'Designer'],
      format: 'In-person',
      commitment: 'One-time'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 5],
    saves: 178,
    url: 'https://www.jpost.com/consumerism/article-854408',
    showCommunityMessage: false
  },
  {
    id: 21,
    name: 'Tel Aviv Fashion Week',
    type: 'Multi-day Event',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: 'Multi-day',
    location: 'Kremenitzky Complex, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '👗',
    description: '28 runway shows, Shenkar College showcase, Israeli design ecosystem. October 26-30, 2025.',
    tags: {
      values: ['Systems Awareness', 'Community Engagement'],
      benefits: ['Industry immersion', 'Designer discovery'],
      activityType: ['Event', 'Fashion', 'Industry'],
      format: 'In-person',
      commitment: 'Multi-day'
    },
    draws: ['witness', 'explore', 'meet'],
    connectedArtworks: [1, 2, 5],
    saves: 345,
    url: 'https://conartmag.com/tel-aviv-fashion-week-returns-in-2025',
    showCommunityMessage: false
  },
  {
    id: 22,
    name: 'מתלבשות על זה (Dressed on It) Charity Bazaar',
    type: 'Charity Event',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '💜',
    description: '22nd annual edition benefiting Jerusalem Rape Crisis Center.',
    tags: {
      values: ['Community Engagement', 'Regenerative Intention'],
      benefits: ['Circular economy + social impact', 'Community building'],
      activityType: ['Charity', 'Swap', 'Community'],
      format: 'In-person',
      commitment: 'Annual'
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
    type: 'Swap Event',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🔄',
    description: 'Clothing swap events benefiting local charities.',
    tags: {
      values: ['Community Engagement', 'Regenerative Intention'],
      benefits: ['Wardrobe refresh', 'Charitable giving', 'Social connection'],
      activityType: ['Swap', 'Charity', 'Social'],
      format: 'In-person',
      commitment: 'One-time'
    },
    draws: ['exchange', 'meet'],
    connectedArtworks: [1, 3],
    saves: 189,
    url: 'https://www.secrettelaviv.com/tickets/swap-shop-for-charity-tlv',
    showCommunityMessage: true
  },
  {
    id: 24,
    name: "Treehouse Children's Swap Events",
    type: 'Family Swap',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Ibn Gavirol 188, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '🧒',
    description: "Ages 0-7 clothing exchange. Supports Mothers Make a Difference charity.",
    tags: {
      values: ['Community Engagement', 'Regenerative Intention'],
      benefits: ['Family participation', "Kids' circular economy", 'Social impact'],
      activityType: ['Family', 'Swap', 'Charity'],
      format: 'In-person',
      commitment: 'One-time'
    },
    draws: ['exchange', 'meet'],
    connectedArtworks: [3, 5],
    saves: 134,
    url: 'https://www.treehousegeneration.com/',
    showCommunityMessage: true
  },
  {
    id: 25,
    name: 'שוקיימות (Shukayamut) Fair',
    type: 'Sustainable Fair',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Dizengoff Center, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🌱',
    description: 'Sustainable vendors, upcycling workshops, clothing swaps with Greenpeace.',
    tags: {
      values: ['Community Engagement', 'Technical Circularity'],
      benefits: ['Alternative consumption discovery', 'Workshop access'],
      activityType: ['Fair', 'Workshop', 'Swap'],
      format: 'In-person',
      commitment: 'One-time'
    },
    draws: ['meet', 'make', 'exchange'],
    connectedArtworks: [2, 3, 4],
    saves: 223,
    url: 'https://www.greenpeace.org/israel/',
    showCommunityMessage: true
  },

  // === MEDIA & EDUCATION ===
  {
    id: 26,
    name: '"Think Your Shirt Cost 30 Shekels?" Video',
    type: 'Documentary',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 15 min',
    location: 'Online (Israel)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(4),
    icon: '🎬',
    description: 'Hebrew documentary on true cost of fashion by Sustainable Fashion Forum.',
    tags: {
      values: ['Systems Awareness'],
      benefits: ['Consumer awareness', 'Supply chain education'],
      activityType: ['Video', 'Education'],
      format: 'Online',
      commitment: 'One-time'
    },
    draws: ['explore'],
    connectedArtworks: [1, 4],
    saves: 456,
    url: 'https://www.sustainablefashionforum.com/',
    showCommunityMessage: false
  },
  {
    id: 27,
    name: '"Alternativa" Podcast Episode #99',
    type: 'Podcast',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 15 min',
    location: 'Online (Israel)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(5),
    icon: '🎙️',
    description: 'Hebrew podcast with Dr. Meital Peleg Mizrachi on sustainable fashion & Ghana textile waste.',
    tags: {
      values: ['Systems Awareness', 'Community Engagement'],
      benefits: ['Global waste journey understanding', 'Ethical considerations'],
      activityType: ['Podcast', 'Education'],
      format: 'Online',
      commitment: 'One-time'
    },
    draws: ['explore'],
    connectedArtworks: [1, 4, 6],
    saves: 189,
    url: 'https://alternativabyuptous.podbean.com/',
    showCommunityMessage: false
  },

  // === PHYSICAL SHOPPING & MARKETS ===
  {
    id: 28,
    name: 'Nachalat Binyamin Fabric District',
    type: 'Shopping District',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: '15-60 min',
    location: 'Carmel Market area, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '🧵',
    description: '30+ fabric sellers offering dead-stock, upholstery, end-of-rolls at 75%+ off.',
    tags: {
      values: ['Technical Circularity', 'Community Engagement'],
      benefits: ['Material sourcing', 'Local supply chains', 'Dead-stock discovery'],
      activityType: ['Shopping', 'Materials', 'Local'],
      format: 'In-person',
      commitment: 'Flexible'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 2, 4],
    saves: 345,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },
  {
    id: 29,
    name: 'Re:Concept (רה:קונספט)',
    type: 'P2P Marketplace',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 15 min',
    location: 'Online + 400 pickup points',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(0),
    icon: '📦',
    description: 'P2P secondhand marketplace with 400 locker pickup points. Sellers get 80%.',
    tags: {
      values: ['Technical Circularity', 'Community Engagement'],
      benefits: ['Circular economy participation', 'Convenient exchange'],
      activityType: ['Marketplace', 'P2P', 'Digital'],
      format: 'Hybrid',
      commitment: 'Flexible'
    },
    draws: ['exchange', 'witness'],
    connectedArtworks: [3, 5],
    saves: 567,
    url: 'https://thereconcept.com/',
    showCommunityMessage: false
  },
  {
    id: 30,
    name: 'Chelsy True Closet App',
    type: 'Vintage App',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 15 min',
    location: 'Tel Aviv & Givatayim',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(1),
    icon: '📱',
    description: 'Mobile app browsing ~7,000 curated vintage items from physical stores.',
    tags: {
      values: ['Technical Circularity', 'Spiritual Grounding'],
      benefits: ['Quality secondhand', 'Curated vintage discovery'],
      activityType: ['App', 'Vintage', 'Curated'],
      format: 'Hybrid',
      commitment: 'Flexible'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 2],
    saves: 234,
    url: 'https://chelsy.co.il/',
    showCommunityMessage: false
  },
  {
    id: 31,
    name: 'Jaffa Flea Market (שוק הפשפשים)',
    type: 'Flea Market',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Near Clock Tower, Jaffa',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '🏺',
    description: "Israel's largest flea market: Yefet, Margoza, Ami'ad, Olei Zion streets.",
    tags: {
      values: ['Community Engagement', 'Technical Circularity'],
      benefits: ['Authentic reuse culture', 'Material sourcing', 'Local secondhand ecosystem'],
      activityType: ['Market', 'Vintage', 'Culture'],
      format: 'In-person',
      commitment: 'Flexible'
    },
    draws: ['witness', 'exchange', 'meet'],
    connectedArtworks: [1, 4, 6],
    saves: 678,
    url: 'https://www.google.com/maps',
    showCommunityMessage: true
  },
  {
    id: 32,
    name: 'Haifa Flea Market (שוק הפשפשים חיפה)',
    type: 'Flea Market',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Kibbutz Galuyot Street, Haifa',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🏛️',
    description: '150+ year market, Sat Peddlers Market (~120 vendors), "Bubba Zahava" vintage stall.',
    tags: {
      values: ['Community Engagement', 'Technical Circularity'],
      benefits: ['Historical reuse culture', 'Textile history', 'Authentic secondhand'],
      activityType: ['Market', 'Vintage', 'Historical'],
      format: 'In-person',
      commitment: 'Flexible'
    },
    draws: ['witness', 'exchange', 'meet'],
    connectedArtworks: [1, 2, 6],
    saves: 345,
    url: 'https://www.instagram.com/flea_market_haifa/',
    showCommunityMessage: true
  },

  // === WORKSHOPS & MAKER SPACES ===
  {
    id: 33,
    name: 'Dome Upcycling Workshop',
    type: 'Mending Workshop',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Tel Aviv & online',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(4),
    icon: '🧶',
    description: 'Drop-in mending sessions: creative repair, upcycling techniques, garment longevity guidance.',
    tags: {
      values: ['Technical Circularity', 'Regenerative Intention'],
      benefits: ['Visible mending skills', 'Product longevity', 'Slow fashion practice'],
      activityType: ['Workshop', 'Making', 'Skill-building'],
      format: 'Hybrid',
      commitment: 'Drop-in'
    },
    draws: ['make', 'explore', 'meet'],
    connectedArtworks: [2, 3, 4],
    saves: 289,
    url: 'https://domeupcycling.com/',
    showCommunityMessage: true
  },
  {
    id: 34,
    name: 'T.A.M.I. - Tel Aviv Makers Institute',
    type: 'Maker Space',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours per visit',
    location: 'Kibbutz Galuyot 45, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(5),
    icon: '🔧',
    description: 'Sewing machines, laser cutters, 3D printers. Open access maker space.',
    tags: {
      values: ['Technical Circularity', 'Community Engagement'],
      benefits: ['DIY fashion', 'Material experimentation', 'Tool access'],
      activityType: ['Maker Space', 'Tools', 'Community'],
      format: 'In-person',
      commitment: 'Flexible membership'
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
    type: 'Maker Space',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours per visit',
    location: 'Avraham Giron 3A, Yehud',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '⚙️',
    description: 'Sewing, laser cutting, 3D printing, CNC machines. Supervised public access.',
    tags: {
      values: ['Technical Circularity', 'Community Engagement'],
      benefits: ['Maker skills', 'Prototyping access'],
      activityType: ['Maker Space', 'Tools', 'Training'],
      format: 'In-person',
      commitment: 'Flexible'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [3, 5],
    saves: 234,
    url: 'https://www.makelab.org.il/',
    showCommunityMessage: false
  },
  {
    id: 36,
    name: 'Yarok Makerspace',
    type: 'Maker Space',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Rehovot, Israel',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '🪚',
    description: 'Sewing, laser cutting, woodworking. Courses in maker skills.',
    tags: {
      values: ['Technical Circularity'],
      benefits: ['Craft skill development', 'Equipment access'],
      activityType: ['Maker Space', 'Courses'],
      format: 'In-person',
      commitment: 'Flexible'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [5, 6],
    saves: 167,
    url: 'https://makerspace.co.il/',
    showCommunityMessage: false
  },

  // === SEWING & CRAFT COURSES ===
  {
    id: 37,
    name: 'Tefer Workshop (תפר)',
    type: 'Sewing Course',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: '8-week courses',
    location: 'Tel Aviv, Israel',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🪡',
    description: 'Short/long-term sewing courses: machine sewing, pattern making, overlock.',
    tags: {
      values: ['Technical Circularity'],
      benefits: ['Garment construction', 'Repair skills', 'Pattern making mastery'],
      activityType: ['Course', 'Sewing', 'Professional'],
      format: 'In-person',
      commitment: '8 weeks'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [1, 2],
    saves: 312,
    url: 'https://www.tefer-workshop.com/',
    showCommunityMessage: false
  },
  {
    id: 38,
    name: 'Studio Bouton (בוטון)',
    type: 'Sewing Course',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Multi-session courses',
    location: 'Homa U\'Migdal 16, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '🧵',
    description: 'Industrial/domestic machines, small groups, Shenkar-trained instructor (25+ years).',
    tags: {
      values: ['Technical Circularity'],
      benefits: ['Professional sewing skills', 'Equipment familiarity'],
      activityType: ['Course', 'Sewing', 'Professional'],
      format: 'In-person',
      commitment: 'Multi-session'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [1, 2],
    saves: 234,
    url: 'https://www.boutonstudio.com/',
    showCommunityMessage: false
  },
  {
    id: 39,
    name: 'Studio FaMoMa',
    type: 'Sewing Course',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Course series',
    location: 'Basel 33, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(3),
    icon: '✂️',
    description: 'Sewing basics, pattern making, garment construction. Hebrew & English.',
    tags: {
      values: ['Technical Circularity'],
      benefits: ['Bilingual instruction', 'Family atmosphere'],
      activityType: ['Course', 'Sewing', 'Bilingual'],
      format: 'In-person',
      commitment: 'Course series'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [1, 2],
    saves: 189,
    url: 'https://studiofamoma.com/',
    showCommunityMessage: false
  },
  {
    id: 40,
    name: 'HaMitpara (המתפרה)',
    type: 'Sewing Course',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Course series',
    location: 'Kikar Atarim, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(4),
    icon: '👙',
    description: 'Sewing, pattern making, swimwear, accessories specialization.',
    tags: {
      values: ['Technical Circularity'],
      benefits: ['Specialized garment types', 'Coastal location'],
      activityType: ['Course', 'Sewing', 'Specialty'],
      format: 'In-person',
      commitment: 'Course series'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [3, 5],
    saves: 156,
    url: 'https://hamatpera.com/',
    showCommunityMessage: false
  },
  {
    id: 41,
    name: 'Tafur Alai Studio (תפור עלי)',
    type: 'Craft Studio',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Course series',
    location: "Ginot HaEla 80, Modi'in",
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(5),
    icon: '🎨',
    description: 'Sewing, embroidery, knitting, beading for kids (8-12) and adults.',
    tags: {
      values: ['Technical Circularity', 'Spiritual Grounding'],
      benefits: ['Intergenerational skills', 'Craft diversity'],
      activityType: ['Course', 'Craft', 'Family'],
      format: 'In-person',
      commitment: 'Course series'
    },
    draws: ['make', 'meet'],
    connectedArtworks: [2, 6],
    saves: 123,
    url: 'https://www.tafuralai.com/',
    showCommunityMessage: true
  },
  {
    id: 42,
    name: 'HaGilda (The Guild) Shoemaking',
    type: 'Craft Training',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Multi-day workshops',
    location: 'South Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '👟',
    description: 'World-class shoemaking by Nina Rosen (since 2007): sneakers, millinery, leather belts.',
    tags: {
      values: ['Technical Circularity', 'Spiritual Grounding'],
      benefits: ['Traditional leather techniques', 'Material innovation', 'Craft mastery'],
      activityType: ['Course', 'Craft', 'Professional'],
      format: 'In-person',
      commitment: 'Multi-day or courses'
    },
    draws: ['make', 'explore'],
    connectedArtworks: [2, 5],
    saves: 267,
    url: 'https://www.google.com/search?q=HaGilda+shoemaking+tel+aviv',
    showCommunityMessage: false
  },
  {
    id: 43,
    name: 'Jerusalem House of Quality',
    type: 'Craft Workshop',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '2.5-3 hours',
    location: 'Hevron Street 12, Jerusalem',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '🏛️',
    description: '23 workshops including leather crafting in 18th-century building. Gallery, rooftop tours.',
    tags: {
      values: ['Technical Circularity', 'Spiritual Grounding'],
      benefits: ['Historic setting', 'Traditional craftsmanship', 'Material exploration'],
      activityType: ['Workshop', 'Heritage', 'Tour'],
      format: 'In-person',
      commitment: 'One session'
    },
    draws: ['make', 'explore', 'witness'],
    connectedArtworks: [2, 6],
    saves: 345,
    url: 'https://www.itraveljerusalem.com/ent/jerusalem-house-of-quality-workshops/',
    showCommunityMessage: false
  },

  // === CULTURAL HERITAGE ===
  {
    id: 44,
    name: 'Sidreh Lakiya Weaving',
    type: 'Cultural Experience',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours',
    location: 'Lakiya, Negev',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🪢',
    description: '38 Bedouin women preserving 4,000-year-old weaving. Natural materials, Awasi wool.',
    tags: {
      values: ['Spiritual Grounding', 'Community Engagement', 'Regenerative Intention'],
      benefits: ['Traditional techniques', "Women's empowerment", 'Natural dyeing'],
      activityType: ['Cultural', 'Heritage', 'Visit'],
      format: 'In-person',
      commitment: 'By appointment'
    },
    draws: ['explore', 'meet', 'witness'],
    connectedArtworks: [4, 6],
    saves: 412,
    url: 'https://sidreh.org/',
    showCommunityMessage: true
  },
  {
    id: 45,
    name: 'Ben Zion David Yemenite Art',
    type: 'Cultural Experience',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '2-3 hours',
    location: 'Old Jaffa',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '✨',
    description: '8th-generation filigree and embroidery. Nearly-lost Yemenite traditions.',
    tags: {
      values: ['Spiritual Grounding', 'Regenerative Intention'],
      benefits: ['Ancestral craft preservation', 'Cultural heritage'],
      activityType: ['Cultural', 'Heritage', 'Workshop'],
      format: 'In-person',
      commitment: 'By appointment'
    },
    draws: ['make', 'explore', 'witness'],
    connectedArtworks: [2, 6],
    saves: 289,
    url: 'https://www.google.com/search?q=Ben+Zion+David+Old+Jaffa',
    showCommunityMessage: false
  },

  // === VINTAGE STORES ===
  {
    id: 46,
    name: 'Flashback Vintage',
    type: 'Vintage Store',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: '15-60 min',
    location: '72 King George & 33 Sheinkin, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(3),
    icon: '👗',
    description: 'Original 50s-90s vintage clothing. Mid-range prices.',
    tags: {
      values: ['Technical Circularity', 'Spiritual Grounding'],
      benefits: ['Curated vintage', 'Quality secondhand'],
      activityType: ['Shopping', 'Vintage'],
      format: 'In-person',
      commitment: 'Flexible'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 2],
    saves: 456,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },
  {
    id: 47,
    name: 'Argaman Luxury Resale',
    type: 'Luxury Resale',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: '15-60 min',
    location: 'Near Aderet, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(4),
    icon: '💎',
    description: 'Luxury resale: Gucci, Chanel, designer pieces. High-end prices.',
    tags: {
      values: ['Technical Circularity', 'Community Engagement'],
      benefits: ['Circular luxury', 'High-end secondhand'],
      activityType: ['Shopping', 'Luxury', 'Resale'],
      format: 'In-person',
      commitment: 'Flexible'
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
    type: 'Vintage Store',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: '15-60 min',
    location: 'Montefiore St, Tel Aviv',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(5),
    icon: '⚖️',
    description: 'Pay-by-weight vintage clothing. Budget-friendly.',
    tags: {
      values: ['Technical Circularity'],
      benefits: ['Affordable secondhand', 'Treasure hunting'],
      activityType: ['Shopping', 'Vintage', 'Budget'],
      format: 'In-person',
      commitment: 'Flexible'
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
    type: 'Luxury Vintage',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: '15-60 min',
    location: '6 Yoezer St, Jaffa',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(6),
    icon: '👠',
    description: 'Luxury vintage and designer pieces. High-end.',
    tags: {
      values: ['Technical Circularity', 'Spiritual Grounding'],
      benefits: ['Curated luxury vintage', 'Quality investment pieces'],
      activityType: ['Shopping', 'Luxury', 'Vintage'],
      format: 'In-person',
      commitment: 'Flexible'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 2],
    saves: 312,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },
  {
    id: 50,
    name: 'Golda Second Hand',
    type: 'Vintage Store',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: '1-3 hours with drive',
    location: 'Herzliya, Israel',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '🏡',
    description: 'Vintage in 1920s home. Famous "10-Shek Sales".',
    tags: {
      values: ['Technical Circularity', 'Spiritual Grounding'],
      benefits: ['Historic setting', 'Budget-friendly finds'],
      activityType: ['Shopping', 'Vintage', 'Experience'],
      format: 'In-person',
      commitment: 'Day trip'
    },
    draws: ['witness', 'exchange'],
    connectedArtworks: [1, 6],
    saves: 289,
    url: 'https://www.google.com/maps',
    showCommunityMessage: false
  },

  // === ACADEMIC & PROFESSIONAL ===
  {
    id: 51,
    name: 'Shenkar Fashion Design Department',
    type: 'Academic Program',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: '4-year degree',
    location: 'Ramat Gan, Israel',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🎓',
    description: '4-year B.Des with "Rebooting Fashion" sustainability track, FISHSkin Project, CIRTex Innovation Center.',
    tags: {
      values: ['Technical Circularity', 'Systems Awareness'],
      benefits: ['Professional sustainable fashion training', 'Industry connections'],
      activityType: ['Degree', 'Academic', 'Professional'],
      format: 'In-person',
      commitment: '4 years'
    },
    draws: ['explore', 'make', 'meet'],
    connectedArtworks: [2, 4, 5],
    saves: 412,
    url: 'https://www.shenkar.ac.il/en/departments/design-fashion-department/',
    showCommunityMessage: false
  },
  {
    id: 52,
    name: 'Bezalel Academy Sustainable Design',
    type: 'Academic Course',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Semester/year',
    location: 'Jerusalem (Mandel Campus)',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '📐',
    description: '"Sustainable Design and Development" (English). Slow design, local manufacturing focus.',
    tags: {
      values: ['Systems Awareness', 'Technical Circularity'],
      benefits: ['Academic rigor', 'Design education', 'Systems thinking'],
      activityType: ['Course', 'Academic', 'Design'],
      format: 'In-person',
      commitment: 'Semester+'
    },
    draws: ['explore', 'make'],
    connectedArtworks: [4, 5, 6],
    saves: 234,
    url: 'https://www.bezalel.ac.il/en/',
    showCommunityMessage: false
  },
  {
    id: 53,
    name: 'Green Academy Israel - Sustainable Fashion',
    type: 'Professional Course',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: '8-week course',
    location: 'Online (Hebrew)',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🌿',
    description: '8 sessions starting April 19, 2026 (20:00-21:30). Upcycling, zero-waste, innovative materials. 3,900 NIS.',
    tags: {
      values: ['Systems Awareness', 'Technical Circularity'],
      benefits: ['Professional development', 'Bar-Ilan partnership', 'EU Green Entrepreneurship Program'],
      activityType: ['Course', 'Professional', 'Online'],
      format: 'Online',
      commitment: '8 weeks'
    },
    draws: ['explore', 'meet'],
    connectedArtworks: [2, 4],
    saves: 178,
    url: 'https://greenacademy.co.il/courses/sustain_fashion/',
    showCommunityMessage: true
  },

  // === COMMUNITY & VOLUNTEERING ===
  {
    id: 54,
    name: 'Sustainable Fashion Forum Israel',
    type: 'Community Forum',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: 'Events 1-3 hours',
    location: 'Tel Aviv & online',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(4),
    icon: '🤝',
    description: 'Open forums, public lectures, "True Cost" screenings, Fashion Library project. Founded Sept 2016.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Industry connections', 'Free/donation events', 'Community building'],
      activityType: ['Forum', 'Community', 'Events'],
      format: 'Hybrid',
      commitment: 'Ongoing membership'
    },
    draws: ['meet', 'explore', 'amplify'],
    connectedArtworks: [1, 4],
    saves: 534,
    url: 'https://www.sustainablefashionforum.com/',
    showCommunityMessage: true
  },
  {
    id: 55,
    name: 'Fashion Revolution Israel Volunteering',
    type: 'Volunteer Role',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Ongoing',
    location: 'Hybrid (Tel Aviv + online)',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(5),
    icon: '✊',
    description: 'Annual Fashion Revolution Week volunteer roles, ongoing campaigns.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness'],
      benefits: ['Activist skills', 'Campaign participation', 'Global network'],
      activityType: ['Volunteering', 'Activism', 'Campaign'],
      format: 'Hybrid',
      commitment: 'Ongoing'
    },
    draws: ['amplify', 'meet', 'explore'],
    connectedArtworks: [1, 4],
    saves: 189,
    url: 'https://www.fashionrevolution.org/asia/israel/',
    showCommunityMessage: true
  },
  {
    id: 56,
    name: 'Greenpeace Israel Fashion Volunteer',
    type: 'Volunteer Role',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Ongoing',
    location: 'Hybrid (Israel + online)',
    locationFormat: 'hybrid',
    region: 'israel',
    gradient: getGradient(6),
    icon: '🌍',
    description: 'Pop-up secondhand markets, advocacy, textile waste investigation.',
    tags: {
      values: ['Community Engagement', 'Systems Awareness', 'Regenerative Intention'],
      benefits: ['Activism experience', 'Policy engagement', 'Community organizing'],
      activityType: ['Volunteering', 'Activism', 'Markets'],
      format: 'Hybrid',
      commitment: 'Ongoing'
    },
    draws: ['amplify', 'meet', 'exchange'],
    connectedArtworks: [4, 6],
    saves: 234,
    url: 'https://www.greenpeace.org/israel/act/fashion/',
    showCommunityMessage: true
  },
  {
    id: 57,
    name: 'HaMetzion Social Enterprise',
    type: 'Social Enterprise',
    energyLevel: 'hands-on',
    energyLabel: 'Hands-on',
    commitment: 'Flexible',
    location: 'Ramat Gan & Jerusalem',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(0),
    icon: '💜',
    description: 'Volunteer/donate/shop at secondhand stores employing people with disabilities.',
    tags: {
      values: ['Community Engagement', 'Regenerative Intention'],
      benefits: ['Social impact + circular economy', 'Inclusive employment'],
      activityType: ['Social Enterprise', 'Volunteering', 'Shopping'],
      format: 'In-person',
      commitment: 'Flexible'
    },
    draws: ['meet', 'exchange', 'amplify'],
    connectedArtworks: [1, 4],
    saves: 345,
    url: 'https://hamezion.co.il/en/',
    showCommunityMessage: true
  },

  // === INNOVATION & RESEARCH ===
  {
    id: 58,
    name: 'Re-Fresh Global / Re-Born Textiles',
    type: 'Innovation Hub',
    energyLevel: 'deep-work',
    energyLabel: 'Deep work',
    commitment: 'Partnership inquiry',
    location: 'Kipod Center, Kfar Saba',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(1),
    icon: '🔬',
    description: 'SMART-UP™ enzymatic textile waste-to-yarn conversion. 10 tons in pilot weeks.',
    tags: {
      values: ['Technical Circularity', 'Regenerative Intention'],
      benefits: ['Industrial-scale waste transformation', 'Innovation access'],
      activityType: ['Innovation', 'Research', 'Partnership'],
      format: 'In-person',
      commitment: 'Partnership'
    },
    draws: ['explore', 'meet'],
    connectedArtworks: [2, 4],
    saves: 156,
    url: 'https://re-fresh.global/',
    showCommunityMessage: false
  },
  {
    id: 59,
    name: 'KMM Recycling Industries',
    type: 'Recycling Infrastructure',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 5 min',
    location: 'Bins throughout Israel',
    locationFormat: 'physical',
    region: 'israel',
    gradient: getGradient(2),
    icon: '♻️',
    description: 'Textile collection bins. Good condition→reuse; worn→rags; wool/acrylic→recycling.',
    tags: {
      values: ['Technical Circularity'],
      benefits: ['Municipal infrastructure', 'Textile donation access'],
      activityType: ['Donation', 'Recycling', 'Infrastructure'],
      format: 'In-person',
      commitment: 'One-time'
    },
    draws: ['exchange', 'amplify'],
    connectedArtworks: [4],
    saves: 678,
    url: 'https://kmm.org.il/textile-recycling/?lang=en',
    showCommunityMessage: false
  },
  {
    id: 60,
    name: 'Algaeing Research',
    type: 'Innovation Research',
    energyLevel: 'low-key',
    energyLabel: 'Low key',
    commitment: 'Under 15 min research',
    location: 'Kibbutz Ketura',
    locationFormat: 'digital',
    region: 'israel',
    gradient: getGradient(3),
    icon: '🧬',
    description: 'Algae-based biodegradable fibers & natural dyes. 80% water reduction, zero waste.',
    tags: {
      values: ['Technical Circularity', 'Regenerative Intention'],
      benefits: ['Next-gen sustainable materials', 'Biomaterial innovation'],
      activityType: ['Research', 'Innovation'],
      format: 'Online research',
      commitment: 'Flexible'
    },
    draws: ['explore'],
    connectedArtworks: [2, 6],
    saves: 234,
    url: 'https://www.google.com/search?q=Algaeing+Renana+Krebs',
    showCommunityMessage: false
  }
];
