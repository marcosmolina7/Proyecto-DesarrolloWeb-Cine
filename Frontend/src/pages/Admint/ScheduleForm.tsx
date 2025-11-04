// src/pages/Admint/ScheduleForm.tsx
// CORREGIDO: Sincronizado con schema.prisma (model Showtime)

import React, { useState, useEffect, type FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, CalendarClock, Film, DoorOpen } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
interface Movie { idMovie: number; nameMovie: string; stateMovie: boolean; } // Incluimos stateMovie
interface Room { idRoom: number; nameRoom: string; }
// 1. CORRECCIÓN: Interfaz basada en 'model Showtime'
interface ScheduleFormData {
  idMovie: number | '';
  idRoom: number | '';
  dateTimeShowtime: string; // Campo de Prisma
}
const initialFormData: ScheduleFormData = {
  idMovie: '',
  idRoom: '',
  dateTimeShowtime: '',
};

// --- COMPONENTE ---
const ScheduleForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ScheduleFormData>(initialFormData);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Cargar Películas y Salas ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setError(null);
      try {
        const [movieRes, roomRes] = await Promise.all([
          axios.get<Movie[]>(`${API_URL}/movie`), 
          axios.get<Room[]>(`${API_URL}/room`)
        ]);
        // Filtramos solo películas activas
        setMovies(movieRes.data.filter(m => m.stateMovie === true)); 
        setRooms(roomRes.data);
      } catch (err) {
        setError("Error al cargar datos (Películas/Salas).");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'idMovie' || name === 'idRoom') ? (value ? Number(value) : '') : value
    }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // 2. CORRECCIÓN: Validar campo dateTimeShowtime
    if (!formData.idMovie || !formData.idRoom || !formData.dateTimeShowtime) {
      setError("Debe seleccionar Película, Sala y Fecha/Hora.");
      setIsSaving(false);
      return;
    }

    try {
        // 3. CORRECCIÓN: Enviar payload con campos correctos y endpoint
        const payload = {
            idMovie: formData.idMovie,
            idRoom: formData.idRoom,
            dateTimeShowtime: new Date(formData.dateTimeShowtime).toISOString()
        };
      // Asegúrate que tu endpoint de backend sea 'showtime' (o 'schedule' si así lo nombraste en el controller)
      await axios.post(`${API_URL}/showtime`, payload); 
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/schedules'), 1500); // Redirige a la lista
    } catch (err) {
      let errorMsg = "Error al crear el horario.";
      if (isAxiosError(err) && err.response?.data.message) {
        errorMsg = err.response.data.message; // Ej. Conflicto de horario
      }
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8 px-4"> 
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><CalendarClock className="w-8 h-8 mr-3 text-purple-400" />Programar Nueva Función</h1>
        <p className="text-gray-400 mb-6">Selecciona la película, la sala y la fecha/hora de inicio.</p>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Función Programada!</h2>
                <p className="text-gray-300">Redirigiendo a la lista...</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></motion.div>
                  )}
                </AnimatePresence>
                
                {isLoadingData ? (
                  <div className="text-gray-400 text-center">Cargando datos (Películas y Salas)...</div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="idMovie" className="block text-sm font-medium text-gray-400 mb-2">Película (Solo activas)</label>
                      <select id="idMovie" name="idMovie" value={formData.idMovie} onChange={handleChange} disabled={isSaving || movies.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 appearance-none" required>
                        <option value="" disabled>Seleccione una película...</option>
                        {movies.map(movie => <option key={movie.idMovie} value={movie.idMovie}>{movie.nameMovie}</option>)}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="idRoom" className="block text-sm font-medium text-gray-400 mb-2">Sala</label>
                      <select id="idRoom" name="idRoom" value={formData.idRoom} onChange={handleChange} disabled={isSaving || rooms.length === 0} className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 appearance-none" required>
                        <option value="" disabled>Seleccione una sala...</option>
                        {rooms.map(room => <option key={room.idRoom} value={room.idRoom}>{room.nameRoom}</option>)}
                      </select>
                    </div>

                    {/* 4. CORRECCIÓN: Campo dateTimeShowtime */}
                    <div>
                      <label htmlFor="dateTimeShowtime" className="block text-sm font-medium text-gray-400 mb-2">Fecha y Hora de Inicio</label>
                      <input 
                        type="datetime-local" 
                        id="dateTimeShowtime" 
                        name="dateTimeShowtime" 
                        value={formData.dateTimeShowtime} 
                        onChange={handleChange} 
                        disabled={isSaving} 
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600" 
                        required 
                      />
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <button type="submit" disabled={isSaving || isLoadingData} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500">
                    {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 rounded-full"></span> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Programando...' : 'Programar Función'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default ScheduleForm;