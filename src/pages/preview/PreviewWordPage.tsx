import { useEffect } from 'react';
import PreviewPage from '../PreviewPage';

const PreviewWordPage = () => {
  useEffect(() => {
    document.title = 'Preview Word Documents Online - DOCX Viewer | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View Microsoft Word documents online. Preview DOCX, DOC files instantly in your browser without downloading or installing software.');
    }
  }, []);

  return <PreviewPage />;
};

export default PreviewWordPage;
