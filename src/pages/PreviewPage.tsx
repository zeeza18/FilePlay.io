import { useState, useRef, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import {

  Upload,

  FileText,

  Image as ImageIcon,

  Video,

  Music,

  Code2,

  Archive,

  Mail,

  Database,

  Calendar,

  File,

  Download,

  Info,

  Eye,

  ChevronLeft,

  ChevronRight,

  FolderOpen,

  User,

  MapPin,

  Clock,

  Paperclip,

  Table,

  ZoomIn,

  ZoomOut,

  Maximize,

  Minimize,

  Copy,

  Check,

} from 'lucide-react';

import Button from '../components/ui/Button';

import * as pdfjsLib from 'pdfjs-dist';

import { createWorker } from 'tesseract.js';
import * as mammoth from 'mammoth';



interface FileData {

  file: File;

  name: string;

  size: string;

  type: string;

  extension: string;

  category: string;

  lastModified: string;

  url: string;

}



const PreviewPage = () => {

  const [fileData, setFileData] = useState<FileData | null>(null);

  const [preview, setPreview] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string>('');

  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');

  const [zoom, setZoom] = useState(100);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [extractedText, setExtractedText] = useState<string>('');
  const [extractedTextPages, setExtractedTextPages] = useState<string[]>([]);

  const [extractingText, setExtractingText] = useState(false);

  const [showExtractedText, setShowExtractedText] = useState(false);

  const [textCopied, setTextCopied] = useState(false);

  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const viewerRef = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const previewSectionRef = useRef<HTMLDivElement>(null);

  const pdfPagesRef = useRef<string[]>([]);
  const textLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pdfViewportsRef = useRef<{ width: number; height: number }[]>([]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  // Handle paste event for files
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Only handle paste if no file is already loaded
      if (fileData) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Check if it's a file
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            onDrop([file]);
            break;
          }
        }

        // Check if it's a URL/text
        if (item.kind === 'string' && item.type === 'text/plain') {
          item.getAsString((str) => {
            // Check if it's a URL
            if (str.startsWith('http://') || str.startsWith('https://')) {
              setUrlInput(str);
              setShowUrlInput(true);
            }
          });
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [fileData]);



  const detectFileCategory = (file: File): string => {

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    const type = file.type.toLowerCase();



    if (['pdf'].includes(ext) || type.includes('pdf')) return 'pdf';

    if (['doc', 'docx', 'ppt', 'pptx', 'odt', 'odp', 'rtf'].includes(ext) || type.includes('word') || type.includes('powerpoint') || type.includes('presentation')) return 'document';

    if (['xlsx', 'xls', 'ods'].includes(ext) || type.includes('spreadsheet')) return 'spreadsheet';

    if (['csv'].includes(ext) || type.includes('csv')) return 'csv';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'heic', 'heif', 'avif', 'tiff', 'tif', 'psd', 'raw', 'arw', 'cr2', 'cr3', 'nef', 'nrw', 'dng', 'raf', 'orf', 'rw2', 'pef', 'srw', 'x3f'].includes(ext) || type.startsWith('image/')) return 'image';

    if (['mp4', 'avi', 'mov', 'mkv', 'webm', 'ogg', 'flv', 'wmv', 'm4v'].includes(ext) || type.startsWith('video/')) return 'video';

    if (['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'wma', 'opus'].includes(ext) || type.startsWith('audio/')) return 'audio';

    if (['html', 'htm'].includes(ext)) return 'text';

    // JSON gets special handling as structured data/code
    if (['json'].includes(ext) || type.includes('json')) return 'json';

    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt', 'css', 'xml', 'yaml', 'yml'].includes(ext)) return 'code';

    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext) || type.includes('zip') || type.includes('compressed')) return 'archive';

    if (['eml', 'msg'].includes(ext)) return 'email';

    if (['db', 'sqlite', 'sqlite3', 'mdb'].includes(ext)) return 'database';

    if (['ics'].includes(ext)) return 'calendar';

    if (['vcf', 'vcard'].includes(ext)) return 'contacts';

    if (['srt', 'vtt', 'ass', 'ssa'].includes(ext)) return 'subtitle';

    // Markdown and plain text files
    if (['txt', 'md', 'markdown', 'log'].includes(ext) || type.startsWith('text/')) return 'text';

    return 'other';

  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const buildParagraphHtml = (content: string) => {
    return content
      .split(/\r?\n/)
      .map((line) => (line.trim() === '' ? '<p>&nbsp;</p>' : `<p>${escapeHtml(line)}</p>`))
      .join('');
  };

  const paginateHtml = (htmlContent: string) => {
    // For better formatting and styling preservation, show as single scrollable document
    // instead of trying to paginate (which can break styling and layouts)
    return [htmlContent];
  };



  const loadDocument = async (file: File, data: FileData) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    try {
      // PRODUCTION-LEVEL SOLUTION: Convert documents to PDF on server for perfect formatting preservation
      // This preserves ALL styling, colors, images, fonts, layouts - exactly as in Word/PowerPoint
      if (['docx', 'pptx', 'doc', 'ppt', 'odt', 'odp', 'rtf'].includes(ext)) {
        setLoading(true);
        setError('Converting document to PDF using LibreOffice (free!)...');

        // Step 1: Upload file to server
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file');
        }

        const { fileId } = await uploadRes.json();

        // Step 2: Convert to PDF on server (preserves all formatting)
        const convertRes = await fetch('http://localhost:3001/api/docx-pdf/convert-to-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileId }),
        });

        if (!convertRes.ok) {
          const contentType = convertRes.headers.get('content-type');
          let errorMessage = 'Conversion failed';

          if (contentType && contentType.includes('application/json')) {
            const errorData = await convertRes.json();
            errorMessage = errorData.suggestion || errorData.error || 'Conversion failed';
          } else {
            errorMessage = 'LibreOffice is not installed on the server. Please convert your document to PDF manually, or install LibreOffice.';
          }

          throw new Error(errorMessage);
        }

        const { pdf } = await convertRes.json();

        // Clear the conversion message
        setError('');

        // Step 3: Display as PDF using existing PDF viewer (perfect quality!)
        // Load PDF using existing PDF infrastructure
        await loadPDF(pdf, data);

        setLoading(false);
        return;
      } else {
        setPreview({ type: 'unsupported' });
        setError('Only DOCX, DOC, PPTX, PPT, ODT, ODP, RTF files are supported. Please upload a valid document.');
        return;
      }
    } catch (err: any) {
      setPreview({ type: 'unsupported' });
      setLoading(false);

      if (err.message.includes('LibreOffice')) {
        setError(
          'Document conversion requires LibreOffice. Install it on the server or convert your file to PDF manually.'
        );
      } else {
        setError(err.message || 'Failed to convert document. Please try uploading as PDF format.');
      }
    }
  };

  const loadTextDocument = async (file: File, isLargeText: boolean = false) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const content = await file.text();
    const isHtml = ext === 'html' || ext === 'htm' || file.type === 'text/html';

    // For Markdown files, convert to HTML
    const isMd = ext === 'md' || ext === 'markdown';

    let htmlContent = content;

    if (isMd) {
      // Simple markdown to HTML conversion for better display
      htmlContent = content
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>')
        // Code blocks
        .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-1 rounded">$1</code>')
        // Line breaks
        .replace(/\n/gim, '<br>');
    } else if (!isHtml) {
      htmlContent = buildParagraphHtml(content);
    }

    const pages = paginateHtml(htmlContent);

    setPreview({
      type: 'document',
      html: htmlContent,
      pages,
      totalPages: pages.length,
      isLargeText,
      rawContent: content, // Store raw content for copying
    });
    setError('');
  };

  const onDrop = async (acceptedFiles: File[]) => {

    const file = acceptedFiles[0];

    if (!file) return;



    const url = URL.createObjectURL(file);

    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    const category = detectFileCategory(file);



    const data: FileData = {

      file,

      name: file.name,

      size: formatFileSize(file.size),

      type: file.type || 'Unknown',

      extension: ext,

      category,

      lastModified: new Date(file.lastModified).toLocaleString(),

      url,

    };



    setFileData(data);

    setError('');

    setLoading(true);

    setPage(1);

    setZoom(100);

    setExtractedText('');
    setExtractedTextPages([]);

    setExtractingText(false);

    setShowExtractedText(false);



    try {

      await loadPreview(data);

      // Auto-start text extraction for images, PDFs, and documents (DOCX converted to PDF)
      if (category === 'image' || category === 'pdf' || category === 'document') {
        setTimeout(() => extractTextFromFile(data), 500);
      }

    } catch (err: any) {

      setError(err.message || 'Failed to load preview');

    } finally {

      setLoading(false);

    }

  };



  const loadPreview = async (data: FileData) => {

    const { category, file, url } = data;



    switch (category) {

      case 'image':

        setPreview({ type: 'image', url });

        break;



      case 'video':

        setPreview({ type: 'video', url });

        break;



      case 'audio':

        setPreview({ type: 'audio', url });

        break;



      case 'text': {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const text = await file.text();
        const isLargeText = text.length > 100000; // >100KB of text

        if (['txt', 'md', 'markdown', 'html', 'htm'].includes(ext) || file.type === 'text/html') {
          await loadTextDocument(file, isLargeText);
        } else {
          setPreview({ type: 'text', content: text, isLargeText });
        }
        break;
      }

      case 'code': {
        const text = await file.text();
        const isLargeText = text.length > 100000; // >100KB of text
        setPreview({ type: 'text', content: text, isLargeText });
        break;
      }

      case 'json': {
        const text = await file.text();
        const isLargeText = text.length > 100000; // >100KB
        try {
          // Try to parse and pretty-print JSON
          const parsed = JSON.parse(text);
          const formatted = JSON.stringify(parsed, null, 2);
          setPreview({ type: 'json', content: formatted, raw: text, isLargeText, parsed });
        } catch (err) {
          // If JSON is invalid, show as plain text
          setPreview({ type: 'json', content: text, raw: text, isLargeText, error: 'Invalid JSON format' });
        }
        break;
      }



      case 'pdf':

        await loadPDF(url, data);

        break;

      case 'document':
        await loadDocument(file, data);
        break;



      case 'csv':

        const csvText = await file.text();

        const rows = csvText.split('\n').map(row => row.split(','));

        setPreview({ type: 'csv', rows });

        break;



      case 'spreadsheet':

        await loadExcel(file);

        break;



      case 'archive':

        await loadArchive(file);

        break;



      case 'email':

        await loadEmail(file);

        break;



      case 'database':

        await loadDatabase(file);

        break;



      case 'calendar':

        await loadCalendar(file);

        break;



      case 'contacts':

        await loadContacts(file);

        break;



      case 'subtitle':

        await loadSubtitle(file);

        break;



      default:

        setPreview({ type: 'unsupported' });

    }

  };



  const loadPDF = async (url: string, fileData: FileData) => {

    try {

      // Configure PDF.js worker - use CDN fallback if local file fails
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).href;

      const pdf = await pdfjsLib.getDocument(url).promise;

      const totalPages = pdf.numPages;



      // Detect if PDF is scanned by checking text content on first 3 pages
      let hasTextContent = false;
      const pagesToCheck = Math.min(3, totalPages);

      for (let i = 1; i <= pagesToCheck; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // If any page has text items, consider it a non-scanned PDF
        if (textContent.items.length > 0) {
          hasTextContent = true;
          break;
        }
      }

      const isScanned = !hasTextContent;



      // OPTIMIZATION: For large PDFs (>50 pages), use on-demand rendering
      // For small PDFs (<50 pages), pre-render all pages
      const isLargePDF = totalPages > 50;
      const renderScale = isLargePDF ? 1.2 : 1.5; // Lower quality for large PDFs to save memory

      // Load first 3 pages immediately for quick preview

      const initialPages: string[] = [];

      const INITIAL_LOAD = Math.min(3, totalPages);



      for (let i = 1; i <= INITIAL_LOAD; i++) {

        const page = await pdf.getPage(i);

        const viewport = page.getViewport({ scale: renderScale });

        const canvas = document.createElement('canvas');

        const context = canvas.getContext('2d')!;

        canvas.height = viewport.height;

        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;

        pdfViewportsRef.current[i - 1] = { width: viewport.width, height: viewport.height };

        initialPages.push(canvas.toDataURL());

      }



      // Initialize array with empty strings for remaining pages

      const allPages: string[] = [...initialPages, ...new Array(totalPages - INITIAL_LOAD).fill('')];

      pdfPagesRef.current = allPages;

      setPreview({ type: 'pdf', dataUrl: initialPages[0], totalPages, pdf, allPages, isScanned, isLargePDF, renderScale });



      // Load remaining pages in background
      // For large PDFs: Only load next 10 pages, rest on-demand
      // For small PDFs: Load all pages in batches
      if (totalPages > INITIAL_LOAD) {
        const pagesToPreload = isLargePDF ? Math.min(10, totalPages) : totalPages;
        setTimeout(() => loadRemainingPDFPages(pdf, INITIAL_LOAD + 1, pagesToPreload, isScanned, renderScale), 100);
      }

    } catch (err: any) {

      console.error('PDF loading error:', err);

      // Provide more specific error messages
      if (err.message?.includes('Worker')) {
        throw new Error('PDF Worker failed to load. Please refresh the page and try again.');
      } else if (err.message?.includes('Invalid PDF')) {
        throw new Error('Invalid or corrupted PDF file. Please try a different PDF.');
      } else if (err.message?.includes('password')) {
        throw new Error('This PDF is password-protected. Please unlock it first.');
      } else {
        throw new Error(`Failed to load PDF: ${err.message || 'Unknown error'}`);
      }

    }

  };



  const loadRemainingPDFPages = async (pdf: any, startPage: number, totalPages: number, isScanned?: boolean, renderScale: number = 1.5) => {

    const BATCH_SIZE = 3;



    for (let i = startPage; i <= totalPages; i += BATCH_SIZE) {

      const batchPromises = [];



      for (let j = i; j < Math.min(i + BATCH_SIZE, totalPages + 1); j++) {

        batchPromises.push(

          pdf.getPage(j).then((page: any) => {

            const viewport = page.getViewport({ scale: renderScale });

            const canvas = document.createElement('canvas');

            const context = canvas.getContext('2d')!;

            canvas.height = viewport.height;

            canvas.width = viewport.width;

            return page.render({ canvasContext: context, viewport }).promise.then(() => {

              pdfPagesRef.current[j - 1] = canvas.toDataURL();
              pdfViewportsRef.current[j - 1] = { width: viewport.width, height: viewport.height };

              return j;

            });

          })

        );

      }



      await Promise.all(batchPromises);

      setPreview((prev: any) => ({ ...prev, allPages: [...pdfPagesRef.current] }));

    }

  };



  const loadExcel = async (file: File) => {

    const formData = new FormData();

    formData.append('file', file);

    const uploadRes = await fetch('http://localhost:3001/api/excel/upload', { method: 'POST', body: formData });

    const { fileId, totalRows, sheetName } = await uploadRes.json();

    const rowsRes = await fetch(`http://localhost:3001/api/excel/${fileId}/rows?page=1&rowsPerPage=50`);

    const { data } = await rowsRes.json();

    setPreview({ type: 'excel', data, totalRows, fileId, sheetName });

  };



  const loadArchive = async (file: File) => {

    const formData = new FormData();

    formData.append('file', file);

    const uploadRes = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: formData });

    const { fileId } = await uploadRes.json();

    const listRes = await fetch('http://localhost:3001/api/archive/list', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ fileId }),

    });

    const { files } = await listRes.json();

    setPreview({ type: 'archive', files });

  };



  const loadEmail = async (file: File) => {

    const formData = new FormData();

    formData.append('file', file);

    const uploadRes = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: formData });

    const { fileId } = await uploadRes.json();

    const parseRes = await fetch('http://localhost:3001/api/email/parse', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ fileId }),

    });

    const emailData = await parseRes.json();

    setPreview({ type: 'email', data: emailData });

  };



  const loadDatabase = async (file: File) => {

    const formData = new FormData();

    formData.append('file', file);

    const uploadRes = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: formData });

    const { fileId } = await uploadRes.json();

    const tablesRes = await fetch('http://localhost:3001/api/database/tables', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ fileId }),

    });

    const { tables } = await tablesRes.json();

    if (tables.length > 0) {

      const queryRes = await fetch('http://localhost:3001/api/database/query', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ fileId, table: tables[0].name, page: 1, limit: 50 }),

      });

      const queryData = await queryRes.json();

      setPreview({ type: 'database', tables, selectedTable: tables[0].name, queryData, fileId });

    }

  };



  const loadCalendar = async (file: File) => {

    const formData = new FormData();

    formData.append('file', file);

    const uploadRes = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: formData });

    const { fileId } = await uploadRes.json();

    const parseRes = await fetch('http://localhost:3001/api/calendar/parse-ics', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ fileId }),

    });

    const { events } = await parseRes.json();

    setPreview({ type: 'calendar', events });

  };



  const loadContacts = async (file: File) => {

    const formData = new FormData();

    formData.append('file', file);

    const uploadRes = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: formData });

    const { fileId } = await uploadRes.json();

    const parseRes = await fetch('http://localhost:3001/api/calendar/parse-vcf', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ fileId }),

    });

    const { contacts } = await parseRes.json();

    setPreview({ type: 'contacts', contacts });

  };



  const loadSubtitle = async (file: File) => {

    const formData = new FormData();

    formData.append('file', file);

    const uploadRes = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: formData });

    const { fileId } = await uploadRes.json();

    const parseRes = await fetch('http://localhost:3001/api/subtitle/parse', {

      method: 'POST',

      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ fileId }),

    });

    const { subtitles, format } = await parseRes.json();

    setPreview({ type: 'subtitle', subtitles, format });

  };



  const extractTextFromFile = async (data: FileData) => {

    setExtractingText(true);

    setExtractedText('');
    setExtractedTextPages([]);



    try {

      if (data.category === 'image') {

        const worker = await createWorker('eng');

        const result = await worker.recognize(data.url);

        setExtractedText(result.data.text.trim());

        await worker.terminate();

        setExtractingText(false);

      } else if (data.category === 'pdf' && pdfPagesRef.current.length > 0) {

        const totalPages = pdfPagesRef.current.length;

        const pages: string[] = new Array(totalPages).fill('');

        const BATCH_SIZE = 4;



        // Process pages in batches of 4

        for (let i = 0; i < totalPages; i += BATCH_SIZE) {

          const batchPromises = [];



          for (let j = i; j < Math.min(i + BATCH_SIZE, totalPages); j++) {

            const worker = createWorker('eng');

            batchPromises.push(

              worker.then(w =>

                w.recognize(pdfPagesRef.current[j]).then(result => {

                  pages[j] = result.data.text.trim();

                  w.terminate();

                  return j;

                })

              )

            );

          }



          // Wait for current batch to complete

          await Promise.all(batchPromises);



          // Update state after each batch

          setExtractedTextPages([...pages]);

        }



        setExtractingText(false);

      }

    } catch (err) {

      setExtractedText('Failed to extract text from file.');

      setExtractingText(false);

    }

  };



  const formatFileSize = (bytes: number): string => {

    if (bytes === 0) return '0 Bytes';

    const k = 1024;

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];

  };



  const handleUrlUpload = async () => {
    if (!urlInput.trim()) return;

    setLoading(true);
    setError('');
    setShowUrlInput(false);

    try {
      console.log('[URL UPLOAD] Fetching from:', urlInput);

      // Try direct fetch first (works for CORS-enabled URLs)
      let response;
      let blob;

      try {
        response = await fetch(urlInput, {
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

        blob = await response.blob();
        console.log('[URL UPLOAD] Direct fetch successful, blob type:', blob.type);
      } catch (corsError: any) {
        console.warn('[URL UPLOAD] Direct fetch failed (likely CORS), trying proxy...');

        // Fallback: Use CORS proxy
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlInput)}`;
        response = await fetch(proxyUrl);

        if (!response.ok) throw new Error('Failed to fetch file. URL may be blocked or invalid.');

        blob = await response.blob();
        console.log('[URL UPLOAD] Proxy fetch successful');
      }

      // Extract filename from URL
      let filename = 'downloaded-file';
      try {
        const urlPath = new URL(urlInput).pathname;
        const pathParts = urlPath.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && lastPart.includes('.')) {
          filename = decodeURIComponent(lastPart);
        }
      } catch (e) {
        // If URL parsing fails, try simple split
        const parts = urlInput.split('/');
        const last = parts[parts.length - 1];
        if (last) filename = last;
      }

      console.log('[URL UPLOAD] Creating file:', filename, 'Type:', blob.type);

      // Create File object
      const file = new File([blob], filename, {
        type: blob.type || 'application/octet-stream'
      });

      // Process the file
      console.log('[URL UPLOAD] Processing file...');
      await onDrop([file]);

      setUrlInput('');
      console.log('[URL UPLOAD] Success!');
    } catch (err: any) {
      console.error('[URL UPLOAD] Error:', err);
      setError(err.message || 'Failed to load file from URL. Please check the URL or try uploading the file directly.');
      setLoading(false);
      setShowUrlInput(true); // Show input again on error
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({

    onDrop,

    maxSize: 1024 * 1024 * 1024,

    multiple: false,

  });



  const fileCategories = [

    { icon: FileText, label: 'Documents', desc: 'PDF, Word, PowerPoint, Text', color: 'from-blue-500 to-blue-600' },

    { icon: ImageIcon, label: 'Images', desc: 'JPG, PNG, GIF, SVG, PSD, RAW', color: 'from-purple-500 to-purple-600' },

    { icon: Video, label: 'Videos', desc: 'MP4, AVI, MOV, MKV, WebM', color: 'from-red-500 to-red-600' },

    { icon: Music, label: 'Audio', desc: 'MP3, WAV, FLAC, OGG, M4A', color: 'from-green-500 to-green-600' },

    { icon: Code2, label: 'Code', desc: 'JS, Python, Java, C++, Go', color: 'from-yellow-500 to-yellow-600' },

    { icon: Archive, label: 'Archives', desc: 'ZIP, RAR, 7Z, TAR, GZ', color: 'from-orange-500 to-orange-600' },

    { icon: Mail, label: 'Email', desc: 'EML, MSG files', color: 'from-pink-500 to-pink-600' },

    { icon: Database, label: 'Database', desc: 'SQLite, DB files', color: 'from-indigo-500 to-indigo-600' },

  ];



  const getCategoryIcon = (category: string) => {

    const map: Record<string, any> = {

      document: FileText, spreadsheet: FileText, pdf: FileText, csv: FileText,

      image: ImageIcon, video: Video, audio: Music, code: Code2,

      archive: Archive, email: Mail, database: Database,

      calendar: Calendar, contacts: User, text: FileText, json: Code2,

    };

    return map[category] || File;

  };



  const handlePageChange = async (newPage: number) => {

    if (preview.type === 'pdf' && preview.pdf && newPage >= 1 && newPage <= preview.totalPages) {

      setPage(newPage);

      setLoading(true);

      try {

        const pdfPage = await preview.pdf.getPage(newPage);

        const viewport = pdfPage.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');

        const context = canvas.getContext('2d')!;

        canvas.height = viewport.height;

        canvas.width = viewport.width;

        await pdfPage.render({ canvasContext: context, viewport }).promise;

        pdfViewportsRef.current[newPage - 1] = { width: viewport.width, height: viewport.height };

        setPreview({ ...preview, dataUrl: canvas.toDataURL() });

      } catch (err) {

        setError('Failed to load page');

      } finally {

        setLoading(false);

      }

    } else if (preview.type === 'document' && preview.pages && newPage >= 1 && newPage <= preview.totalPages) {

      setPage(newPage);

      // Scroll to the page
      if (scrollContainerRef.current) {
        const pageElements = scrollContainerRef.current.querySelectorAll('.document-page');
        const targetPage = pageElements[newPage - 1] as HTMLElement;
        if (targetPage) {
          targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

    } else if (preview.type === 'excel' && preview.fileId && newPage >= 1) {

      setPage(newPage);

      setLoading(true);

      try {

        const rowsRes = await fetch(`http://localhost:3001/api/excel/${preview.fileId}/rows?page=${newPage}&rowsPerPage=50`);

        const { data } = await rowsRes.json();

        setPreview({ ...preview, data });

      } catch (err) {

        setError('Failed to load page');

      } finally {

        setLoading(false);

      }

    }

  };



  const applyPageInput = () => {
    if (!totalPages) {
      setPageInput(String(page));
      return;
    }

    const numericPage = parseInt(pageInput, 10);

    if (!Number.isNaN(numericPage) && numericPage >= 1 && numericPage <= totalPages) {
      if (numericPage !== page) {
        handlePageChange(numericPage);
      }
    } else {
      setPageInput(String(page));
    }
  };


  const docPages = preview?.type === 'document' ? (preview.pages || [preview.html]) : [];

  const showViewerControls = fileData && ['image', 'pdf', 'document', 'text', 'code', 'json'].includes(fileData.category);

  const showPagination = preview && (
    preview.type === 'pdf' ||
    preview.type === 'excel' ||
    preview.type === 'document'
  );

  const totalPages = preview?.type === 'pdf'
    ? preview.totalPages
    : preview?.type === 'document'
      ? (docPages.length || 1)
      : preview?.type === 'excel'
        ? Math.ceil(preview.totalRows / 50)
        : 1;



