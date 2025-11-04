// src/pages/Admint/InventoryList.tsx
// CORREGIDO: Los endpoints ahora apuntan a /products (plural)
// CORREGIDO: Se añade el estado 'searchTerm' que faltaba

import React, { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { PackageSearch, AlertTriangle, CheckCircle, RotateCw, Search, Save, X, Edit } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

// Usamos la interfaz de Producto, asumiendo que stockProduct está ahí
interface Product {
  idProduct: number;
  nameProduct: string;
  stockProduct: number; // Campo clave para el inventario
  category?: { nameCategorie: string }; // Opcional, para mostrar
  size?: { nameSize: string }; // Opcional, para mostrar
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
const InventoryList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 1. CORRECCIÓN: Añadido el estado 'searchTerm' que faltaba
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  
  const [editStockId, setEditStockId] = useState<number | null>(null); // ID del producto cuyo stock se edita
  const [newStockValue, setNewStockValue] = useState<number | string>(''); // Valor temporal del nuevo stock
  const [isSaving, setIsSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);


  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchProductsInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setUpdateSuccess(null);
    
    try {
      const response = await axios.get<Product[]>(`${API_URL}/products`); 
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('No se pudo cargar el inventario. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsInventory();
  }, [fetchProductsInventory]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products; // Ahora 'searchTerm' está definido
    const lowerCaseSearch = searchTerm.toLowerCase();
    return products.filter(prod => 
      prod.nameProduct.toLowerCase().includes(lowerCaseSearch) ||
      (prod.category && prod.category.nameCategorie.toLowerCase().includes(lowerCaseSearch))
    );
  }, [products, searchTerm]); // 'searchTerm' está correctamente en las dependencias

  // --- MANEJO DE EDICIÓN DE STOCK ---
  const handleEditStockClick = (product: Product) => {
    setEditStockId(product.idProduct);
    setNewStockValue(product.stockProduct); 
    setError(null); 
    setUpdateSuccess(null);
  };

  const handleStockChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
        setNewStockValue(value === '' ? '' : Number(value));
    }
  };

  const handleSaveStock = async (productId: number) => {
    if (newStockValue === '' || newStockValue < 0) {
        setError("El stock debe ser un número entero no negativo.");
        return;
    }
    
    const currentProduct = products.find(p => p.idProduct === productId);
    if (currentProduct && Number(newStockValue) === currentProduct.stockProduct) {
        setEditStockId(null); 
        return;
    }

    setIsSaving(true);
    setError(null);
    try {
        await axios.put(`${API_URL}/products/${productId}`, { stockProduct: Number(newStockValue) });
        setUpdateSuccess(`Stock de "${currentProduct?.nameProduct}" actualizado a ${newStockValue}.`);
        setEditStockId(null); 
        fetchProductsInventory(); 
    } catch (err) {
        setError("Error al actualizar el stock.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancelEdit = () => {
      setEditStockId(null);
      setError(null);
  };

  return (
    <Layout>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><PackageSearch className="w-8 h-8 mr-3 text-teal-400" />Gestión de Inventario</h1>
            <p className="text-gray-400">Consulta y actualiza las existencias de los productos de la dulcería.</p>
          </div>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto por nombre o categoría..."
            value={searchTerm} // Ahora 'searchTerm' está definido
            onChange={(e) => setSearchTerm(e.target.value)} // Ahora 'setSearchTerm' está definido
            className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <AnimatePresence>
          {updateSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-green-800 p-4 rounded-lg text-green-100 mb-6 flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" /><span>{updateSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando inventario...</div>
        ) : error && editStockId === null ? ( 
          <div className="bg-red-800 p-4 rounded-lg text-red-100"><AlertTriangle className="w-6 h-6 inline mr-2" />{error}</div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            {filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-750">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Stock Actual</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredProducts.map((product) => (
                      <motion.tr key={product.idProduct} variants={itemVariants}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{product.nameProduct}</div>
                          <div className="text-xs text-gray-400">{product.size?.nameSize || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category?.nameCategorie || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowidrap text-center">
                          {editStockId === product.idProduct ? (
                            <input 
                                type="number"
                                value={newStockValue}
                                onChange={handleStockChange}
                                className="w-20 p-1 bg-gray-600 text-white rounded border border-gray-500 text-center"
                                min="0"
                                autoFocus 
                            />
                          ) : (
                            <span className={`text-lg font-bold ${product.stockProduct <= 5 ? 'text-red-500' : 'text-white'}`}>{product.stockProduct}</span>
                          )}
                           {editStockId === product.idProduct && error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          {editStockId === product.idProduct ? (
                            <div className="flex justify-center space-x-2">
                                <button 
                                    onClick={() => handleSaveStock(product.idProduct)} 
                                    disabled={isSaving}
                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full disabled:opacity-50" 
                                    title="Guardar Stock"
                                >
                                    {isSaving ? <RotateCw className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                                </button>
                                <button onClick={handleCancelEdit} className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full" title="Cancelar"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button 
                                onClick={() => handleEditStockClick(product)} 
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" 
                                title="Editar Stock"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10">{searchTerm ? `No se encontraron resultados para "${searchTerm}".` : 'No hay productos registrados para gestionar inventario.'}</p>
            )}
          </div>
        )}
      </motion.div>
    </Layout>
  );
};

export default InventoryList;