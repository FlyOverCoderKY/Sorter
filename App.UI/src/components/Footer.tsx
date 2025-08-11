import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" role="contentinfo" aria-label="Footer">
      <div className="site-footer__inner">
        <p className="site-footer__text">© {year} Fly Over Coder</p>
      </div>
    </footer>
  );
};

export default Footer;


