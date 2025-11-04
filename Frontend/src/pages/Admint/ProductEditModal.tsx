// src/pages/Admint/ProductEditModal.tsx
// CORREGIDO: Sincronizado con schema.prisma (idCategorie, idSize, stockProduct, stateProduct)
// CORREGIDO: Endpoint apunta a /products (plural)
// ELIMINADO: descProduct

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
interface Category { idCategorie: number; nameCategorie: string; }
interface Size { idSize: number; nameSize: string; }
// 1. CORRECCIÓN: Interfaz basada en schema.prisma
interface Product {
  idProduct: number;
  nameProduct: string;
  priceProduct: number; // Prisma Decimal se maneja como number en TS
  stockProduct: number;
  stateProduct: boolean;
  idCategorie: number;
  idSize: number;
}
interface ProductEditModalProps {
  product: Product;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

// --- COMPONENTE ---
const ProductEditModal: React.FC<ProductEditModalProps> = ({ product, onClose, onUpdateSuccess }) => {
  // 2. CORRECCIÓN: Estado del formulario
  const [formData, setFormData] = useState({
      nameProduct: product.nameProduct,
      priceProduct: Number(product.priceProduct), // Asegurar que sea número
      stockProduct: product.stockProduct,
      stateProduct: product.stateProduct,
      idCategorie: product.idCategorie,
      idSize: product.idSize
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Cargar Categorías y Tamaños ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Endpoints singulares (para traer las listas de opciones)
        const [catRes, sizeRes] = await Promise.all([
          axios.get<Category[]>(`${API_URL}/categorie`),
          axios.get<Size[]>(`${API_URL}/size`)
        ]);
        setCategories(catRes.data);
        setSizes(sizeRes.data);
      } catch (err) {
        setError("Error al cargar categorías y tamaños.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFormData({
      nameProduct: product.nameProduct,
      priceProduct: Number(product.priceProduct),
      stockProduct: product.stockProduct,
      stateProduct: product.stateProduct,
      idCategorie: product.idCategorie,
      idSize: product.idSize
    });
    setError(null);
    setIsSuccess(false);
  }, [product]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const inputValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'priceProduct' || name === 'stockProduct' || name === 'idCategorie' || name === 'idSize') 
                ? Number(value) 
                : inputValue
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 3. CORRECCIÓN: Payload y endpoint
      const payload = {
          nameProduct: formData.nameProduct,
          priceProduct: Number(formData.priceProduct),
          stockProduct: Number(formData.stockProduct),
          stateProduct: formData.stateProduct,
          idCategorie: formData.idCategorie,
          idSize: formData.idSize
      };
      // Endpoint plural para la solicitud PUT
      await axios.put(`${API_URL}/products/${product.idProduct}`, payload); 
      setIsSuccess(true);
    } catch (err) {
      let errorMsg = "Error al actualizar.";
      if (isAxiosError(err) && err.response?.data.message) {
        if (err.response.data.message.includes('unique constraint') || err.response.data.message.includes('Unique constraint failed')) {
            errorMsg = "Ya existe un producto con ese nombre.";
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
          <h2 className="text-2xl font-bold text-white">Editar Producto: {product.nameProduct}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={isLoading}><X /></button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl text-white">¡Actualización Exitosa!</h3>
            <button onClick={handleSuccessClose} className="mt-4 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {error && <div className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></div>}
            
            {/* 4. CORRECCIÓN: Formulario actualizado */}
            <div>
              <label htmlFor="nameProduct" className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
              <input type="text" id="nameProduct" name="nameProduct" value={formData.nameProduct} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="idCategorie" className="block text-sm font-medium text-gray-400 mb-2">Categoría</label>
                <select id="idCategorie" name="idCategorie" value={formData.idCategorie} onChange={handleChange} disabled={isLoading || categories.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required>
                  <option value="" disabled>Seleccione...</option>
                  {categories.map(cat => <option key={cat.idCategorie} value={cat.idCategorie}>{cat.nameCategorie}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="idSize" className="block text-sm font-medium text-gray-400 mb-2">Tamaño</label>
                <select id="idSize" name="idSize" value={formData.idSize} onChange={handleChange} disabled={isLoading || sizes.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required>
                  <option value="" disabled>Seleccione...</option>
                  {sizes.map(size => <option key={size.idSize} value={size.idSize}>{size.nameSize}</option>)}
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <label htmlFor="priceProduct" className="block text-sm font-medium text-gray-400 mb-2">Precio (GTQ)</label>
                    <input type="number" id="priceProduct" name="priceProduct" value={formData.priceProduct} onChange={handleChange} min="0" step="0.01" disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
                </div>
                <div className="flex-1">
                    <label htmlFor="stockProduct" className="block text-sm font-medium text-gray-400 mb-2">Stock</label>
                    <input type="number" id="stockProduct" name="stockProduct" value={formData.stockProduct} onChange={handleChange} min="0" step="1" disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
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
                  Producto Activo
                </label>
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

export default ProductEditModal;