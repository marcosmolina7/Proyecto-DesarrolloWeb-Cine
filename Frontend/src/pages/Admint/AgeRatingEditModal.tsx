// src/pages/Admint/AgeRatingEditModal.tsx

import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface AgeRating {
  idAgeRating: number; 
  nameAgeRating: string; // Ejemplo: 'PG-13'
  descAgeRating: string; // Ejemplo: 'Recomendada para mayores de 13 años...'
}

interface AgeRatingEditModalProps {
  rating: AgeRating; 
  onClose: () => void;
  onUpdateSuccess: () => void; // Función para recargar la lista
}

// Variante de animación para el modal de éxito (escalado suave)
const successModalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

// --- COMPONENTE MODAL ---
const AgeRatingEditModal: React.FC<AgeRatingEditModalProps> = ({ rating, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState<AgeRating>({ ...rating });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Guardamos el estado original para la comparación de cambios
  const originalRating = rating;

  useEffect(() => {
    // Resetear formulario y estado al cambiar la prop 'rating'
    setFormData({ ...rating });
    setError(null);
    setIsSuccess(false); 
  }, [rating]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setIsSuccess(false);
  };
  
  const handleSuccessClose = () => {
      onUpdateSuccess(); // 1. Recarga la lista
      onClose();       // 2. Cierra la modal
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    const name = formData.nameAgeRating.trim();
    const description = formData.descAgeRating.trim();

    if (!name || !description) {
      setError("El nombre y la descripción no pueden estar vacíos.");
      return;
    }

    // ⬅️ Chequear si hubo cambios reales (comparando con el estado original)
    if (name === originalRating.nameAgeRating.trim() && description === originalRating.descAgeRating.trim()) {
        setError("No hay cambios para guardar.");
        return;
    }

    setIsLoading(true);

    try {
      // Endpoint: /age-rating/:id (PUT)
      await axios.put(`${API_URL}/age-rating/${rating.idAgeRating}`, {
        nameAgeRating: name,
        descAgeRating: description,
      });

      setIsSuccess(true);
      
    } catch (err) {
      console.error('Error al actualizar clasificación:', err);
      let errorMsg = "Ocurrió un error al contactar al servidor.";

      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as { message?: string };
        
        // Manejo de error específico (ej: nombre o descripción ya existe)
        if (errorData.message && errorData.message.includes('unique constraint')) {
            errorMsg = "Ya existe otra clasificación con ese nombre o descripción.";
        } else {
            errorMsg = errorData.message || `Error del servidor (Código: ${err.response.status})`;
        }
      }

      setError(errorMsg);

    } finally {
      setIsLoading(false);
    }
  };
  

  // ⬅️ Renderizado de la Pantalla de Éxito
  if (isSuccess) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <motion.div
                key="success-modal"
                variants={successModalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gray-800 rounded-lg p-8 w-full max-w-sm border border-green-600 shadow-2xl relative text-center"
            >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Actualización Exitosa!</h2>
                <p className="text-gray-300 mb-6">La clasificación {formData.nameAgeRating} ha sido actualizada correctamente.</p>
                <button
                    onClick={handleSuccessClose} 
                    className="w-full px-4 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-150"
                >
                    Cerrar
                </button>
            </motion.div>
        </div>
    );
  }


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full border border-gray-700"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Editar Clasificación: {rating.nameAgeRating}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition" disabled={isLoading}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Mensaje de Error */}
          <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-lg text-sm flex items-center space-x-2"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Campo de Nombre */}
          <div>
            <label htmlFor="nameAgeRating" className="block text-sm font-medium text-gray-400 mb-2">
              Nombre de la Clasificación (Ej: 'PG-13')
            </label>
            <input
              type="text"
              id="nameAgeRating"
              name="nameAgeRating"
              value={formData.nameAgeRating}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150 disabled:opacity-50"
              required
            />
          </div>
          
          {/* Campo de Descripción */}
          <div>
            <label htmlFor="descAgeRating" className="block text-sm font-medium text-gray-400 mb-2">
              Descripción
            </label>
            <textarea
              id="descAgeRating"
              name="descAgeRating"
              value={formData.descAgeRating}
              onChange={handleChange}
              rows={3}
              disabled={isLoading}
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150 disabled:opacity-50 resize-none"
              required
            />
          </div>


          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition duration-150 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-5 py-2 rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AgeRatingEditModal;