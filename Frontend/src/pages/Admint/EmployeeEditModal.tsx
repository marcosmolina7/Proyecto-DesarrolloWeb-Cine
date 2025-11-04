// src/pages/Admint/EmployeeEditModal.tsx
// CORREGIDO: Sincronizado con schema.prisma

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertTriangle, CheckCircle, Calendar, Phone, User as UserIcon, Shield } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
// Estos tipos son para mostrar la información incluida del usuario
interface Role { idRole: number; nameRole: string; }
interface User { idUser: number; nameUser: string; role?: Role; }
// Esta es la interfaz principal del empleado, tal como viene de la lista
interface Employee {
  idEmployee: number;
  namesEmployee: string;
  lastNamesEmployee: string;
  phoneEmployee: string;
  birthdayEmployee: string; // ISO String
  stateEmployee: boolean;
  idUser: number;
  user?: User; // Incluido
}
interface EmployeeEditModalProps {
  employee: Employee;
  onClose: () => void;
  onUpdateSuccess: () => void;
}
// Formato para el <input type="date">
const formatISOToInputDate = (isoString: string) => {
    if (!isoString) return '';
    return isoString.split('T')[0];
};

// --- COMPONENTE ---
const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({ employee, onClose, onUpdateSuccess }) => {
  // 1. Estado del formulario solo con campos editables
  const [formData, setFormData] = useState({
      namesEmployee: employee.namesEmployee,
      lastNamesEmployee: employee.lastNamesEmployee,
      phoneEmployee: employee.phoneEmployee,
      birthdayEmployee: formatISOToInputDate(employee.birthdayEmployee),
      stateEmployee: employee.stateEmployee
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sincronizar formulario si el prop 'employee' cambia
  useEffect(() => {
    setFormData({
      namesEmployee: employee.namesEmployee,
      lastNamesEmployee: employee.lastNamesEmployee,
      phoneEmployee: employee.phoneEmployee,
      birthdayEmployee: formatISOToInputDate(employee.birthdayEmployee),
      stateEmployee: employee.stateEmployee
    });
    setError(null);
    setIsSuccess(false);
  }, [employee]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ 
      ...prev, 
      [name]: inputValue
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // 2. Payload con los campos del schema de Employee
    const payload = {
        ...formData,
        birthdayEmployee: new Date(formData.birthdayEmployee).toISOString()
    };
    
    // Validar si hubo cambios reales
    const originalBirthday = formatISOToInputDate(employee.birthdayEmployee);
    if (payload.namesEmployee === employee.namesEmployee &&
        payload.lastNamesEmployee === employee.lastNamesEmployee &&
        payload.phoneEmployee === employee.phoneEmployee &&
        formData.birthdayEmployee === originalBirthday && // Comparamos el formato del input
        payload.stateEmployee === employee.stateEmployee) {
       setError("No hay cambios para guardar.");
       return;
    }


    setIsLoading(true);
    try {
      // 3. Tu backend NO debe permitir cambiar idUser
      // El DTO de UpdateEmployee no debe incluir idUser, solo los campos de Employee
      await axios.put(`${API_URL}/employee/${employee.idEmployee}`, payload);
      setIsSuccess(true);
    } catch (err) {
      let errorMsg = "Error al actualizar.";
      if (isAxiosError(err) && err.response?.data.message) {
        errorMsg = err.response.data.message;
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
          <h2 className="text-2xl font-bold text-white">Editar Empleado: {employee.namesEmployee}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={isLoading}><X /></button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl text-white">¡Actualización Exitosa!</h3>
            <button onClick={handleSuccessClose} className="mt-4 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && <div className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></div>}
            
            {/* Campos informativos (no editables) */}
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400">Cuenta Vinculada</p>
                <p className="text-sm text-white flex items-center"><UserIcon className="w-4 h-4 mr-2" />{employee.user?.nameUser}</p>
                <p className="text-sm text-yellow-400 flex items-center mt-1"><Shield className="w-4 h-4 mr-2" />{employee.user?.role?.nameRole}</p>
                <p className="text-xs text-gray-500 mt-2">Para cambiar el rol o el nombre de usuario, edite la 'Cuenta de Usuario' (ID: {employee.idUser}).</p>
            </div>

            {/* 4. Formulario actualizado */}
            <div>
              <label htmlFor="namesEmployee" className="block text-sm font-medium text-gray-400 mb-2">Nombres</label>
              <input type="text" id="namesEmployee" name="namesEmployee" value={formData.namesEmployee} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
            </div>
            <div>
              <label htmlFor="lastNamesEmployee" className="block text-sm font-medium text-gray-400 mb-2">Apellidos</label>
              <input type="text" id="lastNamesEmployee" name="lastNamesEmployee" value={formData.lastNamesEmployee} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
            </div>
            <div>
              <label htmlFor="phoneEmployee" className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
              <input type="tel" id="phoneEmployee" name="phoneEmployee" value={formData.phoneEmployee} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
            </div>
            <div>
              <label htmlFor="birthdayEmployee" className="block text-sm font-medium text-gray-400 mb-2">Fecha de Nacimiento</label>

              <input type="date" id="birthdayEmployee" name="birthdayEmployee" value={formData.birthdayEmployee} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
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

export default EmployeeEditModal;