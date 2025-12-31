import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Convert video to MP4 (streaming for large files)
router.post('/convert-to-mp4', async (req, res) => {
  try {
    const { fileId } = req.body;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);
    const outputPath = path.join(process.cwd(), 'uploads', `${fileId}-converted.mp4`);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Stream conversion progress
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4')
      .on('start', () => {
        res.write(JSON.stringify({ status: 'started' }) + '\n');
      })
      .on('progress', (progress) => {
        res.write(JSON.stringify({
          status: 'processing',
          percent: progress.percent || 0,
          timemark: progress.timemark
        }) + '\n');
      })
      .on('end', () => {
        res.write(JSON.stringify({
          status: 'completed',
          outputFile: `${fileId}-converted.mp4`
        }) + '\n');
        res.end();
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.write(JSON.stringify({
          status: 'error',
          error: err.message
        }) + '\n');
        res.end();
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract video metadata
router.get('/metadata/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      const audioStream = metadata.streams.find(s => s.codec_type === 'audio');

      res.json({
        duration: metadata.format.duration,
        size: metadata.format.size,
        bitRate: metadata.format.bit_rate,
        video: videoStream ? {
          codec: videoStream.codec_name,
          width: videoStream.width,
          height: videoStream.height,
          fps: eval(videoStream.r_frame_rate),
          bitRate: videoStream.bit_rate
        } : null,
        audio: audioStream ? {
          codec: audioStream.codec_name,
          sampleRate: audioStream.sample_rate,
          channels: audioStream.channels,
          bitRate: audioStream.bit_rate
        } : null
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate video thumbnail
router.post('/thumbnail', async (req, res) => {
  try {
    const { fileId, timestamp = '00:00:01' } = req.body;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);
    const outputPath = path.join(process.cwd(), 'uploads', `${fileId}-thumb.jpg`);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timestamp],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '320x240'
      })
      .on('end', () => {
        res.json({ thumbnail: `${fileId}-thumb.jpg` });
      })
      .on('error', (err) => {
        res.status(500).json({ error: err.message });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract audio from video
router.post('/extract-audio', async (req, res) => {
  try {
    const { fileId } = req.body;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);
    const outputPath = path.join(process.cwd(), 'uploads', `${fileId}-audio.mp3`);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    ffmpeg(inputPath)
      .output(outputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('192k')
      .on('start', () => {
        res.write(JSON.stringify({ status: 'started' }) + '\n');
      })
      .on('progress', (progress) => {
        res.write(JSON.stringify({
          status: 'processing',
          percent: progress.percent || 0
        }) + '\n');
      })
      .on('end', () => {
        res.write(JSON.stringify({
          status: 'completed',
          outputFile: `${fileId}-audio.mp3`
        }) + '\n');
        res.end();
      })
      .on('error', (err) => {
        res.write(JSON.stringify({
          status: 'error',
          error: err.message
        }) + '\n');
        res.end();
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert audio format
router.post('/convert-audio', async (req, res) => {
  try {
    const { fileId, format = 'mp3', bitrate = '192k' } = req.body;
    const inputPath = path.join(process.cwd(), 'uploads', fileId);
    const outputPath = path.join(process.cwd(), 'uploads', `${fileId}-converted.${format}`);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const codecMap = {
      'mp3': 'libmp3lame',
      'wav': 'pcm_s16le',
      'ogg': 'libvorbis',
      'm4a': 'aac',
      'flac': 'flac'
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    ffmpeg(inputPath)
      .output(outputPath)
      .audioCodec(codecMap[format] || 'libmp3lame')
      .audioBitrate(bitrate)
      .on('start', () => {
        res.write(JSON.stringify({ status: 'started' }) + '\n');
      })
      .on('progress', (progress) => {
        res.write(JSON.stringify({
          status: 'processing',
          percent: progress.percent || 0
        }) + '\n');
      })
      .on('end', () => {
        res.write(JSON.stringify({
          status: 'completed',
          outputFile: `${fileId}-converted.${format}`
        }) + '\n');
        res.end();
      })
      .on('error', (err) => {
        res.write(JSON.stringify({
          status: 'error',
          error: err.message
        }) + '\n');
        res.end();
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get video stream URL (for preview)
router.get('/stream/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
