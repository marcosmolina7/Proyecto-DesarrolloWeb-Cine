// src/pages/Admint/ScheduleEditModal.tsx
// CORREGIDO: Sincronizado con schema.prisma (model Showtime)

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Save, AlertTriangle, CheckCircle } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
interface Movie { idMovie: number; nameMovie: string; stateMovie: boolean; }
interface Room { idRoom: number; nameRoom: string; }
// 1. CORRECCIÓN: Interfaz basada en 'Showtime'
interface Showtime {
  idShowtime: number;
  dateTimeShowtime: string; // ISO String
  idMovie: number;
  idRoom: number;
  movie?: Movie; 
  room?: Room;  
}
interface ScheduleFormData {
  idMovie: number;
  idRoom: number;
  dateTimeShowtime: string; // Formato YYYY-MM-DDTHH:mm
}
interface ScheduleEditModalProps {
  schedule: Showtime; // Recibe un Showtime
  onClose: () => void;
  onUpdateSuccess: () => void;
}

// Helper para convertir ISO a formato datetime-local
const formatISOToInput = (isoString: string): string => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        // Ajustar a la zona horaria local antes de formatear
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset*60*1000));
        return localDate.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:mm
    } catch (e) {
        console.error("Error formatting date:", e);
        return '';
    }
};

// --- COMPONENTE ---
const ScheduleEditModal: React.FC<ScheduleEditModalProps> = ({ schedule, onClose, onUpdateSuccess }) => {
  // 2. CORRECCIÓN: Estado del formulario
  const [formData, setFormData] = useState<ScheduleFormData>({ 
      idMovie: schedule.idMovie, 
      idRoom: schedule.idRoom, 
      dateTimeShowtime: formatISOToInput(schedule.dateTimeShowtime) 
  });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Cargar Películas y Salas ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, roomRes] = await Promise.all([
          axios.get<Movie[]>(`${API_URL}/movie`),
          axios.get<Room[]>(`${API_URL}/room`)
        ]);
        setMovies(movieRes.data.filter(m => m.stateMovie)); // Solo activas
        setRooms(roomRes.data);
      } catch (err) {
        setError("Error al cargar datos.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // 3. CORRECCIÓN: Resetear estado
    setFormData({ 
      idMovie: schedule.idMovie, 
      idRoom: schedule.idRoom, 
      dateTimeShowtime: formatISOToInput(schedule.dateTimeShowtime) 
    });
    setError(null);
    setIsSuccess(false);
  }, [schedule]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'idMovie' || name === 'idRoom') ? Number(value) : value
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const originalDateTimeInput = formatISOToInput(schedule.dateTimeShowtime);
    if (formData.idMovie === schedule.idMovie && 
        formData.idRoom === schedule.idRoom &&
        formData.dateTimeShowtime === originalDateTimeInput) {
      setError("No hay cambios para guardar.");
      return;
    }

    setIsLoading(true);
    try {
        // 4. CORRECCIÓN: Payload y endpoint
        const payload = {
            idMovie: formData.idMovie,
            idRoom: formData.idRoom,
            dateTimeShowtime: new Date(formData.dateTimeShowtime).toISOString() // Convertir a ISO
        };
      // Asegúrate que tu endpoint de backend sea 'showtime'
      await axios.put(`${API_URL}/showtime/${schedule.idShowtime}`, payload);
      setIsSuccess(true);
    } catch (err) {
      let errorMsg = "Error al actualizar.";
      if (isAxiosError(err) && err.response?.data.message) {
        errorMsg = err.response.data.message;
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
          <h2 className="text-2xl font-bold text-white">Editar Función</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={isLoading}><X /></button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl text-white">¡Actualización Exitosa!</h3>
            <button onClick={handleSuccessClose} className="mt-4 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && <div className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></div>}
            
            <div>
              <label htmlFor="idMovie" className="block text-sm font-medium text-gray-400 mb-2">Película</label>
              <select id="idMovie" name="idMovie" value={formData.idMovie} onChange={handleChange} disabled={isLoading || movies.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required>
                {movies.map(movie => <option key={movie.idMovie} value={movie.idMovie}>{movie.nameMovie}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="idRoom" className="block text-sm font-medium text-gray-400 mb-2">Sala</label>
              <select id="idRoom" name="idRoom" value={formData.idRoom} onChange={handleChange} disabled={isLoading || rooms.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required>
                {rooms.map(room => <option key={room.idRoom} value={room.idRoom}>{room.nameRoom}</option>)}
              </select>
            </div>

            {/* 5. CORRECCIÓN: Campo dateTimeShowtime */}
            <div>
              <label htmlFor="dateTimeShowtime" className="block text-sm font-medium text-gray-400 mb-2">Fecha y Hora de Inicio</label>
              <input type="datetime-local" id="dateTimeShowtime" name="dateTimeShowtime" value={formData.dateTimeShowtime} onChange={handleChange} disabled={isLoading} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" required />
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

export default ScheduleEditModal;