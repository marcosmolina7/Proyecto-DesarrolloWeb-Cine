// src/components/shared/Header.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="fixed top-0 left-0 w-full bg-gray-900 border-b border-gray-800 z-50 shadow-lg"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuToggle} className="text-white focus:outline-none lg:hidden">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="text-2xl font-bold text-blue-500">
            CineApp
          </Link>
        </div>

        {/* Menú de navegación horizontal para pantallas grandes */}
        <nav className="hidden lg:flex items-center space-x-6 flex-grow justify-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`
            }
          >
            Cartelera
          </NavLink>
          <NavLink
            to="/preventas"
            className={({ isActive }) =>
              `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`
            }
          >
            Preventas
          </NavLink>
          <div
            className="relative"
            onMouseEnter={() => setIsMoreOptionsOpen(true)}
            onMouseLeave={() => setIsMoreOptionsOpen(false)}
          >
            <span
              className={`font-semibold cursor-pointer transition-colors ${isMoreOptionsOpen ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`}
            >
              Más Opciones
            </span>
            {isMoreOptionsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700"
              >
                <Link
                  to="/noticias"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Noticias
                </Link>
                <Link
                  to="/contacto"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Contacto
                </Link>
              </motion.div>
            )}
          </div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`
            }
          >
            Dashboard
          </NavLink>
          {/* ⬅️ Aquí están los dos nuevos enlaces para las cajas */}
          <NavLink
            to="/caja/boletos"
            className={({ isActive }) =>
              `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`
            }
          >
            Caja Boletos
          </NavLink>
          <NavLink
            to="/caja/productos"
            className={({ isActive }) =>
              `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`
            }
          >
            Caja Productos
          </NavLink>
          {/* ⬅️ Fin de los nuevos enlaces */}
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`
            }
          >
            Empleados
          </NavLink>
        </nav>

        {/* Buscador y Login */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Buscar películas..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <Link to="/login" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ingresar
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;