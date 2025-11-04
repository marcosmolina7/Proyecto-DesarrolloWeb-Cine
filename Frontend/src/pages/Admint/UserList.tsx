// src/pages/Admint/UserList.tsx
// CORREGIDO: Sincronizado con schema.prisma (idUser, nameUser, idRole).
// ELIMINADO: emailUser que ya no existe en el modelo User.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Users, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search, Shield, User as UserIcon } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import UserEditModal from './UserEditModal'; 

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Role {
  idRole: number;
  nameRole: string;
}
// 1. CORRECCIÓN: Interfaz actualizada al schema.prisma
interface User {
  idUser: number;
  nameUser: string; // Este es el campo único de login
  idRole: number;
  role?: Role; // Asumiendo que el backend hace un 'include' de Role
}

// --- ANIMACIONES ---
const containerVariants: Variants = { /* ... (igual que en los otros list) ... */ };
const itemVariants: Variants = { /* ... (igual que en los otros list) ... */ };

// --- COMPONENTE PRINCIPAL ---
const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Para el modal de borrado
  const [userToDelete, setUserToDelete] = useState<User | null>(null); // Para el modal de borrado
  const [isDeleting, setIsDeleting] = useState(false); // Para el modal de borrado

  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    try {
      // 2. CORRECCIÓN: Endpoint singular
      const response = await axios.get<User[]>(`${API_URL}/user`); 
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('No se pudieron cargar los usuarios. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerCaseSearch = searchTerm.toLowerCase();
    // 3. CORRECCIÓN: Filtrar por nameUser y role
    return users.filter(user => 
      user.nameUser.toLowerCase().includes(lowerCaseSearch) ||
      (user.role && user.role.nameRole.toLowerCase().includes(lowerCaseSearch))
    );
  }, [users, searchTerm]);

  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
  };
  const handleEditModalClose = () => {
    setSelectedUser(null);
  };
  const handleUserUpdated = () => {
    handleEditModalClose(); 
    fetchUsers(); 
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setError(null);
    setDeleteSuccess(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      // 4. CORRECCIÓN: Endpoint singular y idUser
      await axios.delete(`${API_URL}/user/${userToDelete.idUser}`);
      setDeleteSuccess(`Usuario "${userToDelete.nameUser}" eliminado.`);
      fetchUsers();
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      let errorMsg = "Error al eliminar.";
      if (isAxiosError(err) && err.response?.status === 409) {
        errorMsg = "No se puede eliminar. Este usuario está asignado como empleado.";
      } else if (isAxiosError(err) && err.response?.data.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg); // Mostrar error en el modal de borrado
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    // ... (Lógica de 'No hay usuarios' y 'No hay resultados' sin cambios) ...
    if (filteredUsers.length === 0) {
      // ...
    }

    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <motion.div key={user.idUser} variants={itemVariants} className="bg-gray-700 rounded-xl p-5 border border-gray-600 flex flex-col justify-between">
              <div>
                {/* 5. CORRECCIÓN: Mostrar nameUser (el login) */}
                <h3 className="text-xl font-bold text-white mb-1 flex items-center"><UserIcon className="w-5 h-5 mr-2" />{user.nameUser}</h3>
                <span className="flex items-center text-xs text-yellow-400 bg-gray-600 px-2 py-1 rounded-full w-fit">
                  <Shield className="w-4 h-4 mr-1" />{user.role?.nameRole || `Rol ID: ${user.idRole}`}
                </span>
                <p className="text-xs text-gray-400 mt-2">ID: {user.idUser}</p>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => handleEditClick(user)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-5 h-5" /></button>
                <button onClick={() => handleDeleteClick(user)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
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
        <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Users className="w-8 h-8 mr-3 text-blue-400" />Gestión de Cuentas de Usuario</h1>
            <p className="text-gray-400">Crea y administra las cuentas de acceso (login/contraseña) del personal.</p>
          </div>
          <Link to="/admin/users/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nuevo Usuario</span>
          </Link>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de usuario o rol..."
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
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando usuarios...</div>
        ) : error && !isDeleteModalOpen ? ( // Solo mostrar error general si el modal de borrado no está abierto
          <div className="bg-red-800 p-4 rounded-lg text-red-100"><AlertTriangle className="w-6 h-6 inline mr-2" />{error}</div>
        ) : (
          renderContent()
        )}
      </motion.div>

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={handleEditModalClose}
          onUpdateSuccess={handleUserUpdated}
        />
      )}
      
      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {isDeleteModalOpen && userToDelete && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 p-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center"><AlertTriangle className="w-6 h-6 mr-2" />Confirmar Eliminación</h2>
              <p className="text-gray-300 mb-6">¿Estás seguro de que deseas eliminar al usuario: <span className="font-semibold text-white">"{userToDelete.nameUser}"</span>? Esta acción es irreversible.</p>
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

export default UserList;