import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Parse SRT subtitle file
function parseSRT(content) {
  const subtitles = [];
  const blocks = content.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const index = parseInt(lines[0]);
      const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);

      if (timeMatch) {
        subtitles.push({
          index,
          startTime: timeMatch[1],
          endTime: timeMatch[2],
          text: lines.slice(2).join('\n')
        });
      }
    }
  }

  return subtitles;
}

// Parse VTT subtitle file
function parseVTT(content) {
  const subtitles = [];
  const lines = content.split('\n');
  let currentSub = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes('-->')) {
      const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/);
      if (timeMatch) {
        currentSub = {
          startTime: timeMatch[1],
          endTime: timeMatch[2],
          text: ''
        };
      }
    } else if (currentSub && line && !line.startsWith('WEBVTT')) {
      currentSub.text += (currentSub.text ? '\n' : '') + line;
    } else if (currentSub && !line) {
      subtitles.push(currentSub);
      currentSub = null;
    }
  }

  if (currentSub) {
    subtitles.push(currentSub);
  }

  return subtitles;
}

// Parse subtitle file
router.post('/parse', (req, res) => {
  try {
    const { fileId } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(fileId).toLowerCase();

    let subtitles = [];

    if (ext === '.srt') {
      subtitles = parseSRT(content);
    } else if (ext === '.vtt') {
      subtitles = parseVTT(content);
    } else {
      return res.status(400).json({ error: 'Unsupported subtitle format' });
    }

    res.json({
      format: ext.slice(1),
      count: subtitles.length,
      subtitles
    });
  } catch (error) {
    console.error('Subtitle parse error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Convert SRT to VTT
router.post('/convert', (req, res) => {
  try {
    const { fileId, targetFormat } = req.body;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);
    const outputPath = path.join(process.cwd(), 'uploads', `${fileId}-converted.${targetFormat}`);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(inputPath, 'utf8');
    const ext = path.extname(fileId).toLowerCase();

    let subtitles = [];
    if (ext === '.srt') {
      subtitles = parseSRT(content);
    } else if (ext === '.vtt') {
      subtitles = parseVTT(content);
    }

    let output = '';

    if (targetFormat === 'vtt') {
      output = 'WEBVTT\n\n';
      for (const sub of subtitles) {
        const start = sub.startTime.replace(',', '.');
        const end = sub.endTime.replace(',', '.');
        output += `${start} --> ${end}\n${sub.text}\n\n`;
      }
    } else if (targetFormat === 'srt') {
      for (let i = 0; i < subtitles.length; i++) {
        const sub = subtitles[i];
        const start = sub.startTime.replace('.', ',');
        const end = sub.endTime.replace('.', ',');
        output += `${i + 1}\n${start} --> ${end}\n${sub.text}\n\n`;
      }
    }

    fs.writeFileSync(outputPath, output, 'utf8');

    res.json({
      outputFile: path.basename(outputPath),
      format: targetFormat
    });
  } catch (error) {
    console.error('Subtitle convert error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
