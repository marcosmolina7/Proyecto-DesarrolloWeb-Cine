// src/pages/Admint/SupplierList.tsx
// CORREGIDO: Sincronizado con el schema.prisma (campos detallados)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Truck, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search, User, Phone, Mail, MapPin } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import SupplierEditModal from './SupplierEditModal'; // Corregiremos este

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

// 1. CORRECCIÓN: Interfaz basada en schema.prisma
interface Supplier {
  idSupplier: number;
  nameSupplier: string;
  contactPersonSupplier: string;
  phoneSupplier: string;
  emailSupplier: string;
  addressSupplier: string | null;
}

// --- ANIMACIONES ---
const containerVariants: Variants = { /* ... (sin cambios) ... */ };
const itemVariants: Variants = { /* ... (sin cambios) ... */ };

// --- COMPONENTE PRINCIPAL ---
const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    try {
      // 2. CORRECCIÓN: Endpoint singular
      const response = await axios.get<Supplier[]>(`${API_URL}/supplier`);
      setSuppliers(response.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('No se pudieron cargar los proveedores.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return suppliers;
    const lowerCaseSearch = searchTerm.toLowerCase();
    // 3. CORRECCIÓN: Filtrar por campos nuevos
    return suppliers.filter(s => 
      s.nameSupplier.toLowerCase().includes(lowerCaseSearch) ||
      s.contactPersonSupplier.toLowerCase().includes(lowerCaseSearch) ||
      s.phoneSupplier.toLowerCase().includes(lowerCaseSearch) ||
      s.emailSupplier.toLowerCase().includes(lowerCaseSearch)
    );
  }, [suppliers, searchTerm]);

  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };
  const handleEditModalClose = () => {
    setSelectedSupplier(null);
  };
  const handleSupplierUpdated = () => {
    handleEditModalClose(); 
    fetchSuppliers(); 
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      // 4. CORRECCIÓN: Endpoint singular y idSupplier
      await axios.delete(`${API_URL}/supplier/${supplierToDelete.idSupplier}`);
      setDeleteSuccess(`Proveedor "${supplierToDelete.nameSupplier}" eliminado.`);
      fetchSuppliers();
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
    } catch (err) {
      // ... (manejo de error sin cambios) ...
      setError("Error al eliminar. Verifique que no esté en uso.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const renderContent = () => {
    // ... (Lógica de 'No hay proveedores' y 'No hay resultados' sin cambios) ...
    if (filteredSuppliers.length === 0) { /* ... */ }

    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuppliers.map((supplier) => (
            <motion.div key={supplier.idSupplier} variants={itemVariants} className="bg-gray-700 rounded-xl p-5 border border-gray-600 flex flex-col justify-between">
              <div>
                {/* 5. CORRECCIÓN: Mostrar datos nuevos */}
                <h3 className="text-xl font-bold text-white mb-2">{supplier.nameSupplier}</h3>
                <p className="text-sm text-gray-300 mb-1 flex items-center"><User className="w-4 h-4 mr-2 text-cyan-300"/>{supplier.contactPersonSupplier}</p>
                <p className="text-sm text-gray-300 mb-1 flex items-center"><Phone className="w-4 h-4 mr-2 text-cyan-300"/>{supplier.phoneSupplier}</p>
                <p className="text-sm text-gray-300 mb-1 flex items-center"><Mail className="w-4 h-4 mr-2 text-cyan-300"/>{supplier.emailSupplier}</p>
                <p className="text-sm text-gray-400 mb-1 flex items-start"><MapPin className="w-4 h-4 mr-2 mt-1 text-cyan-300 flex-shrink-0"/>{supplier.addressSupplier || 'Dirección no especificada'}</p>
                <span className="text-xs text-gray-500">(ID: {supplier.idSupplier})</span>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button onClick={() => handleEditClick(supplier)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-5 h-5" /></button>
                <button onClick={() => handleDeleteClick(supplier)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
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
        <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Truck className="w-8 h-8 mr-3 text-lime-400" />Gestión de Proveedores</h1>
            <p className="text-gray-400">Administra los proveedores de productos y servicios.</p>
          </div>
          <Link to="/admin/suppliers/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nuevo Proveedor</span>
          </Link>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, contacto, email o teléfono..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <AnimatePresence>
          {deleteSuccess && ( <motion.div /* ... */ > <CheckCircle/> <span>{deleteSuccess}</span></motion.div> )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando proveedores...</div>
        ) : error && !isDeleteModalOpen ? (
          <div className="bg-red-800 p-4 rounded-lg text-red-100"><AlertTriangle className="w-6 h-6 inline mr-2" />{error}</div>
        ) : (
          renderContent()
        )}
      </motion.div>

      {selectedSupplier && (
        <SupplierEditModal
          supplier={selectedSupplier}
          onClose={handleEditModalClose}
          onUpdateSuccess={handleSupplierUpdated}
        />
      )}
      
      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {isDeleteModalOpen && supplierToDelete && (
          <motion.div /* ... */>
            <motion.div /* ... */>
              <h2 /* ... */><AlertTriangle />Confirmar Eliminación</h2>
              <p className="text-gray-300 mb-6">¿Estás seguro de que deseas eliminar al proveedor: <span className="font-semibold text-white">"{supplierToDelete.nameSupplier}"</span>?</p>
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

export default SupplierList;