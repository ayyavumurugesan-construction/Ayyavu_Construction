import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 text-white py-8 border-t border-blue-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg">Ayyavu Constructions</h3>
            <p className="text-gray-300 mt-1"><h3><b>Creating Heavens on Earth</b></h3></p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-300">
              © 2025 Ayyavu Constructions. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;