import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-900 text-white py-8 border-t border-blue-300/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">Ayyavu Constructions</h3>
            <p className="text-white/80 mt-1"><h3><b>Creating Heavens on Earth</b></h3></p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-white/80">
              © 2025 Ayyavu Constructions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;