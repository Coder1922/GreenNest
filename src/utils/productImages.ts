// Static illustrated representations of each plant and tool so they work completely offline
// and never fail due to CORS, hotlinking blocks, or container iframe constraints.

import monsteraImg from './Monstera_Deliciosa.jpg';
import snakeImg from './Sansevieria_Trifasciata.jpg';
import peaceLilyImg from './Spathiphyllum.jpg';
import orchidImg from './Phalaenopsis_Moth_Orchid.jpg';
import arecaImg from './Dypsis_Lutescens.jpg';
import tomatoSeedsImg from './Heirloom_Beefsteak_Tomato_Seeds.jpg';
import lavenderSeedsImg from './French_Lavender_Seeds.jpg';
import ceramicPotImg from './Nordic_Pastel_Ceramic_Pot.jpg';
import trowelImg from './Cast-Aluminum_Digging_Trowel.jpg';

export const LOCAL_IMAGES: Record<string, string> = {
  'prod-monstera': monsteraImg,
  'prod-snake': snakeImg,
  'prod-peace-lily': peaceLilyImg,
  'prod-orchid': orchidImg,
  'prod-areca': arecaImg,
  'prod-tomato-seeds': tomatoSeedsImg,
  'prod-lavender-seeds': lavenderSeedsImg,
  'prod-ceramic-pot': ceramicPotImg,
  'prod-ergonomic-trowel': trowelImg,
};

