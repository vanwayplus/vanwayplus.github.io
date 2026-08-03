import { readdir, rename, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const MAX_EDGE = 2400
const JPEG_QUALITY = 80
const imageRoots = ['src/assets', 'src/content/posts']

async function collectJpegs(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async entry => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return collectJpegs(entryPath)
    return /\.jpe?g$/i.test(entry.name) ? [entryPath] : []
  }))

  return files.flat()
}

const files = (await Promise.all(imageRoots.map(collectJpegs))).flat()
let beforeTotal = 0
let afterTotal = 0

for (const file of files) {
  const before = await stat(file)
  const temporaryFile = `${file}.optimized.jpg`

  try {
    await sharp(file, { failOn: 'none' })
      .rotate()
      .resize({
        width: MAX_EDGE,
        height: MAX_EDGE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(temporaryFile)

    const after = await stat(temporaryFile)
    beforeTotal += before.size

    if (after.size < before.size) {
      await rename(temporaryFile, file)
      afterTotal += after.size
    } else {
      await rm(temporaryFile)
      afterTotal += before.size
    }
  } catch (error) {
    await rm(temporaryFile, { force: true })
    throw error
  }
}

const toMegabytes = bytes => (bytes / 1024 / 1024).toFixed(1)
console.log(`Optimized ${files.length} JPEG images at ${MAX_EDGE}px / quality ${JPEG_QUALITY}.`)
console.log(`${toMegabytes(beforeTotal)} MB -> ${toMegabytes(afterTotal)} MB`)
