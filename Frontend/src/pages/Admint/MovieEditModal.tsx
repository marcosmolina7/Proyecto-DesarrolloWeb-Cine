// src/pages/Admint/MovieEditModal.tsx
// CORREGIDO: Sincronizado con MovieForm. Carga y maneja Múltiples Géneros.

import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { X, Save, List, RotateCw, AlertTriangle, CheckCircle } from 'lucide-react';
import axios, { isAxiosError } from 'axios';

// 1. CORRECCIÓN: Interfaces actualizadas con relaciones
interface Genre { idGenre: number; nameGenre: string; }
// Asumimos que el backend envía 'movieGenres: { idGenre: number, genre: { ... } }'
// o al menos 'movieGenres: { idGenre: number }'
interface MovieGenre { idGenre: number; genre?: Genre; } 
interface Director { idDirector: number; nameDirector: string; }
interface AgeRating { idAgeRating: number; nameAgeRating: string; }

interface Movie {
  idMovie: number;
  nameMovie: string;
  durationMovie: number;
  synapsisMovie: string;
  realseDateMovie: string;
  posterMovie: string;
  stateMovie: boolean;
  idDirector: number;
  idAgeRating: number;
  movieGenres?: MovieGenre[]; // Géneros actuales de la película
}
interface MovieEditModalProps {
  movie: Movie;
  onClose: () => void;
  onUpdateSuccess: () => void; 
}

const API_URL = 'http://localhost:3000';