export const PRODUCT_SVGS: Record<string, string> = {
  'prod-monstera': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#E8F5E9" rx="16"/>
    <circle cx="300" cy="180" r="110" fill="#C8E6C9" opacity="0.6"/>
    <path d="M300 80 C230 80 180 140 180 200 C180 270 230 320 300 320 C370 320 420 270 420 200 C420 140 370 80 300 80 Z" fill="#2E7D32"/>
    <path d="M300 80 L300 320" stroke="#81C784" stroke-width="4" stroke-linecap="round"/>
    <path d="M300 130 C260 140 230 170 210 175 M300 170 C250 185 210 210 190 220 M300 210 C250 230 220 260 205 275" stroke="#E8F5E9" stroke-width="8" stroke-linecap="round"/>
    <path d="M300 130 C340 140 370 170 390 175 M300 170 C350 185 390 210 410 220 M300 210 C350 230 380 260 395 275" stroke="#E8F5E9" stroke-width="8" stroke-linecap="round"/>
    <circle cx="260" cy="220" r="10" fill="#E8F5E9"/>
    <circle cx="340" cy="220" r="10" fill="#E8F5E9"/>
    <circle cx="270" cy="180" r="7" fill="#E8F5E9"/>
    <circle cx="330" cy="180" r="7" fill="#E8F5E9"/>
    <text x="300" y="365" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#1B5E20" text-anchor="middle" letter-spacing="2">MONSTERA DELICIOSA</text>
  </svg>`,

  'prod-snake': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#F1F8E9" rx="16"/>
    <circle cx="300" cy="220" r="110" fill="#DCEDC8" opacity="0.6"/>
    <path d="M250 280 L350 280 L330 350 L270 350 Z" fill="#D84315"/>
    <rect x="240" y="270" width="120" height="12" rx="4" fill="#E64A19"/>
    <path d="M275 280 Q255 160 270 65 Q290 160 290 280" fill="#1B5E20" stroke="#FBC02D" stroke-width="3"/>
    <path d="M305 280 Q295 120 310 45 Q330 120 325 280" fill="#2E7D32" stroke="#FBC02D" stroke-width="3.5"/>
    <path d="M330 280 Q350 170 340 95 Q325 170 315 280" fill="#1B5E20" stroke="#FBC02D" stroke-width="2.5"/>
    <path d="M290 280 Q310 200 295 115 Q275 200 275 280" fill="#33691E" stroke="#FBC02D" stroke-width="2"/>
    <text x="300" y="380" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#33691E" text-anchor="middle" letter-spacing="2">SNAKE PLANT</text>
  </svg>`,

  'prod-peace-lily': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#E0F2F1" rx="16"/>
    <circle cx="300" cy="220" r="110" fill="#B2DFDB" opacity="0.6"/>
    <path d="M260 290 L340 290 L325 350 L275 350 Z" fill="#795548"/>
    <rect x="250" y="280" width="100" height="10" rx="3" fill="#8D6E63"/>
    <path d="M290 280 Q200 220 220 150 Q260 220 280 280" fill="#004D40"/>
    <path d="M310 280 Q400 220 380 150 Q340 220 320 280" fill="#004D40"/>
    <path d="M300 280 Q240 180 260 120 Q290 180 300 280" fill="#00695C"/>
    <path d="M300 280 Q360 180 340 120 Q310 180 300 280" fill="#00695C"/>
    <path d="M260 130 Q220 70 240 40 Q280 60 270 120" fill="#FFFFFF" stroke="#E0F2F1" stroke-width="1"/>
    <line x1="248" y1="95" x2="258" y2="70" stroke="#FFEE58" stroke-width="5" stroke-linecap="round"/>
    <path d="M340 130 Q380 70 360 40 Q320 60 330 120" fill="#FFFFFF" stroke="#E0F2F1" stroke-width="1"/>
    <line x1="352" y1="95" x2="342" y2="70" stroke="#FFEE58" stroke-width="5" stroke-linecap="round"/>
    <text x="300" y="380" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#004D40" text-anchor="middle" letter-spacing="2">PEACE LILY</text>
  </svg>`,

  'prod-orchid': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#F3E5F5" rx="16"/>
    <circle cx="300" cy="220" r="110" fill="#E1BEE7" opacity="0.6"/>
    <path d="M265 300 L335 300 L320 355 L280 355 Z" fill="#9E9E9E"/>
    <rect x="255" y="290" width="90" height="10" rx="3" fill="#BDBDBD"/>
    <path d="M300 290 Q330 160 280 85" fill="none" stroke="#4CAF50" stroke-width="4" stroke-linecap="round"/>
    <path d="M300 290 Q270 200 305 130" fill="none" stroke="#4CAF50" stroke-width="3" stroke-linecap="round"/>
    <path d="M290 300 Q210 280 230 250 Q270 280 290 300" fill="#2E7D32"/>
    <path d="M310 300 Q390 280 370 250 Q330 280 310 300" fill="#2E7D32"/>
    <g transform="translate(285, 95)">
      <ellipse cx="0" cy="0" rx="18" ry="12" fill="#E040FB" opacity="0.9"/>
      <ellipse cx="0" cy="0" rx="12" ry="18" fill="#E040FB" opacity="0.9"/>
      <circle cx="0" cy="0" r="6" fill="#FFEB3B"/>
    </g>
    <g transform="translate(305, 145)">
      <ellipse cx="0" cy="0" rx="20" ry="14" fill="#EA80FC" opacity="0.95"/>
      <ellipse cx="0" cy="0" rx="14" ry="20" fill="#EA80FC" opacity="0.95"/>
      <circle cx="0" cy="0" r="7" fill="#FFEB3B"/>
    </g>
    <g transform="translate(295, 60)">
      <ellipse cx="0" cy="0" rx="15" ry="10" fill="#F50057" opacity="0.85"/>
      <ellipse cx="0" cy="0" rx="10" ry="15" fill="#F50057" opacity="0.85"/>
      <circle cx="0" cy="0" r="5" fill="#FFEB3B"/>
    </g>
    <text x="300" y="380" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#4A148C" text-anchor="middle" letter-spacing="2">ELEGANT ORCHID</text>
  </svg>`,

  'prod-areca': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#EAF2F8" rx="16"/>
    <circle cx="300" cy="220" r="110" fill="#D4E6F1" opacity="0.6"/>
    <path d="M255 290 L345 290 L330 350 L270 350 Z" fill="#A04000"/>
    <rect x="245" y="280" width="110" height="10" rx="3" fill="#D35400"/>
    <path d="M300 280 Q210 170 140 140" fill="none" stroke="#1E8449" stroke-width="3" stroke-linecap="round"/>
    <path d="M300 280 Q390 170 460 140" fill="none" stroke="#1E8449" stroke-width="3" stroke-linecap="round"/>
    <path d="M300 280 Q250 140 210 70" fill="none" stroke="#27AE60" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M300 280 Q350 140 390 70" fill="none" stroke="#27AE60" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M300 280 Q300 120 300 50" fill="none" stroke="#2ECC71" stroke-width="4" stroke-linecap="round"/>
    <text x="300" y="380" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#145A32" text-anchor="middle" letter-spacing="2">ARECA PALM</text>
  </svg>`,

  'prod-tomato-seeds': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#FFF3E0" rx="16"/>
    <circle cx="300" cy="180" r="110" fill="#FFE0B2" opacity="0.6"/>
    <path d="M300 80 Q250 140 220 180 Q250 185 300 130" fill="#2E7D32" opacity="0.3"/>
    <path d="M300 80 Q350 140 380 180 Q350 185 300 130" fill="#2E7D32" opacity="0.3"/>
    <circle cx="260" cy="210" r="48" fill="#E53935"/>
    <ellipse cx="250" cy="190" rx="15" ry="10" fill="#FFF" opacity="0.25"/>
    <circle cx="340" cy="190" r="55" fill="#D32F2F"/>
    <ellipse cx="325" cy="170" rx="18" ry="12" fill="#FFF" opacity="0.25"/>
    <path d="M260 162 C265 155 285 150 300 155" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
    <path d="M340 135 C335 140 315 145 300 155" fill="none" stroke="#2E7D32" stroke-width="4" stroke-linecap="round"/>
    <path d="M260 162 L250 155 L257 165 L268 153 L264 165 L272 165 Z" fill="#1B5E20"/>
    <path d="M340 135 L332 125 L337 135 L348 123 L344 135 L352 131 Z" fill="#1B5E20"/>
    <text x="300" y="335" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#BF360C" text-anchor="middle" letter-spacing="1">PREMIUM TOMATO SEEDS</text>
    <text x="300" y="365" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#757575" text-anchor="middle" letter-spacing="1.5">ORGANIC • HEIRLOOM • HIGH YIELD</text>
  </svg>`,

  'prod-lavender-seeds': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#F3E5F5" rx="16"/>
    <circle cx="300" cy="190" r="110" fill="#E1BEE7" opacity="0.6"/>
    <line x1="260" y1="280" x2="280" y2="80" stroke="#4F378B" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="300" y1="280" x2="300" y2="70" stroke="#4F378B" stroke-width="3" stroke-linecap="round"/>
    <line x1="340" y1="280" x2="320" y2="90" stroke="#4F378B" stroke-width="2.5" stroke-linecap="round"/>
    <g fill="#7F67BE">
      <circle cx="273" cy="140" r="5"/>
      <circle cx="277" cy="120" r="5"/>
      <circle cx="282" cy="100" r="4.5"/>
    </g>
    <g fill="#6750A4">
      <circle cx="295" cy="140" r="6"/>
      <circle cx="305" cy="140" r="6"/>
      <circle cx="296" cy="120" r="5.5"/>
      <circle cx="304" cy="120" r="5.5"/>
      <circle cx="297" cy="100" r="5"/>
      <circle cx="303" cy="100" r="5"/>
    </g>
    <text x="300" y="335" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#311B92" text-anchor="middle" letter-spacing="1">FRAGRANT LAVENDER SEEDS</text>
    <text x="300" y="365" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#757575" text-anchor="middle" letter-spacing="1.5">ENGLISH LAVENDER • BEE FRIENDLY</text>
  </svg>`,

  'prod-ceramic-pot': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#EFEBE9" rx="16"/>
    <circle cx="300" cy="190" r="110" fill="#D7CCC8" opacity="0.6"/>
    <ellipse cx="300" cy="295" rx="90" ry="12" fill="#5D4037" opacity="0.15"/>
    <path d="M210 140 L390 140 L365 290 L235 290 Z" fill="#D84315"/>
    <rect x="195" y="115" width="210" height="28" rx="6" fill="#E64A19"/>
    <path d="M210 170 Q300 185 390 170 M220 230 Q300 245 380 230" fill="none" stroke="#FFCCBC" stroke-width="3" stroke-dasharray="10, 8"/>
    <circle cx="300" cy="205" r="8" fill="#FFCCBC"/>
    <circle cx="260" cy="200" r="8" fill="#FFCCBC"/>
    <circle cx="340" cy="200" r="8" fill="#FFCCBC"/>
    <text x="300" y="345" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#4E342E" text-anchor="middle" letter-spacing="1">HANDMADE CERAMIC POT</text>
    <text x="300" y="370" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#7D6608" text-anchor="middle" letter-spacing="1.5">TERRACOTTA • GLAZED INNER • 8" DIA</text>
  </svg>`,

  'prod-ergonomic-trowel': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#ECEFF1" rx="16"/>
    <circle cx="300" cy="190" r="110" fill="#CFD8DC" opacity="0.5"/>
    <g transform="translate(300, 180) rotate(-45)">
      <path d="M -15 -70 Q -30 20 -3 80 L 3 80 Q 30 20 15 -70 Z" fill="#90A4AE" stroke="#455A64" stroke-width="2"/>
      <line x1="0" y1="-70" x2="0" y2="80" stroke="#37474F" stroke-width="2.5"/>
      <rect x="-6" y="80" width="12" height="25" fill="#37474F" rx="2"/>
      <path d="M -8 105 L 8 105 L 12 180 C 12 195 -12 195 -12 180 Z" fill="#8D6E63" stroke="#5D4037" stroke-width="2"/>
    </g>
    <text x="300" y="345" font-family="system-ui, sans-serif" font-weight="800" font-size="20" fill="#263238" text-anchor="middle" letter-spacing="1">ERGONOMIC DIGGING TROWEL</text>
    <text x="300" y="370" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#546E7A" text-anchor="middle" letter-spacing="1.5">CARBON STEEL • TEAKWOOD HANDLE</text>
  </svg>`
};

// Generates a generic aesthetic placeholder SVG for custom-added products based on category/title
export function getGenericFallbackSvg(title: string, category: string): string {
  const isTool = category.toLowerCase().includes('tool') || category.toLowerCase().includes('gear') || title.toLowerCase().includes('trowel') || title.toLowerCase().includes('pot') || title.toLowerCase().includes('ceramic');
  const isSeed = category.toLowerCase().includes('seed') || category.toLowerCase().includes('packet') || title.toLowerCase().includes('seed') || title.toLowerCase().includes('sprout');
  
  const bgColor = isTool ? '#ECEFF1' : isSeed ? '#FFF3E0' : '#E8F5E9';
  const circleColor = isTool ? '#CFD8DC' : isSeed ? '#FFE0B2' : '#C8E6C9';
  const labelColor = isTool ? '#37474F' : isSeed ? '#E65100' : '#1B5E20';
  const accentColor = isTool ? '#90A4AE' : isSeed ? '#FF6D00' : '#4CAF50';
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="${bgColor}" rx="16"/>
    <circle cx="300" cy="180" r="110" fill="${circleColor}" opacity="0.6"/>
    
    ${isTool ? `
      <!-- Gardening Tool Outline -->
      <path d="M290 100 L310 100 L315 200 L285 200 Z" fill="${accentColor}"/>
      <rect x="280" y="200" width="40" height="80" rx="8" fill="#8D6E63"/>
    ` : isSeed ? `
      <!-- Seed/Sprout Outline -->
      <path d="M300 120 C270 120 250 160 250 200 C250 240 270 260 300 260 C330 260 350 240 350 200 C350 160 330 120 300 120 Z" fill="${accentColor}"/>
      <path d="M300 100 L300 150 M280 120 Q300 110 320 120" stroke="#E65100" stroke-width="4" stroke-linecap="round"/>
    ` : `
      <!-- Clean Minimal Plant Outline -->
      <path d="M250 280 L350 280 L330 350 L270 350 Z" fill="#D84315"/>
      <path d="M300 100 Q260 160 300 280 M300 100 Q340 160 300 280" fill="${accentColor}"/>
      <path d="M280 200 Q240 210 260 170 C280 190 280 200 280 200" fill="#2E7D32"/>
      <path d="M320 200 Q360 210 340 170 C320 190 320 200 320 200" fill="#2E7D32"/>
    `}
    
    <text x="300" y="340" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="${labelColor}" text-anchor="middle" letter-spacing="1">
      ${title.toUpperCase()}
    </text>
    <text x="300" y="365" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="#757575" text-anchor="middle" letter-spacing="1.5">
      GREENEST SPECIALIST CATALOG INDEX
    </text>
  </svg>`;
}

export function encodeSvgToDataUri(svgString: string): string {
  // Safe modern URL URI encoder to prevent rendering lag while keeping markup clean and offline
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export function getProductDataUri(id: string, name = '', category = ''): string {
  const rawSvg = PRODUCT_SVGS[id] || getGenericFallbackSvg(name || 'GreenNest Item', category || 'General');
  return encodeSvgToDataUri(rawSvg);
}

export function getProductImage(id: string, name = '', category = ''): string {
  if (LOCAL_IMAGES[id]) {
    return LOCAL_IMAGES[id];
  }
  return getProductDataUri(id, name, category);
}
