// src/pages/Admint/SeatList.tsx
// CORREGIDO: Los asientos ahora se agrupan por Fila (rowLabel) para una mejor visualización.
// CORREGIDO: Se usa un solo 'overflow-auto' general (H y V) en el contenedor principal.
// CORREGIDO: Arreglado el error de 'motion.div' que causaba que los asientos no se vieran.
// CORREGIDO: Título de fila simplificado (ya no muestra el conteo de asientos).

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Armchair, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import SeatEditModal from './SeatEditModal'; 

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Seat {
  idSeat: number;
  rowSeat: string;
  columnSeat: number;
}

// --- ANIMACIONES ---
const containerVariants: Variants = { 
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, when: "beforeChildren", staggerChildren: 0.05 } },
};
// 1. CORRECCIÓN: Definimos itemVariants pero también usaremos 'initial' y 'animate' directos
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// --- COMPONENTE PRINCIPAL ---
const SeatList: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [seatToDelete, setSeatToDelete] = useState<Seat | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchSeats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    
    try {
      const response = await axios.get<Seat[]>(`${API_URL}/seat`);
      // Ordenamiento por Fila y luego por Columna
      const sortedSeats = response.data.sort((a, b) => {
        if (a.rowSeat < b.rowSeat) return -1;
        if (a.rowSeat > b.rowSeat) return 1;
        return a.columnSeat - b.columnSeat;
      });
      setSeats(sortedSeats);
    } catch (err) {
      console.error('Error fetching seats:', err);
      setError('No se pudieron cargar los asientos. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // --- FUNCIÓN DE FILTRADO Y AGRUPACIÓN ---
  const groupedSeats = useMemo(() => {
    let filtered = seats;
    if (searchTerm) {
        const lowerCaseSearch = searchTerm.toLowerCase();
        filtered = seats.filter(seat => 
            seat.rowSeat.toLowerCase().includes(lowerCaseSearch) ||
            `${seat.rowSeat}${seat.columnSeat}`.toLowerCase().includes(lowerCaseSearch.replace('-', ''))
        );
    }
    
    // Agrupación (sin cambios)
    return filtered.reduce((acc, seat) => {
        const row = seat.rowSeat;
        if (!acc[row]) {
            acc[row] = [];
        }
        acc[row].push(seat);
        return acc;
    }, {} as Record<string, Seat[]>);

  }, [seats, searchTerm]);

  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };
  const handleEditModalClose = () => {
    setSelectedSeat(null);
  };
  const handleSeatUpdated = () => {
    handleEditModalClose(); 
    fetchSeats();
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDeleteClick = (seat: Seat) => {
    setSeatToDelete(seat);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const confirmDelete = async () => {
    // ... (lógica de confirmDelete sin cambios) ...
    if (!seatToDelete) return;
    setIsDeleting(true);
    setError(null);
    
    const seatName = `${seatToDelete.rowSeat}${seatToDelete.columnSeat}`;

    try {
      await axios.delete(`${API_URL}/seat/${seatToDelete.idSeat}`);
      setDeleteSuccess(`Asiento "${seatName}" eliminado.`);
      fetchSeats();
      setIsDeleteModalOpen(false);
      setSeatToDelete(null);
    } catch (err) {
      let errorMsg = "Error al eliminar.";
      if (isAxiosError(err) && err.response?.status === 409) {
        errorMsg = `No se puede eliminar el asiento ${seatName}. Está asignado a una sala y/o tiene boletos asociados.`;
      } else if (isAxiosError(err) && err.response?.data.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  // 3. Renderizado del Contenido
  const renderContent = () => {
    const totalSeats = Object.values(groupedSeats).flat().length;

    if (totalSeats === 0 && !isLoading) {
      return (
        <p className="text-gray-400 text-center py-10">
          {searchTerm ? `No se encontraron resultados para "${searchTerm}".` : 'No hay asientos registrados en el catálogo.'}
        </p>
      );
    }

    return (
      // 4. CORRECCIÓN: Contenedor principal con scroll vertical Y horizontal
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-h-[70vh] overflow-auto">
        
        {/* 5. CORRECCIÓN: Contenedor interno que fuerza el ancho mínimo para el scroll H */}
        <div className="inline-block min-w-full">
            {/* Iteramos sobre el objeto agrupado (Fila A, Fila B, etc.) */}
            {Object.entries(groupedSeats).map(([rowLabel, seatsInRow]) => (
                <motion.div 
                    key={rowLabel} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 pb-4 border-b border-gray-700 last:border-b-0 last:mb-0 last:pb-0"
                >
                    {/* 6. CORRECCIÓN: Título de fila simplificado */}
                    <h2 className="text-xl font-bold text-cyan-300 mb-3">Fila {rowLabel}</h2>
                    
                    {/* 7. Contenedor de Fila SIN scroll (el scroll es general) */}
                    <div className="w-full pb-2">
                        {/* 8. 'flex' con 'flex-nowrap' para mantener en una línea */}
                        <div className="flex flex-nowrap gap-4">
                            {seatsInRow.map((seat) => (
                              <motion.div 
                                  key={seat.idSeat} 
                                  // 9. Añadido initial/animate directo para arreglar el bug de invisibilidad
                                  initial="hidden"
                                  animate="visible"
                                  variants={itemVariants} 
                                  className="bg-gray-700 rounded-xl p-3 border border-gray-600 flex items-center justify-between w-48 flex-shrink-0 transition-all duration-200 hover:shadow-lg"
                              >
                                <div className="flex items-center">
                                  <Armchair className="w-5 h-5 mr-3 text-cyan-400"/>
                                  <span className="text-lg font-bold text-white">{seat.rowSeat}{seat.columnSeat}</span>
                                </div>
                                <div className="flex space-x-1">
                                  <button onClick={() => handleEditClick(seat)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteClick(seat)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </motion.div>
                            ))}
                        </div>
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
        {/* ... (Header y Searchbar sin cambios) ... */}
        <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Armchair className="w-8 h-8 mr-3 text-cyan-400" />Catálogo de Asientos</h1>
            <p className="text-gray-400">Define todos los asientos disponibles que se pueden asignar a las salas (Ej: A1, A2... F10).</p>
          </div>
          <Link to="/admin/seats/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nuevo Asiento</span>
          </Link>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar asiento (Ej: 'A' o 'A10')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <AnimatePresence>
          {deleteSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-green-800 p-4 rounded-lg text-green-100 mb-6 flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" /><span>{deleteSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando asientos...</div>
        ) : error && !isDeleteModalOpen ? (
          <div className="bg-red-800 p-4 rounded-lg text-red-100"><AlertTriangle className="w-6 h-6 inline mr-2" />{error}</div>
        ) : (
          renderContent()
        )}
      </motion.div>

      {selectedSeat && (
        <SeatEditModal
          seat={selectedSeat}
          onClose={handleEditModalClose}
          onUpdateSuccess={handleSeatUpdated}
        />
      )}
      
      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {isDeleteModalOpen && seatToDelete && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 p-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center"><AlertTriangle className="w-6 h-6 mr-2" />Confirmar Eliminación</h2>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que deseas eliminar el asiento: <span className="font-semibold text-white">"{seatToDelete.rowSeat}{seatToDelete.columnSeat}"</span>? 
                Esto podría romper funciones programadas si no está bien desvinculado.
              </p>
              {error && <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-lg text-sm mb-4">{error}</div>}
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50">Cancelar</button>
                <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-500 flex items-center space-x-2">
                  {isDeleting ? <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span> : <Trash2 className="w-5 h-5" />}
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

export default SeatList;