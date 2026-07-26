const sharp = require('sharp');
const fs = require('fs');
const opentype = require('opentype.js');

function svgToPng(name, svg) {
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('icons/' + name + '.png');
}

// ===== Colour palette from app =====
// --bg-primary: #0a0e1a
// accent: #00d4ff (cyan)
// accent-secondary: #7c3aed (purple)
// gradient-main: linear-gradient(135deg,#00d4ff,#7c3aed)
// --bg-glass: rgba(255,255,255,0.05)
// --border-glass: rgba(255,255,255,0.08)

// ============================================================
// CONCEPT O1: 甲骨光痕 (Oracle Light Traces)
// Two oracle-bone pictographs side by side
// Glowing gradient strokes on glass background
// ============================================================
async function conceptO1() {
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#0f0c29"/>
        <stop offset="100%" stop-color="#0a0e1a"/>
      </radialGradient>
      <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00d4ff"/>
        <stop offset="50%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#00d4ff"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.5"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    <!-- Glass background circle -->
    <circle cx="256" cy="256" r="180" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <circle cx="256" cy="256" r="175" fill="none" stroke="rgba(0,212,255,0.06)" stroke-width="1"/>
    
    <!-- 集 (gather) - oracle bone interpretation: three birds atop tree -->
    <!-- Three bird/mountain peaks at top - stylized oracle form -->
    <g fill="none" stroke="url(#strokeGrad)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
      <!-- Left bird peak -->
      <path d="M156,220 Q166,130 186,160 Q176,150 166,165 Q160,180 160,200 L156,220Z" />
      <!-- Center bird peak -->
      <path d="M226,240 Q236,140 256,170 Q246,155 236,175 Q230,195 230,220 L226,240Z" />
      <!-- Right bird peak -->
      <path d="M296,260 Q306,160 326,190 Q316,175 306,195 Q300,215 300,240 L296,260Z" />
      <!-- Tree trunk -->
      <path d="M246,240 Q250,280 250,320" stroke-width="6" />
      <!-- Tree branches left -->
      <path d="M250,270 Q220,290 210,310" />
      <path d="M250,290 Q220,310 215,325" />
      <!-- Tree branches right -->
      <path d="M250,270 Q280,290 290,310" />
      <path d="M250,290 Q280,310 285,325" />
    </g>

    <!-- 合 (together) - oracle bone: lid covering mouth -->
    <g fill="none" stroke="url(#strokeGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
      <!-- Lid/roof -->
      <path d="M140,370 Q190,310 240,340" />
      <path d="M240,340 Q290,310 340,370" />
      <!-- Horizontal separator -->
      <path d="M170,380 L310,380" stroke-width="5" />
      <!-- Mouth/vessel -->
      <path d="M180,380 L180,430 L300,430 L300,380" />
      <!-- Inner detail - ancient vessel marking -->
      <path d="M220,395 L260,395" stroke-width="3" opacity="0.5" />
      <path d="M230,410 L270,410" stroke-width="3" opacity="0.5" />
    </g>

    <!-- Tech accent dots -->
    <circle cx="80" cy="130" r="3" fill="#00d4ff" opacity="0.4" filter="url(#glow)"/>
    <circle cx="432" cy="130" r="3" fill="#7c3aed" opacity="0.4" filter="url(#glow)"/>
    <circle cx="80" cy="420" r="2.5" fill="#7c3aed" opacity="0.3" filter="url(#glow)"/>
    <circle cx="432" cy="420" r="2.5" fill="#00d4ff" opacity="0.3" filter="url(#glow)"/>
  </svg>`;
  await svgToPng('concept-o1', svg);
  console.log('O1 done');
}

// ============================================================
// CONCEPT O2: 青铜甲骨 (Bronze Oracle)
// Seal/stamp style with bronze-gold gradient
// Oracle characters rendered in ancient bronze vessel style
// Modern twist: cyan neon outline + glass background
// ============================================================
async function conceptO2() {
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#111827"/>
        <stop offset="100%" stop-color="#0a0e1a"/>
      </radialGradient>
      <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="30%" stop-color="#d97706"/>
        <stop offset="60%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#92400e"/>
      </linearGradient>
      <linearGradient id="bronzeLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fde68a"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
      <linearGradient id="cyberGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#7c3aed" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#00d4ff" stop-opacity="0.6"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="innerGlow">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    
    <!-- Seal/frame border -->
    <rect x="66" y="66" width="380" height="380" rx="20" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    <rect x="76" y="76" width="360" height="360" rx="16" fill="none" stroke="url(#bronze)" stroke-width="2" opacity="0.3" filter="url(#glow)"/>
    <rect x="76" y="76" width="360" height="360" rx="16" fill="rgba(217,119,6,0.04)"/>
    
    <!-- Corner ornaments (bronze vessel pattern inspired) -->
    <g fill="none" stroke="url(#bronzeLight)" stroke-width="2" opacity="0.4">
      <path d="M96,96 Q110,90 120,100 Q110,110 96,96"/>
      <path d="M416,96 Q402,90 392,100 Q402,110 416,96"/>
      <path d="M96,416 Q110,422 120,412 Q110,402 96,416"/>
      <path d="M416,416 Q402,422 392,412 Q402,402 416,416"/>
    </g>

    <!-- 集 - bronze oracle form (three birds pooling to tree) -->
    <g fill="none" stroke="url(#bronzeLight)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
      <!-- Three birds coming together (the essence of 集/gathering) -->
      <path d="M160,210 Q170,140 195,170" />
      <path d="M175,215 L185,160" stroke-width="4" />
      <path d="M220,230 Q235,145 255,180" />
      <path d="M235,235 L245,170" stroke-width="4" />
      <path d="M280,250 Q295,165 315,195" />
      <path d="M295,252 L305,188" stroke-width="4" />
      <!-- Trunk merging downward -->
      <path d="M250,220 Q248,280 248,330" stroke-width="7" />
      <!-- Roots/branches -->
      <path d="M248,260 Q215,285 200,305" stroke-width="4" />
      <path d="M248,285 Q215,310 210,330" stroke-width="4" />
      <path d="M248,260 Q280,285 298,305" stroke-width="4" />
      <path d="M248,285 Q280,310 285,330" stroke-width="4" />
    </g>

    <!-- 合 - bronze oracle form (vessel with cover) -->
    <g fill="none" stroke="url(#bronzeLight)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
      <!-- Cover/lid -->
      <path d="M200,365 Q230,330 260,340" />
      <path d="M260,340 Q290,330 320,365" />
      <!-- Vessel body -->
      <path d="M210,372 L210,430 Q240,445 280,445 Q320,445 310,372" stroke-width="6" />
      <!-- Bronze pattern lines -->
      <path d="M235,385 L285,385" stroke-width="3" opacity="0.6"/>
      <path d="M225,400 L295,400" stroke-width="3" opacity="0.6"/>
      <path d="M235,415 L285,415" stroke-width="3" opacity="0.6"/>
    </g>

    <!-- Modern cyber accent - thin cyan outer glow border -->
    <rect x="66" y="66" width="380" height="380" rx="20" fill="none" stroke="url(#cyberGlow)" stroke-width="1" filter="url(#glow)" opacity="0.4"/>
  </svg>`;
  await svgToPng('concept-o2', svg);
  console.log('O2 done');
}

