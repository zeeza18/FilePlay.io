import { useEffect } from 'react';
import PreviewPage from '../PreviewPage';

const PreviewCSVPage = () => {
  useEffect(() => {
    document.title = 'Preview CSV Files Online - CSV Viewer | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'View CSV files online as formatted tables. Preview comma-separated values with column headers and data rows. Free CSV viewer.');
    }
  }, []);

  return <PreviewPage />;
};

export default PreviewCSVPage;
