// src/components/shared/Sidebar.tsx

import React, { useState, ReactNode, ReactElement, JSXElementConstructor } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ChevronDown, Film, LayoutDashboard, Clock, Users, Package, Tag, List, Shield, Ruler, Truck, Briefcase, Armchair, DoorOpen, PackageSearch } from 'lucide-react'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- TIPOS DE NAVEGACIÓN ---
interface NavItemBase {
  label: string;
  icon?: ReactNode;
}
interface NavItemSimple extends NavItemBase {
  isSubmenu: false;
  path: string;
  isHeader?: false;
}
interface NavItemSubmenu {
  label: string;
  icon: ReactNode;
  isSubmenu: true;
  subItems: NavItemSimple[];
  isHeader?: false;
}
interface NavHeader {
  label: string;
  isHeader: true;
  isSubmenu?: false;
}
type NavItem = NavItemSimple | NavItemSubmenu | NavHeader;
// --------------------------

// Subcomponente para el elemento de navegación con submenú
const SubMenuNavItem: React.FC<{ label: string, icon: ReactNode, subItems: NavItemSimple[], onClose: () => void }> = ({ label, icon, subItems, onClose }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const location = useLocation();
  const isParentActive = subItems.some(item => location.pathname.startsWith(item.path));

  React.useEffect(() => {
    if (isParentActive) {
        setIsSubMenuOpen(true);
    }
  }, [location.pathname, isParentActive, subItems]);

  return (
    <div>
      <button
        onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
        className={`w-full flex justify-between items-center py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none ${
            isParentActive || isSubMenuOpen
                ? 'bg-blue-800/50 text-white'
                : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        <span className="flex items-center space-x-3">
          {icon}
          <span>{label}</span>
        </span>
        <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isSubMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 ml-4 border-l border-gray-700 pl-4 space-y-2 overflow-hidden"
          >
            {subItems.map(subItem => (
              <NavLink
                key={subItem.path}
                to={subItem.path}
                onClick={onClose} 
                end={true} 
                className={({ isActive }: { isActive: boolean }): string | undefined =>
                  `block py-2 px-3 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'
                  }`
                }
              >
                {subItem.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/dashboard';

  // FUNCIONES AUXILIARES
  const renderSimpleNavItem = (item: NavItemSimple, isMobile: boolean): ReactElement | null => (
    <NavLink
        key={item.path}
        to={item.path}
        onClick={isMobile ? onClose : undefined} 
        end={true} 
        className={({ isActive }: { isActive: boolean }): string | undefined =>
            `block py-2 px-4 rounded-lg font-semibold transition-colors flex items-center space-x-3 ${
            isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`
        }
    >
        {item.icon && item.icon}
        <span>{item.label}</span>
    </NavLink>
  );

  const renderNav = (isMobile: boolean): ReactElement => (
    <nav className="space-y-2">
      {navItems.map((item: NavItem): ReactElement | null => {
        
        if (item.isHeader) {
          return (
            <h3 key={item.label} className="pt-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {item.label}
            </h3>
          );
        }

        if (item.isSubmenu) {
          return (
            <SubMenuNavItem
              key={item.label}
              label={item.label}
              icon={item.icon!}
              subItems={(item as NavItemSubmenu).subItems}
              onClose={isMobile ? onClose : () => {}} 
            />
          );
        }

        return renderSimpleNavItem(item as NavItemSimple, isMobile);
      })}
    </nav>
  );

  // --- ARREGLOS DE NAVEGACIÓN ---

  const generalNav: NavItem[] = [
    { label: 'Cartelera', path: '/', icon: <Film className="w-5 h-5" />, isSubmenu: false },
    { label: 'Preventas', path: '/preventas', icon: <Clock className="w-5 h-5" />, isSubmenu: false },
    { label: 'Noticias', path: '/noticias', isSubmenu: false },
    { label: 'Contacto', path: '/contacto', isSubmenu: false },
    { label: 'Ingresar', path: '/login', isSubmenu: false },
  ];

  // ✅ CORREGIDO: Orden actualizado según solicitud
  const adminNav: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, isSubmenu: false },

    // --- Grupo 1: Catálogo del Cine ---
    { label: 'Catálogo del Cine', isHeader: true }, // ✅ CAMBIADO: "del" en lugar de "de"
    {
      label: 'Películas',
      icon: <Film className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Películas', path: '/admin/movies', isSubmenu: false },
        { label: 'Agregar Película', path: '/admin/movies/new', isSubmenu: false },
      ]
    },
    {
      label: 'Directores',
      icon: <Users className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Directores', path: '/admin/directors', isSubmenu: false },
        { label: 'Agregar Director', path: '/admin/directors/new', isSubmenu: false },
      ]
    },
    {
      label: 'Clasificaciones',
      icon: <Tag className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Clasificaciones', path: '/admin/ageratings', isSubmenu: false },
        { label: 'Agregar Clasificación', path: '/admin/ageratings/new', isSubmenu: false },
      ]
    },
    {
      label: 'Géneros',
      icon: <List className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Géneros', path: '/admin/genres', isSubmenu: false },
        { label: 'Agregar Género', path: '/admin/genres/new', isSubmenu: false },
      ]
    },

    // --- Grupo 2: Operaciones y Sala ---
    { label: 'Operaciones y Sala', isHeader: true }, // ✅ MOVIDO AQUÍ y cambiado a singular
    { 
      label: 'Horarios', 
      icon: <Clock className="w-5 h-5" />, 
      isSubmenu: true,
      subItems: [
        { label: 'Ver Horarios', path: '/admin/schedules', isSubmenu: false }, 
        { label: 'Nueva Función', path: '/admin/schedules/new', isSubmenu: false }, 
      ]
    },
    { 
      label: 'Salas', 
      icon: <DoorOpen className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Salas', path: '/admin/rooms', isSubmenu: false }, 
        { label: 'Crear Sala', path: '/admin/rooms/new', isSubmenu: false }, 
      ]
    },
    { 
      label: 'Asientos (Catálogo)', 
      icon: <Armchair className="w-5 h-5" />, 
      isSubmenu: true,
      subItems: [
        { label: 'Ver Asientos', path: '/admin/seats', isSubmenu: false }, 
        { label: 'Crear Asiento', path: '/admin/seats/new', isSubmenu: false }, 
      ]
    },

    // --- Grupo 3: Inventario (Dulcería) ---
    { label: 'Inventario (Dulcería)', isHeader: true }, // ✅ MOVIDO AQUÍ
    {
      label: 'Categorías',
      icon: <List className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Categorías', path: '/admin/categories', isSubmenu: false },
        { label: 'Agregar Categoría', path: '/admin/categories/new', isSubmenu: false },
      ]
    },
    {
      label: 'Tamaños',
      icon: <Ruler className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Tamaños', path: '/admin/sizes', isSubmenu: false },
        { label: 'Agregar Tamaño', path: '/admin/sizes/new', isSubmenu: false },
      ]
    },
    {
      label: 'Proveedores',
      icon: <Truck className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Proveedores', path: '/admin/suppliers', isSubmenu: false },
        { label: 'Agregar Proveedor', path: '/admin/suppliers/new', isSubmenu: false },
      ]
    },
    {
      label: 'Productos',
      icon: <Package className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
          { label: 'Ver Productos', path: '/admin/products', isSubmenu: false },
          { label: 'Agregar Producto', path: '/admin/products/new', isSubmenu: false },
      ]
    },
    { label: 'Inventario', path: '/admin/inventory', icon: <PackageSearch className="w-5 h-5" />, isSubmenu: false },

    // --- Grupo 4: Personal y Acceso ---
    { label: 'Personal y Acceso', isHeader: true }, // ✅ MOVIDO AL FINAL
    {
      label: 'Roles de Acceso',
      icon: <Shield className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Roles', path: '/admin/roles', isSubmenu: false },
        { label: 'Crear Rol', path: '/admin/roles/new', isSubmenu: false },
      ]
    },
    {
      label: 'Cuentas de Usuario',
      icon: <Users className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Usuarios', path: '/admin/users', isSubmenu: false },
        { label: 'Crear Usuario', path: '/admin/users/new', isSubmenu: false },
      ]
    },
    { 
      label: 'Empleados', 
      icon: <Briefcase className="w-5 h-5" />,
      isSubmenu: true,
      subItems: [
        { label: 'Ver Empleados', path: '/admin/employees', isSubmenu: false }, 
        { label: 'Crear Empleado', path: '/admin/employees/new', isSubmenu: false }, 
      ]
    },
  ];

  const navItems = isAdminRoute ? adminNav : generalNav;

  return (
    <>
      {isAdminRoute && (
        <div className="hidden lg:block w-64 bg-gray-900 border-r border-gray-800 fixed top-16 bottom-0 left-0 z-30 p-6 overflow-y-auto">
          {renderNav(false)}
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} 
            className="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 shadow-xl lg:hidden overflow-y-auto"
          >
            <div className="p-6 pt-20"> 
              <h2 className="text-xl font-bold text-blue-500 mb-6">
                {isAdminRoute ? 'Menú Administración' : 'Menú Principal'}
              </h2>
              {renderNav(true)} 
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;