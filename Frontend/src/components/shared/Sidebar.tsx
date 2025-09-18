// src/components/shared/Sidebar.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  const generalNav = [
    { label: 'Cartelera', path: '/' },
    { label: 'Preventas', path: '/preventas' },
    { label: 'Caja', path: '/cashier' },
    { label: 'Empleados', path: '/employees' },
    { label: 'Noticias', path: '/noticias' },
    { label: 'Contacto', path: '/contacto' },
    { label: 'Ingresar', path: '/login' },
  ];

  const adminNav = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Películas', path: '/admin/movies' },
    { label: 'Agregar Película', path: '/admin/movies/new' },
    { label: 'Empleados', path: '/admin/employees' },
    { label: 'Horarios', path: '/admin/schedules' },
    { label: 'Productos', path: '/admin/products' },
    { label: 'Agregar Producto', path: '/admin/products/new' },
  ];

  const navItems = isAdminRoute ? adminNav : generalNav;

  return (
    <>
      {/* Sidebar persistente en escritorio solo si es ruta admin */}
      {isAdminRoute && (
        <div className="hidden lg:block w-64 bg-gray-900 border-r border-gray-800 h-screen fixed top-0 left-0 z-30 p-6">
          <h2 className="text-2xl font-bold text-blue-500 mb-8">Administración</h2>
          <nav className="space-y-4">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg font-semibold transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Sidebar móvil animado (siempre disponible) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 shadow-xl lg:hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-blue-500 mb-8">
                {isAdminRoute ? 'Administración' : 'Menú'}
              </h2>
              <nav className="space-y-4">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded-lg font-semibold transition-colors ${
                        isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
