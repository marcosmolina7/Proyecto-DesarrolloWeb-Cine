// src/pages/Admint/GenreList.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { List, PlusCircle, Edit, Trash2, AlertTriangle, CheckCircle, RotateCw, Search } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import Layout from '../../components/shared/Layout';
import GenreEditModal from './GenreEditModal'; 

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Genre {
  idGenre: number; // Usando idGenre según tu modelo Prisma
  nameGenre: string;
}

// --- ANIMACIONES ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { 
            duration: 0.5, 
            when: "beforeChildren", 
            staggerChildren: 0.05 
        } 
    },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};
// -------------------

// --- COMPONENTE PRINCIPAL ---
const GenreList: React.FC = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>(''); // Estado para la búsqueda

  // Estados para Edición
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  // Estados para Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);


  // --- FUNCIÓN DE CARGA DE DATOS ---
  const fetchGenres = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDeleteSuccess(null); 
    
    try {
      const response = await axios.get<Genre[]>(`${API_URL}/genre`);
      
      // ⬅️ CAMBIO: Ordenar los géneros por idGenre (correlativo)
      const sortedGenres = response.data.sort((a, b) => a.idGenre - b.idGenre);
      
      setGenres(sortedGenres);
    } catch (err) {
      console.error('Error fetching genres:', err);
      setError('No se pudieron cargar los géneros. Verifique la conexión con el API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);


  // --- FUNCIÓN DE FILTRADO (useMemo) ---
  const filteredGenres = useMemo(() => {
    if (!searchTerm) {
      return genres; 
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    // Filtramos por el nombre del género
    return genres.filter(genre => 
      genre.nameGenre.toLowerCase().includes(lowerCaseSearch)
    );
  }, [genres, searchTerm]); 


  // --- MANEJO DE EDICIÓN ---
  const handleEditClick = (genre: Genre) => {
    setSelectedGenre(genre);
  };

  const handleEditModalClose = () => {
      setSelectedGenre(null); // Cierra el modal de edición
  };
  
  // El modal llamará a fetchGenres en caso de éxito
  const handleGenreUpdated = () => {
      handleEditModalClose(); 
      fetchGenres(); // Recarga la lista completa
  };

  // --- MANEJO DE ELIMINACIÓN ---
  const handleDeleteClick = (genre: Genre) => {
    setGenreToDelete(genre);
    setIsDeleteModalOpen(true);
    setDeleteSuccess(null); 
    setError(null); // Limpiamos errores de la lista
  };

  const confirmDelete = async () => {
    if (!genreToDelete) return;

    setIsDeleting(true);
    // Limpiamos errores del modal antes de la nueva petición
    setError(null); 

    try {
      await axios.delete(`${API_URL}/genre/${genreToDelete.idGenre}`);
      
      // Eliminar el género de la lista local
      setGenres(prevGenres => prevGenres.filter(g => g.idGenre !== genreToDelete.idGenre));
      
      setDeleteSuccess(`El género "${genreToDelete.nameGenre}" fue eliminado exitosamente.`);
      setIsDeleteModalOpen(false); // Cierra el modal de confirmación
      
    } catch (err) {
      console.error('Error deleting genre:', err);
      let errorMsg = "Ocurrió un error al intentar eliminar el género.";

      if (isAxiosError(err) && err.response) {
        if (err.response.status === 409 || err.response.data.message?.includes('foreign key')) {
            errorMsg = "Este género no puede ser eliminado porque está asignado a una o más películas.";
        } else {
            errorMsg = err.response.data.message || `Error del servidor (Código: ${err.response.status})`;
        }
      }
      setError(errorMsg);
      
    } finally {
      setIsDeleting(false);
      // Mantenemos genreToDelete si hubo un error para que el modal lo muestre
      if (!error) {
         setGenreToDelete(null); 
      }
    }
  };
  
  // --- MANEJO DE BÚSQUEDA ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDeleteSuccess(null); // Limpiar éxito al empezar a buscar
  };


  // --- RENDERIZADO DEL CONTENIDO (Card Layout) ---
  const renderContent = () => {
    // Si no hay géneros registrados y no hay error
    if (!genres.length && !isLoading) {
      return (
        <div className="bg-gray-700 p-6 rounded-xl text-center text-gray-300 border border-gray-600">
          <p className="text-xl font-semibold mb-3">No hay géneros registrados.</p>
          <Link
            to="/admin/genres/new"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Añadir el primer género</span>
          </Link>
        </div>
      );
    }
    
    // Si no hay resultados después de filtrar
    if (filteredGenres.length === 0 && !isLoading) {
         return (
              <p className="text-gray-400 text-center py-10">
                {searchTerm 
                    ? `No se encontraron géneros para la búsqueda: "${searchTerm}".`
                    : 'No hay géneros registrados.'}
              </p>
         );
    }

    // Renderizar la lista de tarjetas
    return (
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 min-h-[50vh]">
        <div className="overflow-y-auto overflow-x-hidden pr-2"> 
          
          {error && !isDeleteModalOpen && ( // Mostrar error general fuera del modal de eliminación
            <div className="bg-red-800 border border-red-700 text-red-100 p-4 rounded-lg flex items-center space-x-3 mb-6">
                <AlertTriangle className="w-6 h-6" />
                <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
            
            <AnimatePresence>
            {filteredGenres.map((genre, index) => (
                <motion.div
                    key={genre.idGenre}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.05 }} 
                    className="bg-gray-700 rounded-xl shadow-lg transition duration-300 hover:bg-gray-600 p-5 border border-gray-600 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white leading-tight">
                            {genre.nameGenre}
                        </h3>
                        <span className="text-gray-400 text-sm flex-shrink-0 ml-4">
                            ID: <strong className="text-gray-300">{genre.idGenre}</strong>
                        </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">
                       Este género está disponible para la catalogación de películas.
                    </p>
                    
                    {/* Acciones (Botones) */}
                    <div className="flex justify-end space-x-2 flex-shrink-0 border-t border-gray-600 pt-3">
                        <button
                            onClick={() => handleEditClick(genre)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition duration-200 shadow-md"
                            title="Editar Género"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(genre)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition duration-200 shadow-md"
                            title="Eliminar Género"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };


  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8" 
      > 
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Gestión de Géneros
            </h1>
            <p className="text-gray-400">
              Administración de la lista de géneros disponibles para las películas.
            </p>
          </div>
          
          <Link
            to="/admin/genres/new"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition duration-150 shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Nuevo Género</span>
          </Link>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="mb-6 flex space-x-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar género por nombre..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500 transition duration-150"
                />
            </div>
        </div>
        {/* --------------------------- */}


        {/* Mensaje de Éxito de Eliminación */}
        <AnimatePresence>
            {deleteSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-800 border border-green-700 p-4 rounded-lg text-green-100 mb-6 flex items-center space-x-3"
                >
                    <CheckCircle className="w-6 h-6" />
                    <span>{deleteSuccess}</span>
                </motion.div>
            )}
        </AnimatePresence>
        
        {/* Contenido principal (Cards, Loading o Mensajes) */}
        {isLoading ? (
            <div className="text-center py-10 text-gray-400">
                <RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />
                Cargando lista de géneros...
            </div>
        ) : (
            renderContent()
        )}

      </motion.div>

      {/* --- MODAL DE EDICIÓN --- */}
      {selectedGenre && (
        <GenreEditModal
          genre={selectedGenre}
          onClose={handleEditModalClose}
          onUpdateSuccess={fetchGenres} // Recargar la lista al actualizar con éxito
        />
      )}

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Confirmar Eliminación
              </h2>
              <p className="text-gray-300 mb-6">
                ¿Estás seguro de que deseas eliminar el género: 
                <span className="font-semibold text-white"> "{genreToDelete?.nameGenre}"</span>? 
                Esta acción es irreversible.
              </p>
              
              {/* Mensaje de error de eliminación */}
              {error && genreToDelete && ( 
                <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-lg text-sm mb-4">
                    {error}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setError(null); 
                    setGenreToDelete(null); 
                  }}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-500 flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span>
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
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

export default GenreList;