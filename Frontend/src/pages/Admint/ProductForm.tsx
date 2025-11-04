// src/pages/Admint/ProductForm.tsx
// CORREGIDO: Sincronizado con schema.prisma (idCategorie, idSize, stockProduct, stateProduct)
// CORREGIDO: Endpoint apunta a /products (plural)

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, Package, DollarSign, List, Ruler, Hash } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
interface Category { idCategorie: number; nameCategorie: string; }
interface Size { idSize: number; nameSize: string; }
// 1. Interfaz de formulario basada en schema.prisma
interface ProductFormData {
  nameProduct: string;
  priceProduct: number | '';
  stockProduct: number | '';
  stateProduct: boolean;
  idCategorie: number | '';
  idSize: number | '';
}
const initialFormData: ProductFormData = {
  nameProduct: '',
  priceProduct: '',
  stockProduct: '',
  stateProduct: true, // Activo por defecto
  idCategorie: '',
  idSize: '',
};

// --- COMPONENTE ---
const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Cargar Categorías y Tamaños ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        // Endpoints singulares (¡estos ya estaban correctos!)
        const [catRes, sizeRes] = await Promise.all([
          axios.get<Category[]>(`${API_URL}/categorie`),
          axios.get<Size[]>(`${API_URL}/size`)
        ]);
        setCategories(catRes.data);
        setSizes(sizeRes.data);
      } catch (err) {
        setError("Error al cargar categorías o tamaños. No se puede crear un producto.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'priceProduct' || name === 'stockProduct' || name === 'idCategorie' || name === 'idSize') 
                ? (value ? Number(value) : '') 
                : inputValue
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Validar campos
    if (!formData.nameProduct || formData.priceProduct === '' || formData.stockProduct === '' || !formData.idCategorie || !formData.idSize) {
      setError("Todos los campos (excepto estado) son obligatorios.");
      setIsSaving(false);
      return;
    }

    try {
      // Payload y endpoint
      const payload = {
          nameProduct: formData.nameProduct,
          priceProduct: Number(formData.priceProduct), 
          stockProduct: Number(formData.stockProduct), 
          stateProduct: formData.stateProduct,
          idCategorie: formData.idCategorie,
          idSize: formData.idSize
      };
      // 2. CORRECCIÓN: Endpoint plural
      await axios.post(`${API_URL}/products`, payload); 
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      let errorMsg = "Error al crear el producto.";
      if (isAxiosError(err) && err.response?.data.message) {
         if (err.response.data.message.includes('unique constraint') || err.response.data.message.includes('Unique constraint failed')) {
            errorMsg = "Ya existe un producto con ese nombre.";
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
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Package className="w-8 h-8 mr-3 text-green-400" />Agregar Nuevo Producto</h1>
        <p className="text-gray-400 mb-6">Complete la información del nuevo producto de dulcería.</p>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Producto Creado!</h2>
                <p className="text-gray-300">Redirigiendo a la lista...</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></motion.div>
                  )}
                </AnimatePresence>
                
                {isLoadingData ? (
                  <div className="text-gray-400 text-center">Cargando categorías y tamaños...</div>
                ) : (
                  <>
                    {/* Formulario actualizado */}
                    <div>
                      <label htmlFor="nameProduct" className="block text-sm font-medium text-gray-400 mb-2">Nombre del Producto</label>
                      <input type="text" id="nameProduct" name="nameProduct" value={formData.nameProduct} onChange={handleChange} disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label htmlFor="idCategorie" className="block text-sm font-medium text-gray-400 mb-2">Categoría</label>
                        <select id="idCategorie" name="idCategorie" value={formData.idCategorie} onChange={handleChange} disabled={isSaving || categories.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 appearance-none" required>
                          <option value="" disabled>Seleccione...</option>
                          {categories.map(cat => <option key={cat.idCategorie} value={cat.idCategorie}>{cat.nameCategorie}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label htmlFor="idSize" className="block text-sm font-medium text-gray-400 mb-2">Tamaño</label>
                        <select id="idSize" name="idSize" value={formData.idSize} onChange={handleChange} disabled={isSaving || sizes.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 appearance-none" required>
                          <option value="" disabled>Seleccione...</option>
                          {sizes.map(size => <option key={size.idSize} value={size.idSize}>{size.nameSize}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="priceProduct" className="block text-sm font-medium text-gray-400 mb-2">Precio (GTQ)</label>
                            <input type="number" id="priceProduct" name="priceProduct" value={formData.priceProduct} onChange={handleChange} min="0" step="0.01" disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="stockProduct" className="block text-sm font-medium text-gray-400 mb-2">Stock Inicial</label>
                            <input type="number" id="stockProduct" name="stockProduct" value={formData.stockProduct} onChange={handleChange} min="0" step="1" disabled={isSaving} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="stateProduct"
                          name="stateProduct"
                          checked={formData.stateProduct}
                          onChange={handleChange} 
                          className="h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="stateProduct" className="text-gray-300 font-semibold">
                          Producto Activo (visible para venta)
                        </label>
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <button type="submit" disabled={isSaving || isLoadingData} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500">
                    {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 rounded-full"></span> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Creando...' : 'Crear Producto'}</span>
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

export default ProductForm;