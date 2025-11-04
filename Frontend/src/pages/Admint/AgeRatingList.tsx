// src/pages/Admint/AgeRatingList.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';      
import { Plus, Trash2, Edit, Search } from 'lucide-react';         
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios'; 
import AgeRatingEditModal from './AgeRatingEditModal'; 

// --- 1. INTERFAZ DE DATOS (Basada en tu modelo Prisma) ---
interface AgeRating {
  idAgeRating: number; 
  nameAgeRating: string;
  descAgeRating: string;
}

interface AgeRatingListProps {
  shouldReload?: boolean;
}

const API_URL = 'http://localhost:3000'; 

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


const AgeRatingList = ({ shouldReload }: AgeRatingListProps) => {
  const navigate = useNavigate(); 
  
  const [ageRatings, setAgeRatings] = useState<AgeRating[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAgeRating, setSelectedAgeRating] = useState<AgeRating | null>(null);

  // --- LÓGICA DE CARGA DE DATOS ---
  const loadAgeRatings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<AgeRating[]>(`${API_URL}/age-rating`);
      
      const ageRatingsData = response.data;
      const sortedAgeRatings = ageRatingsData.sort((a, b) => a.idAgeRating - b.idAgeRating);
      
      setAgeRatings(sortedAgeRatings); 
    } catch (err) {
      console.error('Error al cargar clasificaciones:', err);
      if (isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 404) {
              setError(`Error 404: El endpoint ${API_URL}/age-rating no fue encontrado.`);
          } else {
              setError(`Error de API: ${err.response?.statusText || 'No se pudo conectar al servidor.'}`);
          }
      } else {
          setError('Hubo un error al cargar las clasificaciones.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgeRatings();
  }, [shouldReload]);
  
  // --- FUNCIÓN DE FILTRADO (POR NOMBRE O DESCRIPCIÓN) ---
  const filteredAgeRatings = useMemo(() => {
    if (!searchTerm) {
      return ageRatings; 
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return ageRatings.filter(rating => 
      rating.nameAgeRating.toLowerCase().includes(lowerCaseSearch) ||
      rating.descAgeRating.toLowerCase().includes(lowerCaseSearch)
    );
  }, [ageRatings, searchTerm]); 


  // --- MANEJADORES DE ACCIÓN ---
  
  const handleEdit = (id: number) => {
    const ratingToEdit = ageRatings.find(d => d.idAgeRating === id);
    if (ratingToEdit) {
      setSelectedAgeRating(ratingToEdit);
      setIsModalOpen(true); // ⬅️ Abre la modal
    } 
  };
  
  // Mismo patrón que DirectorList y MoviesList
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgeRating(null);
  };
  
  const handleAgeRatingUpdated = () => {
    handleCloseModal(); // 1. Cierra la modal
    loadAgeRatings();   // 2. Recarga la lista 
  };
  
  const handleDelete = async (id: number) => {
    const ratingName = ageRatings.find(d => d.idAgeRating === id)?.nameAgeRating || `ID ${id}`;
    if (window.confirm(`¿Estás seguro de eliminar la clasificación "${ratingName}"?`)) {
        try {
            await axios.delete(`${API_URL}/age-rating/${id}`);
            alert(`Clasificación ${ratingName} eliminada exitosamente.`);
            loadAgeRatings(); 
        } catch (err) {
            console.error('Error al eliminar clasificación:', err);
            if (isAxiosError(err) && err.response?.status === 409) {
                alert(`No se puede eliminar la clasificación ${ratingName}. Está asociada a películas.`);
            } else {
                alert('Ocurrió un error al eliminar la clasificación.');
            }
        }
    }
  };

  const handleNavigateToAdd = () => {
    navigate('/admin/ageratings/new'); 
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };


  // --- RENDERING ---

  if (isLoading) {
    return (
        <Layout>
            <div className="text-white text-center py-20">Cargando clasificaciones...</div>
        </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      > 
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">Administración de Clasificaciones</h1>
            <p className="text-gray-400">
              Gestión de clasificaciones por edad y sus descripciones.
            </p>
          </div>
          
          <button
            onClick={handleNavigateToAdd}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Nueva Clasificación
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="mb-6 flex space-x-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500 transition duration-150"
                />
            </div>
        </div>
        {/* --------------------------- */}


        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 min-h-[50vh]">
          <div className="overflow-y-auto overflow-x-hidden pr-2"> 
            
            {error ? (
              <div className="text-red-500 text-center py-10">{error}</div>
            ) : filteredAgeRatings.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                {searchTerm 
                    ? `No se encontraron clasificaciones para la búsqueda: "${searchTerm}".`
                    : 'No hay clasificaciones registradas.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Dos columnas para mejor visualización del contenido */}
                {/* Mapeamos sobre la lista FILTRADA */}
                {filteredAgeRatings.map((rating, index) => (
                    <motion.div
                        key={rating.idAgeRating}
                        variants={itemVariants}
                        transition={{ delay: index * 0.05 }} 
                        className="bg-gray-700 rounded-lg shadow-md overflow-hidden transition duration-300 hover:bg-gray-600 p-4 border border-gray-600 flex flex-col justify-between"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-white leading-tight">
                                {rating.nameAgeRating}
                            </h3>
                            <span className="text-gray-400 text-sm flex-shrink-0 ml-4">
                                ID: <strong className="text-gray-300">{rating.idAgeRating}</strong>
                            </span>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                           {rating.descAgeRating}
                        </p>
                        
                        {/* Acciones (Botones) */}
                        <div className="flex justify-end space-x-2 flex-shrink-0 border-t border-gray-600 pt-3">
                            <button
                                onClick={() => handleEdit(rating.idAgeRating)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition duration-200 shadow-md"
                                title="Editar Clasificación"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(rating.idAgeRating)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition duration-200 shadow-md"
                                title="Eliminar Clasificación"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </motion.div>
      
      {/* ⬅️ RENDERIZADO DEL MODAL DE EDICIÓN */}
      {isModalOpen && selectedAgeRating && (
        <AgeRatingEditModal
          rating={selectedAgeRating}
          onClose={handleCloseModal}
          onUpdateSuccess={handleAgeRatingUpdated}
        />
      )}
    </Layout>
  );
};

export default AgeRatingList;