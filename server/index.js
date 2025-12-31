import express from 'express';
import cors from 'cors';
import multer from 'multer';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Import route modules
import videoRoutes from './routes/video.js';
import archiveRoutes from './routes/archives.js';
import emailRoutes from './routes/email.js';
import databaseRoutes from './routes/database.js';
import calendarRoutes from './routes/calendar.js';
import imageRoutes from './routes/images.js';
import subtitleRoutes from './routes/subtitles.js';
import documentRoutes from './routes/document.js';
import docxToPdfRoutes from './routes/docx-to-pdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 } // 1GB limit
});

// Store workbook info in memory (in production, use Redis or database)
const workbookCache = new Map();

// Upload Excel file and return metadata
app.post('/api/excel/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileId = req.file.filename;

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Get total row count
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const totalRows = range.e.r + 1;
    const totalCols = range.e.c + 1;

    // Cache workbook info
    workbookCache.set(fileId, {
      filePath,
      sheetName,
      totalRows,
      totalCols,
      uploadTime: Date.now()
    });

    // Clean up files older than 1 hour
    cleanupOldFiles();

    res.json({
      fileId,
      totalRows,
      totalCols,
      sheetName,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
});

// Get paginated rows from Excel file
app.get('/api/excel/:fileId/rows', (req, res) => {
  try {
    const { fileId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const rowsPerPage = parseInt(req.query.rowsPerPage) || 50;

    const cachedInfo = workbookCache.get(fileId);
    if (!cachedInfo) {
      return res.status(404).json({ error: 'File not found or expired' });
    }

    const { filePath, sheetName } = cachedInfo;

    // Read workbook
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[sheetName];

    // Calculate range for this page
    const startRow = (page - 1) * rowsPerPage;
    const endRow = Math.min(startRow + rowsPerPage, cachedInfo.totalRows);

    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const pageRange = {
      s: { r: startRow, c: range.s.c },
      e: { r: endRow - 1, c: range.e.c }
    };

    // Extract rows for this page
    const pageData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      range: pageRange
    });

    res.json({
      page,
      rowsPerPage,
      totalRows: cachedInfo.totalRows,
      startRow,
      endRow,
      data: pageData
    });
  } catch (error) {
    console.error('Fetch rows error:', error);
    res.status(500).json({ error: 'Failed to fetch rows' });
  }
});

// Delete Excel file
app.delete('/api/excel/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const cachedInfo = workbookCache.get(fileId);

    if (cachedInfo) {
      // Delete file
      if (fs.existsSync(cachedInfo.filePath)) {
        fs.unlinkSync(cachedInfo.filePath);
      }
      workbookCache.delete(fileId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Clean up files older than 1 hour
function cleanupOldFiles() {
  const ONE_HOUR = 60 * 60 * 1000;
  const now = Date.now();

  for (const [fileId, info] of workbookCache.entries()) {
    if (now - info.uploadTime > ONE_HOUR) {
      if (fs.existsSync(info.filePath)) {
        fs.unlinkSync(info.filePath);
      }
      workbookCache.delete(fileId);
      console.log(`Cleaned up old file: ${fileId}`);
    }
  }
}

// Register all routes
app.use('/api/video', videoRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/subtitle', subtitleRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/docx-pdf', docxToPdfRoutes);

// Universal file upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = req.file.filename;
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;
    const originalName = req.file.originalname;

    res.json({
      fileId,
      fileName: originalName,
      fileType,
      fileSize,
      uploadTime: Date.now()
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Download/stream file
app.get('/api/download/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = join(__dirname, 'uploads', fileId);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeFiles: workbookCache.size });
});

app.listen(PORT, () => {
  console.log(`🚀 FilePlay server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${join(__dirname, 'uploads')}`);
  console.log(`
  Available endpoints:
  - /api/upload (Universal file upload)
  - /api/video/* (Video processing)
  - /api/archive/* (Archive handling)
  - /api/email/* (Email parsing)
  - /api/database/* (SQLite queries)
  - /api/calendar/* (ICS/VCF parsing)
  - /api/image/* (Advanced image processing)
  - /api/subtitle/* (Subtitle parsing/conversion)
  - /api/document/* (DOC/DOCX conversion)
  - /api/excel/* (Excel processing)
  `);
});
