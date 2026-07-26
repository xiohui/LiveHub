const sharp = require('sharp');

function save(name, svg) {
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('icons/' + name + '.png');
}

// App palette
// bg: #0a0e1a, glass: rgba(255,255,255,0.05), accent: #00d4ff, accent2: #7c3aed
// gradient: 135deg #00d4ff → #7c3aed

// ============================================================
// S1: 纵目 (Staring Eye)
// Sanxingdui protruding-pupil eye mask → tech "all-seeing" eye
// Bronze/gold frame, cyan neon iris, angular mask geometry
// ============================================================
async function s1() {
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="45%" cy="40%" r="65%">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#0a0e1a"/>
      </radialGradient>
      <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="30%" stop-color="#d97706"/>
        <stop offset="70%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef3c7"/>
        <stop offset="30%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="iris" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00d4ff"/>
        <stop offset="50%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="strongGlow">
        <feGaussianBlur stdDeviation="10" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="3"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    
    <!-- Glass ambient circle -->
    <circle cx="256" cy="256" r="190" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    
    <!-- Outer bronze mask frame - angular U-shape brow -->
    <g fill="none" stroke="url(#bronze)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.8">
      <!-- Brow - angular, sweeping up at outer corners (Sanxingdui signature) -->
      <path d="M100,190 Q180,130 256,150 Q332,130 412,190" stroke-width="7" filter="url(#glow)"/>
      <!-- Outer brow extensions sweeping up -->
      <path d="M100,190 L80,160" stroke-width="5" stroke-linecap="round"/>
      <path d="M412,190 L432,160" stroke-width="5" stroke-linecap="round"/>
      <!-- Cheek lines angling down -->
      <path d="M130,200 Q120,280 155,360" stroke-width="4" opacity="0.5"/>
      <path d="M382,200 Q392,280 357,360" stroke-width="4" opacity="0.5"/>
    </g>

    <!-- Eye almond shape -->
    <g fill="none" stroke="url(#gold)" stroke-width="4">
      <path d="M146,240 Q180,195 256,210 Q332,195 366,240 Q332,310 256,295 Q180,310 146,240Z" stroke-width="5" filter="url(#glow)"/>
    </g>

    <!-- Inner eye glow -->
    <ellipse cx="256" cy="248" rx="85" ry="40" fill="url(#iris)" opacity="0.15" filter="url(#strongGlow)"/>

    <!-- Protruding pupil (Sanxingdui signature - the 纵目) -->
    <!-- A cone/cylinder projecting forward -->
    <g filter="url(#glow)">
      <!-- Pupil cylinder -->
      <rect x="226" y="233" width="60" height="35" rx="6" fill="url(#iris)"/>
      <!-- Pupil front face -->
      <ellipse cx="256" cy="250" rx="28" ry="15" fill="#ffffff" opacity="0.9"/>
      <ellipse cx="256" cy="250" rx="18" ry="10" fill="url(#iris)"/>
      <ellipse cx="256" cy="250" rx="8" ry="5" fill="#ffffff" opacity="0.8"/>
    </g>

    <!-- Tech data dots -->
    <g fill="url(#iris)" filter="url(#glow)">
      <circle cx="100" cy="360" r="4" opacity="0.6"/>
      <circle cx="412" cy="360" r="4" opacity="0.6"/>
      <circle cx="256" cy="385" r="3" opacity="0.4"/>
    </g>
  </svg>`;
  await save('concept-s1', svg);
  console.log('S1 done');
}

// ============================================================
// S2: 日轮 (Sun Wheel)
// Sanxingdui bronze sun wheel (5 spokes) → data hub
// Angular spokes transform into data/tech connections
// Central glowing core
// ============================================================
async function s2() {
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#0a0e1a"/>
      </radialGradient>
      <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="40%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
      <linearGradient id="tech" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00d4ff"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
      <radialGradient id="core" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#00d4ff"/>
        <stop offset="70%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="strongGlow">
        <feGaussianBlur stdDeviation="12"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    
    <!-- Ambient glow behind wheel -->
    <circle cx="256" cy="256" r="140" fill="url(#tech)" opacity="0.06" filter="url(#strongGlow)"/>
    
    <!-- Glass ring base -->
    <circle cx="256" cy="256" r="175" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    
    <!-- Outer rim - bronze with tech notches -->
    <circle cx="256" cy="256" r="150" fill="none" stroke="url(#bronze)" stroke-width="6" opacity="0.6" filter="url(#glow)"/>
    <circle cx="256" cy="256" r="148" fill="none" stroke="rgba(0,212,255,0.08)" stroke-width="1"/>
    
    <!-- Rim notches (Sanxingdui sun wheel teeth) -->
    <g fill="url(#bronze)" opacity="0.5">
      <!-- 5 groups of 3 notches each, at 72deg intervals -->
      ${[0,1,2,3,4].map(i => {
        const a = i * 72 - 90;
        return `<g transform="rotate(${a},256,256)">
          <rect x="250" y="98" width="12" height="10" rx="2" fill="url(#tech)" opacity="0.7"/>
          <rect x="245" y="84" width="22" height="8" rx="2"/>
        </g>`;
      }).join('')}
    </g>

    <!-- 5 spokes -->
    <g stroke-linecap="round">
      ${[0,1,2,3,4].map(i => {
        const a = i * 72 - 90;
        return `<g transform="rotate(${a},256,256)">
          <!-- Bronze spoke base -->
          <line x1="256" y1="150" x2="256" y2="280" stroke="url(#bronze)" stroke-width="6" opacity="0.5"/>
          <!-- Tech glow overlay -->
          <line x1="256" y1="160" x2="256" y2="270" stroke="url(#tech)" stroke-width="3" opacity="0.7" filter="url(#glow)"/>
          <!-- Data node at midpoint -->
          <rect x="250" y="195" width="12" height="12" rx="3" fill="url(#tech)" filter="url(#glow)"/>
        </g>`;
      }).join('')}
    </g>

    <!-- Central hub -->
    <circle cx="256" cy="256" r="35" fill="url(#bg)" stroke="url(#bronze)" stroke-width="4" filter="url(#glow)"/>
    <circle cx="256" cy="256" r="28" fill="url(#core)" filter="url(#glow)"/>
    <circle cx="256" cy="256" r="14" fill="#ffffff" opacity="0.3"/>
    <circle cx="256" cy="256" r="6" fill="#ffffff" opacity="0.8"/>
    
    <!-- Tech accent dots -->
    <g fill="url(#tech)" filter="url(#glow)">
      <circle cx="130" cy="130" r="3.5" opacity="0.5"/>
      <circle cx="382" cy="130" r="3.5" opacity="0.5"/>
      <circle cx="130" cy="382" r="3" opacity="0.3"/>
      <circle cx="382" cy="382" r="3" opacity="0.3"/>
    </g>
  </svg>`;
  await save('concept-s2', svg);
  console.log('S2 done');
}

