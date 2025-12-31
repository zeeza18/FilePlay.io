import { FileText, Users, Target, Zap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary to-background-secondary py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-text-primary mb-4">
            About <span className="gradient-text">FilePlay</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Your ultimate file processing platform for previewing, converting, and managing all file types
          </p>
        </div>

        {/* Mission */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-text-primary">Our Mission</h2>
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              FilePlay is built to be the one-stop solution for all your file processing needs. Whether you need to preview a document, convert an image, or browse an archive, we've got you covered. Our mission is to make file handling simple, fast, and accessible to everyone.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Universal Preview</h3>
            <p className="text-text-secondary">
              Preview any file type directly in your browser - from documents and images to videos, archives, and databases.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Fast Conversion</h3>
            <p className="text-text-secondary">
              Convert files between formats instantly with our powerful conversion engine supporting 100+ file types.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="w-12 h-12 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Privacy First</h3>
            <p className="text-text-secondary">
              Your files are processed securely with automatic cleanup. We never store your data longer than necessary.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-5xl font-black gradient-text mb-2">100+</p>
                <p className="text-lg text-text-secondary font-semibold">File Formats</p>
              </div>
              <div>
                <p className="text-5xl font-black gradient-text mb-2">15+</p>
                <p className="text-lg text-text-secondary font-semibold">Preview Types</p>
              </div>
              <div>
                <p className="text-5xl font-black gradient-text mb-2">50+</p>
                <p className="text-lg text-text-secondary font-semibold">Conversions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
