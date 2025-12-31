import { useState } from 'react';
import { Upload, Calendar as CalendarIcon, User, MapPin, Clock } from 'lucide-react';
import Button from '../../components/ui/Button';

interface CalendarEvent {
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
  organizer: string;
}

interface Contact {
  name: string;
  email: string;
  phone: string;
  organization: string;
}

const PreviewCalendarPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileType, setFileType] = useState<'ics' | 'vcf'>('ics');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setError('');

    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    setFileType(ext === 'vcf' ? 'vcf' : 'ics');

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

      // Parse calendar/contact file
      const parseEndpoint = ext === 'vcf' ? '/api/calendar/parse-vcf' : '/api/calendar/parse-ics';
      const parseRes = await fetch(`http://localhost:3001${parseEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId }),
      });

      if (!parseRes.ok) throw new Error('Failed to parse file');

      const data = await parseRes.json();

      if (ext === 'vcf') {
        setContacts(data.contacts || []);
      } else {
        setEvents(data.events || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process file');
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
            <CalendarIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-text-primary mb-4">
            Calendar & Contacts <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Preview ICS calendar events and VCF contact files
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
                  accept=".ics,.vcf,.vcard"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Drop your calendar or contact file here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <Button variant="primary" size="large">
                    Choose File
                  </Button>
                </div>
              </label>
            </div>

            {/* Supported Formats */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-accent-primary" />
                Supported Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {['ICS', 'VCF', 'vCard'].map((format) => (
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

        {/* Calendar Events Preview */}
        {file && !loading && fileType === 'ics' && events.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <CalendarIcon className="w-6 h-6 text-accent-primary" />
                  {file.name}
                </h2>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={() => {
                    setFile(null);
                    setEvents([]);
                    setError('');
                  }}
                >
                  Upload New File
                </Button>
              </div>

              <div className="space-y-4">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="border border-ui-border rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-text-primary mb-4">
                      {event.summary}
                    </h3>
                    <div className="grid gap-3">
                      {event.description && (
                        <p className="text-sm text-text-secondary">{event.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>{event.start} - {event.end}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.organizer && (
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <User className="w-4 h-4" />
                          <span>{event.organizer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contacts Preview */}
        {file && !loading && fileType === 'vcf' && contacts.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <User className="w-6 h-6 text-accent-primary" />
                  {file.name}
                </h2>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={() => {
                    setFile(null);
                    setContacts([]);
                    setError('');
                  }}
                >
                  Upload New File
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    className="border border-ui-border rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-bold text-text-primary mb-3">
                      {contact.name}
                    </h3>
                    <div className="space-y-2">
                      {contact.email && (
                        <p className="text-sm text-text-secondary">
                          <span className="font-semibold">Email:</span> {contact.email}
                        </p>
                      )}
                      {contact.phone && (
                        <p className="text-sm text-text-secondary">
                          <span className="font-semibold">Phone:</span> {contact.phone}
                        </p>
                      )}
                      {contact.organization && (
                        <p className="text-sm text-text-secondary">
                          <span className="font-semibold">Organization:</span> {contact.organization}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Parsing file...</p>
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

export default PreviewCalendarPage;
