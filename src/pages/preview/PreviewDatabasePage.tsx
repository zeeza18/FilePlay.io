import { useState } from 'react';
import { Upload, Database, Table, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';

interface TableInfo {
  name: string;
  rowCount: number;
}

interface QueryResult {
  columns: string[];
  rows: any[];
  total: number;
}

const PreviewDatabasePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string>('');
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const rowsPerPage = 50;

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

      const { fileId: uploadedFileId } = await uploadRes.json();
      setFileId(uploadedFileId);

      // Get table list
      const tablesRes = await fetch('http://localhost:3001/api/database/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: uploadedFileId }),
      });

      if (!tablesRes.ok) throw new Error('Failed to get tables');

      const { tables: dbTables } = await tablesRes.json();
      setTables(dbTables);

      if (dbTables.length > 0) {
        loadTable(uploadedFileId, dbTables[0].name, 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process database');
    } finally {
      setLoading(false);
    }
  };

  const loadTable = async (dbFileId: string, tableName: string, pageNum: number) => {
    setLoading(true);
    setSelectedTable(tableName);
    setPage(pageNum);

    try {
      const res = await fetch('http://localhost:3001/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId: dbFileId,
          table: tableName,
          page: pageNum,
          limit: rowsPerPage,
        }),
      });

      if (!res.ok) throw new Error('Failed to query table');

      const data = await queryRes.json();
      setQueryResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load table');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = queryResult ? Math.ceil(queryResult.total / rowsPerPage) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-2xl mb-6">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-text-primary mb-4">
            Database <span className="gradient-text">Preview</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            View SQLite and DB database tables and run queries
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
                  accept=".db,.sqlite,.sqlite3"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <Upload className="w-16 h-16 text-accent-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Drop your database file here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <Button variant="primary" size="large">
                    Choose Database File
                  </Button>
                </div>
              </label>
            </div>

            {/* Supported Formats */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-accent-primary" />
                Supported Formats
              </h3>
              <div className="flex flex-wrap gap-2">
                {['SQLite', 'DB', 'SQLite3'].map((format) => (
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

        {/* Database Viewer */}
        {file && !loading && tables.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                  <Database className="w-6 h-6 text-accent-primary" />
                  {file.name}
                </h2>
                <Button
                  variant="outline"
                  size="medium"
                  onClick={() => {
                    setFile(null);
                    setTables([]);
                    setQueryResult(null);
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

              <div className="grid grid-cols-12 gap-6">
                {/* Table List */}
                <div className="col-span-3">
                  <div className="border border-ui-border rounded-xl p-4">
                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Table className="w-5 h-5 text-accent-primary" />
                      Tables ({tables.length})
                    </h3>
                    <div className="space-y-1">
                      {tables.map((table) => (
                        <button
                          key={table.name}
                          onClick={() => loadTable(fileId, table.name, 1)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedTable === table.name
                              ? 'bg-accent-primary text-white'
                              : 'hover:bg-background-secondary text-text-primary'
                          }`}
                        >
                          <p className="text-sm font-semibold">{table.name}</p>
                          <p className="text-xs opacity-75">{table.rowCount} rows</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table Data */}
                <div className="col-span-9">
                  {queryResult && (
                    <>
                      <div className="border border-ui-border rounded-xl overflow-hidden mb-4">
                        <div className="bg-background-secondary px-4 py-3 border-b border-ui-border">
                          <h3 className="font-bold text-text-primary">
                            {selectedTable} ({queryResult.total} rows)
                          </h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-background-secondary">
                              <tr>
                                {queryResult.columns.map((col) => (
                                  <th
                                    key={col}
                                    className="px-4 py-3 text-left text-sm font-semibold text-text-primary border-b border-ui-border"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-ui-border">
                              {queryResult.rows.map((row, index) => (
                                <tr key={index} className="hover:bg-background-secondary">
                                  {queryResult.columns.map((col) => (
                                    <td
                                      key={col}
                                      className="px-4 py-3 text-sm text-text-primary"
                                    >
                                      {row[col]?.toString() || '-'}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-text-secondary">
                            Showing {(page - 1) * rowsPerPage + 1} to{' '}
                            {Math.min(page * rowsPerPage, queryResult.total)} of{' '}
                            {queryResult.total} rows
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => loadTable(fileId, selectedTable, page - 1)}
                              disabled={page === 1}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={1}
                                max={totalPages}
                                value={page}
                                onChange={(e) => {
                                  const newPage = parseInt(e.target.value);
                                  if (newPage >= 1 && newPage <= totalPages) {
                                    loadTable(fileId, selectedTable, newPage);
                                  }
                                }}
                                className="w-16 px-2 py-1 text-center text-sm border border-ui-border rounded-md"
                              />
                              <span className="text-sm text-text-secondary">
                                / {totalPages}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => loadTable(fileId, selectedTable, page + 1)}
                              disabled={page === totalPages}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && file && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading database...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewDatabasePage;
