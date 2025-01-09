// Footer.js
import React from "react";
import "./Footer.css"; // Import styles for the footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Connect With Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@jobsearchplatform.com</p>
          <p>Phone: +1-800-123-4567</p>
        </div>

        <div className="footer-section">
          <p>&copy; {new Date().getFullYear()} JobSearch Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
