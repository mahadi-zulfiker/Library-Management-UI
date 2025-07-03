import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white text-center p-4 mt-8 shadow-inner">
      <div className="container mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Library Management System. All rights reserved.</p>
        <p className="text-xs mt-1">Developed by Mahadi Zulfiker</p>
      </div>
    </footer>
  );
};

export default Footer;