import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgBuffer = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Rounded Green App Icon Background -->
  <rect width="512" height="512" rx="108" fill="#005723" />
  
  <!-- Subtle inner gradient overlay -->
  <rect width="512" height="512" rx="108" fill="url(#paint0_linear)" />

  <!-- 4 Golden Yellow Speed / Motion Lines on Left -->
  <rect x="55" y="165" width="80" height="18" rx="9" fill="#FFB800" />
  <rect x="30" y="205" width="120" height="22" rx="11" fill="#FFB800" />
  <rect x="42" y="250" width="105" height="22" rx="11" fill="#FFB800" />
  <rect x="70" y="295" width="75" height="18" rx="9" fill="#FFB800" />

  <!-- Golden Yellow Bag Handles -->
  <path d="M210 120 C210 45, 330 45, 330 120" stroke="#FFB800" stroke-width="24" stroke-linecap="round" fill="none" />

  <!-- Green Shopping Bag Body -->
  <path d="M150 120 H390 C402 120, 412 128, 415 140 L435 370 C438 385, 425 400, 410 400 H130 C115 400, 102 385, 105 370 L125 140 C128 128, 138 120, 150 120 Z" fill="#00481D" />

  <!-- Bag Shadow/Highlight edge -->
  <path d="M150 120 H390 L385 160 H155 L150 120 Z" fill="#005723" opacity="0.5" />

  <!-- Handle Grommets (White Circles) -->
  <circle cx="210" cy="125" r="12" fill="#FFFFFF" />
  <circle cx="330" cy="125" r="12" fill="#FFFFFF" />

  <!-- Slanted Monogram Text: White "K" + Yellow "F" -->
  <g transform="skewX(-14) translate(40, 10)">
    <text x="200" y="320" fill="#FFFFFF" font-size="170" font-weight="900" font-family="DejaVu Sans, Arial, sans-serif" letter-spacing="-6">K</text>
    <text x="300" y="320" fill="#FFB800" font-size="170" font-weight="900" font-family="DejaVu Sans, Arial, sans-serif" letter-spacing="-6">F</text>
  </g>

  <!-- KFMart.in Sub-text at the bottom of the icon -->
  <g transform="translate(145, 455)">
    <text x="0" y="0" fill="#FFFFFF" font-size="44" font-weight="900" font-style="italic" font-family="DejaVu Sans, Arial, sans-serif">KF</text>
    <text x="58" y="0" fill="#FFB800" font-size="44" font-weight="900" font-style="italic" font-family="DejaVu Sans, Arial, sans-serif">Mart</text>
    <text x="156" y="0" fill="#FFFFFF" font-size="34" font-weight="900" font-style="italic" font-family="DejaVu Sans, Arial, sans-serif">.in</text>
  </g>

  <defs>
    <linearGradient id="paint0_linear" x1="256" y1="0" x2="256" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#006A2B" />
      <stop offset="1" stop-color="#00401A" />
    </linearGradient>
  </defs>
</svg>
`);

async function generate() {
  const publicDir = path.join(process.cwd(), 'public');
  
  // Save favicon SVG
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgBuffer);
  
  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512.png'));
    
  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192.png'));

  // 180x180 Apple Touch Icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Successfully generated PWA icons!');
}

generate().catch(console.error);