const MovieEditModal: React.FC<MovieEditModalProps> = ({ movie, onClose, onUpdateSuccess }) => {
  // 2. CORRECCIÓN: Estado del formulario (sin movieGenres)
  const [formData, setFormData] = useState({
      nameMovie: movie.nameMovie,
      durationMovie: movie.durationMovie,
      synapsisMovie: movie.synapsisMovie,
      realseDateMovie: movie.realseDateMovie,
      posterMovie: movie.posterMovie,
      stateMovie: movie.stateMovie,
      idDirector: movie.idDirector,
      idAgeRating: movie.idAgeRating,
  });

  // 3. NUEVOS ESTADOS: Para manejar géneros
  const [directors, setDirectors] = useState<Director[]>([]);
  const [ageRatings, setAgeRatings] = useState<AgeRating[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]); // Catálogo de géneros
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set()); // Géneros seleccionados
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); // Estado para cargar selects
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); 

  const successModalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };


  // 4. CORRECCIÓN: Cargar Directores, Clasificaciones Y Géneros
  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoadingData(true);
      try {
        const [directorsResponse, ageRatingsResponse, genresResponse] = await Promise.all([
          axios.get<Director[]>(`${API_URL}/director`),
          axios.get<AgeRating[]>(`${API_URL}/age-rating`),
          axios.get<Genre[]>(`${API_URL}/genre`), // Cargar géneros
        ]);

        setDirectors(directorsResponse.data);
        setAgeRatings(ageRatingsResponse.data);
        setGenres(genresResponse.data); // Guardar géneros
        
        // 5. Pre-seleccionar los géneros que la película ya tiene
        const initialGenreIds = movie.movieGenres?.map(mg => mg.idGenre) || [];
        setSelectedGenres(new Set(initialGenreIds));

      } catch (err) {
        console.error('Error al cargar datos de selects:', err);
        setError('Error al cargar datos de directores/clasificaciones/géneros.');
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDropdownData();
  }, [movie]); // Depende de 'movie' para pre-seleccionar
  
  // 6. Sincronizar formulario si 'movie' cambia (para evitar bugs al reabrir)
  useEffect(() => {
    setFormData({
        nameMovie: movie.nameMovie,
        durationMovie: movie.durationMovie,
        synapsisMovie: movie.synapsisMovie,
        realseDateMovie: movie.realseDateMovie,
        posterMovie: movie.posterMovie,
        stateMovie: movie.stateMovie,
        idDirector: movie.idDirector,
        idAgeRating: movie.idAgeRating,
    });
    // Pre-seleccionar géneros
    const initialGenreIds = movie.movieGenres?.map(mg => mg.idGenre) || [];
    setSelectedGenres(new Set(initialGenreIds));
    // Resetear estados
    setIsSuccess(false);
    setError(null);
  }, [movie]);


  const formatDateForInput = (isoDate: string) => {
    if (isoDate && isoDate.length >= 10) {
      return isoDate.substring(0, 10);
    }
    return '';
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'durationMovie' ? (value ? Number(value) : '') : value,
    });
  };
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // 7. NUEVA FUNCIÓN: Manejador para checkboxes de Género
  const handleGenreChange = (genreId: number) => {
    setSelectedGenres(prev => {
      const newSet = new Set(prev); 
      if (newSet.has(genreId)) {
        newSet.delete(genreId); 
      } else {
        newSet.add(genreId); 
      }
      return newSet;
    });
  };
  
  const handleSuccessClose = () => {
      onUpdateSuccess(); 
      onClose();       
  };

  // 8. CORRECCIÓN: handleSubmit actualizado
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // 9. CORRECCIÓN: Añadir 'genreIds' al payload
    const dataToSend = {
      ...formData,
      realseDateMovie: new Date(formData.realseDateMovie).toISOString(),
      genreIds: Array.from(selectedGenres) // Enviar los IDs de géneros
    };

    try {
      // 10. CORRECCIÓN: Usar axios y endpoint singular
      const response = await axios.put(`${API_URL}/movie/${movie.idMovie}`, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
          }
      });

      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData.message || 'Error al actualizar la película');
      }

      setIsSuccess(true);

    } catch (err: any) {
      console.error('Error de actualización:', err);
      if (isAxiosError(err) && err.response?.data.message) {
         setError(err.response.data.message);
      } else {
         setError(err.message || 'Ocurrió un error inesperado al guardar.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Backdrop difuminado
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      
      <AnimatePresence mode="wait"> 
        {isSuccess ? (
          // Modal de Éxito
          <motion.div
            key="success-modal"
            variants={successModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-800 rounded-lg p-8 w-full max-w-sm border border-gray-700 shadow-2xl relative"
          >
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4"/>
              <h2 className="text-2xl font-bold text-white mb-2">¡Éxito! 🎉</h2>
              <p className="text-xl text-white text-center mb-8">Película actualizada correctamente.</p>
              <button
                onClick={handleSuccessClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-md transition duration-300"
              >
                OK
              </button>
            </div>
          </motion.div>
        ) : (
          // Formulario de Edición
          <motion.div 
            key="form-modal" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-800 rounded-lg p-8 w-full max-w-3xl border border-gray-700 shadow-2xl relative"
          >
            
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white" disabled={isSaving}> &times; </button>
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Editar: {movie.nameMovie}</h2>
            
            {error && <div className="bg-red-800 text-red-100 p-3 rounded-lg text-sm mb-4">{error}</div>}

            {isLoadingData ? (
                <div className="text-white text-center py-10"><RotateCw className="w-8 h-8 animate-spin mx-auto"/></div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                   <div className="flex space-x-4">
                        <div className="flex flex-col flex-grow">
                          <label htmlFor="nameMovie" className="text-gray-300 mb-1">Título</label>
                          <input
                            type="text"
                            id="nameMovie"
                            name="nameMovie"
                            value={formData.nameMovie}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                            disabled={isSaving}
                          />
                        </div>
                        <div className="flex flex-col w-32">
                          <label htmlFor="durationMovie" className="text-gray-300 mb-1">Duración (min)</label>
                          <input
                            type="number"
                            id="durationMovie"
                            name="durationMovie"
                            value={formData.durationMovie}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-blue-500"
                            required
                            disabled={isSaving}
                          />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="realseDateMovie" className="text-gray-300 mb-1">Fecha de estreno</label>
                        <input
                          type="date"
                          id="realseDateMovie"
                          name="realseDateMovie"
                          value={formatDateForInput(formData.realseDateMovie)} 
                          onChange={handleInputChange}
                          className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-blue-500"
                          required
                          disabled={isSaving}
                        />
                    </div>
                  
                  <div className="flex space-x-4">
                    <div className="flex flex-col flex-grow">
                      <label htmlFor="idDirector" className="text-gray-300 mb-1">Director</label>
                      <select id="idDirector" name="idDirector" value={formData.idDirector} onChange={handleSelectChange} className="bg-gray-700 text-white rounded p-2 border border-gray-600" disabled={isSaving}>
                        <option value="" disabled>Selecciona un director</option>
                        {directors.map((director) => ( <option key={director.idDirector} value={director.idDirector}>{director.nameDirector}</option> ))}
                      </select>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label htmlFor="idAgeRating" className="text-gray-300 mb-1">Clasificación</label>
                      <select id="idAgeRating" name="idAgeRating" value={formData.idAgeRating} onChange={handleSelectChange} className="bg-gray-700 text-white rounded p-2 border border-gray-600" disabled={isSaving}>
                        <option value="" disabled>Selecciona una clasificación</option>
                        {ageRatings.map((rating) => ( <option key={rating.idAgeRating} value={rating.idAgeRating}>{rating.nameAgeRating}</option> ))}
                      </select>
                    </div>
                  </div>

                  {/* 12. CAMPO DE GÉNEROS (Checkboxes) */}
                  <div className="flex flex-col">
                    <label className="text-gray-300 mb-2 flex items-center"><List className="w-5 h-5 mr-2" /> Géneros</label>
                    <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-3">
                      {genres.length > 0 ? genres.map(genre => (
                        <label key={genre.idGenre} className="flex items-center space-x-2 text-white cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-5 w-5 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                            checked={selectedGenres.has(genre.idGenre)}
                            onChange={() => handleGenreChange(genre.idGenre)}
                            disabled={isSaving}
                          />
                          <span>{genre.nameGenre}</span>
                        </label>
                      )) : (
                         <p className="text-gray-400 col-span-full">No hay géneros creados.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="synapsisMovie" className="text-gray-300 mb-1">Sinopsis</label>
                    <textarea id="synapsisMovie" name="synapsisMovie" value={formData.synapsisMovie} onChange={handleInputChange} rows={3} className="bg-gray-700 text-white rounded p-2 border border-gray-600" required disabled={isSaving}/>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <input type="checkbox" id="stateMovie" name="stateMovie" checked={formData.stateMovie} onChange={handleCheckboxChange} className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded" disabled={isSaving}/>
                    <label htmlFor="stateMovie" className="text-gray-300 font-semibold">Película disponible en Cartelera</label>
                  </div>

                  <button type="submit" disabled={isSaving || isLoadingData} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500">
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieEditModal;