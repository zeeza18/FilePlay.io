import { useState } from 'react';
import { Upload, Archive, Download, FolderOpen, File, Info } from 'lucide-react';
import Button from '../../components/ui/Button';

interface ArchiveFile {
  path: string;
  type: string;
  size: number;
}

const PreviewArchivePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<ArchiveFile[]>([]);
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

      // List archive contents
      const listRes = await fetch('http://localhost:3001/api/archive/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (!listRes.ok) throw new Error('Failed to list archive contents');

      const { files: archiveFiles } = await listRes.json();
      setFiles(archiveFiles);
    } catch (err: any) {
      setError(err.message || 'Failed to process archive');
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

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalFiles = files.filter(f => f.type === 'file').length;
  const totalFolders = files.filter(f => f.type === 'directory').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl mb-6">
            <Archive className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-text-primary mb-4">
            Archive <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Browse ZIP, RAR, 7Z, TAR, and GZ archive contents
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
                  accept=".zip,.rar,.7z,.tar,.gz,.tgz,.bz2"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Drop your archive file here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <Button variant="primary" size="large">
                    Choose Archive File
                  </Button>
                </div>
              </label>
            </div>

            {/* Supported Formats */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <Archive className="w-5 h-5 text-accent-primary" />
                Supported Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {['ZIP', 'RAR', '7Z', 'TAR', 'GZ', 'TGZ', 'BZ2', 'XZ'].map((format) => (
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

        {/* Archive Contents */}
        {file && !loading && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <Archive className="w-6 h-6 text-accent-primary" />
                  {file.name}
                </h2>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={() => {
                    setFile(null);
                    setFiles([]);
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

              {/* Stats */}
              {files.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                      <Info className="w-4 h-4" />
                      Total Files
                    </div>
                    <p className="text-lg font-bold text-text-primary">{totalFiles}</p>
                  </div>
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                      <Info className="w-4 h-4" />
                      Total Folders
                    </div>
                    <p className="text-lg font-bold text-text-primary">{totalFolders}</p>
                  </div>
                  <div className="bg-background-secondary rounded-xl p-4">
                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                      <Info className="w-4 h-4" />
                      Uncompressed Size
                    </div>
                    <p className="text-lg font-bold text-text-primary">
                      {formatFileSize(totalSize)}
                    </p>
                  </div>
                </div>
              )}

              {/* File List */}
              {files.length > 0 && (
                <div className="border border-ui-border rounded-xl overflow-hidden">
                  <div className="bg-background-secondary px-4 py-3 border-b border-ui-border">
                    <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-text-secondary">
                      <div className="col-span-8">Name</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2 text-right">Size</div>
                    </div>
                  </div>
                  <div className="divide-y divide-ui-border max-h-[500px] overflow-y-auto">
                    {files.map((archiveFile, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-background-secondary transition-colors"
                      >
                        <div className="col-span-8 flex items-center gap-2">
                          {archiveFile.type === 'directory' ? (
                            <FolderOpen className="w-4 h-4 text-accent-primary flex-shrink-0" />
                          ) : (
                            <File className="w-4 h-4 text-text-secondary flex-shrink-0" />
                          )}
                          <span className="text-sm text-text-primary truncate">
                            {archiveFile.path}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <span className="text-sm text-text-secondary capitalize">
                            {archiveFile.type}
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <span className="text-sm text-text-secondary">
                            {archiveFile.type === 'file' ? formatFileSize(archiveFile.size) : '-'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Reading archive contents...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewArchivePage;
