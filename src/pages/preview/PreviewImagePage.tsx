import { useEffect } from 'react';
import PreviewPage from '../PreviewPage';

const PreviewImagePage = () => {
  useEffect(() => {
    document.title = 'Preview Images Online - JPG PNG WEBP Viewer | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Preview images online. View JPG, PNG, GIF, WEBP, HEIC, SVG files with zoom controls. Fast and secure image viewer.');
    }
  }, []);

  return <PreviewPage />;
};

export default PreviewImagePage;
