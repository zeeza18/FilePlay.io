import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const PNGToJPGPage = () => {
  useEffect(() => {
    document.title = 'PNG to JPG Converter - Convert PNG to JPEG Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert PNG to JPG online for free. Transform PNG images to JPEG format. Reduce file size while maintaining quality. Fast and secure.');
    }
  }, []);

  return <ConvertPage />;
};

export default PNGToJPGPage;
