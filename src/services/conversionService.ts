import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// Conversion rules: what formats can convert to what
export const conversionRules: Record<string, string[]> = {
  // Images
  'image/jpeg': ['jpg', 'png', 'webp', 'bmp', 'gif', 'pdf'],
  'image/jpg': ['jpg', 'png', 'webp', 'bmp', 'gif', 'pdf'],
  'image/png': ['jpg', 'png', 'webp', 'bmp', 'gif', 'pdf'],
  'image/webp': ['jpg', 'png', 'webp', 'bmp', 'gif', 'pdf'],
  'image/gif': ['jpg', 'png', 'webp', 'bmp', 'pdf'],
  'image/bmp': ['jpg', 'png', 'webp', 'gif', 'pdf'],
  'image/tiff': ['jpg', 'png', 'webp', 'bmp', 'pdf'],
  'image/heic': ['jpg', 'png', 'webp', 'pdf'],
  'image/heif': ['jpg', 'png', 'webp', 'pdf'],
  'image/avif': ['jpg', 'png', 'webp', 'pdf'],
  'image/svg+xml': ['png', 'jpg', 'webp', 'pdf'],

  // Spreadsheets
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx', 'csv', 'json', 'html', 'txt', 'pdf'],
  'text/csv': ['xlsx', 'json', 'html', 'txt', 'pdf', 'xml'],

  // Documents
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['txt', 'html', 'md', 'pdf'],
  'application/pdf': ['txt', 'html', 'jpg', 'png'],
  'text/plain': ['html', 'md', 'txt', 'pdf', 'json'],
  'text/html': ['txt', 'md', 'pdf'],
  'text/markdown': ['html', 'txt', 'pdf'],

  // Data formats
  'application/json': ['json', 'csv', 'xml', 'txt', 'html'],
  'application/xml': ['xml', 'json', 'csv', 'txt', 'html'],
  'text/xml': ['xml', 'json', 'csv', 'txt', 'html'],

  // Archives
  'application/zip': ['zip'],
  'application/x-zip-compressed': ['zip'],
};

// Get file extension from filename
const getExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Get MIME type from extension
const getMimeFromExtension = (ext: string): string => {
  const mimeMap: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'heic': 'image/heic',
    'heif': 'image/heif',
    'avif': 'image/avif',
    'svg': 'image/svg+xml',
    // Spreadsheets
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'csv': 'text/csv',
    'ods': 'application/vnd.oasis.opendocument.spreadsheet',
    // Documents
    'txt': 'text/plain',
    'html': 'text/html',
    'htm': 'text/html',
    'md': 'text/markdown',
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc': 'application/msword',
    'rtf': 'application/rtf',
    // Data formats
    'json': 'application/json',
    'xml': 'application/xml',
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
  };
  return mimeMap[ext] || 'application/octet-stream';
};

// Get allowed output formats for a file
export const getAllowedFormats = (file: File): string[] => {
  const fileType = file.type || getMimeFromExtension(getExtension(file.name));
  return conversionRules[fileType] || [];
};

// Check if conversion is possible
export const canConvert = (file: File, targetFormat: string): boolean => {
  const allowedFormats = getAllowedFormats(file);
  return allowedFormats.includes(targetFormat);
};

// Image conversion using Canvas
const convertImage = async (file: File, targetFormat: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // For JPG, fill white background
        if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const mimeType = getMimeFromExtension(targetFormat);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          mimeType,
          0.95 // Quality for JPEG/WEBP
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

// Convert HEIC/HEIF to other formats
const convertHEIC = async (file: File, targetFormat: string): Promise<Blob> => {
  const heic2any = (await import('heic2any')).default as any;
  const targetMime = getMimeFromExtension(targetFormat);

  const convertedBlob = await heic2any({
    blob: file,
    toType: targetMime,
    quality: 0.95
  });

  return convertedBlob as Blob;
};

// Excel/CSV conversions
const convertSpreadsheet = async (file: File, targetFormat: string): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

  let output: string | ArrayBuffer | Blob;
  let mimeType: string;

  switch (targetFormat) {
    case 'csv':
      output = XLSX.utils.sheet_to_csv(firstSheet);
      mimeType = 'text/csv';
      break;

    case 'xlsx':
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, firstSheet, 'Sheet1');
      output = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;

    case 'json':
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      output = JSON.stringify(jsonData, null, 2);
      mimeType = 'application/json';
      break;

    case 'html':
      output = XLSX.utils.sheet_to_html(firstSheet);
      mimeType = 'text/html';
      break;

    case 'txt':
      output = XLSX.utils.sheet_to_txt(firstSheet);
      mimeType = 'text/plain';
      break;

    case 'xml':
      const xmlData = XLSX.utils.sheet_to_json(firstSheet);
      const builder = new XMLBuilder({ format: true });
      output = builder.build({ rows: { row: xmlData } });
      mimeType = 'application/xml';
      break;

    case 'pdf':
      // Convert to CSV first, then to PDF
      const csvContent = XLSX.utils.sheet_to_csv(firstSheet);
      return await textToPDF(csvContent);

    default:
      throw new Error(`Unsupported spreadsheet format: ${targetFormat}`);
  }

  if (output instanceof Blob) {
    return output;
  }

  return new Blob([output], { type: mimeType });
};

