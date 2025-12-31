import { useEffect } from 'react';
import ConvertPage from '../ConvertPage';

const JSONToCSVPage = () => {
  useEffect(() => {
    document.title = 'JSON to CSV Converter - Convert JSON to CSV Online Free | FilePlay';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert JSON to CSV online for free. Transform JSON data to CSV format. Perfect for data analysis and Excel import. Fast conversion.');
    }
  }, []);

  return <ConvertPage />;
};

export default JSONToCSVPage;
