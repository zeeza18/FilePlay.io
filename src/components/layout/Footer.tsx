import { Link } from 'react-router-dom';
import { Play, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const footerColumns = [
    {
      title: 'Product',
      links: [
        { label: 'Preview', url: '/preview' },
        { label: 'Convert', url: '/convert' },
        { label: 'Edit', url: '/edit' },
        { label: 'AI Tools', url: '/ai-tools' },
        { label: 'Analysis', url: '/analysis' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', url: '/docs' },
        { label: 'API', url: '/api' },
        { label: 'Blog', url: '/blog' },
        { label: 'Support', url: '/support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', url: '/about' },
        { label: 'Contact', url: '/contact' },
        { label: 'Careers', url: '/careers' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Cookie Policy', url: '/cookies' },
        { label: 'Security', url: '/security' },
      ],
    },
  ];

  const socialMedia = [
    { platform: 'Twitter', icon: Twitter, url: 'https://twitter.com/fileplay' },
    { platform: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/fileplay' },
    { platform: 'GitHub', icon: Github, url: 'https://github.com/fileplay' },
  ];

  return (
    <footer className="bg-text-primary text-text-muted">
      <div className="container-custom py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-white font-bold text-xl mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.url}
                      className="text-base hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-accent-primary to-accent-secondary p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-black text-white">
                File<span className="gradient-text">Play</span>
              </span>
            </Link>
            <div className="text-center md:text-left">
              <p className="text-sm">© 2025 FilePlay.io. All rights reserved.</p>
              <p className="text-sm mt-1">Built with ❤️ for document lovers</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            {socialMedia.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 rounded-lg hover:bg-accent-primary hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.platform}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