// DOCX to text/html
const convertDocx = async (file: File, targetFormat: string): Promise<Blob> => {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();

  let output: string;
  let mimeType: string;

  switch (targetFormat) {
    case 'html':
      const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
      output = htmlResult.value;
      mimeType = 'text/html';
      break;

    case 'txt':
      const textResult = await mammoth.extractRawText({ arrayBuffer });
      output = textResult.value;
      mimeType = 'text/plain';
      break;

    case 'md':
      // Basic markdown conversion (convert to text first)
      const mdResult = await mammoth.extractRawText({ arrayBuffer });
      output = mdResult.value;
      mimeType = 'text/markdown';
      break;

    default:
      throw new Error(`Unsupported DOCX conversion: ${targetFormat}`);
  }

  return new Blob([output], { type: mimeType });
};

// Text format conversions
const convertText = async (file: File, targetFormat: string): Promise<Blob> => {
  const text = await file.text();
  const ext = getExtension(file.name);

  let output: string | Blob;
  let mimeType: string;

  // Markdown to HTML
  if (ext === 'md' && targetFormat === 'html') {
    // Simple markdown to HTML (basic conversion)
    output = text
      .split('\n')
      .map(line => {
        // Headers
        if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`;
        if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`;
        if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`;
        // Bold
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Code
        line = line.replace(/`(.*?)`/g, '<code>$1</code>');
        // Links
        line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
        // Paragraph
        return line.trim() ? `<p>${line}</p>` : '<br>';
      })
      .join('\n');
    mimeType = 'text/html';
  }
  // HTML to text/markdown
  else if (ext === 'html' && (targetFormat === 'txt' || targetFormat === 'md')) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    output = doc.body.textContent || '';
    mimeType = targetFormat === 'txt' ? 'text/plain' : 'text/markdown';
  }
  // Text to HTML
  else if (ext === 'txt' && targetFormat === 'html') {
    output = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Converted Document</title>
</head>
<body>
  <pre>${text}</pre>
</body>
</html>`;
    mimeType = 'text/html';
  }
  // Text to Markdown
  else if (ext === 'txt' && targetFormat === 'md') {
    output = text;
    mimeType = 'text/markdown';
  }
  // Text to PDF
  else if (targetFormat === 'pdf') {
    return await textToPDF(text);
  }
  // Text to JSON (wrap in object)
  else if (ext === 'txt' && targetFormat === 'json') {
    output = JSON.stringify({ content: text }, null, 2);
    mimeType = 'application/json';
  }
  // Default: just copy
  else {
    output = text;
    mimeType = getMimeFromExtension(targetFormat);
  }

  if (output instanceof Blob) {
    return output;
  }

  return new Blob([output], { type: mimeType });
};

// Convert text/HTML/Markdown to PDF
const textToPDF = async (text: string): Promise<Blob> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margins = 15;
  const lineHeight = 7;
  const maxLineWidth = pageWidth - margins * 2;

  // Split text into lines that fit the page
  const lines = pdf.splitTextToSize(text, maxLineWidth);

  let y = margins;
  for (let i = 0; i < lines.length; i++) {
    if (y > pdf.internal.pageSize.getHeight() - margins) {
      pdf.addPage();
      y = margins;
    }
    pdf.text(lines[i], margins, y);
    y += lineHeight;
  }

  return pdf.output('blob');
};

// Convert image to PDF
const imageToPDF = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const pdf = new jsPDF({
          orientation: img.width > img.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [img.width, img.height]
        });

        pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
        URL.revokeObjectURL(url);
        resolve(pdf.output('blob'));
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

// JSON/XML conversions
const convertJSON = async (file: File, targetFormat: string): Promise<Blob> => {
  const text = await file.text();
  const data = JSON.parse(text);

  let output: string;
  let mimeType: string;

  switch (targetFormat) {
    case 'xml':
      const builder = new XMLBuilder({ format: true });
      output = builder.build({ root: data });
      mimeType = 'application/xml';
      break;

    case 'csv':
      // Convert JSON array to CSV
      if (Array.isArray(data)) {
        const headers = Object.keys(data[0] || {});
        const csvRows = [
          headers.join(','),
          ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
        ];
        output = csvRows.join('\n');
      } else {
        output = 'key,value\n' + Object.entries(data).map(([k, v]) => `${k},${JSON.stringify(v)}`).join('\n');
      }
      mimeType = 'text/csv';
      break;

    case 'txt':
      output = JSON.stringify(data, null, 2);
      mimeType = 'text/plain';
      break;

    case 'html':
      output = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JSON Data</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <pre>${JSON.stringify(data, null, 2)}</pre>
</body>
</html>`;
      mimeType = 'text/html';
      break;

    default:
      output = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
  }

  return new Blob([output], { type: mimeType });
};

const convertXML = async (file: File, targetFormat: string): Promise<Blob> => {
  const text = await file.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const data = parser.parse(text);

  let output: string;
  let mimeType: string;

  switch (targetFormat) {
    case 'json':
      output = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      break;

    case 'csv':
      // Simple CSV conversion (flatten first level)
      const flatData = Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : value
      }));
      output = 'key,value\n' + flatData.map(row => `${row.key},${JSON.stringify(row.value)}`).join('\n');
      mimeType = 'text/csv';
      break;

    case 'txt':
      output = text;
      mimeType = 'text/plain';
      break;

    case 'html':
      output = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>XML Data</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <pre>${text}</pre>
</body>
</html>`;
      mimeType = 'text/html';
      break;

    default:
      output = text;
      mimeType = 'application/xml';
  }

  return new Blob([output], { type: mimeType });
};

// SVG to raster conversion
const convertSVG = async (file: File, targetFormat: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 800;
        canvas.height = img.height || 600;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Fill white background for JPG
        if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        if (targetFormat === 'pdf') {
          const pdfBlob = await imageToPDF(file);
          URL.revokeObjectURL(url);
          resolve(pdfBlob);
        } else {
          const mimeType = getMimeFromExtension(targetFormat);
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(url);
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to convert SVG'));
              }
            },
            mimeType,
            0.95
          );
        }
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
};

