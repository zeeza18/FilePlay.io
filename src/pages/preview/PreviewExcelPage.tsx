import { useEffect } from 'react';
import PreviewPage from '../PreviewPage';

const PreviewExcelPage = () => {
  useEffect(() => {
    document.title = 'Preview Excel Files Online - XLSX Viewer | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View Excel spreadsheets online. Preview XLSX, XLS files with pagination and data tables. No software installation needed.');
    }
  }, []);

  return <PreviewPage />;
};

export default PreviewExcelPage;
