// src/pages/Admint/EmployeeList.tsx
// CORREGIDO: Sincronizado con el nuevo schema.prisma
// Muestra 'namesEmployee', 'phoneEmployee', 'stateEmployee'
// Obtiene el Rol desde la relación user.role

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Briefcase, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search, User, Mail, Shield, Phone, Cake, Check, XCircle } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import EmployeeEditModal from './EmployeeEditModal'; // Crearemos la versión corregida

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

// 1. CORRECCIÓN: Interfaces actualizadas al schema.prisma
interface Role { idRole: number; nameRole: string; }
interface User { idUser: number; nameUser: string; role?: Role; } // User ahora incluye Role
interface Employee {
  idEmployee: number;
  namesEmployee: string;
  lastNamesEmployee: string;
  phoneEmployee: string;
  birthdayEmployee: string; // Recibido como ISO string
  stateEmployee: boolean;
  idUser: number;
  user?: User; // Incluido desde Prisma
  // idRole ya no está en Employee
}

// --- ANIMACIONES ---
const containerVariants: Variants = { /* ... (sin cambios) ... */ };
const itemVariants: Variants = { /* ... (sin cambios) ... */ };

// --- COMPONENTE PRINCIPAL ---
const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    try {
      // 2. CORRECCIÓN: El backend DEBE hacer include de 'user' y 'role'
      // (ej. prisma.employee.findMany({ include: { user: { include: { role: true } } } }))
      const response = await axios.get<Employee[]>(`${API_URL}/employee`); 
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('No se pudieron cargar los empleados. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    const lowerCaseSearch = searchTerm.toLowerCase();
    // 3. CORRECCIÓN: Filtrar por los campos nuevos
    return employees.filter(emp => 
      emp.namesEmployee.toLowerCase().includes(lowerCaseSearch) ||
      emp.lastNamesEmployee.toLowerCase().includes(lowerCaseSearch) ||
      emp.phoneEmployee.toLowerCase().includes(lowerCaseSearch) ||
      (emp.user && emp.user.nameUser.toLowerCase().includes(lowerCaseSearch))
    );
  }, [employees, searchTerm]);

  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };
  const handleEditModalClose = () => {
    setSelectedEmployee(null);
  };
  const handleEmployeeUpdated = () => {
    handleEditModalClose(); 
    fetchEmployees(); 
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      await axios.delete(`${API_URL}/employee/${employeeToDelete.idEmployee}`);
      setDeleteSuccess(`Empleado "${employeeToDelete.namesEmployee}" eliminado.`);
      fetchEmployees();
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      let errorMsg = "Error al eliminar.";
      // ... (manejo de errores sin cambios) ...
      setError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatBday = (isoString: string) => {
      return new Date(isoString).toLocaleDateString('es-GT');
  };

  const renderContent = () => {
    // ... (Lógica de 'No hay empleados' y 'No hay resultados' sin cambios) ...
    if (filteredEmployees.length === 0) { /* ... */ }

    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <motion.div key={employee.idEmployee} variants={itemVariants} className="bg-gray-700 rounded-xl p-5 border border-gray-600 flex flex-col justify-between">
              <div>
                {/* 4. CORRECCIÓN: Mostrar datos del empleado */}
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white mb-1">{employee.namesEmployee} {employee.lastNamesEmployee}</h3>
                    {employee.stateEmployee ? (
                        <span className="flex items-center text-xs text-green-300 bg-green-800 px-2 py-1 rounded-full"><Check className="w-4 h-4 mr-1"/> Activo</span>
                    ) : (
                        <span className="flex items-center text-xs text-red-300 bg-red-800 px-2 py-1 rounded-full"><XCircle className="w-4 h-4 mr-1"/> Inactivo</span>
                    )}
                </div>
                <p className="text-sm text-gray-300 mb-2 flex items-center"><Phone className="w-4 h-4 mr-2" />{employee.phoneEmployee}</p>
                <p className="text-sm text-gray-300 mb-2 flex items-center"><Cake className="w-4 h-4 mr-2" />{formatBday(employee.birthdayEmployee)}</p>
                
                {/* Datos del Usuario Vinculado */}
                <div className="mt-2 pt-2 border-t border-gray-600">
                    <p className="text-xs text-gray-400">Cuenta Vinculada:</p>
                    <p className="text-sm text-gray-200 flex items-center"><User className="w-4 h-4 mr-2" />{employee.user?.nameUser || 'N/A'}</p>
                    <span className="flex items-center text-xs text-yellow-400 bg-gray-600 px-2 py-1 rounded-full w-fit mt-1">
                        <Shield className="w-4 h-4 mr-1" />{employee.user?.role?.nameRole || 'Rol no asignado'}
                    </span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => handleEditClick(employee)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-5 h-5" /></button>
                <button onClick={() => handleDeleteClick(employee)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto py-8 px-4">
        {/* ... (Header y Búsqueda sin cambios) ... */}
        <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Briefcase className="w-8 h-8 mr-3 text-orange-400" />Gestión de Empleados</h1>
            <p className="text-gray-400">Administra el personal del cine, asignando roles y usuarios.</p>
          </div>
          <Link to="/admin/employees/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nuevo Empleado</span>
          </Link>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, teléfono o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        <AnimatePresence>
          {deleteSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-green-800 p-4 rounded-lg text-green-100 mb-6 flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" /><span>{deleteSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando empleados...</div>
        ) : error && !isDeleteModalOpen ? (
          <div className="bg-red-800 p-4 rounded-lg text-red-100"><AlertTriangle className="w-6 h-6 inline mr-2" />{error}</div>
        ) : (
          renderContent()
        )}
      </motion.div>

      {selectedEmployee && (
        <EmployeeEditModal
          employee={selectedEmployee}
          onClose={handleEditModalClose}
          onUpdateSuccess={handleEmployeeUpdated}
        />
      )}
      
      {/* ... (Modal de Confirmación de Eliminación sin cambios) ... */}
      <AnimatePresence>
        {isDeleteModalOpen && employeeToDelete && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 p-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center"><AlertTriangle className="w-6 h-6 mr-2" />Confirmar Eliminación</h2>
              <p className="text-gray-300 mb-6">¿Estás seguro de que deseas eliminar al empleado: <span className="font-semibold text-white">"{employeeToDelete.namesEmployee} {employeeToDelete.lastNamesEmployee}"</span>?</p>
              {error && <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-lg text-sm mb-4">{error}</div>}
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50">Cancelar</button>
                <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-500 flex items-center space-x-2">
                  {isDeleting ? <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span> : <Trash2 className="w-5 h-5" />}
                  <span>{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default EmployeeList; // Exportamos como EmployeeList