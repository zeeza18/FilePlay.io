import { FileText, Image, FileSpreadsheet, Presentation } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { motion } from 'framer-motion';

const SupportedFormatsSection = () => {
  const categories = [
    {
      name: 'Documents',
      icon: FileText,
      formats: ['PDF', 'DOCX', 'DOC', 'TXT', 'RTF', 'MD'],
    },
    {
      name: 'Images',
      icon: Image,
      formats: ['JPG', 'PNG', 'GIF', 'WEBP', 'TIFF', 'BMP', 'SVG'],
    },
    {
      name: 'Spreadsheets',
      icon: FileSpreadsheet,
      formats: ['XLSX', 'XLS', 'CSV', 'TSV'],
    },
    {
      name: 'Presentations',
      icon: Presentation,
      formats: ['PPTX', 'PPT'],
    },
  ];

  return (
    <section className="bg-background-secondary">
      <div className="container-custom section-padding">
        <SectionHeader
          title="Support for every file type you need"
          description="We handle all major document, image, and spreadsheet formats."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl mb-4 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Category Name */}
                <h3 className="text-xl font-bold text-text-primary mb-4">{category.name}</h3>

                {/* Format Badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {category.formats.map((format) => (
                    <span
                      key={format}
                      className="px-4 py-2 bg-white border border-ui-border rounded-lg text-sm font-semibold text-accent-primary shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SupportedFormatsSection;
