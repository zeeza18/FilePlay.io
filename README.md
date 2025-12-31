# FilePlay

**Play with your files** - All-in-one file management platform with intelligent preview, conversion, and OCR capabilities.

## 🚀 Overview

FilePlay is a comprehensive full-stack web application for file management, offering powerful modules:

- ✅ **Preview** - View any file instantly with smart text extraction (LIVE)
- ✅ **Convert** - Transform files between formats effortlessly (LIVE)
- 🔜 **Edit** - Modify documents online (Coming Q2 2025)
- 🔜 **AI Tools** - AI-powered document processing (Coming Q2 2025)
- 🔜 **Analysis** - Deep insights on your files (Coming Q3 2025)

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **File Handling**: react-dropzone, pdfjs-dist, tesseract.js (OCR)

### Backend
- **Runtime**: Node.js with Express
- **File Processing**: Multer, FFmpeg, pdf-lib
- **Database**: SQLite (for archives, databases)
- **Email Parsing**: Mailparser
- **Calendar**: node-ical

## 📦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- FFmpeg (for video/audio conversion)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/fileplay.git
cd fileplay
```

2. **Install frontend dependencies**:
```bash
npm install
```

3. **Install backend dependencies**:
```bash
cd server
npm install
cd ..
```

4. **Start both servers**:

**Option 1: Windows (Batch file)**
```bash
START_SERVERS.bat
```

**Option 2: Manual start**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
cd server
node index.js
```

5. **Open your browser**:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

## 📁 Project Structure

```
fileplay/
├── src/
│   ├── components/
│   │   ├── layout/          # Navigation, Footer
│   │   ├── sections/        # Homepage sections
│   │   └── ui/              # Reusable UI components
│   ├── pages/
│   │   ├── convert/         # Conversion pages
│   │   └── preview/         # Preview pages for different file types
│   ├── context/             # React Context (FileContext)
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # App entry point
├── server/
│   ├── routes/              # API routes
│   │   ├── video.js         # Video/audio conversion
│   │   ├── archive.js       # Archive extraction
│   │   ├── email.js         # Email parsing
│   │   ├── database.js      # Database queries
│   │   ├── calendar.js      # ICS parsing
│   │   └── subtitle.js      # Subtitle parsing
│   ├── uploads/             # Temporary file uploads (git-ignored)
│   └── index.js             # Express server
├── public/
│   └── pdf.worker.min.mjs   # PDF.js worker
└── package.json
```

## ✨ Features

### Preview Module (LIVE)

#### Smart File Detection
- **Scanned PDF Detection**: Automatically detects if a PDF contains selectable text or is scanned
- **OCR Text Extraction**: Extracts text from scanned documents and images using Tesseract.js
- **Progressive Loading**: Large files load in chunks for instant preview

#### Supported Formats
- **Documents**: PDF, DOCX, PPTX, TXT
- **Spreadsheets**: XLSX, CSV
- **Images**: JPG, PNG, GIF, WebP, BMP, SVG
- **Media**: MP4, AVI, MOV, MP3, WAV, OGG
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Code**: JS, TS, Python, Java, C++, and 20+ more
- **Email**: EML, MSG
- **Database**: SQLite, DB files
- **Calendar**: ICS files
- **Subtitles**: SRT, VTT

#### Preview Features
- Zoom controls (50% - 200%)
- Page navigation for multi-page documents
- Scroll-based pagination with snap points
- Download original files
- Fullscreen mode
- Selectable text for non-scanned PDFs
- OCR overlay for scanned documents

### Convert Module (LIVE)

#### Conversions Available
- **PDF**: PDF ↔ Word, PDF ↔ Images
- **Images**: JPG ↔ PNG, Image → PDF
- **Documents**: Word → PDF
- **Spreadsheets**: Excel ↔ CSV
- **Data**: JSON ↔ CSV, XML ↔ JSON
- **Video**: AVI/MOV/MKV → MP4
- **Audio**: MP3, WAV, OGG, FLAC, M4A, AAC (any to any)

#### Conversion Features
- Real-time progress tracking
- Streaming progress updates
- Batch processing support
- High-quality output

### Other Pages
- **Pricing**: Three-tier pricing with feature comparison
- **About**: Company mission and statistics

## 🎨 Design System

### Colors
- Primary: `#4F46E5` (Indigo)
- Secondary: `#06B6D4` (Cyan)
- Success: `#10B981` (Green)
- Gradients: Primary to Secondary

### Typography
- Font: Inter (Google Fonts)
- Responsive sizing with Tailwind utilities

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

## 🔧 API Endpoints

### Upload
- `POST /api/upload` - Upload files (multipart/form-data)
- `GET /api/download/:filename` - Download processed files

### Video/Audio
- `POST /api/video/convert-to-mp4` - Convert video to MP4
- `POST /api/video/convert-audio` - Convert between audio formats

### Archives
- `POST /api/archive/extract` - Extract archive contents
- `POST /api/archive/list` - List archive files

### Email
- `POST /api/email/parse` - Parse EML/MSG files

### Database
- `POST /api/database/tables` - Get database tables
- `POST /api/database/query` - Query database

### Calendar
- `POST /api/calendar/parse-ics` - Parse ICS calendar files

### Subtitles
- `POST /api/subtitle/parse` - Parse subtitle files

## 🚀 Deployment

### Frontend
Deploy to:
- **Vercel** (Recommended)
- Netlify
- Cloudflare Pages

### Backend
Deploy to:
- **Railway**
- Heroku
- DigitalOcean
- AWS EC2

**Important**: Ensure FFmpeg is installed on your production server for video/audio conversion.

## 🔐 Environment Setup

No environment variables required for basic operation. All configuration is in code.

For production:
- Update API endpoints in frontend code
- Configure CORS in server/index.js
- Set up file size limits
- Configure upload cleanup schedule

## 📄 License

All rights reserved © 2025 FilePlay

---

Built with ❤️ for file management enthusiasts
