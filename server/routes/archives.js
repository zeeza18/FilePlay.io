import express from 'express';
import archiver from 'archiver';
import unzipper from 'unzipper';
import decompress from 'decompress';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// List contents of archive
router.post('/list', async (req, res) => {
  try {
    const { fileId } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const ext = path.extname(fileId).toLowerCase();
    const files = [];

    if (ext === '.zip') {
      const directory = await unzipper.Open.file(filePath);

      for (const file of directory.files) {
        files.push({
          path: file.path,
          type: file.type,
          size: file.uncompressedSize,
          compressedSize: file.compressedSize,
          date: file.lastModified
        });
      }
    } else {
      // Use decompress for other formats (7z, tar, rar, etc.)
      const extractedFiles = await decompress(filePath, { strip: 0 });

      for (const file of extractedFiles) {
        files.push({
          path: file.path,
          type: file.type,
          size: file.data.length,
          mode: file.mode
        });
      }
    }

    res.json({ files });
  } catch (error) {
    console.error('Archive list error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Extract archive
router.post('/extract', async (req, res) => {
  try {
    const { fileId } = req.body;
    const filePath = path.join(process.cwd(), 'uploads', fileId);
    const extractPath = path.join(process.cwd(), 'uploads', `${fileId}-extracted`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Create extraction directory
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true });
    }

    const ext = path.extname(fileId).toLowerCase();

    if (ext === '.zip') {
      await fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .promise();
    } else {
      await decompress(filePath, extractPath);
    }

    // List extracted files
    const files = [];
    function walkDir(dir, baseDir = '') {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(baseDir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          walkDir(fullPath, relativePath);
        } else {
          files.push({
            path: relativePath,
            size: stats.size,
            type: 'file'
          });
        }
      }
    }
    walkDir(extractPath);

    res.json({
      extractPath: `${fileId}-extracted`,
      files
    });
  } catch (error) {
    console.error('Archive extract error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get file from archive
router.post('/get-file', async (req, res) => {
  try {
    const { fileId, filePath: targetPath } = req.body;
    const archivePath = path.join(process.cwd(), 'uploads', fileId);
    const extractedPath = path.join(process.cwd(), 'uploads', `${fileId}-extracted`);

    // Check if already extracted
    if (fs.existsSync(extractedPath)) {
      const targetFile = path.join(extractedPath, targetPath);
      if (fs.existsSync(targetFile)) {
        return res.sendFile(targetFile);
      }
    }

    // Extract specific file from zip
    const ext = path.extname(fileId).toLowerCase();
    if (ext === '.zip') {
      const directory = await unzipper.Open.file(archivePath);
      const file = directory.files.find(f => f.path === targetPath);

      if (file) {
        const content = await file.buffer();
        res.send(content);
      } else {
        res.status(404).json({ error: 'File not found in archive' });
      }
    } else {
      res.status(400).json({ error: 'Please extract archive first' });
    }
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create archive from multiple files
router.post('/create', async (req, res) => {
  try {
    const { files, format = 'zip', archiveName } = req.body;
    const outputPath = path.join(process.cwd(), 'uploads', archiveName || `archive-${Date.now()}.${format}`);

    const archive = archiver(format === '7z' ? 'zip' : format, {
      zlib: { level: 9 } // Maximum compression
    });

    const output = fs.createWriteStream(outputPath);

    archive.pipe(output);

    // Add files to archive
    for (const file of files) {
      const filePath = path.join(process.cwd(), 'uploads', file.fileId);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file.name || path.basename(filePath) });
      }
    }

    await archive.finalize();

    output.on('close', () => {
      res.json({
        archiveId: path.basename(outputPath),
        size: archive.pointer(),
        fileCount: files.length
      });
    });

    archive.on('error', (err) => {
      throw err;
    });
  } catch (error) {
    console.error('Create archive error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
