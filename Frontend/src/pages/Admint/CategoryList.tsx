// src/pages/Admint/CategoryList.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { List, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import CategoryEditModal from './CategoryEditModal'; // Crearemos este archivo a continuación

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Category {
  idCategorie: number;
  nameCategorie: string;
}

// --- ANIMACIONES ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// --- COMPONENTE PRINCIPAL ---
const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    
    try {
      const response = await axios.get<Category[]>(`${API_URL}/categorie`);
      const sortedCategories = response.data.sort((a, b) => a.idCategorie - b.idCategorie);
      setCategories(sortedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('No se pudieron cargar las categorías. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return categories.filter(category => 
      category.nameCategorie.toLowerCase().includes(lowerCaseSearch)
    );
  }, [categories, searchTerm]);

  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleEditModalClose = () => {
    setSelectedCategory(null);
  };
  
  const handleCategoryUpdated = () => {
    handleEditModalClose(); 
    fetchCategories(); // Recarga la lista
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDelete = async (category: Category) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.nameCategorie}"?`)) {
      try {
        await axios.delete(`${API_URL}/categorie/${category.idCategorie}`);
        setDeleteSuccess(`Categoría "${category.nameCategorie}" eliminada.`);
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        let errorMsg = "Ocurrió un error al eliminar.";
        if (isAxiosError(err) && err.response?.status === 409) {
          errorMsg = "No se puede eliminar. Esta categoría está asignada a productos.";
        }
        alert(errorMsg);
      }
    }
  };

  // --- RENDERIZADO ---
  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" 
      >
        <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Gestión de Categorías de Productos</h1>
            <p className="text-gray-400">Administra las categorías para los productos de la dulcería (Ej: Bebidas, Snacks).</p>
          </div>
          <Link to="/admin/categories/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nueva Categoría</span>
          </Link>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar categoría por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <AnimatePresence>
          {deleteSuccess && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-green-800 p-4 rounded-lg text-green-100 mb-6 flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <span>{deleteSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando categorías...</div>
        ) : error ? (
          <div className="bg-red-800 p-4 rounded-lg text-red-100 flex items-center space-x-3"><AlertTriangle className="w-6 h-6" /><span>{error}</span></div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category, index) => (
                  <motion.div key={category.idCategorie} variants={itemVariants} className="bg-gray-700 rounded-xl p-5 border border-gray-600 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{category.nameCategorie}</h3>
                      <span className="text-gray-400 text-sm">ID: {category.idCategorie}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button onClick={() => handleEditClick(category)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(category)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10">{searchTerm ? `No se encontraron resultados para "${searchTerm}".` : 'No hay categorías registradas.'}</p>
            )}
          </div>
        )}
      </motion.div>

      {selectedCategory && (
        <CategoryEditModal
          category={selectedCategory}
          onClose={handleEditModalClose}
          onUpdateSuccess={handleCategoryUpdated}
        />
      )}
    </Layout>
  );
};

export default CategoryList;