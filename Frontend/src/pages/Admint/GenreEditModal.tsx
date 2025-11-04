// src/pages/Admint/GenreEditModal.tsx

import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Genre {
  idGenre: number; // Usamos idGenre según tu modelo Prisma
  nameGenre: string;
}

interface GenreEditModalProps {
  genre: Genre; // El género que se está editando
  onClose: () => void;
  onUpdateSuccess: () => void; // Función para recargar la lista de géneros en el padre
}

// Variante de animación para el modal de éxito (escalado suave)
const successModalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

// --- COMPONENTE MODAL ---
const GenreEditModal: React.FC<GenreEditModalProps> = ({ genre, onClose, onUpdateSuccess }) => {
  // Inicializamos formData con una copia de los datos del género
  const [formData, setFormData] = useState<Genre>({ ...genre });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); 

  // Sincronizar el formulario con el género que viene por props
  useEffect(() => {
    setFormData({ ...genre });
    setError(null);
    setIsSuccess(false); // Resetear el estado de éxito si se abre de nuevo
  }, [genre]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Solo permitimos la edición de nameGenre
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setIsSuccess(false);
  };
  
  // Función de cierre que notifica al padre y cierra el modal
  const handleSuccessClose = () => {
      onUpdateSuccess(); // 1. Recarga la lista
      onClose();       // 2. Cierra la modal
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    const genreName = formData.nameGenre.trim();

    if (!genreName) {
      setError("El nombre del género no puede estar vacío.");
      return;
    }
    
    // Verificar si el nombre actual es igual al nombre original (ignorando espacios iniciales/finales)
    if (genreName === genre.nameGenre.trim()) {
        setError("No se ha detectado ningún cambio. El nombre es el mismo.");
        return;
    }

    setIsLoading(true);

    try {
      // Llamada PUT con Axios usando idGenre en la URL
      await axios.put(`${API_URL}/genre/${genre.idGenre}`, {
        nameGenre: genreName,
      });

      // Si la actualización en el backend es exitosa, marcamos éxito
      setIsSuccess(true);
      
    } catch (err) {
      console.error('Error al actualizar género:', err);
      let errorMsg = "Ocurrió un error al contactar al servidor.";

      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as { message?: string };
        
        if (errorData.message && errorData.message.includes('unique constraint')) {
            errorMsg = "Ya existe un género con ese nombre. Por favor, elige un nombre único.";
        } else {
            errorMsg = errorData.message || `Error del servidor (Código: ${err.response.status})`;
        }
      }

      setError(errorMsg);

    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    // Backdrop difuminado
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex justify-center items-center">
      
      {/* Usamos AnimatePresence para animar la entrada/salida del formulario/éxito */}
      <AnimatePresence mode="wait"> 
        {isSuccess ? (
          // CONTENEDOR DE ÉXITO CON ANIMACIÓN
          <motion.div
            key="success-modal"
            variants={successModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-800 rounded-lg p-8 w-full max-w-sm border border-gray-700 shadow-2xl relative"
          >
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">¡Actualización Exitosa!</h2>
              <p className="text-gray-300 text-center mb-6">El género **{formData.nameGenre}** ha sido actualizado correctamente.</p>
              <button
                onClick={handleSuccessClose} 
                className="w-full px-4 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-150"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        ) : (
          // FORMULARIO DE EDICIÓN
          <motion.div
            key="form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full border border-gray-700"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Editar Género: {genre.nameGenre}</h2>
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

              {/* Campo de Nombre del Género */}
              <div>
                <label htmlFor="nameGenre" className="block text-sm font-medium text-gray-400 mb-2">
                  Nombre del Género
                </label>
                <input
                  type="text"
                  id="nameGenre"
                  name="nameGenre"
                  value={formData.nameGenre}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150 disabled:opacity-50"
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenreEditModal;