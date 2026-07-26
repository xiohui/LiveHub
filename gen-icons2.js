const sharp = require('sharp');
const fs = require('fs');
const opentype = require('opentype.js');

// Load fonts
function getCharPaths(fontFile, text, scale, offsetX, offsetY) {
  const data = fs.readFileSync(fontFile);
  const font = opentype.parse(data);
  const glyph = font.charToGlyph(text);
  const path = glyph.getPath(0, -font.tables.hhea.ascender, font.tables.hhea.ascender - font.tables.hhea.descender);
  return path.toSVG();
}

// ===== CONCEPT A: Digital Seal (数字印章) =====
// SIMLI clerical script + red seal + gold accents + modern cyan glow
async function conceptA() {
  const charPath = getCharPaths('C:\\Windows\\Fonts\\SIMLI.TTF', '集合', 1, 256, 298);
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1a2e"/>
        <stop offset="100%" stop-color="#0f0c29"/>
      </linearGradient>
      <linearGradient id="seal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#dc2626"/>
        <stop offset="40%" stop-color="#b91c1c"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </linearGradient>
      <linearGradient id="sealGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ef4444" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="charColor" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef3c7"/>
        <stop offset="50%" stop-color="#fde68a"/>
        <stop offset="100%" stop-color="#fbbf24"/>
      </linearGradient>
      <filter id="charGlow">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.6"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    <rect x="56" y="56" width="400" height="400" rx="24" fill="none" stroke="#dc2626" stroke-width="3" opacity="0.3"/>
    <rect x="66" y="66" width="380" height="380" rx="16" fill="url(#seal)" filter="url(#shadow)" opacity="0.15"/>
    <rect x="66" y="66" width="380" height="380" rx="16" fill="none" stroke="url(#seal)" stroke-width="4"/>
    <rect x="66" y="66" width="380" height="380" rx="16" fill="url(#sealGlow)"/>
    <!-- Top cloud motif -->
    <path d="M160,110 Q180,90 210,100 Q230,85 260,95 Q290,85 310,100 Q340,90 360,110" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.5"/>
    <!-- Bottom cloud motif -->
    <path d="M160,410 Q180,430 210,420 Q230,435 260,425 Q290,435 310,420 Q340,430 360,410" fill="none" stroke="#dc2626" stroke-width="2" opacity="0.5"/>
    <!-- Circle accent -->
    <circle cx="256" cy="256" r="115" fill="none" stroke="#dc2626" stroke-width="1" opacity="0.3"/>
    <circle cx="256" cy="256" r="108" fill="none" stroke="#dc2626" stroke-width="1" opacity="0.15"/>
    <!-- Characters with gold gradient -->
    <g transform="translate(96, 130) scale(1.1)" fill="url(#charColor)" filter="url(#charGlow)" opacity="0.95">
      ${charPath}
    </g>
    <!-- Modern tech accent: cyan dot -->
    <circle cx="370" cy="395" r="5" fill="#00d4ff" opacity="0.7"/>
    <circle cx="370" cy="395" r="8" fill="#00d4ff" opacity="0.2"/>
    <circle cx="148" cy="395" r="3" fill="#00d4ff" opacity="0.5"/>
  </svg>`;
  
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('icons/concept-a.png');
  console.log('A done');
}

// ===== CONCEPT B: Ink & Circuit (水墨电路) =====
// simkai calligraphy + inkwash + neon circuit lines
async function conceptB() {
  const charPath = getCharPaths('C:\\Windows\\Fonts\\simkai.ttf', '集合', 1, 256, 290);
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#050510"/>
        <stop offset="50%" stop-color="#0a0e1a"/>
        <stop offset="100%" stop-color="#0f0c29"/>
      </linearGradient>
      <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="50%" stop-color="#312e81"/>
        <stop offset="100%" stop-color="#1e1b4b"/>
      </linearGradient>
      <linearGradient id="charGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e0e7ff"/>
        <stop offset="40%" stop-color="#a5b4fc"/>
        <stop offset="100%" stop-color="#6366f1"/>
      </linearGradient>
      <linearGradient id="circuit" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00d4ff" stop-opacity="0"/>
        <stop offset="30%" stop-color="#00d4ff" stop-opacity="0.8"/>
        <stop offset="70%" stop-color="#7c3aed" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="8"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    <!-- Ink wash background circle -->
    <circle cx="256" cy="256" r="180" fill="url(#ink)" opacity="0.5"/>
    <circle cx="256" cy="256" r="175" fill="none" stroke="#312e81" stroke-width="1" opacity="0.3"/>
    <!-- Circuit lines - left side -->
    <g fill="none" stroke="url(#circuit)" stroke-width="2" opacity="0.7" filter="url(#glow)">
      <path d="M80,256 L120,256 L140,236 L190,236"/>
      <path d="M100,200 L140,200 L160,180 L190,180"/>
      <path d="M90,310 L130,310 L150,330 L190,330"/>
    </g>
    <!-- Circuit lines - right side -->
    <g fill="none" stroke="url(#circuit)" stroke-width="2" opacity="0.5">
      <path d="M430,256 L390,256 L370,276 L330,276" stroke-dasharray="4,4"/>
      <path d="M410,200 L370,200 L350,180 L330,180" stroke-dasharray="4,4"/>
    </g>
    <!-- Characters -->
    <g transform="translate(90, 125) scale(1.15)" fill="url(#charGrad)" filter="url(#glow)" opacity="0.9">
      ${charPath}
    </g>
    <!-- Tech dots -->
    <circle cx="190" cy="236" r="3" fill="#00d4ff" filter="url(#glow)"/>
    <circle cx="190" cy="180" r="2.5" fill="#00d4ff" filter="url(#glow)"/>
    <circle cx="190" cy="330" r="2.5" fill="#7c3aed" filter="url(#glow)"/>
    <circle cx="330" cy="276" r="2" fill="#7c3aed"/>
    <circle cx="330" cy="180" r="2" fill="#7c3aed"/>
  </svg>`;
  
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('icons/concept-b.png');
  console.log('B done');
}