// ============================================================
// S3: 神面 (Divine Mask Totem)
// Simplified Sanxingdui bronze mask → tech emblem
// Angular eyes, geometric mouth, prominent ears
// Symmetric, powerful, iconic
// ============================================================
async function s3() {
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="40%" cy="35%" r="70%">
        <stop offset="0%" stop-color="#0f0c29"/>
        <stop offset="60%" stop-color="#0a0e1a"/>
        <stop offset="100%" stop-color="#050510"/>
      </radialGradient>
      <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="40%" stop-color="#d97706"/>
        <stop offset="80%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
      <linearGradient id="goldMask" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef3c7"/>
        <stop offset="50%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
      <linearGradient id="cyberEye" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00d4ff"/>
        <stop offset="100%" stop-color="#7c3aed"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="strongGlow">
        <feGaussianBlur stdDeviation="10"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    
    <!-- Glass background -->
    <circle cx="256" cy="256" r="185" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    
    <!-- Prominent ears (Sanxingdui masks have huge ears) -->
    <g fill="none" stroke="url(#bronze)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.7" filter="url(#glow)">
      <!-- Left ear -->
      <path d="M105,265 Q75,245 80,220 Q85,195 110,200"/>
      <path d="M80,220 L60,215" stroke-width="4"/>
      <!-- Right ear -->  
      <path d="M407,265 Q437,245 432,220 Q427,195 402,200"/>
      <path d="M432,220 L452,215" stroke-width="4"/>
    </g>

    <!-- Brow ridge - continuous angular bar -->
    <path d="M120,210 Q180,170 256,180 Q332,170 392,210" fill="none" stroke="url(#goldMask)" stroke-width="7" stroke-linecap="round" filter="url(#glow)"/>
    
    <!-- Left eye -->
    <g>
      <path d="M140,240 Q175,218 210,235 Q185,260 140,240Z" fill="none" stroke="url(#goldMask)" stroke-width="4"/>
      <ellipse cx="175" cy="240" rx="22" ry="12" fill="url(#cyberEye)" opacity="0.3" filter="url(#strongGlow)"/>
      <rect x="160" y="233" width="28" height="14" rx="4" fill="url(#cyberEye)" filter="url(#glow)"/>
      <rect x="165" y="236" width="18" height="8" rx="2" fill="#ffffff" opacity="0.8"/>
    </g>
    
    <!-- Right eye -->
    <g>
      <path d="M372,240 Q337,218 302,235 Q327,260 372,240Z" fill="none" stroke="url(#goldMask)" stroke-width="4"/>
      <ellipse cx="337" cy="240" rx="22" ry="12" fill="url(#cyberEye)" opacity="0.3" filter="url(#strongGlow)"/>
      <rect x="322" y="233" width="28" height="14" rx="4" fill="url(#cyberEye)" filter="url(#glow)"/>
      <rect x="325" y="236" width="18" height="8" rx="2" fill="#ffffff" opacity="0.8"/>
    </g>

    <!-- Nose - triangular -->
    <path d="M240,260 L256,310 L272,260" fill="none" stroke="url(#goldMask)" stroke-width="4" stroke-linejoin="round"/>
    <line x1="256" y1="310" x2="256" y2="330" stroke="url(#goldMask)" stroke-width="4" stroke-linecap="round"/>

    <!-- Mouth - wide, geometric grin (Sanxingdui mask style) -->
    <g fill="none" stroke="url(#goldMask)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M180,360 Q256,385 332,360" stroke-width="5"/>
      <!-- Teeth/grid -->
      <line x1="205" y1="362" x2="210" y2="375" stroke-width="3"/>
      <line x1="230" y1="368" x2="232" y2="382" stroke-width="3"/>
      <line x1="256" y1="372" x2="256" y2="386" stroke-width="3"/>
      <line x1="280" y1="371" x2="282" y2="382" stroke-width="3"/>
      <line x1="307" y1="362" x2="302" y2="375" stroke-width="3"/>
    </g>

    <!-- Crown/head ornament -->
    <g fill="none" stroke="url(#bronze)" stroke-width="3" opacity="0.5">
      <path d="M200,168 L210,120 L220,168" stroke-width="4"/>
      <path d="M256,175 L256,115" stroke-width="4"/>
      <path d="M292,168 L302,120 L312,168" stroke-width="4"/>
    </g>

    <!-- Tech data dots -->
    <g fill="url(#cyberEye)" filter="url(#glow)">
      <circle cx="256" cy="420" r="3.5" opacity="0.5"/>
      <circle cx="440" cy="200" r="3" opacity="0.3"/>
      <circle cx="72" cy="200" r="3" opacity="0.3"/>
    </g>
  </svg>`;
  await save('concept-s3', svg);
  console.log('S3 done');
}

Promise.all([s1(), s2(), s3()]).then(() => console.log('All done'));
