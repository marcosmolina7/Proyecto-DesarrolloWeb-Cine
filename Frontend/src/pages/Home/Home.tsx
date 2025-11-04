// src/pages/Home/Home.tsx
// CORREGIDO: Llama a la API real (GET /movie) y usa axios.
// CORREGIDO: Filtra para mostrar solo películas activas Y ya estrenadas.
// CORREGIDO: Añadida la '/' que faltaba en la URL del póster.
// CORREGIDO: Eliminado el <Layout> duplicado que causaba doble footer.

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { RotateCw, AlertTriangle } from 'lucide-react';
// 1. ELIMINADO: import Layout from '../../components/shared/Layout'; 

const API_URL = 'http://localhost:3000';

interface Movie {
    idMovie: number;
    nameMovie: string;
    synapsisMovie: string;
    realseDateMovie: string; // ISO String
    posterMovie: string; 
    stateMovie: boolean;
}

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get<Movie[]>(`${API_URL}/movie`); 
                setMovies(response.data);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('No se pudieron cargar las películas. Asegúrate de que el backend esté corriendo.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // 2. Lógica de filtro
    const activeAndReleasedMovies = movies.filter(movie => {
        const releaseDate = new Date(movie.realseDateMovie);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Comparar solo fechas
        return movie.stateMovie === true && releaseDate <= today; // Activa y ya estrenada
    });

    const filteredMovies = activeAndReleasedMovies.filter(movie => {
        return movie.nameMovie.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
      // 3. ELIMINADO: El <Layout> wrapper
      <div className="min-h-screen bg-gray-900 text-white p-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-6">Cartelera</h1>
          <div className="relative mb-6">
              <input
                  type="text"
                  placeholder="Buscar películas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
          </div>
          
          {isLoading && (
              <div className="flex items-center justify-center min-h-[50vh]"><RotateCw className="w-12 h-12 animate-spin text-blue-500" /></div>
          )}

          {error && (
              <div className="flex flex-col items-center justify-center min-h-[50vh]"><AlertTriangle className="w-12 h-12 text-red-500 mb-4" /><p className="text-xl text-gray-400">{error}</p></div>
          )}

          {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredMovies.length > 0 ? (
                      filteredMovies.map(movie => {
                          const movieId = movie.idMovie; 
                          
                          const posterUrl = movie.posterMovie
                              ? `${API_URL}/${movie.posterMovie}` // Ruta corregida
                              : 'https://placehold.co/400x600/1f2937/9ca3af?text=No+Poster';
                          
                          const releaseYear = new Date(movie.realseDateMovie).getFullYear();

                          return (
                              <motion.div
                                  key={movieId}
                                  whileHover={{ scale: 1.05 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 cursor-pointer"
                              >
                                  <Link to={`/detail/${movieId}`}>
                                      <img 
                                          src={posterUrl} 
                                          alt={movie.nameMovie} 
                                          className="w-full h-96 object-cover" 
                                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/1f2937/9ca3af?text=Error';}}
                                      />
                                      <div className="p-4">
                                          <h2 className="text-xl font-bold text-white mb-1">{movie.nameMovie}</h2>
                                          <p className="text-gray-400 text-sm mb-2 h-10 overflow-hidden">
                                              {movie.synapsisMovie.substring(0, 50)}...
                                          </p>
                                          <div className="flex justify-between items-center">
                                              <span className="text-sm text-blue-400 font-semibold">{releaseYear}</span>
                                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                                                  Detalles
                                              </button>
                                          </div>
                                      </div>
                                  </Link>
                              </motion.div>
                          );
                      })
                  ) : (
                      <p className="col-span-full text-center text-gray-400">
                          {searchTerm 
                              ? 'No se encontraron películas que coincidan.' 
                              : 'No hay películas en cartelera en este momento.'}
                      </p>
                  )}
              </div>
          )}
      </div>
      // 4. ELIMINADO: El </Layout> de cierre
    );
};

export default Home;