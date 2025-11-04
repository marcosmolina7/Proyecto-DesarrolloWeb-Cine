// src/pages/Admint/AgeRatingForm.tsx

import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface AgeRatingFormData {
  nameAgeRating: string;
  descAgeRating: string;
}

const initialFormData: AgeRatingFormData = {
  nameAgeRating: '',
  descAgeRating: '',
};

const successModalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

// --- COMPONENTE ---
const AgeRatingForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AgeRatingFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); 
  const [createdRatingName, setCreatedRatingName] = useState<string>('');


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };
  
  const handleSuccessClose = () => {
      // Regresa a la lista de clasificaciones
      navigate('/admin/ageratings'); 
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const name = formData.nameAgeRating.trim();
    const description = formData.descAgeRating.trim();

    if (!name || !description) {
      setError("El nombre y la descripción de la clasificación son obligatorios.");
      setIsSaving(false);
      return;
    }

    try {
      // Endpoint: /age-rating (POST)
      const response = await axios.post(`${API_URL}/age-rating`, {
        nameAgeRating: name,
        descAgeRating: description,
      });

      setCreatedRatingName(response.data.nameAgeRating || name);
      setIsSuccess(true);
      setFormData(initialFormData); // Limpia el formulario
      
    } catch (err) {
      console.error('Error al crear clasificación:', err);
      let errorMsg = "Ocurrió un error al contactar al servidor.";

      if (isAxiosError(err) && err.response) {
        const errorData = err.response.data as { message?: string };
        
        if (errorData.message && errorData.message.includes('unique constraint')) {
            errorMsg = "Ya existe una clasificación con ese nombre o descripción. Por favor, usa valores únicos.";
        } else {
            errorMsg = errorData.message || `Error del servidor (Código: ${err.response.status})`;
        }
      }

      setError(errorMsg);

    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> 
        <h1 className="text-4xl font-extrabold text-white mb-2">Agregar Nueva Clasificación</h1>
        <p className="text-gray-400 mb-6">Define un nuevo código de clasificación por edad y su descripción oficial.</p>
        
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
            
            <AnimatePresence mode="wait">
                {isSuccess ? (
                    // PANTALLA DE ÉXITO
                    <motion.div
                        key="success"
                        variants={successModalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col items-center py-12"
                    >
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">¡Clasificación Creada! 🎉</h2>
                        <p className="text-gray-300 text-center mb-6">
                            La clasificación **{createdRatingName}** fue agregada exitosamente.
                        </p>
                        <button
                            onClick={handleSuccessClose} 
                            className="w-full max-w-xs px-4 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-150"
                        >
                            Volver a la Lista
                        </button>
                    </motion.div>
                ) : (
                    // FORMULARIO PRINCIPAL
                    <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit} 
                        className="space-y-6"
                    >
                        
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
                                Nombre de la Clasificación (Ej: 'C', 'PG-13')
                            </label>
                            <input
                                type="text"
                                id="nameAgeRating"
                                name="nameAgeRating"
                                value={formData.nameAgeRating}
                                onChange={handleChange}
                                disabled={isSaving}
                                className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150 disabled:opacity-50"
                                required
                            />
                        </div>
                        
                        {/* Campo de Descripción */}
                        <div>
                            <label htmlFor="descAgeRating" className="block text-sm font-medium text-gray-400 mb-2">
                                Descripción Detallada (Requerimientos, restricciones)
                            </label>
                            <textarea
                                id="descAgeRating"
                                name="descAgeRating"
                                value={formData.descAgeRating}
                                onChange={handleChange}
                                rows={4}
                                disabled={isSaving}
                                className="mt-1 block w-full px-4 py-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-150 disabled:opacity-50 resize-none"
                                required
                            />
                        </div>

                        {/* Botón de Submit */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span>
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                <span>{isSaving ? 'Creando Clasificación...' : 'Crear Clasificación'}</span>
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

export default AgeRatingForm;