import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const XMLToJSONPage = () => {
  useEffect(() => {
    document.title = 'XML to JSON Converter - Convert XML to JSON Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert XML to JSON online for free. Transform XML data to JSON format. Perfect for API integration and modern web development. Instant conversion.');
    }
  }, []);

  return <ConvertPage />;
};

export default XMLToJSONPage;
