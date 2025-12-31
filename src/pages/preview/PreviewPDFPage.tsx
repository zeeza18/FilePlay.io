import { useEffect } from 'react';
import PreviewPage from '../PreviewPage';

const PreviewPDFPage = () => {
  useEffect(() => {
    document.title = 'Preview PDF Files Online - Free PDF Viewer | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View PDF documents instantly in your browser. Multi-page navigation, zoom controls, and instant previews. No download required.');
    }
  }, []);

  return <PreviewPage />;
};

export default PreviewPDFPage;