// PDF extraction (basic)
const convertPDF = async (file: File, targetFormat: string): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  if (targetFormat === 'txt') {
    // Note: pdf-lib doesn't extract text well, this is a limitation
    // For production, you'd need pdf.js or a server-side solution
    const text = 'PDF text extraction requires pdf.js. Use the preview page to view content.';
    return new Blob([text], { type: 'text/plain' });
  } else if (targetFormat === 'html') {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PDF Content</title>
</head>
<body>
  <p>PDF to HTML conversion requires advanced processing. Please use the preview page to view the PDF.</p>
</body>
</html>`;
    return new Blob([html], { type: 'text/html' });
  }

  throw new Error('Unsupported PDF conversion');
};

// Main conversion function
export const convertFile = async (
  file: File,
  targetFormat: string,
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  if (!canConvert(file, targetFormat)) {
    throw new Error(`Cannot convert ${file.type} to ${targetFormat}`);
  }

  const fileType = file.type || getMimeFromExtension(getExtension(file.name));
  const ext = getExtension(file.name);

  onProgress?.(10);

  try {
    let blob: Blob;

    // Image conversions
    if (fileType.startsWith('image/')) {
      if (ext === 'svg') {
        blob = await convertSVG(file, targetFormat);
      } else if (['heic', 'heif', 'avif'].includes(ext)) {
        blob = await convertHEIC(file, targetFormat);
      } else if (targetFormat === 'pdf') {
        blob = await imageToPDF(file);
      } else {
        blob = await convertImage(file, targetFormat);
      }
    }
    // Spreadsheet conversions
    else if (
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'text/csv' ||
      ext === 'xlsx' ||
      ext === 'csv'
    ) {
      blob = await convertSpreadsheet(file, targetFormat);
    }
    // DOCX conversions
    else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      ext === 'docx'
    ) {
      if (targetFormat === 'pdf') {
        // Convert DOCX to text first, then to PDF
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const textResult = await mammoth.extractRawText({ arrayBuffer });
        blob = await textToPDF(textResult.value);
      } else {
        blob = await convertDocx(file, targetFormat);
      }
    }
    // JSON conversions
    else if (
      fileType === 'application/json' ||
      ext === 'json'
    ) {
      blob = await convertJSON(file, targetFormat);
    }
    // XML conversions
    else if (
      fileType === 'application/xml' ||
      fileType === 'text/xml' ||
      ext === 'xml'
    ) {
      blob = await convertXML(file, targetFormat);
    }
    // PDF conversions
    else if (
      fileType === 'application/pdf' ||
      ext === 'pdf'
    ) {
      blob = await convertPDF(file, targetFormat);
    }
    // HTML to PDF
    else if (
      (fileType === 'text/html' || ext === 'html') &&
      targetFormat === 'pdf'
    ) {
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const textContent = doc.body.textContent || '';
      blob = await textToPDF(textContent);
    }
    // Markdown to PDF
    else if (
      (fileType === 'text/markdown' || ext === 'md') &&
      targetFormat === 'pdf'
    ) {
      const text = await file.text();
      blob = await textToPDF(text);
    }
    // Text conversions
    else if (
      fileType.startsWith('text/') ||
      ['txt', 'html', 'md'].includes(ext)
    ) {
      blob = await convertText(file, targetFormat);
    }
    else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    onProgress?.(100);
    return blob;

  } catch (error) {
    console.error('Conversion error:', error);
    throw error;
  }
};

// Get suggested filename for converted file
export const getConvertedFilename = (originalFilename: string, targetFormat: string): string => {
  const baseName = originalFilename.replace(/\.[^/.]+$/, '');
  return `${baseName}.${targetFormat}`;
};
