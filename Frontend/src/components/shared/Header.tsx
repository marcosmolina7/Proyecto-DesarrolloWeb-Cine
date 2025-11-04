// src/components/shared/Header.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  // Definir constantes de roles
  const ROLE_ADMIN = 2;
  const ROLE_CASHIER = 3;
  const ROLE_CLIENT = 4;

  // Flags de permisos
  const isAdmin = user?.idRole === ROLE_ADMIN;
  const isCashier = user?.idRole === ROLE_CASHIER;
  const isClient = user?.idRole === ROLE_CLIENT;

  // Función helper para determinar qué mostrar
  const canViewPublicLinks = isAdmin || isCashier || isClient || !isAuthenticated;
  const canViewDashboard = isAdmin;
  const canViewPOS = isAdmin || isCashier;

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
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="text-2xl font-bold text-blue-500">
            CineApp
          </Link>
        </div>

        {/* Menú de navegación condicional */}
        <nav className="hidden lg:flex items-center space-x-6 flex-grow justify-center">
          
          {/* ENLACES PÚBLICOS - Visibles para todos */}
          {canViewPublicLinks && (
            <>
              <NavLink to="/" className={({ isActive }) => `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`}>
                Cartelera
              </NavLink>

              {/* Dropdown de Más Opciones */}
              <div
                className="relative"
                onMouseEnter={() => setIsMoreOptionsOpen(true)}
                onMouseLeave={() => setIsMoreOptionsOpen(false)}
              >
                <button className={`font-semibold cursor-pointer transition-colors flex items-center gap-1 ${isMoreOptionsOpen ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`}>
                  Más Opciones
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMoreOptionsOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
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
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsMoreOptionsOpen(false)}
                      >
                        Noticias
                      </Link>
                      <Link 
                        to="/contacto" 
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => setIsMoreOptionsOpen(false)}
                      >
                        Contacto
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
          
          {/* DASHBOARD - Solo visible para Administrador */}
          {canViewDashboard && (
            <NavLink to="/dashboard" className={({ isActive }) => `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`}>
              Dashboard
            </NavLink>
          )}

          {/* PUNTO DE VENTA - Visible para Admin y Cajero */}
          {canViewPOS && (
            <>
              <NavLink to="/caja/boletos" className={({ isActive }) => `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`}>
                Caja Boletos
              </NavLink>
              <NavLink to="/caja/productos" className={({ isActive }) => `font-semibold transition-colors ${isActive ? 'text-blue-500' : 'text-gray-300 hover:text-white'}`}>
                Caja Productos
              </NavLink>
            </>
          )}

        </nav>

        {/* ✅ CORREGIDO: Eliminado el buscador - Solo Login/Logout */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-3">
              <span className="text-white font-semibold text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                {user?.nameUser} ({user?.roleName}) 
              </span>
              <motion.button
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </motion.button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ingresar
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;