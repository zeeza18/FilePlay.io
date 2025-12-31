import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Settings,
  RefreshCw,
  CheckCircle,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  X,
  Download,
  AlertCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useFileContext } from '../context/FileContext';
import { convertFile, getAllowedFormats, getConvertedFilename } from '../services/conversionService';

type Step = 1 | 2 | 3;

interface UploadedFile {
  file: File;
  id: string;
  convertedBlob?: Blob;
  progress?: number;
  error?: string;
}

const ConvertPage = () => {
  const { sharedFile, setSharedFile } = useFileContext();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Auto-load file from preview page
  useEffect(() => {
    if (sharedFile) {
      const newFile: UploadedFile = {
        file: sharedFile.file,
        id: Math.random().toString(36).substr(2, 9),
      };
      setUploadedFiles([newFile]);
      setCurrentStep(2);
      // Clear shared file after loading
      setSharedFile(null);
    }
  }, [sharedFile, setSharedFile]);

  const onDrop = (acceptedFiles: File[]) => {
    setUploadError(null);
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    if (currentStep === 1 && newFiles.length > 0) {
      setCurrentStep(2);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (rejections) => {
      const message =
        rejections[0]?.errors?.[0]?.message || 'File not accepted. Check size/quantity.';
      setUploadError(message);
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 10,
    noKeyboard: false,
  });

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  // Get available formats based on uploaded files
  const getAvailableFormats = () => {
    if (uploadedFiles.length === 0) return [];

    // Get allowed formats for all uploaded files
    const allowedFormatSets = uploadedFiles.map(item => getAllowedFormats(item.file));

    // Find common formats (formats that work for ALL files)
    const commonFormats = allowedFormatSets.reduce((acc, formats) => {
      return acc.filter(format => formats.includes(format));
    }, allowedFormatSets[0] || []);

    return commonFormats;
  };

  const availableFormats = getAvailableFormats();

  // Format display information
  const formatInfo: Record<string, { label: string; icon: any; category: string }> = {
    // Images
    'jpg': { label: 'JPG', icon: ImageIcon, category: 'Images' },
    'png': { label: 'PNG', icon: ImageIcon, category: 'Images' },
    'webp': { label: 'WEBP', icon: ImageIcon, category: 'Images' },
    'gif': { label: 'GIF', icon: ImageIcon, category: 'Images' },
    'bmp': { label: 'BMP', icon: ImageIcon, category: 'Images' },
    'tiff': { label: 'TIFF', icon: ImageIcon, category: 'Images' },
    // Documents
    'pdf': { label: 'PDF', icon: FileText, category: 'Documents' },
    'txt': { label: 'TXT', icon: FileText, category: 'Documents' },
    'html': { label: 'HTML', icon: FileText, category: 'Documents' },
    'md': { label: 'Markdown', icon: FileText, category: 'Documents' },
    // Spreadsheets & Data
    'xlsx': { label: 'Excel', icon: FileSpreadsheet, category: 'Spreadsheets & Data' },
    'csv': { label: 'CSV', icon: FileSpreadsheet, category: 'Spreadsheets & Data' },
    'json': { label: 'JSON', icon: FileSpreadsheet, category: 'Spreadsheets & Data' },
    'xml': { label: 'XML', icon: FileSpreadsheet, category: 'Spreadsheets & Data' },
  };

  // Group formats by category
  const formatCategories = Object.entries(
    availableFormats.reduce((acc, format) => {
      const info = formatInfo[format];
      if (info) {
        if (!acc[info.category]) {
          acc[info.category] = [];
        }
        acc[info.category].push({ ...info, extension: format });
      }
      return acc;
    }, {} as Record<string, any[]>)
  ).map(([name, formats]) => ({ name, formats }));

  const handleConvert = async () => {
    setIsConverting(true);
    setCurrentStep(3);

    try {
      // Convert each file
      const conversionPromises = uploadedFiles.map(async (item) => {
        try {
          const blob = await convertFile(item.file, selectedFormat, (progress) => {
            setUploadedFiles(prev =>
              prev.map(f =>
                f.id === item.id ? { ...f, progress } : f
              )
            );
          });

          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === item.id ? { ...f, convertedBlob: blob, progress: 100 } : f
            )
          );
        } catch (error: any) {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === item.id ? { ...f, error: error.message || 'Conversion failed' } : f
            )
          );
        }
      });

      await Promise.all(conversionPromises);
      setIsConverting(false);
      setIsComplete(true);
    } catch (error) {
      console.error('Conversion error:', error);
      setIsConverting(false);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  };

  const handleDownloadSingle = (item: UploadedFile) => {
    if (item.convertedBlob) {
      const filename = getConvertedFilename(item.file.name, selectedFormat);
      downloadFile(item.convertedBlob, filename);
    }
  };

  const handleDownloadAll = () => {
    uploadedFiles.forEach((item) => {
      if (item.convertedBlob) {
        const filename = getConvertedFilename(item.file.name, selectedFormat);
        downloadFile(item.convertedBlob, filename);
      }
    });
  };

  const steps = [
    { number: 1, label: 'Upload', icon: Upload },
    { number: 2, label: 'Choose Format', icon: Settings },
    { number: 3, label: 'Convert', icon: RefreshCw },
  ];

  return (
    <div className="bg-background-secondary min-h-screen">
      <div className="container-custom py-12">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-text-primary mb-2">Convert Files</h1>
          <p className="text-lg text-text-secondary">
            Transform files between formats effortlessly
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-accent-primary text-white shadow-lg'
                          : 'bg-white text-text-muted border-2 border-ui-border'
                      } ${isCurrent ? 'ring-4 ring-accent-primary/30' : ''}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isActive ? 'text-accent-primary' : 'text-text-muted'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-4 mb-8 rounded transition-all duration-300 ${
                        currentStep > step.number ? 'bg-accent-primary' : 'bg-ui-border'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-5xl mx-auto">
          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <Card>
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Upload files to convert
              </h2>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-300 mb-6 ${
                  isDragActive
                    ? 'border-accent-primary bg-background-accent-light'
                    : 'border-ui-border hover:border-accent-primary'
                }`}
              >
                <input {...getInputProps({ multiple: true })} />
                <Upload
                  className={`w-20 h-20 mx-auto mb-4 ${
                    isDragActive ? 'text-accent-primary' : 'text-text-muted'
                  }`}
                />
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {isDragActive ? 'Drop your files here' : 'Drag and drop files here'}
                </h3>
                <p className="text-text-secondary mb-4">
                  or click to browse (up to 10 files, 50MB each)
                </p>
                <Badge variant="primary">All formats supported</Badge>
              </div>

              {uploadError && (
                <div className="mt-4 text-sm text-red-600">{uploadError}</div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-text-primary">Uploaded Files</h3>
                  {uploadedFiles.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-background-secondary rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-accent-primary" />
                        <div>
                          <div className="font-medium text-text-primary">{item.file.name}</div>
                          <div className="text-sm text-text-secondary">
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(item.id)}
                        className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-text-muted" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Step 2: Choose Format */}
          {currentStep === 2 && (
            <Card>
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Choose output format
              </h2>

              {formatCategories.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    No conversion formats available
                  </h3>
                  <p className="text-text-secondary mb-6">
                    The uploaded file type(s) cannot be converted yet. Try uploading different file types.
                  </p>
                  <Button
                    variant="secondary"
                    size="large"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back to Upload
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-8">
                    {formatCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="font-bold text-text-primary mb-4">{category.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {category.formats.map((format) => {
                        const Icon = format.icon;
                        const isSelected = selectedFormat === format.extension;

                        return (
                          <button
                            key={format.extension}
                            onClick={() => setSelectedFormat(format.extension)}
                            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                              isSelected
                                ? 'border-accent-primary bg-background-accent-light shadow-lg'
                                : 'border-ui-border hover:border-accent-primary'
                            }`}
                          >
                            <Icon
                              className={`w-12 h-12 mx-auto mb-3 ${
                                isSelected ? 'text-accent-primary' : 'text-text-muted'
                              }`}
                            />
                            <div
                              className={`font-bold ${
                                isSelected ? 'text-accent-primary' : 'text-text-primary'
                              }`}
                            >
                              {format.label}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                              .{format.extension}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button
                      variant="secondary"
                      size="large"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      size="large"
                      onClick={handleConvert}
                      disabled={!selectedFormat}
                      className="flex-1"
                    >
                      Convert to {selectedFormat.toUpperCase() || '...'}
                    </Button>
                  </div>
                </>
              )}
            </Card>
          )}

          {/* Step 3: Converting/Complete */}
          {currentStep === 3 && (
            <Card>
              {isConverting ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-primary/10 rounded-full mb-6">
                    <RefreshCw className="w-12 h-12 text-accent-primary animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Converting your files...
                  </h2>
                  <p className="text-text-secondary">This will only take a moment</p>

                  <div className="mt-8 space-y-3">
                    {uploadedFiles.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-background-secondary rounded-lg gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-text-primary truncate">{item.file.name}</div>
                          {item.error && (
                            <div className="text-xs text-red-600 mt-1">{item.error}</div>
                          )}
                        </div>
                        <div className="w-48 h-2 bg-ui-border rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              item.error ? 'bg-red-500' : 'bg-accent-primary'
                            }`}
                            style={{ width: `${item.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : isComplete ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    Files converted successfully!
                  </h2>
                  <p className="text-text-secondary mb-8">
                    Your files are ready to download
                  </p>

                  <div className="space-y-3 mb-8">
                    {uploadedFiles.map((item) => {
                      const hasError = !!item.error;
                      const isSuccess = item.convertedBlob && !hasError;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-background-secondary rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isSuccess ? (
                              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-text-primary truncate">
                                {isSuccess
                                  ? getConvertedFilename(item.file.name, selectedFormat)
                                  : item.file.name}
                              </div>
                              {hasError && (
                                <div className="text-xs text-red-600 mt-1">{item.error}</div>
                              )}
                            </div>
                          </div>
                          {isSuccess && (
                            <Button
                              variant="ghost"
                              size="small"
                              icon={Download}
                              onClick={() => handleDownloadSingle(item)}
                            >
                              Download
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="primary"
                    size="large"
                    icon={Download}
                    onClick={handleDownloadAll}
                    disabled={!uploadedFiles.some(f => f.convertedBlob)}
                  >
                    Download All ({uploadedFiles.filter(f => f.convertedBlob).length})
                  </Button>
                    <Button
                      variant="secondary"
                      size="large"
                      onClick={() => {
                        setCurrentStep(1);
                        setUploadedFiles([]);
                        setSelectedFormat('');
                        setIsComplete(false);
                      }}
                    >
                      Convert More Files
                    </Button>
                  </div>
                </div>
              ) : null}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConvertPage;
