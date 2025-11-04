// src/pages/Admint/DirectorList.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';      
import { Plus, Trash2, Edit, Search } from 'lucide-react';         
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios'; 
import DirectorEditModal from './DirectorEditModal'; 

// --- 1. INTERFAZ DE DATOS ---
interface Director {
  idDirector: number; 
  nameDirector: string;
}

interface DirectorListProps {
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


const DirectorList = ({ shouldReload }: DirectorListProps) => {
  const navigate = useNavigate(); 
  
  const [directors, setDirectors] = useState<Director[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);

  // --- LÓGICA DE CARGA DE DATOS ---
  const loadDirectors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Director[]>(`${API_URL}/director`);
      
      const directorsData = response.data;
      const sortedDirectors = directorsData.sort((a, b) => a.idDirector - b.idDirector);
      
      setDirectors(sortedDirectors); 
    } catch (err) {
      console.error('Error al cargar directores:', err);
      if (isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 404) {
              setError(`Error 404: El endpoint ${API_URL}/director no fue encontrado.`);
          } else {
              setError(`Error de API: ${err.response?.statusText || 'No se pudo conectar al servidor.'}`);
          }
      } else {
          setError('Hubo un error al cargar los directores.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDirectors();
  }, [shouldReload]);
  
  // FUNCIÓN DE FILTRADO OPTIMIZADA
  const filteredDirectors = useMemo(() => {
    if (!searchTerm) {
      return directors; 
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return directors.filter(director => 
      director.nameDirector.toLowerCase().includes(lowerCaseSearch)
    );
  }, [directors, searchTerm]); 


  // --- MANEJADORES DE LA MODAL ---
  
  const handleEdit = (id: number) => {
    const directorToEdit = directors.find(d => d.idDirector === id);
    if (directorToEdit) {
      setSelectedDirector(directorToEdit);
      setIsModalOpen(true);
    } 
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDirector(null);
  };
  
  // ⬅️ PATRÓN MOVIESLIST: Cierra primero, luego recarga la lista
  const handleDirectorUpdated = () => {
    handleCloseModal(); // 1. Cierra la modal
    loadDirectors();    // 2. Recarga la lista
  };
  
  // --- OTRAS ACCIONES ---
  
  const handleDelete = async (id: number) => {
    const directorName = directors.find(d => d.idDirector === id)?.nameDirector || `ID ${id}`;
    if (window.confirm(`¿Estás seguro de eliminar al director "${directorName}"?`)) {
        try {
            await axios.delete(`${API_URL}/director/${id}`);
            alert(`Director ${directorName} eliminado exitosamente.`);
            loadDirectors(); 
        } catch (err) {
            console.error('Error al eliminar director:', err);
            if (isAxiosError(err) && err.response?.status === 409) {
                alert(`No se puede eliminar al director ${directorName}. Está asociado a películas.`);
            } else {
                alert('Ocurrió un error al eliminar el director.');
            }
        }
    }
  };

  const handleNavigateToAdd = () => {
    navigate('/admin/directors/new'); 
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };


  // --- RENDERING ---

  if (isLoading) {
    return (
        <Layout>
            <div className="text-white text-center py-20">Cargando directores...</div>
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
            <h1 className="text-4xl font-extrabold text-white mb-2">Administración de Directores</h1>
            <p className="text-gray-400">
              Gestión de directores registrados.
            </p>
          </div>
          
          <button
            onClick={handleNavigateToAdd}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Nuevo Director
          </button>
        </div>

        {/* BARRA DE BÚSQUEDA */}
        <div className="mb-6 flex space-x-4">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar director por nombre..."
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
            ) : filteredDirectors.length === 0 ? (
              <p className="text-gray-400 text-center py-10">
                {searchTerm 
                    ? `No se encontraron directores para la búsqueda: "${searchTerm}".`
                    : 'No hay directores registrados.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Mapeamos sobre la lista FILTRADA */}
                {filteredDirectors.map((director, index) => (
                    <motion.div
                        key={director.idDirector}
                        variants={itemVariants}
                        transition={{ delay: index * 0.05 }} 
                        className="bg-gray-700 rounded-lg shadow-md overflow-hidden transition duration-300 hover:bg-gray-600 flex justify-between items-center p-4 border border-gray-600"
                    >
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-white leading-tight">
                                {director.nameDirector}
                            </h3>
                            <span className="text-gray-400 text-sm mt-1">
                                ID: <strong className="text-gray-300">{director.idDirector}</strong>
                            </span>
                        </div>
                        
                        {/* Acciones (Botones) */}
                        <div className="flex space-x-2 flex-shrink-0">
                            <button
                                onClick={() => handleEdit(director.idDirector)}
                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition duration-200 shadow-md"
                                title="Editar Director"
                            >
                                <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(director.idDirector)}
                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition duration-200 shadow-md"
                                title="Eliminar Director"
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
      
      {/* ⬅️ RENDERIZADO DE LA MODAL DE EDICIÓN */}
      {isModalOpen && selectedDirector && (
        <DirectorEditModal
          director={selectedDirector}
          onClose={handleCloseModal}
          onUpdateSuccess={handleDirectorUpdated} // ⬅️ Usa el patrón de MoviesList
        />
      )}
    </Layout>
  );
};

export default DirectorList;