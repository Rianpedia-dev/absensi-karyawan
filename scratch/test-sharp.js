const sharp = require('sharp');
const fs = require('fs');

const svg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <rect x="20" y="20" width="360" height="160" rx="10" fill="#003366"/>
  <text x="200" y="110" fill="#ffffff" font-size="20" font-family="Arial" text-anchor="middle">Test Diagram</text>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile('test-diagram.png')
  .then(() => {
    console.log('Success! File size:', fs.statSync('test-diagram.png').size);
    fs.unlinkSync('test-diagram.png');
  })
  .catch(err => console.error(err));
