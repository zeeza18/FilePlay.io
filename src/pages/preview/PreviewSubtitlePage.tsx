import { useState } from 'react';
import { Upload, FileText, Download, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';

interface Subtitle {
  index?: number;
  startTime: string;
  endTime: string;
  text: string;
}

const PreviewSubtitlePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [format, setFormat] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Upload file to server
      const uploadRes = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const { fileId } = await uploadRes.json();

      // Parse subtitle file
      const parseRes = await fetch('http://localhost:3001/api/subtitle/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (!parseRes.ok) throw new Error('Failed to parse subtitle file');

      const data = await parseRes.json();
      setSubtitles(data.subtitles || []);
      setFormat(data.format || '');
    } catch (err: any) {
      setError(err.message || 'Failed to process subtitle file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-text-primary mb-4">
            Subtitle <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Preview SRT, VTT, and ASS subtitle files
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
                  accept=".srt,.vtt,.ass,.ssa"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Drop your subtitle file here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <Button variant="primary" size="large">
                    Choose Subtitle File
                  </Button>
                </div>
              </label>
            </div>

            {/* Supported Formats */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-primary" />
                Supported Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {['SRT', 'VTT', 'ASS', 'SSA'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-3 py-1 bg-background-accent-light text-accent-primary rounded-full text-sm font-semibold"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subtitle Preview */}
        {file && !loading && subtitles.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                    <FileText className="w-6 h-6 text-accent-primary" />
                    {file.name}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Format: <span className="font-semibold">{format.toUpperCase()}</span> • {subtitles.length} subtitles
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={() => {
                    setFile(null);
                    setSubtitles([]);
                    setFormat('');
                    setError('');
                  }}
                >
                  Upload New File
                </Button>
              </div>

              {/* Subtitle List */}
              <div className="space-y-4 max-h-[700px] overflow-y-auto">
                {subtitles.map((subtitle, index) => (
                  <div
                    key={index}
                    className="border border-ui-border rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      {subtitle.index && (
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-accent-primary text-white rounded-lg font-bold text-sm">
                          {subtitle.index}
                        </span>
                      )}
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono">
                          {subtitle.startTime} → {subtitle.endTime}
                        </span>
                      </div>
                    </div>
                    <p className="text-base text-text-primary leading-relaxed whitespace-pre-wrap">
                      {subtitle.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(subtitles, null, 2)], {
                      type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${file.name}.json`;
                    a.click();
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export as JSON
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Parsing subtitle file...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewSubtitlePage;
