const opentype = require('opentype.js');
const fs = require('fs');

const fonts = ['simkai.ttf', 'SIMLI.TTF', 'simfang.ttf', 'simhei.ttf'];
for (const f of fonts) {
  try {
    const data = fs.readFileSync('C:\\Windows\\Fonts\\' + f);
    const font = opentype.parse(data);
    const ch = '集合';
    const glyph = font.charToGlyph(ch);
    const path = glyph.getPath(0, 0, 100);
    const svg = path.toSVG();
    console.log(f + ': ' + ch + ' path length=' + svg.length + ' first chars=' + svg.substring(0,80));
  } catch(e) {
    console.log(f + ': ' + e.message);
  }
}
