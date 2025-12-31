import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PreviewPage from './pages/PreviewPage';
import ConvertPage from './pages/ConvertPage';
import EditPage from './pages/EditPage';
import AIToolsPage from './pages/AIToolsPage';
import AnalysisPage from './pages/AnalysisPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import { FileProvider } from './context/FileContext';

// Preview pages
import PreviewPDFPage from './pages/preview/PreviewPDFPage';
import PreviewExcelPage from './pages/preview/PreviewExcelPage';
import PreviewWordPage from './pages/preview/PreviewWordPage';
import PreviewImagePage from './pages/preview/PreviewImagePage';
import PreviewCSVPage from './pages/preview/PreviewCSVPage';
import PreviewVideoPage from './pages/preview/PreviewVideoPage';
import PreviewAudioPage from './pages/preview/PreviewAudioPage';
import PreviewCodePage from './pages/preview/PreviewCodePage';
import PreviewArchivePage from './pages/preview/PreviewArchivePage';
import PreviewEmailPage from './pages/preview/PreviewEmailPage';
import PreviewDatabasePage from './pages/preview/PreviewDatabasePage';
import PreviewCalendarPage from './pages/preview/PreviewCalendarPage';
import PreviewSubtitlePage from './pages/preview/PreviewSubtitlePage';

// Conversion pages
import PDFToWordPage from './pages/convert/PDFToWordPage';
import JPGToPNGPage from './pages/convert/JPGToPNGPage';
import PNGToJPGPage from './pages/convert/PNGToJPGPage';
import ExcelToCSVPage from './pages/convert/ExcelToCSVPage';
import CSVToExcelPage from './pages/convert/CSVToExcelPage';
import WordToPDFPage from './pages/convert/WordToPDFPage';
import ImageToPDFPage from './pages/convert/ImageToPDFPage';
import JSONToCSVPage from './pages/convert/JSONToCSVPage';
import XMLToJSONPage from './pages/convert/XMLToJSONPage';
import VideoToMP4Page from './pages/convert/VideoToMP4Page';
import AudioFormatPage from './pages/convert/AudioFormatPage';

function App() {
  return (
    <Router>
      <FileProvider>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Preview Routes */}
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/preview/pdf" element={<PreviewPDFPage />} />
              <Route path="/preview/excel" element={<PreviewExcelPage />} />
              <Route path="/preview/word" element={<PreviewWordPage />} />
              <Route path="/preview/image" element={<PreviewImagePage />} />
              <Route path="/preview/csv" element={<PreviewCSVPage />} />
              <Route path="/preview/video" element={<PreviewVideoPage />} />
              <Route path="/preview/audio" element={<PreviewAudioPage />} />
              <Route path="/preview/code" element={<PreviewCodePage />} />
              <Route path="/preview/archive" element={<PreviewArchivePage />} />
              <Route path="/preview/email" element={<PreviewEmailPage />} />
              <Route path="/preview/database" element={<PreviewDatabasePage />} />
              <Route path="/preview/calendar" element={<PreviewCalendarPage />} />
              <Route path="/preview/subtitle" element={<PreviewSubtitlePage />} />

              {/* Convert Routes */}
              <Route path="/convert" element={<ConvertPage />} />
              <Route path="/convert/pdf-to-word" element={<PDFToWordPage />} />
              <Route path="/convert/jpg-to-png" element={<JPGToPNGPage />} />
              <Route path="/convert/png-to-jpg" element={<PNGToJPGPage />} />
              <Route path="/convert/excel-to-csv" element={<ExcelToCSVPage />} />
              <Route path="/convert/csv-to-excel" element={<CSVToExcelPage />} />
              <Route path="/convert/word-to-pdf" element={<WordToPDFPage />} />
              <Route path="/convert/image-to-pdf" element={<ImageToPDFPage />} />
              <Route path="/convert/json-to-csv" element={<JSONToCSVPage />} />
              <Route path="/convert/xml-to-json" element={<XMLToJSONPage />} />
              <Route path="/convert/video-to-mp4" element={<VideoToMP4Page />} />
              <Route path="/convert/audio" element={<AudioFormatPage />} />

              {/* Other Routes */}
              <Route path="/edit" element={<EditPage />} />
              <Route path="/ai-tools" element={<AIToolsPage />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </FileProvider>
    </Router>
  );
}

export default App;