// ===== CONCEPT C: Jade Bi (玉璧) =====
// Circular jade with simfang characters, classical symmetry + modern
async function conceptC() {
  const charPath = getCharPaths('C:\\Windows\\Fonts\\simfang.ttf', '集合', 1, 256, 290);
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0a0e1a"/>
        <stop offset="100%" stop-color="#1a1a2e"/>
      </linearGradient>
      <linearGradient id="jade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#34d399"/>
        <stop offset="30%" stop-color="#10b981"/>
        <stop offset="60%" stop-color="#059669"/>
        <stop offset="100%" stop-color="#047857"/>
      </linearGradient>
      <linearGradient id="jadeInner" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#6ee7b7" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#34d399" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.6"/>
      </linearGradient>
      <radialGradient id="jadeGlow" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#a7f3d0" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.5"/>
      </filter>
      <filter id="goldGlow">
        <feGaussianBlur stdDeviation="2" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    <!-- Outer jade ring (bi) -->
    <circle cx="256" cy="256" r="160" fill="url(#jade)" filter="url(#shadow)" opacity="0.9"/>
    <circle cx="256" cy="256" r="160" fill="url(#jadeGlow)"/>
    <circle cx="256" cy="256" r="152" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.5"/>
    <!-- Inner cutout -->
    <circle cx="256" cy="256" r="92" fill="#0a0e1a"/>
    <circle cx="256" cy="256" r="92" fill="url(#jadeInner)" opacity="0.5"/>
    <circle cx="256" cy="256" r="85" fill="none" stroke="url(#gold)" stroke-width="1.5" opacity="0.4"/>
    <!-- Characters in center -->
    <g transform="translate(90, 125) scale(1.1)" fill="url(#gold)" filter="url(#goldGlow)" opacity="0.9">
      ${charPath}
    </g>
    <!-- Decorative dots around rim -->
    <g fill="url(#gold)" opacity="0.6">
      <circle cx="256" cy="106" r="3"/>
      <circle cx="370" cy="140" r="2.5"/>
      <circle cx="406" cy="256" r="3"/>
      <circle cx="370" cy="372" r="2.5"/>
      <circle cx="256" cy="406" r="3"/>
      <circle cx="142" cy="372" r="2.5"/>
      <circle cx="106" cy="256" r="3"/>
      <circle cx="142" cy="140" r="2.5"/>
    </g>
    <!-- Cloud pattern on outer jade -->
    <path d="M180,120 Q195,108 210,118 Q225,108 240,118" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <path d="M280,390 Q295,402 310,392 Q325,402 340,392" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
  </svg>`;
  
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('icons/concept-c.png');
  console.log('C done');
}

// ===== CONCEPT D: Tech Calligraphy (科技书法) =====
// Large bold simhei characters with glassmorphism + neon accent
async function conceptD() {
  const charPath = getCharPaths('C:\\Windows\\Fonts\\simhei.ttf', '集合', 1, 256, 290);
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f0c29"/>
        <stop offset="50%" stop-color="#1e1b4b"/>
        <stop offset="100%" stop-color="#0a0e1a"/>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.04)"/>
      </linearGradient>
      <linearGradient id="charColor" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#e0e7ff"/>
        <stop offset="60%" stop-color="#a5b4fc"/>
        <stop offset="100%" stop-color="#818cf8"/>
      </linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#00d4ff"/>
        <stop offset="50%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#00d4ff"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="blur">
        <feGaussianBlur stdDeviation="1.5"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    <!-- Glass card -->
    <rect x="46" y="46" width="420" height="420" rx="32" fill="url(#glass)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    <rect x="46" y="46" width="420" height="420" rx="32" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" transform="translate(2,2)"/>
    <!-- Characters -->
    <g transform="translate(90, 125) scale(1.2)" fill="url(#charColor)" filter="url(#glow)" opacity="0.95">
      ${charPath}
    </g>
    <!-- Bottom accent line -->
    <rect x="120" y="380" width="272" height="3" rx="1.5" fill="url(#accent)" filter="url(#glow)" opacity="0.8"/>
    <!-- Top accent dot -->
    <circle cx="256" cy="130" r="4" fill="#00d4ff" opacity="0.6" filter="url(#glow)"/>
    <!-- Corner accents -->
    <path d="M80,70 L100,70 L100,80" fill="none" stroke="#00d4ff" stroke-width="2" opacity="0.4"/>
    <path d="M432,70 L412,70 L412,80" fill="none" stroke="#7c3aed" stroke-width="2" opacity="0.4"/>
    <path d="M80,442 L100,442 L100,432" fill="none" stroke="#7c3aed" stroke-width="2" opacity="0.4"/>
    <path d="M432,442 L412,442 L412,432" fill="none" stroke="#00d4ff" stroke-width="2" opacity="0.4"/>
  </svg>`;
  
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('icons/concept-d.png');
  console.log('D done');
}

Promise.all([conceptA(), conceptB(), conceptC(), conceptD()]).then(() => console.log('All done'));
