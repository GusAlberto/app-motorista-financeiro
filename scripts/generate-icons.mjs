/**
 * scripts/generate-icons.mjs
 *
 * Generates PWA PNG icons from public/icon.svg using sharp.
 * Run: node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svg = readFileSync(join(root, 'public', 'icon.svg'))
const outDir = join(root, 'public', 'icons')
mkdirSync(outDir, { recursive: true })

// Standard "any" icons — full-bleed
const sizes = [192, 512]
for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(outDir, `icon-${size}.png`))
  console.log(`✓ icon-${size}.png`)
}

// Maskable icon — icon scaled to ~80% on a solid background (safe zone)
const maskableSize = 512
const inner = Math.round(maskableSize * 0.8)
const pad = Math.round((maskableSize - inner) / 2)
const resized = await sharp(svg).resize(inner, inner).png().toBuffer()
await sharp({
  create: {
    width: maskableSize,
    height: maskableSize,
    channels: 4,
    background: '#2563eb',
  },
})
  .composite([{ input: resized, top: pad, left: pad }])
  .png()
  .toFile(join(outDir, 'icon-maskable-512.png'))
console.log('✓ icon-maskable-512.png')

// Apple touch icon
await sharp(svg).resize(180, 180).png().toFile(join(root, 'public', 'apple-touch-icon.png'))
console.log('✓ apple-touch-icon.png')

console.log('Done.')
