import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <p>&copy; {currentYear} Fly Over Coder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
