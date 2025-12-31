import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const WordToPDFPage = () => {
  useEffect(() => {
    document.title = 'Word to PDF Converter - Convert DOCX to PDF Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert Word to PDF online for free. Transform DOCX documents to PDF format. Preserve formatting and layout. No software installation required.');
    }
  }, []);

  return <ConvertPage />;
};

export default WordToPDFPage;
