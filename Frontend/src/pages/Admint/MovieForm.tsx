// src/pages/Admint/MovieForm.tsx
// CORREGIDO: Añadida la selección de Múltiples Géneros (Muchos-a-Muchos)
// CORREGIDO: Reemplazado alert() con un Modal de Éxito (AnimatePresence)

import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios'; 
import { List, CheckSquare, Square, Save, AlertTriangle, CheckCircle, RotateCw } from 'lucide-react'; // Importar íconos
import { motion, AnimatePresence } from 'framer-motion'; // Importar AnimatePresence y motion
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

// --- INTERFACES ---
interface Director {
  idDirector: number;
  nameDirector: string;
}
interface AgeRating {
  idAgeRating: number;
  nameAgeRating: string;
}
interface Genre {
  idGenre: number;
  nameGenre: string;
}

interface MovieData {
  nameMovie: string;
  durationMovie: number | ''; 
  synapsisMovie: string;
  realseDateMovie: string;
  idDirector: number | ''; 
  idAgeRating: number | ''; 
  stateMovie: boolean; 
}

const API_URL = 'http://localhost:3000';

// --- Variantes de Animación ---
const successModalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

const MovieForm = () => {
  const navigate = useNavigate(); // Hook para navegar
  const [movieData, setMovieData] = useState<MovieData>({
    nameMovie: '',
    durationMovie: '',
    synapsisMovie: '',
    realseDateMovie: '',
    idDirector: '',
    idAgeRating: '',
    stateMovie: true, 
  });

  const [file, setFile] = useState<File | null>(null);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [ageRatings, setAgeRatings] = useState<AgeRating[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]); 
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set()); 

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  
  // 1. NUEVOS ESTADOS para el modal de éxito
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdMovieName, setCreatedMovieName] = useState('');


  // Cargar datos para selects (Directores, Clasificaciones Y GÉNEROS)
  const fetchDropdownData = async () => {
    try {
      const [directorsResponse, ageRatingsResponse, genresResponse] = await Promise.all([
        axios.get<Director[]>(`${API_URL}/director`),
        axios.get<AgeRating[]>(`${API_URL}/age-rating`),
        axios.get<Genre[]>(`${API_URL}/genre`), 
      ]);

      const directorsData = directorsResponse.data;
      const ageRatingsData = ageRatingsResponse.data;
      const genresData = genresResponse.data; 

      setDirectors(directorsData);
      setAgeRatings(ageRatingsData);
      setGenres(genresData); 

      // Setea valores predeterminados (solo si no están ya seteados)
      if (directorsData.length > 0) {
        setMovieData((prev) => ({ ...prev, idDirector: prev.idDirector || directorsData[0].idDirector }));
      }
      if (ageRatingsData.length > 0) {
        setMovieData((prev) => ({ ...prev, idAgeRating: prev.idAgeRating || ageRatingsData[0].idAgeRating }));
      }
    } catch (error) {
      console.error('Error al obtener datos iniciales:', error);
      setError('Error al cargar datos (Directores, Clasificaciones o Géneros).');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovieData({
      ...movieData,
      [name]: name === 'durationMovie' ? (value ? Number(value) : '') : value,
    });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setMovieData({
      ...movieData,
      [name]: checked,
    });
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMovieData({
      ...movieData,
      [name]: Number(value),
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

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


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Debes seleccionar un póster.');
      return;
    }
    if (!movieData.idDirector || !movieData.idAgeRating) {
      setError('Por favor, selecciona un Director y una Clasificación.');
      return;
    }
    if (selectedGenres.size === 0) {
      setError('Debes seleccionar al menos un género.');
      return;
    }

    setIsSubmitting(true); 

    const realseDateMovieISO = new Date(movieData.realseDateMovie).toISOString();

    const formData = new FormData();
    formData.append('file', file);
    
    const dataToSend = {
        ...movieData,
        realseDateMovie: realseDateMovieISO,
        posterMovie: file.name, 
        genreIds: Array.from(selectedGenres) 
    };

    formData.append('data', JSON.stringify(dataToSend));

    try {
      const response = await axios.post(`${API_URL}/movie`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });

      // 2. CORRECCIÓN: Quitar alert() y mostrar modal
      setCreatedMovieName(response.data.nameMovie || movieData.nameMovie);
      setIsSuccess(true); 

      // Resetear el formulario (se hará al cerrar el modal)

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      if (isAxiosError(error) && error.response) {
        const errorData = error.response.data as { message?: string | string[] };
        if (Array.isArray(errorData.message)) {
            setError(errorData.message.join(', '));
        } else {
            setError(errorData.message || 'Error del servidor');
        }
      } else {
        setError('Ocurrió un error de red o desconocido.');
      }
    } finally {
        setIsSubmitting(false); 
    }
  };
  
  // 3. NUEVA FUNCIÓN: Para cerrar el modal de éxito
  const handleSuccessClose = () => {
    setIsSuccess(false);
    // Resetear el formulario
    setMovieData({
      nameMovie: '',
      durationMovie: '',
      synapsisMovie: '',
      realseDateMovie: '',
      idDirector: directors[0]?.idDirector || '',
      idAgeRating: ageRatings[0]?.idAgeRating || '',
      stateMovie: true, 
    });
    setSelectedGenres(new Set());
    setFile(null);
    // Resetear el input de archivo
    const fileInput = document.getElementById('posterMovie') as HTMLInputElement;
    if (fileInput) fileInput.value = ""; 
    
    // Navegar a la lista de películas
    navigate('/admin/movies');
  };


  if (isLoading) {
    return (
      <Layout>
        <div className="text-white text-center p-10"><RotateCw className="w-8 h-8 animate-spin mx-auto"/></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Agregar Nueva Película</h1>
        <p className="text-gray-400 mb-4">
          Ingresa los detalles de la nueva película que estará disponible en la cartelera.
        </p>

        {/* 4. CORRECCIÓN: Usar AnimatePresence para el modal */}
        <AnimatePresence mode="wait">
          {isSuccess ? (
            // --- PANTALLA DE ÉXITO ---
            <motion.div
              key="success"
              variants={successModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-auto border border-green-600 shadow-2xl relative text-center"
            >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Película Creada! 🎉</h2>
                <p className="text-gray-300 mb-6">
                    La película **{createdMovieName}** ha sido guardada exitosamente.
                </p>
                <button
                    onClick={handleSuccessClose} 
                    className="w-full px-4 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-150"
                >
                    Volver a la Lista
                </button>
            </motion.div>
          ) : (
            // --- FORMULARIO ---
            <motion.form
              key="form"
              initial={{ opacity: 1 }} // Empezar visible
              onSubmit={handleSubmit}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4"
            >
              
              {/* Mensaje de Error */}
              {error && (
                <div className="bg-red-800 text-red-100 p-3 rounded-lg text-sm">
                    Error: {error}
                </div>
              )}

              {/* ... (Campos: Título, Sinopsis, Fecha, Duración - Sin cambios) ... */}
              <div className="flex flex-col">
                <label htmlFor="nameMovie" className="text-gray-300 mb-1">
                  Título de la película
                </label>
                <input
                  type="text"
                  id="nameMovie"
                  name="nameMovie"
                  value={movieData.nameMovie}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-purple-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="synapsisMovie" className="text-gray-300 mb-1">
                  Sinopsis
                </label>
                <textarea
                  id="synapsisMovie"
                  name="synapsisMovie"
                  value={movieData.synapsisMovie}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-purple-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="realseDateMovie" className="text-gray-300 mb-1">
                  Fecha de estreno
                </label>
                <input
                  type="date"
                  id="realseDateMovie"
                  name="realseDateMovie"
                  value={movieData.realseDateMovie}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-purple-500"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="durationMovie" className="text-gray-300 mb-1">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  id="durationMovie"
                  name="durationMovie"
                  value={movieData.durationMovie}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-purple-500"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* ... (Campos: Director, Clasificación - Sin cambios) ... */}
              <div className="flex flex-col">
                <label htmlFor="idDirector" className="text-gray-300 mb-1">
                  Director
                </label>
                <select
                  id="idDirector"
                  name="idDirector"
                  value={movieData.idDirector}
                  onChange={handleSelectChange}
                  className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-purple-500"
                  disabled={isSubmitting}
                >
                  <option value="" disabled>Seleccione un director...</option>
                  {directors.map((director) => (
                    <option key={director.idDirector} value={director.idDirector}>
                      {director.nameDirector}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="idAgeRating" className="text-gray-300 mb-1">
                  Clasificación por Edad
                </label>
                <select
                  id="idAgeRating"
                  name="idAgeRating"
                  value={movieData.idAgeRating}
                  onChange={handleSelectChange}
                  className="bg-gray-700 text-white rounded p-2 border border-gray-600 focus:outline-none focus:border-purple-500"
                  disabled={isSubmitting}
                >
                  <option value="" disabled>Seleccione una clasificación...</option>
                  {ageRatings.map((rating) => (
                    <option key={rating.idAgeRating} value={rating.idAgeRating}>
                      {rating.nameAgeRating}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* ... (Campo: Géneros - Sin cambios) ... */}
              <div className="flex flex-col">
                <label className="text-gray-300 mb-2 flex items-center">
                  <List className="w-5 h-5 mr-2" />
                  Géneros (Selecciona uno o más)
                </label>
                <div className="p-3 bg-gray-700 border border-gray-600 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-3">
                  {genres.length > 0 ? genres.map(genre => (
                    <label 
                      key={genre.idGenre} 
                      className="flex items-center space-x-2 text-white cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
                        checked={selectedGenres.has(genre.idGenre)}
                        onChange={() => handleGenreChange(genre.idGenre)}
                        disabled={isSubmitting}
                      />
                      <span>{genre.nameGenre}</span>
                    </label>
                  )) : (
                    <p className="text-gray-400 col-span-full">No hay géneros creados. (Ve a /admin/genres/new)</p>
                  )}
                </div>
              </div>

              {/* ... (Campo: Estado - Sin cambios) ... */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="stateMovie"
                  name="stateMovie"
                  checked={movieData.stateMovie}
                  onChange={handleCheckboxChange} 
                  className="h-4 w-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  disabled={isSubmitting}
                />
                <label htmlFor="stateMovie" className="text-gray-300">
                  ¿La película está disponible?
                </label>
              </div>
              
              {/* ... (Campo: Póster - Sin cambios) ... */}
              <div className="flex flex-col">
                <label htmlFor="posterMovie" className="text-gray-300 mb-1">
                  Póster
                </label>
                <input
                  type="file"
                  id="posterMovie"
                  name="posterMovie"
                  onChange={handleFileChange}
                  className="text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  accept="image/*"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-500"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Película'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default MovieForm;