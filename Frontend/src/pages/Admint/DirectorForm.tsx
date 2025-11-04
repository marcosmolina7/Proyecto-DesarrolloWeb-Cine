// src/pages/Admint/DirectorForm.tsx

import React, { useState } from 'react';
import Layout from '../../components/shared/Layout';
import { motion, type Variants } from 'framer-motion';
import { Save, X, CheckCircle } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios'; 

// --- CONFIGURACIÓN ---
const API_URL = 'http://localhost:3000';

// --- INTERFAZ DE DATOS ---
interface IDirectorForm {
  nameDirector: string;
}

// --- ANIMACIÓN ---
const formVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// --- COMPONENTE MODAL DE ÉXITO ---
const SuccessModal: React.FC<{ directorName: string, onClose: () => void }> = ({ directorName, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full text-center border border-green-600"
        >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¡Guardado Exitoso!</h2>
            <p className="text-gray-300 mb-6">
                El director {directorName} ha sido creado correctamente.
            </p>
            <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-150"
            >
                Continuar
            </button>
        </motion.div>
    </div>
);
// -----------------------------------


const DirectorForm: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<IDirectorForm>({ nameDirector: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // ⬅️ NUEVO ESTADO: Guardará el nombre para la modal antes de limpiar el formulario.
  const [savedDirectorName, setSavedDirectorName] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); 

    const directorName = formData.nameDirector.trim(); // ⬅️ Capturamos el nombre

    if (!directorName) {
        setErrorMessage("El nombre del director es obligatorio.");
        return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_URL}/director`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Director guardado con éxito:', directorName);
      
      // ⬅️ PASO 1: Guardamos el nombre
      setSavedDirectorName(directorName);
      
      // ⬅️ PASO 2: Mostramos la modal
      setShowSuccessModal(true); 
      
      // ⬅️ PASO 3: Limpiamos el formulario (ya no afecta a la modal)
      setFormData({ nameDirector: '' });

    } catch (error) {
      console.error("Fallo el envío:", error);
      
      let errorMsg = "No se pudo conectar con el servidor.";

      if (isAxiosError(error) && error.response) {
        const errorData = error.response.data as { message?: string };
        errorMsg = errorData.message || `Error al guardar (Código: ${error.response.status})`;
      }
      
      setErrorMessage(errorMsg); 

    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSavedDirectorName(null); // Limpiamos el nombre guardado
    navigate('/admin/directors'); 
  };


  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-4xl font-extrabold text-white mb-6">Agregar Nuevo Director</h1>
        
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl space-y-6">
          
          {/* Mensaje de Error (Si existe) */}
          {errorMessage && (
            <div className="bg-red-900 border border-red-700 text-red-300 p-3 rounded-lg text-sm font-medium">
              Error: {errorMessage}
            </div>
          )}

          {/* Campo: Nombre del Director */}
          <div>
            <label htmlFor="nameDirector" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Director (Obligatorio)
            </label>
            <input
              type="text"
              id="nameDirector"
              name="nameDirector"
              value={formData.nameDirector}
              onChange={handleChange}
              placeholder="Ej: Christopher Nolan"
              required
              disabled={isLoading}
              className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150 disabled:opacity-50"
            />
          </div>
          
          {/* Botones de Acción */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/directors')}
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition duration-150 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                // Indicador de carga
                <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Guardando...' : 'Guardar Director'}</span>
            </button>
          </div>
        </form>
        
      </motion.div>
      
      {/* ⬅️ RENDERIZAR LA MODAL DE ÉXITO (Usando savedDirectorName) */}
      {showSuccessModal && savedDirectorName && (
        <SuccessModal 
          directorName={savedDirectorName} // ⬅️ Usamos el nombre guardado
          onClose={handleSuccessModalClose} 
        />
      )}
    </Layout>
  );
};

export default DirectorForm;