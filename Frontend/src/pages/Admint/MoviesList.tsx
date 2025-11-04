// src/pages/Admint/MoviesList.tsx
// CORREGIDO: Sincronizado con backend, usa axios, muestra géneros y modal de borrado.
// CORREGIDO: Añadido 'useCallback' a la importación de React.
// CORREGIDO: Añadido 'List' a la importación de lucide-react.
// CORREGIDO: 'loadMovies' ahora usa la misma ruta 'getMovieById' para traer las relaciones.

import React, { useState, useEffect, useMemo, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';      
import { Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Tag, User, List } from 'lucide-react'; // ⬅️ 1. CORRECCIÓN: Añadido 'List'
import Layout from '../../components/shared/Layout';
import MovieEditModal from './MovieEditModal'; 
import axios, { isAxiosError } from 'axios';

// Interfaces (actualizadas con relaciones)
interface Genre { idGenre: number; nameGenre: string; }
interface MovieGenre { idGenre: number; genre: Genre; } // ⬅️ CAMBIO: Asegurarse que idGenre esté aquí
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
  // Relaciones (deben venir del 'include' del backend)
  director?: Director;
  ageRating?: AgeRating;
  movieGenres?: MovieGenre[];
}
interface MoviesListProps {
  shouldReload?: boolean;
}

const API_URL = 'http://localhost:3000';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};


const MoviesList = ({ shouldReload }: MoviesListProps) => {
  const navigate = useNavigate(); 
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  
  // Estados para el modal de borrado
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null);
    try {
      // 1. CORRECCIÓN: Usamos la ruta /movie que (según tu backend) ya trae las relaciones
      const response = await axios.get<Movie[]>(`${API_URL}/movie`);
      const sortedMovies = response.data.sort((a, b) => a.idMovie - b.idMovie);
      setMovies(sortedMovies);
    } catch (err) {
      console.error('Error al cargar las películas:', err);
      setError('Hubo un error al cargar las películas.');
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    loadMovies();
  }, [loadMovies, shouldReload]); 
  
  const filteredMovies = useMemo(() => {
    if (!searchTerm) {
      return movies; 
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return movies.filter(movie => 
      movie.nameMovie.toLowerCase().includes(lowerCaseSearch) ||
      (movie.director && movie.director.nameDirector.toLowerCase().includes(lowerCaseSearch))
    );
  }, [movies, searchTerm]); 
  

  const handleEdit = (movie: Movie) => { // Recibe el objeto Movie completo
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };
  
  const handleMovieUpdated = () => {
    handleCloseModal();
    loadMovies(); 
  };

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    setIsDeleteModalOpen(true);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!movieToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await axios.delete(`${API_URL}/movie/${movieToDelete.idMovie}`);
      setDeleteSuccess(`Película "${movieToDelete.nameMovie}" eliminada.`);
      loadMovies();
      setIsDeleteModalOpen(false);
      setMovieToDelete(null);
    } catch (err) {
      let errorMsg = "Error al eliminar.";
      if (isAxiosError(err) && err.response?.status === 409) {
          errorMsg = "No se puede eliminar, la película tiene horarios o tickets asociados.";
      }
      setDeleteError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };


  const handleNavigateToAdd = () => {
    navigate('/admin/movies/new'); 
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const StatusIndicator = ({ stateMovie }: { stateMovie: boolean }) => (
    <div className={`px-3 py-1 text-xs font-semibold rounded-full ${ stateMovie ? 'bg-green-600 text-white' : 'bg-red-600 text-white' }`}>
      {stateMovie ? 'Disponible' : 'Inactiva'}
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"> 
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Administración de Películas</h1>
            <p className="text-gray-400">
              Lista completa de películas. Haz seguimiento a su disponibilidad y gestiona los detalles.
            </p>
          </div>
          
          <button
            onClick={handleNavigateToAdd}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Nueva Película
          </button>
        </div>
        
        <div className="mb-6 flex space-x-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar película por título o director..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500 transition duration-150"
                />
            </div>
        </div>

        <AnimatePresence>
          {deleteSuccess && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-green-800 p-4 rounded-lg text-green-100 mb-6 flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" /><span>{deleteSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
          <div className="overflow-y-auto overflow-x-hidden pr-2"> 
            
            {isLoading ? (
              <div className="text-white text-center py-10"><RotateCw className="w-8 h-8 animate-spin mx-auto"/></div>
            ) : error && !isDeleteModalOpen ? (
              <div className="text-red-500 text-center py-10">{error}</div>
            ) : filteredMovies.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                {searchTerm 
                    ? `No se encontraron películas para la búsqueda: "${searchTerm}".`
                    : 'No hay películas registradas.'}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredMovies.map((movie, index) => {
                  const posterSrc = movie.posterMovie
                    ? `${API_URL}/${movie.posterMovie}` // Ruta corregida con /
                    : 'https://placehold.co/100x150/1f2937/9ca3af?text=No+Poster';
                  
                  // 2. CORRECCIÓN: Añadimos '?' por si genre no viene
                  const genres = movie.movieGenres?.map(mg => mg.genre?.nameGenre).join(', ') || 'N/A';

                  return (
                    <motion.div
                      key={movie.idMovie}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }} 
                      className="flex bg-gray-700 rounded-xl overflow-hidden shadow-lg transition duration-300 hover:bg-gray-600 border border-gray-600"
                    >
                      <img
                        src={posterSrc}
                        alt={`Póster de ${movie.nameMovie}`}
                        className="w-28 h-40 object-cover flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x150/1f2937/9ca3af?text=Error';}}
                      />
                      <div className="flex-grow p-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-extrabold text-white leading-tight">
                            {movie.nameMovie}
                          </h3>
                          <StatusIndicator stateMovie={movie.stateMovie} />
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-300">
                           <p className="flex items-center"><User className="w-4 h-4 mr-2 text-cyan-300"/>{movie.director?.nameDirector || 'N/A'}</p>
                           <p className="flex items-center"><Tag className="w-4 h-4 mr-2 text-cyan-300"/>{movie.ageRating?.nameAgeRating || 'N/A'}</p>
                           <p className="flex items-center"><List className="w-4 h-4 mr-2 text-cyan-300"/>{genres}</p>
                        </div>
                        
                        <div className="flex space-x-6 text-gray-400 text-xs font-medium mt-auto pt-2">
                          <span>ID: <strong className="text-white">{movie.idMovie}</strong></span>
                          <span>Duración: <strong className="text-white">{movie.durationMovie} min</strong></span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center p-4 space-y-2 border-l border-gray-600 bg-gray-750">
                        <button
                          onClick={() => handleEdit(movie)} 
                          className="w-28 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition duration-200 shadow-md"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(movie)} 
                          className="w-28 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg text-sm transition duration-200 shadow-md"
                        >
                          Eliminar
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedMovie && (
        <MovieEditModal
          movie={selectedMovie}
          onClose={handleCloseModal}
          onUpdateSuccess={handleMovieUpdated}
        />
      )}

      {/* 9. Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {isDeleteModalOpen && movieToDelete && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 p-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center"><AlertTriangle className="w-6 h-6 mr-2" />Confirmar Eliminación</h2>
              <p className="text-gray-300 mb-6">¿Estás seguro de que deseas eliminar la película: <span className="font-semibold text-white">"{movieToDelete.nameMovie}"</span>?</p>
              {deleteError && <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-lg text-sm mb-4">{deleteError}</div>}
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

export default MoviesList;