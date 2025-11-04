// src/pages/Admint/ProductList.tsx
// CORREGIDO: Endpoints apuntan a /products (plural)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Package, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search, Tag, Ruler, Check, XCircle } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import ProductEditModal from './ProductEditModal'; 

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Category { idCategorie: number; nameCategorie: string; }
interface Size { idSize: number; nameSize: string; }
interface Product {
  idProduct: number;
  nameProduct: string;
  priceProduct: number;
  stockProduct: number;
  stateProduct: boolean;
  idCategorie: number;
  idSize: number;
  category?: Category; 
  size?: Size;       
}

// --- ANIMACIONES ---
const containerVariants: Variants = { /* ... (sin cambios) ... */ };
const itemVariants: Variants = { /* ... (sin cambios) ... */ };

// --- COMPONENTE PRINCIPAL ---
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    try {
      // 1. CORRECCIÓN: Endpoint plural
      const response = await axios.get<Product[]>(`${API_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('No se pudieron cargar los productos. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredProducts = useMemo(() => {
    // ... (sin cambios) ...
    if (!searchTerm) return products;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return products.filter(product => 
      product.nameProduct.toLowerCase().includes(lowerCaseSearch) ||
      (product.category && product.category.nameCategorie.toLowerCase().includes(lowerCaseSearch)) ||
      (product.size && product.size.nameSize.toLowerCase().includes(lowerCaseSearch))
    );
  }, [products, searchTerm]);

  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (product: Product) => { /* ... (sin cambios) ... */ setSelectedProduct(product); };
  const handleEditModalClose = () => { /* ... (sin cambios) ... */ setSelectedProduct(null); };
  const handleProductUpdated = () => {
    handleEditModalClose(); 
    fetchProducts();
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      // 2. CORRECCIÓN: Endpoint plural
      await axios.delete(`${API_URL}/products/${productToDelete.idProduct}`);
      setDeleteSuccess(`Producto "${productToDelete.nameProduct}" eliminado.`);
      fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError("Error al eliminar. Verifique que no esté en uso (ventas, etc).");
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    // ... (renderizado sin cambios, sigue usando los campos correctos del schema) ...
    if (filteredProducts.length === 0) {
      return (
        <p className="text-gray-400 text-center py-10">
          {searchTerm 
              ? `No se encontraron productos para la búsqueda: "${searchTerm}".`
              : 'No hay productos registrados.'}
        </p>
      );
    }

    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <motion.div key={product.idProduct} variants={itemVariants} className="bg-gray-700 rounded-xl p-5 border border-gray-600 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white mb-1">{product.nameProduct}</h3>
                    {product.stateProduct ? (
                        <span className="flex items-center text-xs text-green-300 bg-green-800 px-2 py-1 rounded-full"><Check className="w-4 h-4 mr-1"/> Activo</span>
                    ) : (
                        <span className="flex items-center text-xs text-red-300 bg-red-800 px-2 py-1 rounded-full"><XCircle className="w-4 h-4 mr-1"/> Inactivo</span>
                    )}
                </div>
                <p className="text-2xl font-bold text-green-400 mb-2">{Number(product.priceProduct).toFixed(2)} GTQ</p>
                <p className="text-sm text-gray-300 mb-2">Stock: <span className="font-bold">{product.stockProduct}</span></p>
                
                <div className="flex space-x-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center"><Tag className="w-4 h-4 mr-1" />{product.category?.nameCategorie || 'N/A'}</span>
                  <span className="flex items-center"><Ruler className="w-4 h-4 mr-1" />{product.size?.nameSize || 'N/A'}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => handleEditClick(product)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-5 h-5" /></button>
                <button onClick={() => handleDeleteClick(product)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto py-8 px-4">
        {/* ... (Header y Búsqueda sin cambios) ... */}
         <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Package className="w-8 h-8 mr-3 text-green-400" />Gestión de Productos</h1>
            <p className="text-gray-400">Administra los productos de la dulcería.</p>
          </div>
          <Link to="/admin/products/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </Link>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o tamaño..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <AnimatePresence>
          {deleteSuccess && ( <motion.div /* ... */ > <CheckCircle/> <span>{deleteSuccess}</span></motion.div> )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando productos...</div>
        ) : error && !isDeleteModalOpen ? (
          <div className="bg-red-800 p-4 rounded-lg text-red-100"><AlertTriangle className="w-6 h-6 inline mr-2" />{error}</div>
        ) : (
          renderContent()
        )}
      </motion.div>

      {selectedProduct && (
        <ProductEditModal
          product={selectedProduct}
          onClose={handleEditModalClose}
          onUpdateSuccess={handleProductUpdated}
        />
      )}
      
      {/* ... (Modal de Confirmación de Eliminación) ... */}
      <AnimatePresence>
        {isDeleteModalOpen && productToDelete && (
          <motion.div /* ... */>
            <motion.div /* ... */>
              <h2 /* ... */><AlertTriangle />Confirmar Eliminación</h2>
              <p className="text-gray-300 mb-6">¿Estás seguro de que deseas eliminar el producto: <span className="font-semibold text-white">"{productToDelete.nameProduct}"</span>?</p>
              {error && <div className="bg-red-800 ... mb-4">{error}</div>}
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsDeleteModalOpen(false)} /* ... */>Cancelar</button>
                <button onClick={confirmDelete} disabled={isDeleting} /* ... */>
                  {isDeleting ? <span className="animate-spin ..."></span> : <Trash2 />}
                  <span>{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ProductList;