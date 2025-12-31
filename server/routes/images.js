import express from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Advanced image conversion with options
router.post('/convert', async (req, res) => {
  try {
    const { fileId, format, width, height, quality = 90 } = req.body;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);
    const outputPath = path.join(process.cwd(), 'uploads', `${fileId}-converted.${format}`);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    let transformer = sharp(inputPath);

    // Resize if dimensions provided
    if (width || height) {
      transformer = transformer.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Convert format
    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        await transformer.jpeg({ quality }).toFile(outputPath);
        break;
      case 'png':
        await transformer.png({ quality }).toFile(outputPath);
        break;
      case 'webp':
        await transformer.webp({ quality }).toFile(outputPath);
        break;
      case 'avif':
        await transformer.avif({ quality }).toFile(outputPath);
        break;
      case 'tiff':
        await transformer.tiff().toFile(outputPath);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported format' });
    }

    const stats = fs.statSync(outputPath);

    res.json({
      outputFile: path.basename(outputPath),
      size: stats.size,
      format
    });
  } catch (error) {
    console.error('Image convert error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get image metadata
router.post('/metadata', async (req, res) => {
  try {
    const { fileId } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const metadata = await sharp(filePath).metadata();

    res.json({
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation,
      exif: metadata.exif,
      icc: metadata.icc
    });
  } catch (error) {
    console.error('Image metadata error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Optimize image
router.post('/optimize', async (req, res) => {
  try {
    const { fileId, quality = 80 } = req.body;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);
    const outputPath = path.join(process.cwd(), 'uploads', `${fileId}-optimized${path.extname(fileId)}`);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const metadata = await sharp(inputPath).metadata();
    const format = metadata.format;

    let output = sharp(inputPath);

    if (format === 'jpeg' || format === 'jpg') {
      await output.jpeg({ quality, mozjpeg: true }).toFile(outputPath);
    } else if (format === 'png') {
      await output.png({ quality, compressionLevel: 9 }).toFile(outputPath);
    } else if (format === 'webp') {
      await output.webp({ quality }).toFile(outputPath);
    } else {
      await output.toFile(outputPath);
    }

    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

    res.json({
      outputFile: path.basename(outputPath),
      originalSize,
      optimizedSize,
      savings: `${savings}%`
    });
  } catch (error) {
    console.error('Image optimize error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create thumbnail
router.post('/thumbnail', async (req, res) => {
  try {
    const { fileId, width = 200, height = 200 } = req.body;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);
    const outputPath = path.join(process.cwd(), 'uploads', `${fileId}-thumb.jpg`);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    await sharp(inputPath)
      .resize(width, height, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    res.json({
      thumbnail: path.basename(outputPath)
    });
  } catch (error) {
    console.error('Thumbnail error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
