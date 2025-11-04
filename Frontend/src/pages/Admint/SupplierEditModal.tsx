// src/pages/Admint/SupplierEditModal.tsx
// CORREGIDO: Sincronizado con schema.prisma

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
// 1. CORRECCIÓN: Interfaz completa
interface Supplier {
  idSupplier: number;
  nameSupplier: string;
  contactPersonSupplier: string;
  phoneSupplier: string;
  emailSupplier: string;
  addressSupplier: string | null;
}
interface SupplierEditModalProps {
  supplier: Supplier;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

// --- COMPONENTE ---
const SupplierEditModal: React.FC<SupplierEditModalProps> = ({ supplier, onClose, onUpdateSuccess }) => {
  // 2. CORRECCIÓN: Estado del formulario
  const [formData, setFormData] = useState({
      nameSupplier: supplier.nameSupplier,
      contactPersonSupplier: supplier.contactPersonSupplier,
      phoneSupplier: supplier.phoneSupplier,
      emailSupplier: supplier.emailSupplier,
      addressSupplier: supplier.addressSupplier || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      nameSupplier: supplier.nameSupplier,
      contactPersonSupplier: supplier.contactPersonSupplier,
      phoneSupplier: supplier.phoneSupplier,
      emailSupplier: supplier.emailSupplier,
      addressSupplier: supplier.addressSupplier || ''
    });
    setError(null);
    setIsSuccess(false);
  }, [supplier]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
        ...formData,
        addressSupplier: formData.addressSupplier || null
    };
    
    // Validar si hubo cambios
    const hasChanged = Object.keys(payload).some(key => {
        const formValue = payload[key as keyof typeof payload];
        const propValue = supplier[key as keyof typeof supplier] || null; // Normalizar null/undefined
        return String(formValue || null) !== String(propValue || null);
    });

    if (!hasChanged) {
        setError("No hay cambios para guardar.");
        return;
    }

    setIsLoading(true);
    try {
      // 3. CORRECCIÓN: Endpoint singular y idSupplier
      await axios.put(`${API_URL}/supplier/${supplier.idSupplier}`, payload);
      setIsSuccess(true);
    } catch (err) {
      let errorMsg = "Error al actualizar.";
      if (isAxiosError(err) && err.response?.data.message) {
        if (err.response.data.message.includes('unique constraint') || err.response.data.message.includes('Unique constraint failed')) {
            errorMsg = "El Nombre o Email de este proveedor ya existen.";
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
          <h2 className="text-2xl font-bold text-white">Editar Proveedor: {supplier.nameSupplier}</h2>
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
            
            {/* 4. CORRECCIÓN: Formulario actualizado */}
            <div>
              <label htmlFor="nameSupplier" className="block text-sm font-medium text-gray-400 mb-2">Nombre Proveedor</label>
              <input type="text" id="nameSupplier" name="nameSupplier" value={formData.nameSupplier} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
            </div>
            <div>
              <label htmlFor="contactPersonSupplier" className="block text-sm font-medium text-gray-400 mb-2">Persona de Contacto</label>
              <input type="text" id="contactPersonSupplier" name="contactPersonSupplier" value={formData.contactPersonSupplier} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="phoneSupplier" className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                <input type="tel" id="phoneSupplier" name="phoneSupplier" value={formData.phoneSupplier} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
              </div>
              <div className="flex-1">
                <label htmlFor="emailSupplier" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input type="email" id="emailSupplier" name="emailSupplier" value={formData.emailSupplier} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
              </div>
            </div>
            <div>
              <label htmlFor="addressSupplier" className="block text-sm font-medium text-gray-400 mb-2">Dirección (Opcional)</label>
              <textarea id="addressSupplier" name="addressSupplier" value={formData.addressSupplier} onChange={handleChange} rows={2} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 resize-none" />
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

export default SupplierEditModal;