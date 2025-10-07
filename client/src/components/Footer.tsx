import Link from 'next/link';
import { MapPin, Phone, Mail, ExternalLink, Stethoscope } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/office-bearers', label: 'Office Bearers' },
    { href: '/members', label: 'Members' },
    { href: '/events', label: 'Events' },
  ];

  const importantLinks = [
    { href: '/newsletters', label: 'Newsletters' },
    { href: '/membership', label: 'Membership' },
    { href: '/contact', label: 'Contact Us' },
    { href: 'https://www.fogsi.org', label: 'FOGSI', external: true },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container section-padding-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-medical rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="text-white w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold">POGS</h3>
                <p className="text-gray-300 text-sm">Patna Obstetric & Gynaecological Society</p>
              </div>
            </div>
            <p className="text-gray-300 text-body leading-relaxed mb-6">
              Advancing the field of obstetrics and gynaecology through education, research, and 
              professional development in Bihar. A proud member of FOGSI, committed to excellence 
              in women&apos;s healthcare.
            </p>
            <div className="flex items-center space-x-4">
              <Link 
                href="https://www.fogsi.org" 
                target="_blank"
                className="inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors duration-200 text-sm font-medium"
              >
                FOGSI Affiliation
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 text-sm block py-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Resources</h4>
            <ul className="space-y-3">
              {importantLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    {...(link.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="text-gray-300 hover:text-blue-300 transition-colors duration-200 text-sm flex items-center py-1"
                  >
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3 ml-1" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <MapPin className="text-white w-5 h-5" />
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">Address</h5>
                <p className="text-gray-300 text-sm leading-relaxed">
                  IMA Building, Dr. A. K. N. Sinha Path,<br />
                  South East of Gandhi Maidan,<br />
                  Patna – 800 004 (Bihar)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Phone className="text-white w-5 h-5" />
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">Phone</h5>
                <p className="text-gray-300 text-sm">
                  <a href="tel:06122321542" className="hover:text-blue-300 transition-colors duration-200">
                    0612-2321542
                  </a><br />
                  <a href="tel:7677253032" className="hover:text-blue-300 transition-colors duration-200">
                    7677253032
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Mail className="text-white w-5 h-5" />
              </div>
              <div>
                <h5 className="font-semibold text-white mb-2">Email</h5>
                <p className="text-gray-300 text-sm">
                  <a 
                    href="mailto:patnabogs@gmail.com" 
                    className="hover:text-blue-300 transition-colors duration-200"
                  >
                    patnabogs@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Patna Obstetric &amp; Gynaecological Society. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link 
                href="/contact" 
                className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-400 hover:text-blue-300 transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          
          {/* Developer Credit */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-gray-500 text-xs text-center">
              Designed and Developed by{' '}
              <a 
                href="https://moviesindiagroup.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                MIG Events
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;