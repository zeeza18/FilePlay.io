import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const JPGToPNGPage = () => {
  useEffect(() => {
    document.title = 'JPG to PNG Converter - Convert JPEG to PNG Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert JPG to PNG online for free. Transform JPEG images to PNG format with transparency support. High-quality conversion in seconds.');
    }
  }, []);

  return <ConvertPage />;
};

export default JPGToPNGPage;