const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

const handleFullscreen = () => {

    if (viewerRef.current) {

      if (document.fullscreenElement) {

        document.exitFullscreen();

        setIsFullscreen(false);

      } else {

        viewerRef.current.requestFullscreen();

        setIsFullscreen(true);

      }

    }

  };

  const handleScrollUpdate = (container: HTMLDivElement) => {
    if (preview?.type === 'pdf' && preview.allPages) {
      const pageElements = container.querySelectorAll('.pdf-page');
      const containerRect = container.getBoundingClientRect();

      let maxVisible = 0;
      let mostVisiblePage = page;

      pageElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top);
        if (visibleHeight > maxVisible) {
          maxVisible = visibleHeight;
          mostVisiblePage = index + 1;
        }

        // ON-DEMAND RENDERING: For large PDFs, render pages as they come into view
        if (preview.isLargePDF && !pdfPagesRef.current[index] && visibleHeight > 0) {
          const pageNum = index + 1;
          // Render this page on-demand
          preview.pdf.getPage(pageNum).then((pdfPage: any) => {
            const viewport = pdfPage.getViewport({ scale: preview.renderScale || 1.2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            pdfPage.render({ canvasContext: context, viewport }).promise.then(() => {
              pdfPagesRef.current[index] = canvas.toDataURL();
              pdfViewportsRef.current[index] = { width: viewport.width, height: viewport.height };
              setPreview((prev: any) => ({ ...prev, allPages: [...pdfPagesRef.current] }));
            });
          });
        }
      });

      if (mostVisiblePage !== page) {
        setPage(mostVisiblePage);
      }
    } else if (preview?.type === 'document' && preview.pages) {
      const pageElements = container.querySelectorAll('.document-page');
      const containerRect = container.getBoundingClientRect();

      let maxVisible = 0;
      let mostVisiblePage = page;

      pageElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top);
        if (visibleHeight > maxVisible) {
          maxVisible = visibleHeight;
          mostVisiblePage = index + 1;
        }
      });

      if (mostVisiblePage !== page) {
        setPage(mostVisiblePage);
      }
    } else if (preview?.type === 'document' && (preview.pages || preview.html)) {
      const pageElements = container.querySelectorAll('.document-page');
      const containerRect = container.getBoundingClientRect();

      let maxVisible = 0;
      let mostVisiblePage = page;

      pageElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top);
        if (visibleHeight > maxVisible) {
          maxVisible = visibleHeight;
          mostVisiblePage = index + 1;
        }
      });

      if (mostVisiblePage !== page) {
        setPage(mostVisiblePage);
      }
    } else if (preview?.type === 'excel') {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 50 && page < totalPages) {
        handlePageChange(page + 1);
      }
    }
  };

  const handleToggleExtractText = () => {
    if (!fileData) return;

    // Allow Show Text for all supported file types
    if (!['image', 'pdf', 'document', 'text', 'code', 'json', 'csv', 'spreadsheet'].includes(fileData.category)) {
      return;
    }

    if (!showExtractedText) {
      // For text/code files, extract text from preview content
      if (fileData.category === 'text' || fileData.category === 'code') {
        if (preview?.content) {
          setExtractedText(preview.content);
        }
      } else if (fileData.category === 'json') {
        // For JSON, use the raw content
        if (preview?.raw || preview?.content) {
          setExtractedText(preview.raw || preview.content);
        }
      } else if (fileData.category === 'csv') {
        // Convert CSV rows to tab-separated text
        if (preview?.rows) {
          const csvText = preview.rows.map((row: any[]) => row.join('\t')).join('\n');
          setExtractedText(csvText);
        }
      } else if (fileData.category === 'spreadsheet') {
        // Convert Excel data to tab-separated text
        if (preview?.data) {
          const excelText = preview.data.map((row: any[]) => row.join('\t')).join('\n');
          setExtractedText(excelText);
        }
      } else if (fileData.category === 'document') {
        // Documents are converted to PDF, so extract from the current page
        if (preview?.type === 'pdf' && !extractingText && extractedTextPages.length === 0) {
          extractTextFromFile(fileData);
        }
      } else {
        // For images and PDFs, run OCR if not already done
        if (!extractingText && !extractedText && extractedTextPages.length === 0) {
          extractTextFromFile(fileData);
        }
      }
      setShowExtractedText(true);
    } else {
      setShowExtractedText(false);
    }
  };

  const handleDownload = async () => {
    if (!fileData || !preview) return;
    const a = document.createElement('a');
    a.href = fileData.url;
    a.download = fileData.name;
    a.click();
  };



