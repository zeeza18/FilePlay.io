import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const ExcelToCSVPage = () => {
  useEffect(() => {
    document.title = 'Excel to CSV Converter - Convert XLSX to CSV Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert Excel to CSV online for free. Transform XLSX spreadsheets to CSV format. Perfect for data import/export. No registration needed.');
    }
  }, []);

  return <ConvertPage />;
};

export default ExcelToCSVPage;
