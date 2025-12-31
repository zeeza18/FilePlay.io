export interface FileFormat {
  label: string;
  extensions: string[];
  category: string;
  canPreview: boolean;
  convertibleTo: string[];
}

export const FILE_FORMATS: FileFormat[] = [
  // IMAGE FILES - Raster Images
  {
    label: 'JPG/JPEG',
    extensions: ['.jpg', '.jpeg'],
    category: 'Raster Images',
    canPreview: true,
    convertibleTo: ['jpg', 'png', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  {
    label: 'PNG',
    extensions: ['.png'],
    category: 'Raster Images',
    canPreview: true,
    convertibleTo: ['jpg', 'png', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  {
    label: 'GIF',
    extensions: ['.gif'],
    category: 'Raster Images',
    canPreview: true,
    convertibleTo: ['jpg', 'png', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  {
    label: 'BMP',
    extensions: ['.bmp'],
    category: 'Raster Images',
    canPreview: true,
    convertibleTo: ['jpg', 'png', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  {
    label: 'TIFF',
    extensions: ['.tiff', '.tif'],
    category: 'Raster Images',
    canPreview: true,
    convertibleTo: ['jpg', 'png', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  {
    label: 'WEBP',
    extensions: ['.webp'],
    category: 'Raster Images',
    canPreview: true,
    convertibleTo: ['jpg', 'png', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  {
    label: 'HEIC',
    extensions: ['.heic'],
    category: 'Raster Images',
    canPreview: true,
    convertibleTo: ['jpg', 'png', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  {
    label: 'AVIF',
    extensions: ['.avif'],
    category: 'Raster Images',
    canPreview: true,
    convertibleTo: ['jpg', 'png', 'webp', 'tiff', 'bmp', 'pdf'],
  },

  // IMAGE FILES - RAW Images
  {
    label: 'RAW',
    extensions: ['.raw', '.cr2', '.cr3', '.nef', '.arw', '.dng'],
    category: 'RAW Images',
    canPreview: false,
    convertibleTo: ['jpg', 'png', 'tiff', 'dng'],
  },

  // IMAGE FILES - Vector Images
  {
    label: 'SVG',
    extensions: ['.svg'],
    category: 'Vector Images',
    canPreview: true,
    convertibleTo: ['svg', 'png', 'jpg', 'pdf'],
  },
  {
    label: 'AI',
    extensions: ['.ai'],
    category: 'Vector Images',
    canPreview: true,
    convertibleTo: ['svg', 'png', 'jpg', 'pdf'],
  },
  {
    label: 'EPS',
    extensions: ['.eps'],
    category: 'Vector Images',
    canPreview: true,
    convertibleTo: ['svg', 'png', 'jpg', 'pdf'],
  },

  // TEXT & DOCUMENT FILES - Plain Text
  {
    label: 'TXT',
    extensions: ['.txt', '.log'],
    category: 'Plain Text',
    canPreview: true,
    convertibleTo: ['pdf', 'docx', 'html', 'txt'],
  },
  {
    label: 'Markdown',
    extensions: ['.md'],
    category: 'Plain Text',
    canPreview: true,
    convertibleTo: ['pdf', 'docx', 'html', 'txt'],
  },
  {
    label: 'RTF',
    extensions: ['.rtf'],
    category: 'Plain Text',
    canPreview: true,
    convertibleTo: ['pdf', 'docx', 'html', 'txt'],
  },

  // TEXT & DOCUMENT FILES - Word Docs
  {
    label: 'DOC/DOCX',
    extensions: ['.doc', '.docx'],
    category: 'Word Documents',
    canPreview: true,
    convertibleTo: ['pdf', 'txt', 'html'],
  },
  {
    label: 'ODT',
    extensions: ['.odt'],
    category: 'Word Documents',
    canPreview: true,
    convertibleTo: ['pdf', 'txt', 'html'],
  },
  {
    label: 'PAGES',
    extensions: ['.pages'],
    category: 'Word Documents',
    canPreview: true,
    convertibleTo: ['pdf', 'txt', 'html'],
  },

  // TEXT & DOCUMENT FILES - Spreadsheets
  {
    label: 'XLS/XLSX',
    extensions: ['.xls', '.xlsx'],
    category: 'Spreadsheets',
    canPreview: true,
    convertibleTo: ['csv', 'xlsx', 'pdf'],
  },
  {
    label: 'CSV',
    extensions: ['.csv'],
    category: 'Spreadsheets',
    canPreview: true,
    convertibleTo: ['csv', 'xlsx', 'pdf'],
  },
  {
    label: 'ODS',
    extensions: ['.ods'],
    category: 'Spreadsheets',
    canPreview: true,
    convertibleTo: ['csv', 'xlsx', 'pdf'],
  },

  // TEXT & DOCUMENT FILES - Presentations
  {
    label: 'PPT/PPTX',
    extensions: ['.ppt', '.pptx'],
    category: 'Presentations',
    canPreview: true,
    convertibleTo: ['pdf', 'pptx', 'png', 'jpg'],
  },
  {
    label: 'KEY',
    extensions: ['.key'],
    category: 'Presentations',
    canPreview: true,
    convertibleTo: ['pdf', 'pptx', 'png', 'jpg'],
  },
  {
    label: 'ODP',
    extensions: ['.odp'],
    category: 'Presentations',
    canPreview: true,
    convertibleTo: ['pdf', 'pptx', 'png', 'jpg'],
  },

  // TEXT & DOCUMENT FILES - PDF
  {
    label: 'PDF',
    extensions: ['.pdf'],
    category: 'PDF',
    canPreview: true,
    convertibleTo: ['docx', 'txt', 'png', 'jpg'],
  },

  // WEB FILES
  {
    label: 'HTML',
    extensions: ['.html', '.htm'],
    category: 'Web Pages',
    canPreview: true,
    convertibleTo: ['pdf', 'txt'],
  },
  {
    label: 'CSS',
    extensions: ['.css'],
    category: 'Stylesheets',
    canPreview: true,
    convertibleTo: ['txt'],
  },
  {
    label: 'JavaScript',
    extensions: ['.js'],
    category: 'Scripts',
    canPreview: false,
    convertibleTo: ['txt'],
  },
  {
    label: 'JSON',
    extensions: ['.json'],
    category: 'Data Files',
    canPreview: true,
    convertibleTo: ['json', 'xml', 'txt'],
  },
  {
    label: 'XML',
    extensions: ['.xml'],
    category: 'Data Files',
    canPreview: true,
    convertibleTo: ['json', 'xml', 'txt'],
  },

  // AUDIO FILES
  {
    label: 'MP3',
    extensions: ['.mp3'],
    category: 'Common Audio',
    canPreview: true,
    convertibleTo: ['mp3', 'wav', 'aac', 'flac'],
  },
  {
    label: 'WAV',
    extensions: ['.wav'],
    category: 'Common Audio',
    canPreview: true,
    convertibleTo: ['mp3', 'wav', 'aac', 'flac'],
  },
  {
    label: 'AAC',
    extensions: ['.aac'],
    category: 'Common Audio',
    canPreview: true,
    convertibleTo: ['mp3', 'wav', 'aac', 'flac'],
  },
  {
    label: 'FLAC',
    extensions: ['.flac'],
    category: 'Common Audio',
    canPreview: true,
    convertibleTo: ['mp3', 'wav', 'aac', 'flac'],
  },
  {
    label: 'OGG',
    extensions: ['.ogg'],
    category: 'Common Audio',
    canPreview: true,
    convertibleTo: ['mp3', 'wav', 'aac', 'flac'],
  },
  {
    label: 'M4A',
    extensions: ['.m4a'],
    category: 'Common Audio',
    canPreview: true,
    convertibleTo: ['mp3', 'wav', 'aac', 'flac'],
  },
  {
    label: 'MIDI',
    extensions: ['.mid', '.midi'],
    category: 'MIDI',
    canPreview: false,
    convertibleTo: ['mp3', 'wav'],
  },

  // VIDEO FILES
  {
    label: 'MP4',
    extensions: ['.mp4'],
    category: 'Standard Video',
    canPreview: true,
    convertibleTo: ['mp4', 'mkv', 'avi', 'mov'],
  },
  {
    label: 'MKV',
    extensions: ['.mkv'],
    category: 'Standard Video',
    canPreview: true,
    convertibleTo: ['mp4', 'mkv', 'avi', 'mov'],
  },
  {
    label: 'AVI',
    extensions: ['.avi'],
    category: 'Standard Video',
    canPreview: true,
    convertibleTo: ['mp4', 'mkv', 'avi', 'mov'],
  },
  {
    label: 'MOV',
    extensions: ['.mov'],
    category: 'Standard Video',
    canPreview: true,
    convertibleTo: ['mp4', 'mkv', 'avi', 'mov'],
  },
  {
    label: 'WMV',
    extensions: ['.wmv'],
    category: 'Standard Video',
    canPreview: true,
    convertibleTo: ['mp4', 'mkv', 'avi', 'mov'],
  },
  {
    label: 'FLV',
    extensions: ['.flv'],
    category: 'Standard Video',
    canPreview: true,
    convertibleTo: ['mp4', 'mkv', 'avi', 'mov'],
  },
  {
    label: 'WEBM',
    extensions: ['.webm'],
    category: 'Standard Video',
    canPreview: true,
    convertibleTo: ['mp4', 'mkv', 'avi', 'mov'],
  },
  {
    label: 'TS/M2TS',
    extensions: ['.ts', '.m2ts'],
    category: 'Disc/Stream',
    canPreview: false,
    convertibleTo: ['mp4', 'mkv'],
  },
  {
    label: 'VOB',
    extensions: ['.vob'],
    category: 'Disc/Stream',
    canPreview: false,
    convertibleTo: ['mp4', 'mkv'],
  },

  // ARCHIVE FILES
  {
    label: 'ZIP',
    extensions: ['.zip'],
    category: 'Compressed',
    canPreview: false,
    convertibleTo: ['zip', '7z', 'tar'],
  },
  {
    label: 'RAR',
    extensions: ['.rar'],
    category: 'Compressed',
    canPreview: false,
    convertibleTo: ['zip', '7z', 'tar'],
  },
  {
    label: '7Z',
    extensions: ['.7z'],
    category: 'Compressed',
    canPreview: false,
    convertibleTo: ['zip', '7z', 'tar'],
  },
  {
    label: 'TAR',
    extensions: ['.tar'],
    category: 'Compressed',
    canPreview: false,
    convertibleTo: ['zip', '7z', 'tar'],
  },
  {
    label: 'GZ',
    extensions: ['.gz'],
    category: 'Compressed',
    canPreview: false,
    convertibleTo: ['zip', '7z', 'tar'],
  },
  {
    label: 'ISO',
    extensions: ['.iso'],
    category: 'Compressed',
    canPreview: false,
    convertibleTo: ['zip', '7z', 'tar'],
  },

  // CODE FILES
  {
    label: 'Python',
    extensions: ['.py'],
    category: 'Source Code',
    canPreview: true,
    convertibleTo: ['txt', 'pdf', 'html'],
  },
  {
    label: 'Java',
    extensions: ['.java'],
    category: 'Source Code',
    canPreview: true,
    convertibleTo: ['txt', 'pdf', 'html'],
  },
  {
    label: 'C/C++',
    extensions: ['.c', '.cpp', '.h', '.hpp'],
    category: 'Source Code',
    canPreview: true,
    convertibleTo: ['txt', 'pdf', 'html'],
  },
  {
    label: 'C#',
    extensions: ['.cs'],
    category: 'Source Code',
    canPreview: true,
    convertibleTo: ['txt', 'pdf', 'html'],
  },
  {
    label: 'PHP',
    extensions: ['.php'],
    category: 'Source Code',
    canPreview: true,
    convertibleTo: ['txt', 'pdf', 'html'],
  },
  {
    label: 'Go',
    extensions: ['.go'],
    category: 'Source Code',
    canPreview: true,
    convertibleTo: ['txt', 'pdf', 'html'],
  },

  // DATABASE FILES
  {
    label: 'SQL',
    extensions: ['.sql'],
    category: 'Databases',
    canPreview: false,
    convertibleTo: ['csv', 'sql', 'xlsx'],
  },
  {
    label: 'SQLite',
    extensions: ['.db', '.sqlite'],
    category: 'Databases',
    canPreview: false,
    convertibleTo: ['csv', 'sql', 'xlsx'],
  },
  {
    label: 'Access',
    extensions: ['.mdb', '.accdb'],
    category: 'Databases',
    canPreview: false,
    convertibleTo: ['csv', 'sql', 'xlsx'],
  },

  // DESIGN & 3D FILES
  {
    label: 'PSD',
    extensions: ['.psd'],
    category: 'Design Files',
    canPreview: false,
    convertibleTo: ['png', 'jpg', 'pdf'],
  },
  {
    label: 'XCF',
    extensions: ['.xcf'],
    category: 'Design Files',
    canPreview: false,
    convertibleTo: ['png', 'jpg', 'pdf'],
  },
  {
    label: 'Sketch',
    extensions: ['.sketch'],
    category: 'Design Files',
    canPreview: false,
    convertibleTo: ['png', 'jpg', 'pdf'],
  },
  {
    label: 'Figma',
    extensions: ['.fig'],
    category: 'Design Files',
    canPreview: false,
    convertibleTo: ['png', 'jpg', 'pdf'],
  },
  {
    label: '3D Models',
    extensions: ['.obj', '.fbx', '.stl', '.blend', '.3ds'],
    category: '3D Models',
    canPreview: false,
    convertibleTo: ['obj', 'fbx', 'stl', 'gltf'],
  },
];

export const getFormatsByCategory = () => {
  const categories: Record<string, FileFormat[]> = {};
  FILE_FORMATS.forEach((format) => {
    if (!categories[format.category]) {
      categories[format.category] = [];
    }
    categories[format.category].push(format);
  });
  return categories;
};

export const getConvertibleFormats = (fileExtension: string): string[] => {
  const format = FILE_FORMATS.find((f) =>
    f.extensions.some((ext) => ext === fileExtension.toLowerCase())
  );
  return format?.convertibleTo || [];
};

export const canPreviewFile = (fileExtension: string): boolean => {
  const format = FILE_FORMATS.find((f) =>
    f.extensions.some((ext) => ext === fileExtension.toLowerCase())
  );
  return format?.canPreview || false;
};