// ============================================================
// CONCEPT O3: 象形图腾 (Pictographic Totem)
// Single unified emblem integrating 集合 into one symbol
// Oracle pictograph + modern cyberpunk neon
// Most abstract, most tech-forward
// ============================================================
async function conceptO3() {
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="40%" cy="40%" r="70%">
        <stop offset="0%" stop-color="#0f0c29"/>
        <stop offset="50%" stop-color="#0a0e1a"/>
        <stop offset="100%" stop-color="#050510"/>
      </radialGradient>
      <linearGradient id="mainGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00d4ff"/>
        <stop offset="40%" stop-color="#6366f1"/>
        <stop offset="70%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#00d4ff"/>
      </linearGradient>
      <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.3"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="12"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#bg)"/>
    
    <!-- Background ambient glow -->
    <circle cx="256" cy="256" r="160" fill="url(#accentGrad)" filter="url(#softGlow)"/>

    <!-- Outer glass ring -->
    <circle cx="256" cy="256" r="190" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <circle cx="256" cy="256" r="175" fill="none" stroke="rgba(0,212,255,0.06)" stroke-width="1.5"/>
    <circle cx="256" cy="256" r="80" fill="none" stroke="rgba(124,58,237,0.08)" stroke-width="1"/>

    <!-- ===== CENTRAL TOTEM ===== -->
    <!-- Integrated 集 + 合 in a single flowing pictograph -->
    <g fill="none" stroke="url(#mainGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
      <!-- Three ascending bird-branches (集) merging into -->
      <!-- the covering vessel (合) at bottom -->
      
      <!-- Left bird/stroke - rising -->
      <path d="M170,340 Q155,270 175,230 Q185,210 200,215" />
      <path d="M175,230 L150,240" stroke-width="4" />
      <path d="M175,230 L160,215" stroke-width="4" />
      
      <!-- Center bird/stroke - tallest -->
      <path d="M240,340 Q235,240 250,180 Q258,160 270,165" />
      <path d="M250,180 L225,195" stroke-width="4" />
      <path d="M250,180 L235,165" stroke-width="4" />
      
      <!-- Right bird/stroke -->
      <path d="M310,340 Q325,270 315,240 Q310,220 295,225" />
      <path d="M315,240 L340,250" stroke-width="4" />
      <path d="M315,240 L330,225" stroke-width="4" />
      
      <!-- Connecting beam (the 合 cover) -->
      <path d="M170,340 Q190,315 230,325" />
      <path d="M230,325 Q270,315 310,340" />
      
      <!-- The vessel body (合 mouth) -->
      <path d="M195,345 L195,400 Q256,415 316,400 L316,345" />
      
      <!-- Vessel inner markings -->
      <path d="M220,360 L292,360" stroke-width="3.5" opacity="0.6"/>
      <path d="M215,378 L297,378" stroke-width="3.5" opacity="0.6"/>
    </g>

    <!-- Tech data dots orbiting -->
    <g fill="url(#mainGrad)" filter="url(#glow)">
      <circle cx="130" cy="380" r="4" opacity="0.7"/>
      <circle cx="382" cy="380" r="3" opacity="0.5"/>
      <circle cx="160" cy="120" r="3" opacity="0.4"/>
      <circle cx="360" cy="140" r="4" opacity="0.6"/>
      <circle cx="400" cy="270" r="2.5" opacity="0.3"/>
    </g>
    
    <!-- Fine data circuit lines -->
    <g fill="none" stroke="url(#mainGrad)" stroke-width="1.5" opacity="0.3" filter="url(#glow)">
      <path d="M105,380 L130,380"/>
      <path d="M382,380 L400,380"/>
      <path d="M160,120 L256,120 L256,165"/>
    </g>
  </svg>`;
  await svgToPng('concept-o3', svg);
  console.log('O3 done');
}

Promise.all([conceptO1(), conceptO2(), conceptO3()]).then(() => console.log('All done'));
