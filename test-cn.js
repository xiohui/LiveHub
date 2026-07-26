const sharp = require('sharp');
sharp(Buffer.from('<svg width="200" height="100"><text x="10" y="60" font-size="50" fill="red" font-family="sans-serif">集合</text></svg>'))
  .png().toFile('icons/_test-cn.png')
  .then(() => console.log('OK'))
  .catch(e => console.log('FAIL: ' + e.message));
