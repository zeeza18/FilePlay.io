import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const CSVToExcelPage = () => {
  useEffect(() => {
    document.title = 'CSV to Excel Converter - Convert CSV to XLSX Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert CSV to Excel online for free. Transform CSV files to XLSX spreadsheets. Edit and format your data in Excel. Fast conversion.');
    }
  }, []);

  return <ConvertPage />;
};

export default CSVToExcelPage;
