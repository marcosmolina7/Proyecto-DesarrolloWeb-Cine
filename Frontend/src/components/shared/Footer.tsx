import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} CineApp. Todos los derechos reservados.
        </p>
        <p className="mt-2">
          Hecho con ❤️ en Guatemala
        </p>
      </div>
    </footer>
  );
};

export default Footer;