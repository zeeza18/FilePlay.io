const API_URL = 'http://localhost:3001/api';

export interface ExcelUploadResponse {
  fileId: string;
  totalRows: number;
  totalCols: number;
  sheetName: string;
  fileName: string;
  fileSize: number;
}

export interface ExcelRowsResponse {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  startRow: number;
  endRow: number;
  data: any[][];
}

export const excelService = {
  // Upload Excel file to server
  async uploadExcel(file: File): Promise<ExcelUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/excel/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload Excel file');
    }

    return response.json();
  },

  // Get paginated rows from server
  async getRows(fileId: string, page: number, rowsPerPage: number = 50): Promise<ExcelRowsResponse> {
    const response = await fetch(
      `${API_URL}/excel/${fileId}/rows?page=${page}&rowsPerPage=${rowsPerPage}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Excel rows');
    }

    return response.json();
  },

  // Delete file from server
  async deleteFile(fileId: string): Promise<void> {
    await fetch(`${API_URL}/excel/${fileId}`, {
      method: 'DELETE',
    });
  },
};
