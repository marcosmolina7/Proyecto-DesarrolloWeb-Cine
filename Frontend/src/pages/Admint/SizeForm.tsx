// src/pages/Admint/SizeForm.tsx

import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, Ruler } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

const SizeForm: React.FC = () => {
  const navigate = useNavigate();
  const [nameSize, setNameSize] = useState(''); // Coincide con tu DTO
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const name = nameSize.trim();
    if (!name) {
      setError("El nombre del tamaño es obligatorio.");
      setIsSaving(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/size`, { nameSize: name }); // Endpoint correcto
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/sizes'), 1500); // Redirige a la lista de tamaños
    } catch (err) {
      console.error('Error al crear tamaño:', err);
      let errorMsg = "Ocurrió un error al contactar al servidor.";
      if (isAxiosError(err) && err.response?.data.message) {
        // Asume que el backend devuelve un mensaje de error claro (ej. conflicto)
        errorMsg = err.response.data.message; 
      }
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8 px-4"> 
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Ruler className="w-8 h-8 mr-3 text-yellow-400" />Agregar Nuevo Tamaño</h1>
        <p className="text-gray-400 mb-6">Crea un nuevo tamaño para los productos (Ej: Pequeño, Grande).</p>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Tamaño Creado!</h2>
                <p className="text-gray-300">Redirigiendo a la lista...</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></motion.div>
                  )}
                </AnimatePresence>
                <div>
                  <label htmlFor="nameSize" className="block text-sm font-medium text-gray-400 mb-2">Nombre del Tamaño (Ej: 'Mediano')</label>
                  <input
                    type="text"
                    id="nameSize"
                    value={nameSize}
                    onChange={(e) => setNameSize(e.target.value)}
                    disabled={isSaving}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500">
                    {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Creando...' : 'Crear Tamaño'}</span>
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

export default SizeForm;