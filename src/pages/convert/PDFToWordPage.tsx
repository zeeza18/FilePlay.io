import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const PDFToWordPage = () => {
  useEffect(() => {
    document.title = 'PDF to DOCX Converter - Convert PDF to Word Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert PDF to DOCX online for free. Transform PDF files into editable Microsoft Word documents. Fast, secure, and no software installation required.');
    }
  }, []);

  return <ConvertPage />;
};

export default PDFToWordPage;
