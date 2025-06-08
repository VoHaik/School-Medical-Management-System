import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer py-10 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <i className="fas fa-heartbeat text-2xl mr-2"></i>
              <h4 className="text-xl font-bold">School Health</h4>
            </div>
            <p className="text-gray-200 mb-4">Providing comprehensive health management solutions for schools and educational institutions.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-gray-200 transition-all" aria-label="Facebook">
                <i className="fab fa-facebook-f text-lg"></i>
              </a>
              <a href="https://twitter.com" className="text-white hover:text-gray-200 transition-all" aria-label="Twitter">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="https://instagram.com" className="text-white hover:text-gray-200 transition-all" aria-label="Instagram">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="https://linkedin.com" className="text-white hover:text-gray-200 transition-all" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in text-lg"></i>
              </a>
            </div>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="footer-link flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Home</Link></li>
              <li><Link to="/#docs" className="footer-link flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Health Docs</Link></li>
              <li><Link to="/#blog" className="footer-link flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Blog</Link></li>
              <li><Link to="/login" className="footer-link flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Login</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-4">Resources</h5>
            <ul className="space-y-2">
              <li><Link to="/resources/health-policies" className="footer-link flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Health Policies</Link></li>
              <li><Link to="/resources/vaccination-info" className="footer-link flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Vaccination Info</Link></li>
              <li><Link to="/resources/emergency-procedures" className="footer-link flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> Emergency Procedures</Link></li>
              <li><Link to="/resources/faq" className="footer-link flex items-center"><i className="fas fa-chevron-right text-xs mr-2"></i> FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
            <ul className="space-y-2">
              <li className="flex items-center"><i className="fas fa-map-marker-alt mr-3"></i> 123 Education St, School City</li>
              <li className="flex items-center"><i className="fas fa-phone-alt mr-3"></i> (123) 456-7890</li>
              <li className="flex items-center"><i className="fas fa-envelope mr-3"></i> health@school.edu</li>
              <li className="flex items-center"><i className="fas fa-clock mr-3"></i> Mon-Fri: 8:00 AM - 5:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-indigo-400 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} School Health Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;