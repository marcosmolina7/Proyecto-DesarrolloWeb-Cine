// src/pages/Admint/DirectorEditModal.tsx

import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Director {
  idDirector: number;
  nameDirector: string;
}

interface DirectorEditModalProps {
  director: Director; 
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
const DirectorEditModal: React.FC<DirectorEditModalProps> = ({ director, onClose, onUpdateSuccess }) => {
  // ⬅️ Cambiamos el estado de éxito a booleano, como en MovieEditModal
  const [formData, setFormData] = useState<Director>({ ...director });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); // ⬅️ NUEVO: Booleano de éxito

  useEffect(() => {
    setFormData({ ...director });
    setError(null);
    setIsSuccess(false); // Resetear el estado de éxito si se abre de nuevo
  }, [director]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setIsSuccess(false);
  };
  
  // ⬅️ FUNCIÓN DE CIERRE DE ÉXITO (Mismo patrón que handleSuccessClose de MovieEditModal)
  const handleSuccessClose = () => {
      onUpdateSuccess(); // 1. Recarga la lista
      onClose();       // 2. Cierra la modal
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    const directorName = formData.nameDirector.trim();

    if (!directorName) {
      setError("El nombre del director no puede estar vacío.");
      return;
    }

    if (directorName === director.nameDirector.trim()) {
        setError("No hay cambios para guardar.");
        return;
    }

    setIsLoading(true);

    try {
      // Llamada PUT con Axios
      await axios.put(`${API_URL}/director/${director.idDirector}`, {
        nameDirector: directorName,
      });

      // ⬅️ Almacenar el éxito y dejar que AnimatePresence lo maneje
      setIsSuccess(true);
      
    } catch (err) {
      console.error('Error al actualizar director:', err);
      let errorMsg = "Ocurrió un error al contactar al servidor.";

      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as { message?: string };
        errorMsg = errorData.message || `Error del servidor (Código: ${err.response.status})`;
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
          // ⬅️ CONTENEDOR DE ÉXITO CON ANIMACIÓN
          <motion.div
            key="success-modal"
            variants={successModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // Hacemos el contenedor de éxito un poco más pequeño, como en MovieEditModal
            className="bg-gray-800 rounded-lg p-8 w-full max-w-sm border border-gray-700 shadow-2xl relative"
          >
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">¡Actualización Exitosa!</h2>
              <p className="text-gray-300 text-center mb-6">El director {director.nameDirector} ha sido actualizado correctamente.</p>
              <button
                onClick={handleSuccessClose} // ⬅️ Cierra y notifica a la lista
                className="w-full px-4 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-150"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        ) : (
          // ⬅️ FORMULARIO DE EDICIÓN
          <motion.div
            key="form-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Mantenemos el tamaño original para el formulario
            className="bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full border border-gray-700"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Editar Director: {director.nameDirector}</h2>
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
                <label htmlFor="nameDirector" className="block text-sm font-medium text-gray-400 mb-2">
                  Nombre del Director
                </label>
                <input
                  type="text"
                  id="nameDirector"
                  name="nameDirector"
                  value={formData.nameDirector}
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

export default DirectorEditModal;