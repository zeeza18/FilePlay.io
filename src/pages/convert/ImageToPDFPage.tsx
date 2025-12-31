import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const ImageToPDFPage = () => {
  useEffect(() => {
    document.title = 'Image to PDF Converter - Convert JPG PNG to PDF Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert images to PDF online for free. Transform JPG, PNG, WEBP to PDF documents. Combine multiple images into one PDF. Fast and secure.');
    }
  }, []);

  return <ConvertPage />;
};

export default ImageToPDFPage;
