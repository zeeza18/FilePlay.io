import { useState } from 'react';
import { Upload, Video, Download, FileVideo, Info } from 'lucide-react';
import Button from '../../components/ui/Button';

const PreviewVideoPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    try {
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);

      // Create video element to get metadata
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;

      video.onloadedmetadata = () => {
        setMetadata({
          duration: Math.floor(video.duration),
          width: video.videoWidth,
          height: video.videoHeight,
          size: selectedFile.size,
          type: selectedFile.type,
        });
        setLoading(false);
      };
    } catch (error) {
      console.error('Error loading video:', error);
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl mb-6">
            <Video className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-text-primary mb-4">
            Video <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Preview MP4, AVI, MOV, MKV, WebM, OGG, and other video formats in your browser
          </p>
        </div>

        {/* Upload Section */}
        {!file && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-dashed border-ui-border hover:border-accent-primary transition-colors">
              <label className="block cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Drop your video file here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <Button variant="primary" size="large">
                    Choose Video File
                  </Button>
                </div>
              </label>
            </div>

            {/* Supported Formats */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <FileVideo className="w-5 h-5 text-accent-primary" />
                Supported Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {['MP4', 'AVI', 'MOV', 'MKV', 'WebM', 'OGG', 'FLV', 'WMV', 'MPEG', 'M4V'].map((format) => (
                  <span
                    key={format}
                    className="px-3 py-1 bg-background-accent-light text-accent-primary rounded-full text-sm font-semibold"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video Preview */}
        {file && videoUrl && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <Video className="w-6 h-6 text-accent-primary" />
                  {file.name}
                </h2>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={() => {
                    setFile(null);
                    setVideoUrl('');
                    setMetadata(null);
                  }}
                >
                  Upload New File
                </Button>
              </div>

              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden mb-6">
                <video
                  src={videoUrl}
                  controls
                  className="w-full"
                  style={{ maxHeight: '600px' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Metadata */}
              {metadata && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                      <Info className="w-4 h-4" />
                      Duration
                    </div>
                    <p className="text-lg font-bold text-text-primary">
                      {formatDuration(metadata.duration)}
                    </p>
                  </div>
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                      <Info className="w-4 h-4" />
                      Resolution
                    </div>
                    <p className="text-lg font-bold text-text-primary">
                      {metadata.width} × {metadata.height}
                    </p>
                  </div>
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                      <Info className="w-4 h-4" />
                      File Size
                    </div>
                    <p className="text-lg font-bold text-text-primary">
                      {formatFileSize(metadata.size)}
                    </p>
                  </div>
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                      <Info className="w-4 h-4" />
                      Format
                    </div>
                    <p className="text-lg font-bold text-text-primary">
                      {metadata.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = videoUrl;
                    a.download = file.name;
                    a.click();
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download Video
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewVideoPage;
