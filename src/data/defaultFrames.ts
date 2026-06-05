import { Frame } from '../types';

// Raw Data URIs with transparent viewports to fit the new 1:1 and 9:16 ratios
const ENVIRONMENT_DAY_1_1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <!-- Minimalist Sharp Border -->
  <rect x="15" y="15" width="470" height="470" fill="none" stroke="#eab308" stroke-width="4"/>
  <rect x="25" y="25" width="450" height="450" fill="none" stroke="#22c55e" stroke-width="10"/>

  <!-- Subtle Eco Details -->
  <path d="M 25,25 L 80,25 L 25,80 Z" fill="#eab308" opacity="0.9"/>
  <path d="M 475,25 L 420,25 L 475,80 Z" fill="#eab308" opacity="0.9"/>

  <!-- Lower visual banner -->
  <rect x="50" y="400" width="400" height="55" fill="#064e3b" stroke="#eab308" stroke-width="2"/>
  <text x="250" y="433" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="900" font-size="20" fill="#fef08a" text-anchor="middle" letter-spacing="1.5">WORLD ENVIRONMENT DAY</text>
</svg>
`)}`;

const GOLDEN_ECO_1_1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <rect x="20" y="20" width="460" height="460" fill="none" stroke="#ca8a04" stroke-width="6" />
  <rect x="32" y="32" width="436" height="436" fill="none" stroke="#15803d" stroke-width="3" />
  
  <rect x="80" y="420" width="340" height="42" fill="#171717" stroke="#ca8a04" stroke-width="2" />
  <text x="250" y="446" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="bold" font-size="14" fill="#fef08a" text-anchor="middle" letter-spacing="2">SAVE OUR PLANET • GO GREEN 🌲</text>
</svg>
`)}`;

const ECO_STORY_9_16 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" width="360" height="640">
  <!-- 9:16 Aspect ratio Story theme -->
  <rect x="12" y="12" width="336" height="616" fill="none" stroke="#15803d" stroke-width="10"/>
  <rect x="22" y="22" width="316" height="596" fill="none" stroke="#ca8a04" stroke-width="3"/>
  
  <rect x="40" y="555" width="280" height="48" fill="#14532d" stroke="#fef08a" stroke-width="1.5"/>
  <text x="180" y="583" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="bold" font-size="12" fill="#fef08a" text-anchor="middle" letter-spacing="1">ENVIRONMENT DAY STORY • JUNE 5 🍃</text>
</svg>
`)}`;

const GO_GREEN_STORY_9_16 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640" width="360" height="640">
  <!-- Elegant minimal Gold/Black Story Theme -->
  <rect x="15" y="15" width="330" height="610" fill="none" stroke="#eab308" stroke-width="4"/>
  <rect x="25" y="25" width="310" height="590" fill="none" stroke="#1c1917" stroke-width="8"/>
  
  <rect x="50" y="540" width="260" height="50" fill="#1c1917" stroke="#eab308" stroke-width="2"/>
  <text x="180" y="570" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="900" font-size="13" fill="#fef08a" text-anchor="middle" letter-spacing="1.5">CHOOSE NATURE 🌳</text>
</svg>
`)}`;

export const DEFAULT_FRAMES: Frame[] = [
  {
    id: 'env-day-1-1',
    name: 'Environment Day Square (1:1)',
    imageUrl: ENVIRONMENT_DAY_1_1,
    aspectRatio: '1:1',
    isDefault: true,
  },
  {
    id: 'golden-eco-1-1',
    name: 'Golden ECO Frame (1:1)',
    imageUrl: GOLDEN_ECO_1_1,
    aspectRatio: '1:1',
    isDefault: true,
  },
  {
    id: 'eco-story-9-16',
    name: 'Eco Nature Story (9:16)',
    imageUrl: ECO_STORY_9_16,
    aspectRatio: '9:16',
    isDefault: true,
  },
  {
    id: 'go-green-story-9-16',
    name: 'Go Green Status (9:16)',
    imageUrl: GO_GREEN_STORY_9_16,
    aspectRatio: '9:16',
    isDefault: true,
  }
];