// Handle scroll-based pagination

  useEffect(() => {

    if (!scrollContainerRef.current || !showPagination) return;

    const container = scrollContainerRef.current;

    const handler = (e: Event) => handleScrollUpdate(e.target as HTMLDivElement);

    container.addEventListener('scroll', handler);

    return () => container.removeEventListener('scroll', handler);

  }, [page, totalPages, showPagination, preview]);

  // Listen for fullscreen changes

  useEffect(() => {

    const handleFullscreenChange = () => {

      setIsFullscreen(!!document.fullscreenElement);

    };



    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);

  }, []);



  useEffect(() => {

    if (fileData && previewSectionRef.current) {

      const offset = 80;

      const top = previewSectionRef.current.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });

    }

  }, [fileData]);

  // Build PDF text layers so text can be selected (non-scanned PDFs)
  useEffect(() => {
    const renderTextLayers = async () => {
      if (preview?.type !== 'pdf' || !preview.pdf) return;
      const pdf = preview.pdf;

      for (let i = 0; i < preview.totalPages; i++) {
        const container = textLayerRefs.current[i];
        if (!container) continue;

        container.innerHTML = '';

        try {
          const page = await pdf.getPage(i + 1);
          const viewport = page.getViewport({ scale: 1.5 });
          const textContent = await page.getTextContent();
          // @ts-ignore renderTextLayer provided by pdfjs
          await pdfjsLib.renderTextLayer({
            textContent,
            container,
            viewport,
          });

          const baseSize = pdfViewportsRef.current[i] || { width: viewport.width, height: viewport.height };
          container.style.width = `${baseSize.width}px`;
          container.style.height = `${baseSize.height}px`;
          container.style.left = '50%';
          container.style.top = '50%';
          container.style.transform = `translate(-50%, -50%) scale(${zoom / 100})`;
          container.style.transformOrigin = 'top left';
          container.style.color = 'transparent';
          container.style.pointerEvents = 'auto';
        } catch {
          // ignore text layer failures to keep preview working
        }
      }
    };

    renderTextLayers();
  }, [preview, zoom]);



  return (

    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-4">

      <div className="container-custom">
        <style>{`
          .textLayer {
            position: absolute;
            inset: 0;
            pointer-events: auto;
          }
          .textLayer span {
            position: absolute;
            white-space: pre;
            transform-origin: 0 0;
          }
          .textLayer span::selection {
            background: rgba(79, 70, 229, 0.25);
          }
          /* Document content styling */
          .prose img {
            max-width: 100% !important;
            height: auto !important;
            display: block;
            margin: 1rem auto;
          }
          .prose p {
            margin-bottom: 0.75rem;
          }
          .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            page-break-after: avoid;
            break-after: avoid;
          }
          .document-page {
            page-break-after: always;
            break-after: page;
          }
        `}</style>

        {!fileData && (

          <>

            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl mb-4">

                <Eye className="w-10 h-10 text-white" />

              </div>

              <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3">

                File <span className="gradient-text">Preview</span>

              </h1>

              <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">

                Preview any file type instantly - documents, images, videos, audio, code, archives, databases, and more

              </p>

            </div>

            <div className="max-w-4xl mx-auto mb-8 animate-fade-in-up">
              <div {...getRootProps()} className={`bg-white rounded-3xl shadow-xl p-8 md:p-10 border-2 border-dashed transition-all cursor-pointer ${isDragActive ? 'border-accent-primary bg-background-accent-light scale-105' : 'border-ui-border hover:border-accent-primary hover:shadow-2xl'}`}>
                <input {...getInputProps()} />

                <div className="text-center">

                  <Upload className="w-16 h-16 md:w-20 md:h-20 text-accent-primary mx-auto mb-4 md:mb-6" />

                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">

                    {isDragActive ? 'Drop your file here' : 'Drop any file here'}

                  </h3>

                  <p className="text-base md:text-lg text-text-secondary mb-6">
                    or click to browse your device • Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+V</kbd> to paste
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                    <Button variant="primary" size="large" onClick={(e) => { e.stopPropagation(); open(); }} type="button">Choose File</Button>
                    <Button variant="outline" size="large" onClick={(e) => { e.stopPropagation(); setShowUrlInput(!showUrlInput); }} type="button">
                      Upload from URL
                    </Button>
                  </div>

                  {showUrlInput && (
                    <div className="mt-6 max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUrlUpload();
                            if (e.key === 'Escape') setShowUrlInput(false);
                          }}
                          placeholder="https://example.com/file.pdf"
                          className="flex-1 px-4 py-3 border-2 border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                        />
                        <Button variant="primary" size="large" onClick={handleUrlUpload} disabled={!urlInput.trim()}>
                          Load
                        </Button>
                      </div>
                      <p className="text-xs text-text-secondary mt-2">Enter a direct URL to an image, document, or file</p>
                    </div>
                  )}

                  <p className="text-xs text-text-secondary mt-4">Maximum file size: 1GB • All file types supported</p>

                </div>

              </div>

            </div>



            <div className="max-w-6xl mx-auto animate-fade-in-up">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-6 text-center">Supported File Types</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {fileCategories.map((cat, index) => {

                  const Icon = cat.icon;

                  return (

                    <div key={index} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className={`w-10 h-10 bg-gradient-to-r ${cat.color} rounded-xl flex items-center justify-center mb-4`}>

                        <Icon className="w-6 h-6 text-white" />

                      </div>

                      <h3 className="text-base font-bold text-text-primary mb-1">{cat.label}</h3>

                      <p className="text-xs text-text-secondary">{cat.desc}</p>

                    </div>

                  );

                })}

              </div>

            </div>

          </>

        )}



        {fileData && (

          <div className="max-w-6xl mx-auto" ref={previewSectionRef}>

            <div className="bg-white rounded-3xl shadow-xl p-3 md:p-4 mb-3">

              {/* Header - Responsive */}

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-ui-border">

                <div className="flex items-start gap-3 flex-1 min-w-0 w-full sm:w-auto">

                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center flex-shrink-0">

                    {(() => {

                      const Icon = getCategoryIcon(fileData.category);

                      return <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;

                    })()}

                  </div>

                  <div className="flex-1 min-w-0">

                    <h2 className="text-lg sm:text-2xl font-bold text-text-primary mb-2 truncate" title={fileData.name}>

                      {fileData.name}

                    </h2>

                    <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-xs text-text-secondary">

                      <span className="flex items-center gap-1">

                        <Info className="w-3 h-3 sm:w-4 sm:h-4" />

                        {fileData.size}

                      </span>

                      <span className="hidden sm:inline">•</span>

                      <span className="capitalize">{fileData.category}</span>

                      <span className="hidden sm:inline">•</span>

                      <span>{fileData.extension.toUpperCase()}</span>

                    </div>

                  </div>

                </div>

                <div className="flex gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => {
                      setFileData(null);
                      setPreview(null);
                      setError('');
                      setPage(1);
                      setZoom(100);
                      setExtractedText('');
                      setExtractedTextPages([]);
                      setExtractingText(false);
                      setShowExtractedText(false);
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Upload Another File</span>
                    <span className="sm:hidden">Upload</span>
                  </Button>
                </div>

              </div>



              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"><p className="text-red-700">{error}</p></div>}



              {/* Viewer Controls - Responsive */}

              {!loading && preview && (

                <div className="mb-3">

                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-3 bg-background-secondary rounded-xl">

                    <div className="flex items-center gap-2 sm:gap-3">

                      {showPagination && (

                        <>

                          <Button variant="outline" size="small" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>

                            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />

                          </Button>

                          <div className="flex items-center gap-2">

                            <input

                              type="number"

                              min={1}

                              max={totalPages}

                              value={pageInput}
                              onChange={(e) => setPageInput(e.target.value)}
                              onBlur={applyPageInput}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  applyPageInput();
                                }
                              }}

                              className="w-14 sm:w-16 px-2 py-1 text-center text-xs sm:text-sm border border-ui-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"

                            />

                            <span className="text-xs sm:text-xs text-text-secondary">/ {totalPages}</span>

                          </div>

                          <Button variant="outline" size="small" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>

                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />

                          </Button>

                        </>

                      )}

                    </div>



                    <div className="flex items-center gap-2 sm:gap-3">

                      {showViewerControls && (

                        <>

                          <Button variant="outline" size="small" onClick={handleZoomOut} disabled={zoom <= 50}>

                            <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />

                          </Button>

                          <span className="text-xs sm:text-sm font-semibold text-text-primary min-w-[50px] sm:min-w-[60px] text-center">

                            {zoom}%

                          </span>

                          <Button variant="outline" size="small" onClick={handleZoomIn} disabled={zoom >= 200}>

                            <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />

                          </Button>

                          {fileData && ['pdf', 'image', 'document', 'text', 'code', 'json', 'csv', 'spreadsheet'].includes(fileData.category) && (
                            <Button
                              variant={showExtractedText ? 'primary' : 'outline'}
                              size="small"
                              onClick={handleToggleExtractText}
                              title={showExtractedText ? 'Hide text overlay' : 'Show text overlay'}
                            >
                              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">
                                {showExtractedText ? 'Hide Text' : 'Show Text'}
                              </span>
                            </Button>
                          )}

                        </>

                      )}

                      <Button variant="outline" size="small" onClick={handleDownload} title="Download File">

                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />

                      </Button>

                      <Button variant="outline" size="small" onClick={handleFullscreen}>

                        {isFullscreen ? <Minimize className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />}

                      </Button>

                    </div>

                  </div>

                </div>

              )}



              {loading && <div className="flex flex-col items-center justify-center py-20"><div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-primary mb-4"></div><p className="text-text-secondary text-lg">Loading preview...</p></div>}



              {!loading && preview && (

                <div

                  className={`preview-content ${isFullscreen ? 'h-screen overflow-auto' : ''}`}

                  ref={viewerRef}

                >

                  <div
                    ref={scrollContainerRef}
                    className={showPagination ? 'overflow-y-auto scroll-smooth snap-y snap-mandatory' : ''}
                    style={!isFullscreen ? { maxHeight: 'calc(100vh - 220px)' } : undefined}
                    onScroll={(e) => handleScrollUpdate(e.currentTarget)}
                  >

                  {preview.type === 'image' && (

                    <div
                      className="relative flex items-center justify-center bg-gray-50 rounded-xl p-4"
                      style={!isFullscreen ? { height: 'calc(100vh - 220px)' } : { height: '100vh' }}
                    >

                      <img

                        src={preview.url}

                        alt={fileData.name}

                        className="rounded-lg shadow-lg transition-transform object-contain"

                        style={{
                          transform: `scale(${zoom / 100})`,
                          transformOrigin: 'center',
                          maxHeight: '100%',
                          maxWidth: '100%',
                          height: 'auto',
                          width: 'auto',
                        }}

                      />

                      {showExtractedText && extractedText && (

                        <div className="absolute inset-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-auto border-2 border-accent-primary shadow-2xl">

                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">

                            <h3 className="text-lg font-bold text-text-primary">Extracted Text</h3>

                            <div className="flex items-center gap-2">

                              <Button

                                variant="outline"

                                size="small"

                                onClick={() => {

                                  navigator.clipboard.writeText(extractedText);

                                  setTextCopied(true);

                                  setTimeout(() => setTextCopied(false), 2000);

                                }}

                              >

                                {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}

                                <span className="ml-1">{textCopied ? 'Copied!' : 'Copy'}</span>

                              </Button>

                              <Button

                                variant="outline"

                                size="small"

                                onClick={() => setShowExtractedText(false)}

                              >

                                Hide

                              </Button>

                            </div>

                          </div>

                          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{extractedText}</pre>

                        </div>

                      )}

                    </div>

                  )}



                  {preview.type === 'video' && (

                    <div className="bg-black rounded-xl overflow-hidden" style={!isFullscreen ? { maxHeight: 'calc(100vh - 220px)' } : undefined}>

                      <video src={preview.url} controls className="w-full" style={!isFullscreen ? { maxHeight: 'calc(100vh - 220px)' } : { height: '100vh' }} />

                    </div>

                  )}



                  {preview.type === 'audio' && (

                    <div className="bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 rounded-xl p-12">

                      <div className="flex items-center justify-center mb-8">

                        <div className="w-32 h-32 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full flex items-center justify-center">

                          <Music className="w-16 h-16 text-white" />

                        </div>

                      </div>

                      <audio src={preview.url} controls className="w-full" style={{ height: '54px' }} />

                    </div>

                  )}



                  {preview.type === 'text' && (

                    <div className="relative bg-white border border-ui-border rounded-xl overflow-hidden shadow-sm">

                      <div className="flex items-center justify-between px-4 py-3 bg-background-secondary border-b border-ui-border">

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-secondary font-mono">{fileData.name}</span>
                          {preview.isLargeText && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Large File</span>
                          )}
                        </div>

                        <span className="text-xs text-text-muted">{preview.content.split('\n').length} lines</span>

                      </div>

                      {preview.isLargeText && (
                        <div className="px-4 py-2 bg-orange-50 border-b border-orange-200">
                          <p className="text-xs text-orange-700">⚡ Large file optimized for performance</p>
                        </div>
                      )}

                      <pre className="p-6 overflow-x-auto max-h-[600px] overflow-y-auto bg-white">

                        <code className="text-sm font-mono text-text-primary leading-6 whitespace-pre">{preview.content}</code>

                      </pre>

                      {showExtractedText && extractedText && (
                        <div className="absolute inset-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-auto border-2 border-accent-primary shadow-2xl">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                            <h3 className="text-lg font-bold text-text-primary">Text Content</h3>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(extractedText);
                                  setTextCopied(true);
                                  setTimeout(() => setTextCopied(false), 2000);
                                }}
                              >
                                {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-1">{textCopied ? 'Copied!' : 'Copy'}</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => setShowExtractedText(false)}
                              >
                                Hide
                              </Button>
                            </div>
                          </div>
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{extractedText}</pre>
                        </div>
                      )}

                    </div>

                  )}



                  {preview.type === 'json' && (

                    <div className="relative bg-white border border-ui-border rounded-xl overflow-hidden shadow-sm">

                      <div className="flex items-center justify-between px-4 py-3 bg-background-secondary border-b border-ui-border">

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-secondary font-mono">{fileData.name}</span>
                          {preview.isLargeText && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Large JSON</span>
                          )}
                          {preview.error && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{preview.error}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-text-muted">{preview.content.split('\n').length} lines</span>
                          {preview.parsed && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Valid JSON</span>
                          )}
                        </div>

                      </div>

                      <pre className="p-6 overflow-x-auto max-h-[600px] overflow-y-auto bg-white">

                        <code className="text-sm font-mono text-text-primary leading-6 whitespace-pre">{preview.content}</code>

                      </pre>

                      {showExtractedText && extractedText && (
                        <div className="absolute inset-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-auto border-2 border-accent-primary shadow-2xl">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                            <h3 className="text-lg font-bold text-text-primary">JSON Content</h3>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(extractedText);
                                  setTextCopied(true);
                                  setTimeout(() => setTextCopied(false), 2000);
                                }}
                              >
                                {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-1">{textCopied ? 'Copied!' : 'Copy JSON'}</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => setShowExtractedText(false)}
                              >
                                Hide
                              </Button>
                            </div>
                          </div>
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{extractedText}</pre>
                        </div>
                      )}

                    </div>

                  )}



                  {preview.type === 'document' && (preview.pages || preview.html) && (

                    <div className="relative bg-gray-50 rounded-xl">

                      {(docPages.length ? docPages : [preview.html]).map((pageHtml: string, index: number) => (

                        <div
                          key={index}
                          className="document-page snap-center flex items-center justify-center relative bg-gray-50 p-4"
                          data-page={index + 1}
                          style={!isFullscreen ? { height: 'calc(100vh - 220px)' } : { height: '100vh' }}
                        >

                          <div
                            className="bg-white shadow-2xl rounded-lg overflow-auto"
                            style={{
                              width: '816px',
                              maxHeight: 'calc(100vh - 280px)',
                              transform: `scale(${zoom / 100})`,
                              transformOrigin: 'top center',
                              maxWidth: '95%',
                            }}
                          >
                            <div
                              className="prose prose-sm md:prose-base max-w-none p-8 md:p-12"
                              style={{
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                              dangerouslySetInnerHTML={{ __html: pageHtml }}
                            />
                          </div>

                          <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">

                            Page {index + 1} / {(docPages.length ? docPages.length : 1)}

                          </div>

                          {showExtractedText && (index + 1) === page && (

                            <div className="absolute inset-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-auto border-2 border-accent-primary shadow-2xl z-10">

                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">

                            <h3 className="text-lg font-bold text-text-primary">

                              Document Text - Page {page}

                            </h3>

                            <div className="flex items-center gap-2">

                              <Button

                                variant="outline"

                                size="small"

                                onClick={() => {

                                  const textContent = new DOMParser().parseFromString(pageHtml, 'text/html').body.textContent || '';

                                  navigator.clipboard.writeText(textContent);

                                  setTextCopied(true);

                                  setTimeout(() => setTextCopied(false), 2000);

                                }}

                              >

                                {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}

                                <span className="ml-1">{textCopied ? 'Copied!' : 'Copy'}</span>

                              </Button>

                              <Button variant="outline" size="small" onClick={() => setShowExtractedText(false)}>

                                Hide

                              </Button>

                            </div>

                          </div>

                          <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">

                            {new DOMParser().parseFromString(pageHtml, 'text/html').body.textContent}

                          </div>

                        </div>

                          )}

                        </div>

                      ))}

                    </div>

                  )}



                  {preview.type === 'pdf' && preview.allPages && (

                    <div className="relative bg-gray-50 rounded-xl">

                      {preview.allPages.map((pageUrl: string, index: number) => (

                        <div
                          key={index}
                          className="pdf-page snap-center flex items-center justify-center relative bg-gray-50 p-4 mb-4"
                          data-page={index + 1}
                          style={!isFullscreen ? { height: 'calc(100vh - 220px)' } : { height: '100vh' }}
                        >

                          {pageUrl ? (
                            <>
                              <img
                                src={pageUrl}
                                alt={`PDF Page ${index + 1}`}
                                className="shadow-2xl transition-transform object-contain bg-white border-4 border-gray-200 rounded-sm"
                                style={{
                                  transform: `scale(${zoom / 100})`,
                                  transformOrigin: 'center',
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  height: 'auto',
                                  width: 'auto'
                                }}
                              />
                              {preview.isLargePDF && index === 0 && (
                                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                                  📄 Large PDF ({preview.totalPages} pages) - Loading optimized
                                </div>
                              )}
                              <div
                                ref={(el) => (textLayerRefs.current[index] = el)}
                                className="absolute textLayer text-transparent"
                                style={{
                                  pointerEvents: 'auto',
                                  left: '50%',
                                  top: '50%',
                                  transform: `translate(-50%, -50%) scale(${zoom / 100})`,
                                  transformOrigin: 'top left',
                                }}
                              />
                            </>
                          ) : (

                            <div className="flex flex-col items-center justify-center text-gray-400">

                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mb-3"></div>

                              <p className="text-sm">Loading page {index + 1}...</p>

                            </div>

                          )}

                          <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold z-20">

                            Page {index + 1} / {preview.totalPages}

                          </div>

                          {/* Page separator line */}
                          {index < preview.allPages.length - 1 && (
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                          )}

                          {showExtractedText && (index + 1) === page && (

                            <div className="absolute inset-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-auto border-2 border-accent-primary shadow-2xl z-10">

                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">

                            <h3 className="text-lg font-bold text-text-primary">

                              Extracted Text - Page {page}

                              {extractingText && !extractedTextPages[page - 1] && (

                                <span className="ml-2 text-sm text-blue-600">(extracting...)</span>

                              )}

                            </h3>

                            <div className="flex items-center gap-2">

                              <Button

                                variant="outline"

                                size="small"

                                onClick={() => {

                                  if (extractedTextPages[page - 1]) {

                                    navigator.clipboard.writeText(extractedTextPages[page - 1]);

                                    setTextCopied(true);

                                    setTimeout(() => setTextCopied(false), 2000);

                                  }

                                }}

                                disabled={!extractedTextPages[page - 1]}

                              >

                                {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}

                                <span className="ml-1">{textCopied ? 'Copied!' : 'Copy'}</span>

                              </Button>

                              <Button

                                variant="outline"

                                size="small"

                                onClick={() => setShowExtractedText(false)}

                              >

                                Hide

                              </Button>

                            </div>

                          </div>

                          {extractedTextPages[page - 1] ? (

                            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{extractedTextPages[page - 1]}</pre>

                          ) : (

                            <div className="flex items-center justify-center py-12 text-gray-500">

                              <div className="text-center">

                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mx-auto mb-3"></div>

                                <p>Extracting text for this page...</p>

                              </div>

                            </div>

                          )}

                        </div>

                          )}

                        </div>

                      ))}

                    </div>

                  )}



                  {preview.type === 'csv' && (

                    <div className="relative border border-ui-border rounded-xl overflow-hidden">

                      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">

                        <table className="w-full">

                          <tbody className="divide-y divide-ui-border">

                            {preview.rows.slice(0, 100).map((row: any, i: number) => (

                              <tr key={i} className={i === 0 ? 'bg-background-secondary font-semibold' : 'hover:bg-background-secondary'}>

                                {row.map((cell: any, j: number) => (

                                  <td key={j} className="px-4 py-2 text-sm text-text-primary whitespace-nowrap">{cell}</td>

                                ))}

                              </tr>

                            ))}

                          </tbody>

                        </table>

                      </div>

                      {showExtractedText && extractedText && (
                        <div className="absolute inset-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-auto border-2 border-accent-primary shadow-2xl">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                            <h3 className="text-lg font-bold text-text-primary">CSV Data (Tab-separated)</h3>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(extractedText);
                                  setTextCopied(true);
                                  setTimeout(() => setTextCopied(false), 2000);
                                }}
                              >
                                {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-1">{textCopied ? 'Copied!' : 'Copy All'}</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => setShowExtractedText(false)}
                              >
                                Hide
                              </Button>
                            </div>
                          </div>
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{extractedText}</pre>
                        </div>
                      )}

                    </div>

                  )}



                  {preview.type === 'excel' && (

                    <div className="relative border border-ui-border rounded-xl overflow-hidden">

                      <div className="bg-background-secondary px-4 py-3 border-b border-ui-border">

                        <h3 className="font-bold text-text-primary">{preview.sheetName}</h3>

                      </div>

                      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">

                        <table className="w-full">

                          <tbody className="divide-y divide-ui-border">

                            {preview.data.map((row: any, i: number) => (

                              <tr key={i} className="hover:bg-background-secondary">

                                {row.map((cell: any, j: number) => (

                                  <td key={j} className="px-4 py-2 text-sm text-text-primary whitespace-nowrap">{cell}</td>

                                ))}

                              </tr>

                            ))}

                          </tbody>

                        </table>

                      </div>

                      {showExtractedText && extractedText && (
                        <div className="absolute inset-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-auto border-2 border-accent-primary shadow-2xl">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                            <h3 className="text-lg font-bold text-text-primary">Excel Data (Tab-separated)</h3>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(extractedText);
                                  setTextCopied(true);
                                  setTimeout(() => setTextCopied(false), 2000);
                                }}
                              >
                                {textCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span className="ml-1">{textCopied ? 'Copied!' : 'Copy All'}</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="small"
                                onClick={() => setShowExtractedText(false)}
                              >
                                Hide
                              </Button>
                            </div>
                          </div>
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{extractedText}</pre>
                        </div>
                      )}

                    </div>

                  )}



                  {preview.type === 'archive' && (

                    <div className="space-y-2 max-h-[600px] overflow-y-auto">

                      {preview.files.map((file: any, i: number) => (

                        <div key={i} className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">

                          {file.type === 'directory' ? <FolderOpen className="w-4 h-4 text-accent-primary" /> : <File className="w-4 h-4 text-text-secondary" />}

                          <span className="text-sm text-text-primary flex-1">{file.path}</span>

                          <span className="text-xs text-text-secondary">{file.type === 'file' ? formatFileSize(file.size) : ''}</span>

                        </div>

                      ))}

                    </div>

                  )}



                  {preview.type === 'email' && (

                    <div className="space-y-4">

                      <div className="border border-ui-border rounded-xl p-6">

                        <div className="space-y-3">

                          <div><p className="text-xs text-text-secondary">From</p><p className="font-semibold text-text-primary">{preview.data.from}</p></div>

                          <div><p className="text-xs text-text-secondary">To</p><p className="font-semibold text-text-primary">{preview.data.to}</p></div>

                          <div><p className="text-xs text-text-secondary">Subject</p><p className="font-semibold text-text-primary">{preview.data.subject}</p></div>

                        </div>

                      </div>

                      <div className="border border-ui-border rounded-xl p-6 max-h-[400px] overflow-y-auto">

                        {preview.data.html ? <div dangerouslySetInnerHTML={{ __html: preview.data.html }} /> : <pre className="whitespace-pre-wrap text-sm">{preview.data.text}</pre>}

                      </div>

                    </div>

                  )}



                  {preview.type === 'database' && preview.queryData && (

                    <div className="border border-ui-border rounded-xl overflow-hidden">

                      <div className="bg-background-secondary px-4 py-3 border-b border-ui-border">

                        <h3 className="font-bold text-text-primary">{preview.selectedTable}</h3>

                      </div>

                      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">

                        <table className="w-full">

                          <thead className="bg-background-secondary sticky top-0">

                            <tr>

                              {preview.queryData.columns.map((col: string) => (

                                <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-text-primary border-b border-ui-border">{col}</th>

                              ))}

                            </tr>

                          </thead>

                          <tbody className="divide-y divide-ui-border">

                            {preview.queryData.rows.map((row: any, i: number) => (

                              <tr key={i} className="hover:bg-background-secondary">

                                {preview.queryData.columns.map((col: string) => (

                                  <td key={col} className="px-4 py-3 text-sm text-text-primary">{row[col]?.toString() || '-'}</td>

                                ))}

                              </tr>

                            ))}

                          </tbody>

                        </table>

                      </div>

                    </div>

                  )}



                  {preview.type === 'calendar' && (

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">

                      {preview.events.map((event: any, i: number) => (

                        <div key={i} className="border border-ui-border rounded-xl p-6">

                          <h3 className="text-xl font-bold text-text-primary mb-3">{event.summary}</h3>

                          {event.description && <p className="text-xs text-text-secondary mb-3">{event.description}</p>}

                          <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">

                            <Clock className="w-4 h-4" /><span>{event.start} - {event.end}</span>

                          </div>

                          {event.location && <div className="flex items-center gap-2 text-xs text-text-secondary"><MapPin className="w-4 h-4" /><span>{event.location}</span></div>}

                        </div>

                      ))}

                    </div>

                  )}



                  {preview.type === 'contacts' && (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">

                      {preview.contacts.map((contact: any, i: number) => (

                        <div key={i} className="border border-ui-border rounded-xl p-6">

                          <h3 className="text-lg font-bold text-text-primary mb-3">{contact.name}</h3>

                          {contact.email && <p className="text-xs text-text-secondary"><span className="font-semibold">Email:</span> {contact.email}</p>}

                          {contact.phone && <p className="text-xs text-text-secondary"><span className="font-semibold">Phone:</span> {contact.phone}</p>}

                        </div>

                      ))}

                    </div>

                  )}



                  {preview.type === 'subtitle' && (

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">

                      {preview.subtitles.slice(0, 50).map((sub: any, i: number) => (

                        <div key={i} className="border border-ui-border rounded-xl p-5">

                          <div className="flex items-center justify-between mb-3">

                            {sub.index && <span className="w-8 h-8 bg-accent-primary text-white rounded-lg font-bold text-sm flex items-center justify-center">{sub.index}</span>}

                            <div className="flex items-center gap-2 text-xs text-text-secondary">

                              <Clock className="w-4 h-4" /><span className="font-mono">{sub.startTime} → {sub.endTime}</span>

                            </div>

                          </div>

                          <p className="text-base text-text-primary leading-relaxed whitespace-pre-wrap">{sub.text}</p>

                        </div>

                      ))}

                    </div>

                  )}



                  {preview.type === 'unsupported' && (

                    <div className="bg-gray-50 rounded-xl p-12 text-center">

                      <File className="w-16 h-16 text-gray-400 mx-auto mb-6" />

                      <h3 className="text-2xl font-bold text-text-primary mb-3">Preview Not Available</h3>

                      <p className="text-text-secondary mb-8">This file type doesn't have a preview available yet.</p>

                    </div>

                  )}

                  </div>

                </div>

              )}



            </div>

          </div>

        )}

      </div>

    </div>

  );

};



export default PreviewPage;


