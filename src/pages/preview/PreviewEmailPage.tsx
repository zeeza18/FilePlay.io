import { useState } from 'react';
import { Upload, Mail, Download, Paperclip, User, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';

interface EmailData {
  from: string;
  to: string;
  subject: string;
  date: string;
  text: string;
  html: string;
  attachments: Array<{
    filename: string;
    size: number;
    contentType: string;
  }>;
}

const PreviewEmailPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [emailData, setEmailData] = useState<EmailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [viewMode, setViewMode] = useState<'html' | 'text'>('html');

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

      // Parse email
      const parseRes = await fetch('http://localhost:3001/api/email/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (!parseRes.ok) throw new Error('Failed to parse email');

      const data = await parseRes.json();
      setEmailData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to process email');
    } finally {
      setLoading(false);
    }
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
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-text-primary mb-4">
            Email <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Preview EML and MSG email files with attachments
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
                  accept=".eml,.msg"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Drop your email file here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <Button variant="primary" size="large">
                    Choose Email File
                  </Button>
                </div>
              </label>
            </div>

            {/* Supported Formats */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent-primary" />
                Supported Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {['EML', 'MSG'].map((format) => (
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

        {/* Email Preview */}
        {file && !loading && emailData && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <Mail className="w-6 h-6 text-accent-primary" />
                  {file.name}
                </h2>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={() => {
                    setFile(null);
                    setEmailData(null);
                    setError('');
                  }}
                >
                  Upload New File
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Email Header */}
              <div className="border border-ui-border rounded-xl p-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-text-secondary">From</p>
                      <p className="text-base text-text-primary font-semibold">{emailData.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-text-secondary">To</p>
                      <p className="text-base text-text-primary font-semibold">{emailData.to}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-text-secondary">Subject</p>
                      <p className="text-base text-text-primary font-semibold">{emailData.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-text-secondary">Date</p>
                      <p className="text-base text-text-primary font-semibold">{emailData.date}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {emailData.attachments && emailData.attachments.length > 0 && (
                <div className="border border-ui-border rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-accent-primary" />
                    Attachments ({emailData.attachments.length})
                  </h3>
                  <div className="space-y-2">
                    {emailData.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-background-secondary rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-4 h-4 text-text-secondary" />
                          <div>
                            <p className="text-sm font-semibold text-text-primary">
                              {attachment.filename}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {attachment.contentType} • {formatFileSize(attachment.size)}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="small">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email Body */}
              <div className="border border-ui-border rounded-xl overflow-hidden">
                <div className="bg-background-secondary px-4 py-3 border-b border-ui-border flex items-center justify-between">
                  <h3 className="font-bold text-text-primary">Message</h3>
                  {emailData.html && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewMode('html')}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                          viewMode === 'html'
                            ? 'bg-accent-primary text-white'
                            : 'bg-white text-text-secondary hover:bg-gray-100'
                        }`}
                      >
                        HTML
                      </button>
                      <button
                        onClick={() => setViewMode('text')}
                        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                          viewMode === 'text'
                            ? 'bg-accent-primary text-white'
                            : 'bg-white text-text-secondary hover:bg-gray-100'
                        }`}
                      >
                        Text
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6 max-h-[600px] overflow-y-auto">
                  {viewMode === 'html' && emailData.html ? (
                    <div dangerouslySetInnerHTML={{ __html: emailData.html }} />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm text-text-primary font-sans">
                      {emailData.text}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Parsing email...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewEmailPage;
