// src/pages/Admint/EmployeeForm.tsx
// CORREGIDO: Sincronizado con schema.prisma (names, lastNames, phone, birthday, state, idUser)

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, Briefcase, User, Phone, Cake } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
interface User { idUser: number; nameUser: string; } // Para la lista desplegable
// 1. CORRECCIÓN: Interfaz del formulario
interface EmployeeFormData {
  namesEmployee: string;
  lastNamesEmployee: string;
  phoneEmployee: string;
  birthdayEmployee: string; // Fecha de nacimiento
  stateEmployee: boolean;
  idUser: number | '';
}
const initialFormData: EmployeeFormData = {
  namesEmployee: '',
  lastNamesEmployee: '',
  phoneEmployee: '',
  birthdayEmployee: '',
  stateEmployee: true, // Activo por defecto
  idUser: '',
};

// --- COMPONENTE ---
const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [users, setUsers] = useState<User[]>([]); // Usuarios para seleccionar
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Cargar Usuarios (para el select) ---
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        // 2. CORRECCIÓN: Cargar solo usuarios
        // Idealmente, tu backend debería filtrar usuarios que ya son empleados
        const userRes = await axios.get<User[]>(`${API_URL}/user`);
        setUsers(userRes.data);
      } catch (err) {
        setError("Error al cargar Cuentas de Usuario.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // 3. CORRECCIÓN: Manejar checkbox
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'idUser') ? (value ? Number(value) : '') : inputValue
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // 4. CORRECCIÓN: Validar campos nuevos
    if (!formData.idUser || !formData.namesEmployee || !formData.lastNamesEmployee || !formData.phoneEmployee || !formData.birthdayEmployee) {
      setError("Todos los campos (excepto estado) son obligatorios.");
      setIsSaving(false);
      return;
    }

    try {
      // 5. CORRECCIÓN: Enviar payload completo
      const payload = {
          ...formData,
          birthdayEmployee: new Date(formData.birthdayEmployee).toISOString(),
      };
      await axios.post(`${API_URL}/employee`, payload); 
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/employees'), 1500);
    } catch (err) {
      let errorMsg = "Error al crear el empleado.";
      if (isAxiosError(err) && err.response?.data.message) {
         // Ej: "User with id is X is already an employee."
        if (err.response.data.message.includes('unique constraint') || err.response.data.message.includes('Unique constraint failed')) {
            errorMsg = "La cuenta de usuario seleccionada ya está asignada a otro empleado.";
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
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Briefcase className="w-8 h-8 mr-3 text-orange-400" />Registrar Nuevo Empleado</h1>
        <p className="text-gray-400 mb-6">Completa los datos personales y vincula una cuenta de usuario.</p>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Empleado Registrado!</h2>
                <p className="text-gray-300">Redirigiendo a la lista...</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></motion.div>
                  )}
                </AnimatePresence>
                
                {isLoadingData ? (
                  <div className="text-gray-400 text-center">Cargando datos...</div>
                ) : (
                  <>
                    {/* 6. CORRECCIÓN: Campos del formulario actualizados */}
                    <div>
                      <label htmlFor="idUser" className="block text-sm font-medium text-gray-400 mb-2">Cuenta de Usuario (Login)</label>
                      <select id="idUser" name="idUser" value={formData.idUser} onChange={handleChange} disabled={isSaving || users.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 appearance-none" required>
                        <option value="" disabled>Seleccione un usuario...</option>
                        {users.map(user => <option key={user.idUser} value={user.idUser}>{user.nameUser}</option>)}
                      </select>
                      {users.length === 0 && !isLoadingData && <p className="text-xs text-yellow-500 mt-1">No hay usuarios. Debe crear una cuenta primero.</p>}
                    </div>

                    <div>
                      <label htmlFor="namesEmployee" className="block text-sm font-medium text-gray-400 mb-2">Nombres</label>
                      <input type="text" id="namesEmployee" name="namesEmployee" value={formData.namesEmployee} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                    </div>
                    
                    <div>
                      <label htmlFor="lastNamesEmployee" className="block text-sm font-medium text-gray-400 mb-2">Apellidos</label>
                      <input type="text" id="lastNamesEmployee" name="lastNamesEmployee" value={formData.lastNamesEmployee} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                    </div>

                    <div>
                      <label htmlFor="phoneEmployee" className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                      <input type="tel" id="phoneEmployee" name="phoneEmployee" value={formData.phoneEmployee} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                    </div>

                    <div>
                      <label htmlFor="birthdayEmployee" className="block text-sm font-medium text-gray-400 mb-2">Fecha de Nacimiento</label>
                      <input type="date" id="birthdayEmployee" name="birthdayEmployee" value={formData.birthdayEmployee} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="stateEmployee"
                          name="stateEmployee"
                          checked={formData.stateEmployee}
                          onChange={handleChange} 
                          className="h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="stateEmployee" className="text-gray-300 font-semibold">
                          Empleado Activo
                        </label>
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <button type="submit" disabled={isSaving || isLoadingData} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500">
                    {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 rounded-full"></span> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Registrando...' : 'Registrar Empleado'}</span>
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

export default EmployeeForm;