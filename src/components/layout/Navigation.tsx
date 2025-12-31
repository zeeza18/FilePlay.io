import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Play, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

type NavStatus = 'live' | 'coming_soon';

type NavLink = {
  label: string;
  link: string;
  description?: string;
  status?: NavStatus;
  badge?: string;
};

type NavItem = {
  label: string;
  link?: string;
  status?: NavStatus;
  badge?: string;
  summary?: string;
  dropdownItems?: NavLink[];
};

const menuItems: NavItem[] = [
  {
    label: 'Preview',
    summary: 'Instantly view files in-browser with rich viewers.',
    dropdownItems: [
      {
        label: 'Documents',
        link: '/preview/pdf',
        description: 'PDF, Word, PowerPoint, Text, Markdown',
        status: 'live',
      },
      {
        label: 'Spreadsheets',
        link: '/preview/excel',
        description: 'Excel, CSV, ODS tables at a glance',
        status: 'live',
      },
      {
        label: 'Images',
        link: '/preview/image',
        description: 'JPG, PNG, GIF, WEBP, HEIC, SVG, PSD, RAW',
        status: 'live',
      },
      {
        label: 'Videos',
        link: '/preview/video',
        description: 'MP4, AVI, MOV, MKV, WebM, OGG playback',
        status: 'live',
      },
      {
        label: 'Audio',
        link: '/preview/audio',
        description: 'MP3, WAV, OGG, M4A, FLAC, AAC players',
        status: 'live',
      },
      {
        label: 'Code',
        link: '/preview/code',
        description: 'Syntax highlight for JS, Python, Java, more',
        status: 'live',
      },
      {
        label: 'Archives',
        link: '/preview/archive',
        description: 'ZIP, RAR, 7Z, TAR, GZ file browser',
        status: 'live',
      },
      {
        label: 'Email',
        link: '/preview/email',
        description: 'EML, MSG with attachments inline',
        status: 'live',
      },
      {
        label: 'Database',
        link: '/preview/database',
        description: 'SQLite, DB table viewer and queries',
        status: 'live',
      },
      {
        label: '3D Models',
        link: '/preview/3d',
        description: 'STL, OBJ, GLTF, FBX viewer',
        status: 'coming_soon',
        badge: 'Soon',
      },
      {
        label: 'Fonts',
        link: '/preview/font',
        description: 'TTF, OTF, WOFF glyph previews',
        status: 'coming_soon',
        badge: 'Soon',
      },
      {
        label: 'Maps',
        link: '/preview/map',
        description: 'KML, GPX, GeoJSON interactive maps',
        status: 'coming_soon',
        badge: 'Soon',
      },
      {
        label: 'Calendar',
        link: '/preview/calendar',
        description: 'ICS, VCF events and contacts',
        status: 'live',
      },
      {
        label: 'Subtitles',
        link: '/preview/subtitle',
        description: 'SRT, VTT, ASS subtitle viewer',
        status: 'live',
      },
      {
        label: 'All Files',
        link: '/preview',
        description: 'Universal preview for every format',
        status: 'live',
      },
    ],
  },
  {
    label: 'Convert',
    summary: 'Transform files between formats with fast, reliable outputs.',
    dropdownItems: [
      {
        label: 'PDF to Word',
        link: '/convert/pdf-to-word',
        description: 'Convert PDF to DOCX editable documents',
        status: 'live',
      },
      {
        label: 'Word to PDF',
        link: '/convert/word-to-pdf',
        description: 'Convert DOCX to PDF format',
        status: 'live',
      },
      {
        label: 'Excel to CSV',
        link: '/convert/excel-to-csv',
        description: 'Convert XLSX to CSV format',
        status: 'live',
      },
      {
        label: 'CSV to Excel',
        link: '/convert/csv-to-excel',
        description: 'Convert CSV to XLSX spreadsheets',
        status: 'live',
      },
      {
        label: 'JPG to PNG',
        link: '/convert/jpg-to-png',
        description: 'Convert JPEG to PNG images',
        status: 'live',
      },
      {
        label: 'PNG to JPG',
        link: '/convert/png-to-jpg',
        description: 'Convert PNG to JPEG images',
        status: 'live',
      },
      {
        label: 'Image to PDF',
        link: '/convert/image-to-pdf',
        description: 'Convert any image to PDF',
        status: 'live',
      },
      {
        label: 'Video to MP4',
        link: '/convert/video-to-mp4',
        description: 'Convert AVI, MOV, MKV to MP4',
        status: 'live',
      },
      {
        label: 'Audio Format',
        link: '/convert/audio',
        description: 'Convert MP3, WAV, OGG, FLAC, M4A',
        status: 'live',
      },
      {
        label: 'JSON to CSV',
        link: '/convert/json-to-csv',
        description: 'Convert JSON data to CSV',
        status: 'live',
      },
      {
        label: 'XML to JSON',
        link: '/convert/xml-to-json',
        description: 'Convert XML to JSON format',
        status: 'live',
      },
      {
        label: 'All Conversions',
        link: '/convert',
        description: 'Universal file converter - all formats',
        status: 'live',
      },
    ],
  },
  {
    label: 'Tools',
    summary: 'AI helpers and in-browser editors to work faster.',
    dropdownItems: [
      {
        label: 'Edit Files',
        link: '/edit',
        description: 'Edit documents, images, and PDFs in your browser',
        status: 'coming_soon',
        badge: 'Soon',
      },
      {
        label: 'AI Tools',
        link: '/ai-tools',
        description: 'Summaries, translations, and smart file processing',
        status: 'coming_soon',
        badge: 'Soon',
      },
      {
        label: 'Analysis',
        link: '/analysis',
        description: 'File insights, quality checks, and metadata extraction',
        status: 'coming_soon',
        badge: 'Soon',
      },
    ],
  },
  { label: 'Pricing', link: '/pricing', status: 'live' },
];

