// src/pages/Admint/ScheduleList.tsx
// CORREGIDO: Sincronizado con schema.prisma (model Showtime)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { CalendarClock, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search, Film, DoorOpen } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import ScheduleEditModal from './ScheduleEditModal'; // Corregiremos este archivo a continuación

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

// 1. CORRECCIÓN: Interfaz basada en 'model Showtime'
interface Movie { idMovie: number; nameMovie: string; }
interface Room { idRoom: number; nameRoom: string; }
interface Showtime { // Renombrado de 'Schedule' a 'Showtime' para claridad
  idShowtime: number;
  dateTimeShowtime: string; // Campo de Prisma
  idMovie: number;
  idRoom: number;
  movie?: Movie; 
  room?: Room;  
}

// --- ANIMACIONES ---
const containerVariants: Variants = { /* ... (sin cambios) ... */ };
const itemVariants: Variants = { /* ... (sin cambios) ... */ };

// --- COMPONENTE PRINCIPAL ---
const ScheduleList: React.FC = () => {
  // 2. CORRECCIÓN: Nombres de estado actualizados
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<Showtime | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchShowtimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    
    try {
      // 3. CORRECCIÓN: Asumimos que el endpoint es /showtime (o /schedule si así lo ruteaste)
      //    Verifica tu controlador de backend. Usaré /showtime para coincidir con el modelo.
      const response = await axios.get<Showtime[]>(`${API_URL}/showtime`); 
      
      const sortedShowtimes = response.data.sort((a, b) => 
        new Date(a.dateTimeShowtime).getTime() - new Date(b.dateTimeShowtime).getTime()
      );
      setShowtimes(sortedShowtimes);
    } catch (err) {
      console.error('Error fetching showtimes:', err);
      setError('No se pudieron cargar los horarios. Verifique el endpoint del API (ej. /showtime).');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  // --- FUNCIÓN DE FILTRADO ---
  const filteredShowtimes = useMemo(() => {
    if (!searchTerm) return showtimes;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return showtimes.filter(sch => 
      (sch.movie?.nameMovie.toLowerCase().includes(lowerCaseSearch) ||
      sch.room?.nameRoom.toLowerCase().includes(lowerCaseSearch))
    );
  }, [showtimes, searchTerm]);

  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
  };
  const handleEditModalClose = () => {
    setSelectedShowtime(null);
  };
  const handleScheduleUpdated = () => {
    handleEditModalClose(); 
    fetchShowtimes();
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDeleteClick = (showtime: Showtime) => {
    setShowtimeToDelete(showtime);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const confirmDelete = async () => {
    if (!showtimeToDelete) return;
    setIsDeleting(true);
    setError(null);

    const desc = `${showtimeToDelete.movie?.nameMovie || 'N/A'} a las ${formatDateTime(showtimeToDelete.dateTimeShowtime)}`;

    try {
      // 4. CORRECCIÓN: Usar idShowtime y endpoint correcto
      await axios.delete(`${API_URL}/showtime/${showtimeToDelete.idShowtime}`);
      setDeleteSuccess(`Función eliminada: ${desc}.`);
      fetchShowtimes();
      setIsDeleteModalOpen(false);
      setShowtimeToDelete(null);
    } catch (err) {
      setError(`Error al eliminar: ${desc}.`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Helper para formatear fecha y hora
  const formatDateTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short', hour12: true });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const renderContent = () => {
    // ... (Lógica de 'No hay horarios' y 'No hay resultados' sin cambios) ...
    if (filteredShowtimes.length === 0) { /* ... */ }

    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="space-y-4">
          {filteredShowtimes.map((schedule) => (
            <motion.div 
                key={schedule.idShowtime} // 5. CORRECCIÓN: Usar idShowtime
                variants={itemVariants} 
                className="bg-gray-700 rounded-xl p-4 border border-gray-600 flex flex-col md:flex-row md:items-center justify-between"
            >
              <div className="flex-grow mb-3 md:mb-0">
                <h3 className="text-lg font-bold text-white flex items-center mb-1"><Film className="w-5 h-5 mr-2 text-blue-300"/>{schedule.movie?.nameMovie || 'Película Desconocida'}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300">
                   <span className="flex items-center"><DoorOpen className="w-4 h-4 mr-1 text-red-300"/>{schedule.room?.nameRoom || 'Sala Desconocida'}</span>
                   {/* 6. CORRECCIÓN: Usar dateTimeShowtime */}
                   <span className="flex items-center"><CalendarClock className="w-4 h-4 mr-1 text-purple-300"/>{formatDateTime(schedule.dateTimeShowtime)}</span>
                   <span className="text-xs text-gray-500">(ID: {schedule.idShowtime})</span>
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0">
                <button onClick={() => handleEditClick(schedule)} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full" title="Editar"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteClick(schedule)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
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
        {/* ... (Header y Búsqueda sin cambios, Link apunta a /admin/schedules/new) ... */}
        <div className="flex justify-between items-center mb-6 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><CalendarClock className="w-8 h-8 mr-3 text-purple-400" />Gestión de Horarios</h1>
            <p className="text-gray-400">Programa las funciones: qué película se muestra, dónde y cuándo.</p>
          </div>
          <Link to="/admin/schedules/new" className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition">
            <PlusCircle className="w-5 h-5" />
            <span>Nueva Función</span>
          </Link>
        </div>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de película o sala..."
            value={searchTerm}
            onChange={handleSearchChange}
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
          <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando horarios...</div>
        ) : error && !isDeleteModalOpen ? (
          <div className="bg-red-800 p-4 rounded-lg text-red-100"><AlertTriangle className="w-6 h-6 inline mr-2" />{error}</div>
        ) : (
          renderContent()
        )}
      </motion.div>

      {selectedShowtime && (
        <ScheduleEditModal
          schedule={selectedShowtime}
          onClose={handleEditModalClose}
          onUpdateSuccess={handleScheduleUpdated}
        />
      )}

      {/* ... (Modal de Confirmación de Eliminación) ... */}
      <AnimatePresence>
        {isDeleteModalOpen && showtimeToDelete && (
          <motion.div /* ... */>
            <motion.div /* ... */>
              <h2 /* ... */>Confirmar Eliminación</h2>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que deseas eliminar esta función?
                <span className="font-semibold text-white block mt-2">
                  "{showtimeToDelete.movie?.nameMovie}" en "{showtimeToDelete.room?.nameRoom}"
                </span>
                <span className="font-semibold text-white block">
                  {formatDateTime(showtimeToDelete.dateTimeShowtime)}
                </span>
              </p>
              {error && <div className="bg-red-800 ... mb-4">{error}</div>}
              <div className="flex justify-end space-x-3">
                <button onClick={() => setIsDeleteModalOpen(false)} /* ... */>Cancelar</button>
                <button onClick={confirmDelete} disabled={isDeleting} /* ... */>
                  {isDeleting ? <span className="animate-spin ..."></span> : <Trash2 className="w-5 h-5" />}
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

export default ScheduleList; 