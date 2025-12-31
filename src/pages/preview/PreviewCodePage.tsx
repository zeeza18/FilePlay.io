import { useState } from 'react';
import { Upload, Code2, Download, FileCode, Copy, Check } from 'lucide-react';
import Button from '../../components/ui/Button';

const PreviewCodePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    try {
      const text = await selectedFile.text();
      setCode(text);

      // Detect language from extension
      const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const langMap: Record<string, string> = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        py: 'python',
        java: 'java',
        cpp: 'c++',
        c: 'c',
        cs: 'c#',
        go: 'go',
        rs: 'rust',
        php: 'php',
        rb: 'ruby',
        swift: 'swift',
        kt: 'kotlin',
        css: 'css',
        scss: 'scss',
        html: 'html',
        xml: 'xml',
        json: 'json',
        yaml: 'yaml',
        yml: 'yaml',
        md: 'markdown',
        sql: 'sql',
        sh: 'shell',
        bash: 'bash',
      };
      setLanguage(langMap[ext] || ext);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineNumbers = () => {
    return code.split('\n').map((_, i) => i + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl mb-6">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-text-primary mb-4">
            Code <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Preview source code files with syntax highlighting
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
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.css,.scss,.html,.xml,.json,.yaml,.yml,.md,.sql,.sh,.bash"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Drop your code file here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <Button variant="primary" size="large">
                    Choose Code File
                  </Button>
                </div>
              </label>
            </div>

            {/* Supported Languages */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-accent-primary" />
                Supported Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'CSS', 'HTML', 'JSON', 'YAML', 'SQL', 'Shell'].map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-background-accent-light text-accent-primary rounded-full text-sm font-semibold"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Code Preview */}
        {file && code && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                    <Code2 className="w-6 h-6 text-accent-primary" />
                    {file.name}
                  </h2>
                  {language && (
                    <p className="text-sm text-text-secondary mt-1">
                      Language: <span className="font-semibold">{language}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="medium"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="medium"
                    onClick={() => {
                      setFile(null);
                      setCode('');
                      setLanguage('');
                    }}
                  >
                    Upload New File
                  </Button>
                </div>
              </div>

              {/* Code Display */}
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-sm text-gray-400 font-mono">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {code.split('\n').length} lines
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <div className="flex">
                    {/* Line Numbers */}
                    <div className="bg-gray-800 px-4 py-4 select-none">
                      {getLineNumbers().map((num) => (
                        <div
                          key={num}
                          className="text-gray-500 text-sm font-mono leading-6 text-right"
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                    {/* Code Content */}
                    <pre className="flex-1 p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-gray-100 leading-6 whitespace-pre">
                        {code}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-6">
                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    const blob = new Blob([code], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = file.name;
                    a.click();
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download File
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewCodePage;
