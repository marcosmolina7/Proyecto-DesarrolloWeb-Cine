// src/pages/Admint/UserEditModal.tsx
// CORREGIDO: Sincronizado con schema.prisma (nameUser, idRole).
// ELIMINADO: emailUser.

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
interface Role { idRole: number; nameRole: string; }
// 1. CORRECCIÓN: Interfaz actualizada
interface User {
  idUser: number;
  nameUser: string;
  idRole: number;
}
interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

// --- COMPONENTE ---
const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onUpdateSuccess }) => {
  // 2. CORRECCIÓN: Estado del formulario
  const [formData, setFormData] = useState({ 
      nameUser: user.nameUser, 
      idRole: user.idRole 
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Cargar Roles ---
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get<Role[]>(`${API_URL}/role`); // Endpoint singular
        setRoles(res.data);
      } catch (err) {
        setError("Error al cargar roles.");
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    // 3. CORRECCIÓN: Resetear estado
    setFormData({ nameUser: user.nameUser, idRole: user.idRole });
    setError(null);
    setIsSuccess(false);
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'idRole' ? Number(value) : value
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // 4. CORRECCIÓN: Enviar solo los campos del schema
    const dataToUpdate = {
        nameUser: formData.nameUser,
        idRole: formData.idRole
    };
    
    // Validar si hubo cambios
    if (dataToUpdate.nameUser === user.nameUser && dataToUpdate.idRole === user.idRole) {
        setError("No hay cambios para guardar.");
        return;
    }

    setIsLoading(true);
    try {
      // 5. CORRECCIÓN: Endpoint singular y idUser
      await axios.put(`${API_URL}/user/${user.idUser}`, dataToUpdate);
      setIsSuccess(true);
    } catch (err) {
      let errorMsg = "Error al actualizar.";
      if (isAxiosError(err) && err.response?.data.message) {
        if (err.response.data.message.includes('unique constraint') || err.response.data.message.includes('Unique constraint failed')) {
            errorMsg = "Ese nombre de usuario ya existe.";
        } else {
            errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSuccessClose = () => {
    onUpdateSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Editar Usuario: {user.nameUser}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={isLoading}><X /></button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl text-white">¡Actualización Exitosa!</h3>
            <button onClick={handleSuccessClose} className="mt-4 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></div>}
            
            {/* 6. CORRECCIÓN: Campos del formulario */}
            <div>
              <label htmlFor="nameUser" className="block text-sm font-medium text-gray-400 mb-2">Nombre de Usuario (Login)</label>
              <input type="text" id="nameUser" name="nameUser" value={formData.nameUser} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
            </div>
            
            <div>
              <label htmlFor="idRole" className="block text-sm font-medium text-gray-400 mb-2">Rol del Usuario</label>
              <select id="idRole" name="idRole" value={formData.idRole} onChange={handleChange} disabled={isLoading || roles.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required>
                <option value="" disabled>Seleccione un rol...</option>
                {roles.map(role => <option key={role.idRole} value={role.idRole}>{role.nameRole}</option>)}
              </select>
            </div>
            
            <p className="text-xs text-gray-500">La contraseña solo puede ser cambiada por el usuario o un administrador en un módulo separado.</p>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">Cancelar</button>
              <button type="submit" disabled={isLoading} className="flex items-center space-x-2 px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800">
                {isLoading ? <span className="animate-spin h-5 w-5 border-t-2 rounded-full"></span> : <Save />}
                <span>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default UserEditModal;