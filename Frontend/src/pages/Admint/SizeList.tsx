// src/pages/Admint/SizeList.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom'; // No necesitamos useNavigate aquí
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Ruler, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search } from 'lucide-react'; // Cambiamos el icono principal
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import SizeEditModal from './SizeEditModal'; 

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Size {
  idSize: number; // Coincide con tu DTO y modelo Prisma
  nameSize: string;
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
const SizeList: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchSizes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    
    try {
      const response = await axios.get<Size[]>(`${API_URL}/size`); // Endpoint correcto
      const sortedSizes = response.data.sort((a, b) => a.idSize - b.idSize);
      setSizes(sortedSizes);
    } catch (err) {
      console.error('Error fetching sizes:', err);
      setError('No se pudieron cargar los tamaños. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSizes();
  }, [fetchSizes]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredSizes = useMemo(() => {
    if (!searchTerm) return sizes;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return sizes.filter(size => 
      size.nameSize.toLowerCase().includes(lowerCaseSearch)
    );
  }, [sizes, searchTerm]);

  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (size: Size) => {
    setSelectedSize(size);
  };

  const handleEditModalClose = () => {
    setSelectedSize(null);
  };
  
  const handleSizeUpdated = () => {
    handleEditModalClose(); 
    fetchSizes(); // Recarga la lista
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDelete = async (size: Size) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el tamaño "${size.nameSize}"?`)) {
      try {
        await axios.delete(`${API_URL}/size/${size.idSize}`); // Endpoint correcto
        setDeleteSuccess(`Tamaño "${size.nameSize}" eliminado.`);
        fetchSizes();
      } catch (err) {
        console.error('Error deleting size:', err);
        let errorMsg = "Ocurrió un error al eliminar.";
        if (isAxiosError(err) && err.response?.status === 409) {
          errorMsg = "No se puede eliminar. Este tamaño está asignado a productos.";
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
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Ruler className="w-8 h-8 mr-3 text-yellow-400" />Gestión de Tamaños</h1>
            <p className="text-gray-400">Administra los tamaños disponibles para productos (Ej: Pequeño, Mediano, Grande).</p>
          </div>
          <Link to="/admin/sizes/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nuevo Tamaño</span>
          </Link>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tamaño por nombre..."
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
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando tamaños...</div>
        ) : error ? (
          <div className="bg-red-800 p-4 rounded-lg text-red-100 flex items-center space-x-3"><AlertTriangle className="w-6 h-6" /><span>{error}</span></div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            {filteredSizes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Ajustamos columnas para nombres más cortos */}
                {filteredSizes.map((size, index) => (
                  <motion.div key={size.idSize} variants={itemVariants} className="bg-gray-700 rounded-xl p-5 border border-gray-600 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{size.nameSize}</h3>
                      <span className="text-gray-400 text-sm">ID: {size.idSize}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button onClick={() => handleEditClick(size)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(size)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10">{searchTerm ? `No se encontraron resultados para "${searchTerm}".` : 'No hay tamaños registrados.'}</p>
            )}
          </div>
        )}
      </motion.div>

      {selectedSize && (
        <SizeEditModal
          size={selectedSize}
          onClose={handleEditModalClose}
          onUpdateSuccess={handleSizeUpdated}
        />
      )}
    </Layout>
  );
};

export default SizeList;