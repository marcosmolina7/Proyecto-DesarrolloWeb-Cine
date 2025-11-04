// src/pages/Admint/RoomList.tsx
// CORREGIDO: Implementación del Modal de Confirmación para la eliminación.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { DoorOpen, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search, Armchair } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import RoomEditModal from './RoomEditModal'; 
import RoomAssignSeatsModal from './RoomAssignSeatsModal'; 

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Room {
  idRoom: number;
  nameRoom: string;
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
const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);

  // Estados para modales de edición/asignación
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // 1. ESTADOS PARA EL MODAL DE ELIMINACIÓN
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);


  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    try {
      const response = await axios.get<Room[]>(`${API_URL}/room`);
      setRooms(response.data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('No se pudieron cargar las salas. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredRooms = useMemo(() => {
    if (!searchTerm) return rooms;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return rooms.filter(room => 
      room.nameRoom.toLowerCase().includes(lowerCaseSearch)
    );
  }, [rooms, searchTerm]);

  // --- MANEJO DE MODALES ---
  const handleEditClick = (room: Room) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true); 
  };
  const handleAssignClick = (room: Room) => {
    setSelectedRoom(room);
    setIsAssignModalOpen(true); 
  };
  const handleCloseModals = () => {
    setSelectedRoom(null);
    setIsEditModalOpen(false);
    setIsAssignModalOpen(false);
  };
  const handleRoomUpdated = () => {
    handleCloseModals(); 
    fetchRooms();
  };
  
  // 2. MANEJO DEL CLIC EN ELIMINAR (Abre el modal)
  const handleDeleteClick = (room: Room) => {
      setRoomToDelete(room);
      setIsDeleteModalOpen(true);
      setDeleteError(null); // Limpiar error anterior
      setDeleteSuccess(null);
  };
  
  // 3. FUNCIÓN QUE EJECUTA LA ELIMINACIÓN
  const confirmDelete = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await axios.delete(`${API_URL}/room/${roomToDelete.idRoom}`);
      setDeleteSuccess(`Sala "${roomToDelete.nameRoom}" eliminada.`);
      fetchRooms();
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    } catch (err) {
      let errorMsg = "Error al eliminar.";
      if (isAxiosError(err) && err.response?.status === 409) {
        errorMsg = "No se puede eliminar. Esta sala tiene asientos o funciones asignadas.";
      } else if (isAxiosError(err) && err.response?.data.message) {
        errorMsg = err.response.data.message;
      }
      setDeleteError(errorMsg); // Asignar el error al estado local del modal
    } finally {
      setIsDeleting(false);
    }
  };


  const renderContent = () => {
     if (filteredRooms.length === 0) { /* ... */ }
     
     return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
                <motion.div key={room.idRoom} variants={itemVariants} className="bg-gray-700 rounded-xl p-5 border border-gray-600 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">{room.nameRoom}</h3>
                    <span className="text-gray-400 text-sm">ID: {room.idRoom}</span>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => handleAssignClick(room)} className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full" title="Asignar Asientos">
                    <Armchair className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleEditClick(room)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-5 h-5" /></button>
                    {/* 4. CAMBIO: Llamar al manejador de modal */}
                    <button onClick={() => handleDeleteClick(room)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-5 h-5" /></button>
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
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><DoorOpen className="w-8 h-8 mr-3 text-red-400" />Gestión de Salas</h1>
            <p className="text-gray-400">Define las salas del cine (Ej: Sala 1, Sala VIP).</p>
          </div>
          <Link to="/admin/rooms/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nueva Sala</span>
          </Link>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar sala por nombre..."
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
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando salas...</div>
        ) : error && !isDeleteModalOpen ? (
          <div className="bg-red-800 p-4 rounded-lg text-red-100"><AlertTriangle className="w-6 h-6 inline mr-2" />{error}</div>
        ) : (
          renderContent()
        )}
      </motion.div>

      {isEditModalOpen && selectedRoom && (
        <RoomEditModal
          room={selectedRoom}
          onClose={handleCloseModals}
          onUpdateSuccess={handleRoomUpdated}
        />
      )}
      {isAssignModalOpen && selectedRoom && (
        <RoomAssignSeatsModal
          room={selectedRoom}
          onClose={handleCloseModals}
          onUpdateSuccess={handleRoomUpdated}
        />
      )}

      {/* 5. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <AnimatePresence>
        {isDeleteModalOpen && roomToDelete && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 p-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center"><AlertTriangle className="w-6 h-6 mr-2" />Confirmar Eliminación</h2>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que deseas eliminar la sala: <span className="font-semibold text-white">"{roomToDelete.nameRoom}"</span>? 
                Esta acción es irreversible y requiere que la sala esté vacía.
              </p>
              {/* Mostrar error de eliminación aquí */}
              {deleteError && <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-lg text-sm mb-4">{deleteError}</div>}
              <div className="flex justify-end space-x-3">
                {/* 6. CORRECCIÓN: Botón Cancelar */}
                <button 
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)} 
                  disabled={isDeleting} 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                >
                    Cancelar
                </button>
                {/* 7. CORRECCIÓN: Botón Eliminar */}
                <button 
                  type="button"
                  onClick={confirmDelete} 
                  disabled={isDeleting} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-500 flex items-center space-x-2"
                >
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

export default RoomList;