const renderStatusBadge = (status?: NavStatus, badge?: string) => {
  if (badge) {
    return (
      <Badge variant={status === 'coming_soon' ? 'warning' : 'primary'} size="small">
        {badge}
      </Badge>
    );
  }

  if (status === 'live') {
    return (
      <Badge variant="success" size="small">
        Live
      </Badge>
    );
  }

  return null;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const ctaLabel = isHome ? "Let's Start" : null;
  const scrollToConvert = () => {
    const target = document.getElementById('convert');
    if (target) {
      const offset = 80; // account for sticky nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const isItemActive = (item: NavItem) => {
    if (item.link && location.pathname === item.link) return true;
    if (item.dropdownItems) {
      return item.dropdownItems.some((child) => child.link === location.pathname);
    }
    return false;
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-accent-primary to-accent-secondary p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <div key={location.pathname} className="flex text-3xl font-black text-text-primary">
              {['F', 'I', 'L', 'E', 'P', 'L', 'A', 'Y'].map((char, idx) => (
                <motion.span
                  key={char + idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.35, ease: 'easeOut' }}
                  className={idx >= 4 ? 'gradient-text' : ''}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center" onMouseLeave={() => setActiveDropdown(null)}>
            {menuItems.map((item) => {
              const hasDropdown = !!item.dropdownItems?.length;
              const active = isItemActive(item);

              const triggerClasses = `flex items-center gap-2 font-semibold text-base transition-colors duration-200 ${
                active ? 'text-accent-primary' : 'text-text-secondary hover:text-accent-primary'
              }`;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(item.label)}
                  onFocus={() => hasDropdown && setActiveDropdown(item.label)}
                >
                  {hasDropdown ? (
                    <button
                      type="button"
                      className={triggerClasses}
                      aria-haspopup="true"
                      aria-expanded={activeDropdown === item.label}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.label ? 'rotate-180 text-accent-primary' : 'text-text-secondary'
                        }`}
                      />
                    </button>
                  ) : (
                    item.link && (
                      <Link to={item.link} className={triggerClasses}>
                        {item.label}
                        {renderStatusBadge(item.status, item.badge)}
                      </Link>
                    )
                  )}

                  <AnimatePresence>
                    {hasDropdown && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={`absolute left-0 top-full mt-3 rounded-2xl border border-ui-border bg-white shadow-xl ${
                          item.label === 'Convert'
                            ? 'w-[680px]'
                            : item.label === 'Preview'
                              ? 'w-[680px]'
                              : 'w-[420px]'
                        }`}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.16, ease: 'easeOut' }}
                          className="p-4 space-y-4"
                        >
                          {item.summary && (
                            <p className="text-center text-sm text-text-primary font-semibold px-1">
                              {item.summary}
                            </p>
                          )}
                          <div
                            className={`${
                              item.label === 'Convert'
                                ? 'grid grid-cols-3 gap-3'
                                : item.label === 'Preview'
                                  ? 'grid grid-cols-3 gap-3'
                                  : ''
                            }`}
                          >
                          {item.dropdownItems?.map((child) => (
                            <motion.div
                              key={child.link}
                              whileHover={{ y: -2, scale: 1.01 }}
                              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                              className="group"
                            >
                              <Link
                                to={child.link}
                                className="flex items-start justify-between gap-3 rounded-xl p-3 hover:bg-background-secondary/80 transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1 leading-tight">
                                    <p className="font-semibold text-sm text-text-primary group-hover:text-accent-primary transition-colors">
                                      {child.label}
                                    </p>
                                    {renderStatusBadge(child.status, child.badge)}
                                  </div>
                                  {child.description && (
                                    <p className="text-sm text-text-secondary leading-snug">
                                      {child.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center justify-end w-[140px]">
            {ctaLabel ? (
              <Button
                onClick={scrollToConvert}
                variant="primary"
                size="medium"
                type="button"
              >
                {ctaLabel}
              </Button>
            ) : (
              <div className="invisible">
                <Button variant="primary" size="medium" type="button">
                  Placeholder
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-text-primary hover:text-accent-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-ui-border overflow-hidden"
          >
            <div className="container-custom py-6 space-y-5">
              {menuItems.map((item) => {
                const hasDropdown = !!item.dropdownItems?.length;
                const active = isItemActive(item);

                return (
                  <div key={item.label} className="space-y-2">
                    {item.link && !hasDropdown ? (
                      <Link
                        to={item.link}
                        className={`flex items-center justify-between py-3 px-4 rounded-lg transition-colors ${
                          active ? 'bg-background-accent-light text-accent-primary' : 'text-text-secondary hover:bg-background-secondary'
                        }`}
                      >
                        <span className="font-semibold">{item.label}</span>
                        {renderStatusBadge(item.status, item.badge)}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between px-1 text-text-primary mb-2">
                        <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
                        {renderStatusBadge(item.status, item.badge)}
                      </div>
                    )}

                    {hasDropdown && (
                      <div className="space-y-1">
                        {item.dropdownItems?.map((child) => {
                          const childActive = location.pathname === child.link;

                          return (
                            <Link
                              key={child.link}
                              to={child.link}
                              className={`flex items-start gap-3 py-3 px-3 rounded-lg transition-colors ${
                                childActive
                                  ? 'bg-background-accent-light text-accent-primary'
                                  : 'text-text-secondary hover:bg-background-secondary'
                              }`}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-semibold text-text-primary">{child.label}</p>
                                  {renderStatusBadge(child.status, child.badge)}
                                </div>
                                {child.description && (
                                  <p className="text-sm text-text-secondary">{child.description}</p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {ctaLabel && (
                <div className="pt-4">
                  <Button
                    onClick={scrollToConvert}
                    variant="primary"
                    size="medium"
                    className="w-full"
                    type="button"
                  >
                    {ctaLabel}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
