// src/components/shared/Sidebar.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: '0' },
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 shadow-xl lg:hidden"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-500 mb-8">Menú</h2>
            <nav className="space-y-4">
              <NavLink
                to="/"
                onClick={onClose}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg font-semibold transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                Cartelera
              </NavLink>
              <NavLink
                to="/preventas"
                onClick={onClose}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg font-semibold transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                Preventas
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={onClose}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg font-semibold transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/cashier"
                onClick={onClose}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg font-semibold transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                Caja
              </NavLink>
              <NavLink
                to="/employees"
                onClick={onClose}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg font-semibold transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                  }`
                }
              >
                Empleados
              </NavLink>
              <div className="border-t border-gray-700 my-4 pt-4">
                <h3 className="text-gray-400 text-sm font-bold mb-2">Más Opciones</h3>
                <Link
                  to="/noticias"
                  onClick={onClose}
                  className="block py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
                >
                  Noticias
                </Link>
                <Link
                  to="/contacto"
                  onClick={onClose}
                  className="block py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
                >
                  Contacto
                </Link>
              </div>
              <div className="border-t border-gray-700 my-4 pt-4">
                <NavLink
                  to="/login"
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded-lg font-semibold transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  Ingresar
                </NavLink>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;