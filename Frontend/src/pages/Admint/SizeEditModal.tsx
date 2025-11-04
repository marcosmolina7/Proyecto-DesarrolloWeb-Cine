// src/pages/Admint/SizeEditModal.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

interface Size {
  idSize: number;
  nameSize: string;
}

interface SizeEditModalProps {
  size: Size;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const SizeEditModal: React.FC<SizeEditModalProps> = ({ size, onClose, onUpdateSuccess }) => {
  const [nameSize, setNameSize] = useState(size.nameSize);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setNameSize(size.nameSize);
    setError(null);
    setIsSuccess(false);
  }, [size]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = nameSize.trim();
    if (name === size.nameSize.trim()) {
      setError("No hay cambios para guardar.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(`${API_URL}/size/${size.idSize}`, { nameSize: name }); // Endpoint correcto
      setIsSuccess(true);
    } catch (err) {
      let errorMsg = "Error al actualizar.";
      if (isAxiosError(err) && err.response?.data.message) {
         // Asume mensaje de error claro del backend (ej. conflicto)
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
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Editar Tamaño: {size.nameSize}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={isLoading}><X /></button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl text-white">¡Actualización Exitosa!</h3>
            <button onClick={handleSuccessClose} className="mt-4 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && <div className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></div>}
            <div>
              <label htmlFor="nameSize" className="block text-sm font-medium text-gray-400 mb-2">Nombre del Tamaño</label>
              <input type="text" id="nameSize" value={nameSize} onChange={(e) => setNameSize(e.target.value)} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500" required />
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

export default SizeEditModal;