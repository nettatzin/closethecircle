export interface Activity {
  id: number;
  name: string;
  type: string;
  energy: string;
  energyLabel: string;
  commitment: string;
  location: string;
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
  expectations: string[];
  connectedArtworks: string[];
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

import mitumbaImg from '@/assets/artworks/mitumba.png';
import insectsTypologyImg from '@/assets/artworks/insects-typology.png';
import kiteprideImg from '@/assets/artworks/kitepride.png';
import plasticRiversImg from '@/assets/artworks/plastic-rivers.png';
import cityTransformerImg from '@/assets/artworks/city-transformer.png';
import livingRootBridgesImg from '@/assets/artworks/living-root-bridges.png';

export const artworks = [
  { id: 1, name: 'Mitumba', artist: 'Maya Arazi & Merav Gazit', image: mitumbaImg },
  { id: 2, name: 'Insects Typology', artist: 'Ori Orisun Merhav', image: insectsTypologyImg },
  { id: 3, name: 'Kitepride', artist: 'Matthias and Tabea Oppliger', image: kiteprideImg },
  { id: 4, name: 'Plastic Rivers', artist: 'Álvaro Catalán de Ocón', image: plasticRiversImg },
  { id: 5, name: 'City Transformer', artist: 'Nimrod Eliezer', image: cityTransformerImg },
  { id: 6, name: 'Living Root Bridges', artist: 'Meghalaya district', image: livingRootBridgesImg }
];

export const activities: Activity[] = [
  { 
    id: 1, 
    name: 'Tel Aviv Repair Café', 
    type: 'Community meetup', 
    energy: '🔥',
    energyLabel: 'Hands-on',
    commitment: 'A few hours',
    location: 'Florentin, 2km',
    gradient: 'var(--gradient-purple)',
    icon: '🔧',
    description: 'Monthly gathering where neighbors help each other repair clothing, electronics, furniture. Bring broken items, leave with fixed ones and new skills.',
    tags: {
      values: ['Material longevity', 'Community care', 'Skill sharing'],
      benefits: ['Learn repair skills', 'Meet neighbors', 'Save money', 'Reduce waste'],
      activityType: ['Hands-on', 'Social', 'Drop-in welcome'],
      format: 'In-person',
      commitment: 'One-time or recurring'
    },
    expectations: [
      'Usually 8-15 people',
      'Bring your broken item or just watch',
      'Coffee and tools provided',
      'Welcoming to beginners',
      'Chatty and social vibe'
    ],
    connectedArtworks: ['Repair Culture', 'Material Longevity'],
    saves: 23,
    url: 'https://example.com/repair-cafe',
    showCommunityMessage: true
  },
  { 
    id: 2, 
    name: 'Fermentation Workshop', 
    type: 'Hands-on learning', 
    energy: '🔥',
    energyLabel: 'Hands-on',
    commitment: 'A few hours',
    location: 'Jaffa, 5km',
    gradient: 'var(--gradient-pink)',
    icon: '🫙',
    description: 'Learn traditional fermentation techniques for preserving food and reducing waste. Make your own kimchi, sauerkraut, and kombucha to take home.',
    tags: {
      values: ['Slow transformation', 'Traditional knowledge', 'Food sovereignty'],
      benefits: ['Reduce food waste', 'Learn preservation', 'Gut health', 'Cultural connection'],
      activityType: ['Workshop', 'Making', 'Take-home results'],
      format: 'In-person',
      commitment: 'One session'
    },
    expectations: [
      '3-hour hands-on session',
      'All materials provided',
      'Take home your ferments',
      'Learn preservation techniques',
      'Small group, 6-10 people'
    ],
    connectedArtworks: ['Fermentation Process', 'Slow Transformation'],
    saves: 47,
    url: 'https://example.com/fermentation',
    showCommunityMessage: false
  },
  { 
    id: 3, 
    name: 'Zero Waste Collective', 
    type: 'Online community', 
    energy: '🪶',
    energyLabel: 'Low key',
    commitment: 'Minutes to an hour',
    location: 'Global digital',
    gradient: 'var(--gradient-cyan)',
    icon: '🌍',
    description: 'Digital community sharing tips, resources, and support for reducing waste. Weekly challenges, resource library, and monthly online meetups.',
    tags: {
      values: ['Systems thinking', 'Collective learning', 'Global solidarity'],
      benefits: ['Daily inspiration', 'Resource access', 'Accountability', 'Global network'],
      activityType: ['Online', 'Community', 'Self-paced'],
      format: 'Digital',
      commitment: 'Flexible'
    },
    expectations: [
      'Join anytime via Telegram',
      'Weekly sustainability challenges',
      'Resource library access',
      'Monthly video calls',
      'International members'
    ],
    connectedArtworks: ['Waste Streams', 'System Thinking'],
    saves: 156,
    url: 'https://example.com/zero-waste',
    showCommunityMessage: true
  },
  { 
    id: 4, 
    name: 'Textile Recycling Course', 
    type: '8-week program', 
    energy: '💪',
    energyLabel: 'Deep work',
    commitment: 'Ongoing commitment',
    location: 'Neve Tzedek, 3km',
    gradient: 'var(--gradient-sunset)',
    icon: '🧵',
    description: 'Deep dive into textile waste transformation. Learn upcycling, natural dyeing, and fiber processing. Ends with collaborative project creating community textile library.',
    tags: {
      values: ['Material consciousness', 'Craft mastery', 'Collaborative creation'],
      benefits: ['Deep skills', 'Certificate', 'Community project', 'Portfolio piece'],
      activityType: ['Course', 'Certification', 'Project-based'],
      format: 'In-person',
      commitment: '8 weeks, weekly sessions'
    },
    expectations: [
      '8 weekly sessions, 3 hours each',
      'Materials and equipment provided',
      'Previous sewing helpful but not required',
      'Collaborative final project',
      'Certificate upon completion'
    ],
    connectedArtworks: ['Textile Cycles', 'Material Transformation'],
    saves: 34,
    url: 'https://example.com/textile-course',
    showCommunityMessage: false
  },
  { 
    id: 5, 
    name: 'Urban Composting Network', 
    type: 'Ongoing practice', 
    energy: '💪',
    energyLabel: 'Deep work',
    commitment: 'Ongoing commitment',
    location: 'Your neighborhood',
    gradient: 'var(--gradient-mint)',
    icon: '🌱',
    description: 'Neighborhood composting initiative with distributed bins and shared maintenance. Drop off food scraps weekly, collect finished compost for your plants.',
    tags: {
      values: ['Closed-loop systems', 'Neighborhood care', 'Regenerative practice'],
      benefits: ['Free compost', 'Reduce waste', 'Meet neighbors', 'Urban ecology'],
      activityType: ['Ongoing', 'Local', 'Low-barrier'],
      format: 'In-person',
      commitment: 'Drop-in + optional volunteering'
    },
    expectations: [
      'Drop off anytime at local hubs',
      'Monthly volunteer sessions',
      'Free compost for participants',
      'Learn composting techniques',
      'Meet your neighbors'
    ],
    connectedArtworks: ['Urban Garden', 'Closed Loops'],
    saves: 89,
    url: 'https://example.com/composting',
    showCommunityMessage: true
  },
  { 
    id: 6, 
    name: 'Material Library Visit', 
    type: 'Drop-in anytime', 
    energy: '🪶',
    energyLabel: 'Low key',
    commitment: 'Minutes to an hour',
    location: 'Design Museum, 4km',
    gradient: 'var(--gradient-peach)',
    icon: '🏺',
    description: 'Explore innovative sustainable materials—bio-based plastics, waste-derived textiles, regenerative fibers. Touch, feel, and learn about material futures.',
    tags: {
      values: ['Material innovation', 'Tactile learning', 'Future thinking'],
      benefits: ['Inspiration', 'Material knowledge', 'Designer resources', 'Free access'],
      activityType: ['Museum', 'Self-guided', 'Educational'],
      format: 'In-person',
      commitment: 'One visit'
    },
    expectations: [
      'Open during museum hours',
      'Self-guided exploration',
      'Material samples to touch',
      'Staff available for questions',
      'Free with museum entry'
    ],
    connectedArtworks: ['Biomaterial Vessels', 'Material Innovation'],
    saves: 67,
    url: 'https://example.com/material-library',
    showCommunityMessage: false
  }
];