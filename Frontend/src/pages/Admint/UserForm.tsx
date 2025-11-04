// src/pages/Admint/UserForm.tsx
// CORREGIDO: Sincronizado con schema.prisma (nameUser, passUser, idRole).
// ELIMINADO: emailUser que ya no existe.

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, User as UserIcon, Lock, Shield } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
interface Role {
  idRole: number;
  nameRole: string;
}
// 1. CORRECCIÓN: Interfaz actualizada al schema
interface UserFormData {
  nameUser: string;
  passUser: string;
  idRole: number | '';
}
const initialFormData: UserFormData = {
  nameUser: '',
  passUser: '',
  idRole: '',
};

// --- COMPONENTE ---
const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [roles, setRoles] = useState<Role[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Cargar Roles ---
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const res = await axios.get<Role[]>(`${API_URL}/role`); // Endpoint singular
        setRoles(res.data);
      } catch (err) {
        setError("Error al cargar los roles. No se puede crear un usuario.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'idRole' ? (value ? Number(value) : '') : value
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // 2. CORRECCIÓN: Validar campos correctos
    if (!formData.nameUser || !formData.passUser || !formData.idRole) {
      setError("Todos los campos son obligatorios.");
      setIsSaving(false);
      return;
    }

    try {
      // 3. CORRECCIÓN: Enviar payload correcto y a endpoint singular
      await axios.post(`${API_URL}/user`, {
          nameUser: formData.nameUser,
          passUser: formData.passUser,
          idRole: formData.idRole
      }); 
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      let errorMsg = "Error al crear el usuario.";
      if (isAxiosError(err) && err.response?.data.message) {
        // Capturar error de 'nameUser' duplicado
        if (err.response.data.message.includes('unique constraint') || err.response.data.message.includes('Unique constraint failed')) {
            errorMsg = "Ese nombre de usuario ya existe. Pruebe con uno diferente.";
        } else {
            errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8 px-4"> 
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><UserIcon className="w-8 h-8 mr-3 text-blue-400" />Agregar Nuevo Usuario</h1>
        <p className="text-gray-400 mb-6">Complete la información de la nueva cuenta de acceso.</p>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Usuario Creado!</h2>
                <p className="text-gray-300">Redirigiendo a la lista...</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></motion.div>
                  )}
                </AnimatePresence>
                
                {isLoadingData ? (
                  <div className="text-gray-400 text-center">Cargando roles...</div>
                ) : (
                  <>
                    {/* 4. CORRECCIÓN: Formulario actualizado */}
                    <div>
                      <label htmlFor="nameUser" className="block text-sm font-medium text-gray-400 mb-2">Nombre de Usuario (para login)</label>
                      <input 
                        type="text" 
                        id="nameUser" 
                        name="nameUser" 
                        value={formData.nameUser} 
                        onChange={handleChange} 
                        disabled={isSaving} 
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" 
                        placeholder="Ej: mmolina"
                        required 
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="passUser" className="block text-sm font-medium text-gray-400 mb-2">Contraseña Temporal</label>
                      <input 
                        type="password" 
                        id="passUser" 
                        name="passUser" 
                        value={formData.passUser} 
                        onChange={handleChange} 
                        disabled={isSaving} 
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" 
                        placeholder="••••••••"
                        required 
                      />
                    </div>

                    <div>
                      <label htmlFor="idRole" className="block text-sm font-medium text-gray-400 mb-2">Rol del Usuario</label>
                      <select id="idRole" name="idRole" value={formData.idRole} onChange={handleChange} disabled={isSaving || roles.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 appearance-none" required>
                        <option value="" disabled>Seleccione un rol...</option>
                        {roles.map(role => <option key={role.idRole} value={role.idRole}>{role.nameRole}</option>)}
                      </select>
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <button type="submit" disabled={isSaving || isLoadingData} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500">
                    {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 rounded-full"></span> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Creando...' : 'Crear Usuario'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default UserForm;