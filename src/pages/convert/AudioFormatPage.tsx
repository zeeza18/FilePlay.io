import { useState } from 'react';
import { Upload, Music, Download, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const AudioFormatPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('mp3');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFile, setOutputFile] = useState<string>('');
  const [error, setError] = useState<string>('');

  const audioFormats = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    setOutputFile('');
    setProgress(0);
  };

  const handleConvert = async () => {
    if (!file) return;

    setConverting(true);
    setError('');
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file
      const uploadRes = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const { fileId } = await uploadRes.json();

      // Convert audio
      const convertRes = await fetch('http://localhost:3001/api/video/convert-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, format: targetFormat }),
      });

      if (!convertRes.ok) throw new Error('Conversion failed');

      const reader = convertRes.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.status === 'processing' && data.percent) {
              setProgress(Math.round(data.percent));
            } else if (data.status === 'completed') {
              setOutputFile(data.outputFile);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Conversion failed');
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!outputFile) return;
    window.open(`http://localhost:3001/api/download/${outputFile}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl mb-6">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-text-primary mb-4">
            Convert <span className="gradient-text">Audio Format</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Convert between MP3, WAV, OGG, FLAC, M4A, and AAC formats
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Upload Section */}
          {!file && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-dashed border-ui-border hover:border-accent-primary transition-colors">
              <label className="block cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Drop your audio file here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <Button variant="primary" size="large">
                    Choose Audio File
                  </Button>
                </div>
              </label>
            </div>
          )}

          {/* Conversion Section */}
          {file && (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                <Music className="w-6 h-6 text-accent-primary" />
                {file.name}
              </h2>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-text-primary mb-3">
                  Convert to:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {audioFormats.map((format) => (
                    <button
                      key={format}
                      onClick={() => setTargetFormat(format)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-colors ${
                        targetFormat === format
                          ? 'bg-accent-primary text-white'
                          : 'bg-background-secondary text-text-secondary hover:bg-background-accent-light'
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {converting && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-text-secondary">Converting...</span>
                    <span className="text-sm font-semibold text-accent-primary">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-accent-primary to-accent-secondary h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {outputFile && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <p className="text-green-800 font-semibold mb-4">Conversion completed!</p>
                  <Button variant="primary" size="large" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    Download {targetFormat.toUpperCase()}
                  </Button>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleConvert}
                  disabled={converting || !!outputFile}
                  className="flex-1"
                >
                  {converting ? 'Converting...' : `Convert to ${targetFormat.toUpperCase()}`}
                </Button>
                <Button
                  variant="outline"
                  size="large"
                  onClick={() => {
                    setFile(null);
                    setOutputFile('');
                    setError('');
                    setProgress(0);
                  }}
                >
                  Upload New File
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioFormatPage;
