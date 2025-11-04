// src/pages/Admint/SupplierForm.tsx
// CORREGIDO: Sincronizado con schema.prisma

import React, { useState, type FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, Truck, User, Phone, Mail, MapPin } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// 1. CORRECCIÓN: Interfaz del formulario
interface SupplierFormData {
  nameSupplier: string;
  contactPersonSupplier: string;
  phoneSupplier: string;
  emailSupplier: string;
  addressSupplier: string; // Opcional en BD, pero lo pedimos
}
const initialFormData: SupplierFormData = {
  nameSupplier: '',
  contactPersonSupplier: '',
  phoneSupplier: '',
  emailSupplier: '',
  addressSupplier: '',
};

// --- COMPONENTE ---
const SupplierForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SupplierFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // 2. CORRECCIÓN: Validar campos
    if (!formData.nameSupplier || !formData.contactPersonSupplier || !formData.phoneSupplier || !formData.emailSupplier) {
      setError("Nombre, Contacto, Teléfono y Email son obligatorios.");
      setIsSaving(false);
      return;
    }

    try {
      // 3. CORRECCIÓN: Enviar payload completo al endpoint singular
      await axios.post(`${API_URL}/supplier`, {
          ...formData,
          addressSupplier: formData.addressSupplier || null // Enviar null si está vacío
      }); 
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/suppliers'), 1500); // Redirige a la lista
    } catch (err) {
      let errorMsg = "Error al crear el proveedor.";
      if (isAxiosError(err) && err.response?.data.message) {
        if (err.response.data.message.includes('unique constraint') || err.response.data.message.includes('Unique constraint failed')) {
            errorMsg = "El Nombre o Email de este proveedor ya existen.";
        } else {
            errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8 px-4"> 
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Truck className="w-8 h-8 mr-3 text-lime-400" />Agregar Nuevo Proveedor</h1>
        <p className="text-gray-400 mb-6">Complete la información del proveedor.</p>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Proveedor Creado!</h2>
                <p className="text-gray-300">Redirigiendo a la lista...</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* 4. CORRECCIÓN: Formulario actualizado */}
                <div>
                  <label htmlFor="nameSupplier" className="block text-sm font-medium text-gray-400 mb-2">Nombre del Proveedor</label>
                  <input type="text" id="nameSupplier" name="nameSupplier" value={formData.nameSupplier} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                </div>
                <div>
                  <label htmlFor="contactPersonSupplier" className="block text-sm font-medium text-gray-400 mb-2">Persona de Contacto</label>
                  <input type="text" id="contactPersonSupplier" name="contactPersonSupplier" value={formData.contactPersonSupplier} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="phoneSupplier" className="block text-sm font-medium text-gray-400 mb-2">Teléfono</label>
                        <input type="tel" id="phoneSupplier" name="phoneSupplier" value={formData.phoneSupplier} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="emailSupplier" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input type="email" id="emailSupplier" name="emailSupplier" value={formData.emailSupplier} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                    </div>
                </div>
                <div>
                  <label htmlFor="addressSupplier" className="block text-sm font-medium text-gray-400 mb-2">Dirección (Opcional)</label>
                  <textarea id="addressSupplier" name="addressSupplier" value={formData.addressSupplier} onChange={handleChange} rows={2} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 resize-none" />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500">
                    {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 rounded-full"></span> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Creando...' : 'Crear Proveedor'}</span>
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

export default SupplierForm;