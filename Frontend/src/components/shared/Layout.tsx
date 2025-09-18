// src/components/shared/Layout.tsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Detectar si estamos en una ruta administrativa
  const isAdminRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/admin');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Encabezado */}
      <Header onMenuToggle={toggleSidebar} />

      {/* Sidebar: visible en móvil y en escritorio si es ruta admin */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Contenido principal con margen izquierdo solo si hay sidebar persistente */}
      <main className={`flex-grow pt-16 px-6 ${isAdminRoute ? 'lg:ml-64' : ''}`}>
        {children}
      </main>

      {/* Pie de página */}
      <Footer />
    </div>
  );
};

export default Layout;
