// src/pages/Admint/SeatEditModal.tsx
// CORREGIDO: Manejo de errores de actualización y endpoint singular

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

interface Seat {
  idSeat: number;
  rowSeat: string;
  columnSeat: number;
}
interface SeatFormData {
  rowSeat: string;
  columnSeat: number | '';
}
interface SeatEditModalProps {
  seat: Seat;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const SeatEditModal: React.FC<SeatEditModalProps> = ({ seat, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<SeatFormData>({ rowSeat: seat.rowSeat, columnSeat: seat.columnSeat });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setFormData({ rowSeat: seat.rowSeat, columnSeat: seat.columnSeat });
    setError(null);
    setIsSuccess(false);
  }, [seat]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(null);

    // 1. CORRECCIÓN: Asegura que la fila sea mayúscula y la columna sea número
    setFormData(prev => ({ 
        ...prev, 
        [name]: (name === 'columnSeat') ? (value === '' ? '' : Number(value)) : value.toUpperCase() 
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      rowSeat: formData.rowSeat.trim().toUpperCase(),
      columnSeat: Number(formData.columnSeat)
    };
    
    // 2. Validación de cambios
    if (payload.rowSeat === seat.rowSeat && payload.columnSeat === seat.columnSeat) {
      setError("No hay cambios para guardar.");
      return;
    }

    setIsLoading(true);
    try {
      // 3. CORRECCIÓN: Endpoint singular
      await axios.put(`${API_URL}/seat/${seat.idSeat}`, payload);
      setIsSuccess(true);
    } catch (err) {
      let errorMsg = "Error al actualizar.";
      if (isAxiosError(err) && err.response?.data.message) {
        // 4. CORRECCIÓN: Manejo de error de unicidad
        if (err.response.data.message.includes('unique constraint') || err.response.data.message.includes('Unique constraint failed')) {
            errorMsg = "El asiento con esa Fila y Columna ya existe en el catálogo.";
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
          <h2 className="text-2xl font-bold text-white">Editar Asiento: {seat.rowSeat}{seat.columnSeat}</h2>
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
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="rowSeat" className="block text-sm font-medium text-gray-400 mb-2">Fila (Letra)</label>
                <input
                  type="text"
                  id="rowSeat"
                  name="rowSeat"
                  value={formData.rowSeat}
                  onChange={handleChange}
                  maxLength={2}
                  disabled={isLoading}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="columnSeat" className="block text-sm font-medium text-gray-400 mb-2">Columna (Número)</label>
                <input
                  type="number"
                  id="columnSeat"
                  name="columnSeat"
                  value={formData.columnSeat}
                  min="1"
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                  required
                />
              </div>
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

export default SeatEditModal;