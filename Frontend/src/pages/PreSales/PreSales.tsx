// src/pages/PreSales/PreSales.tsx
// CORREGIDO: Ya no importa 'moviesData'.
// CORREGIDO: Llama a la API (GET /movie) y filtra películas por fecha de estreno futura.
// CORREGIDO: Arreglada la URL del póster (añadida la '/').
// CORREGIDO: Eliminado el <Layout> duplicado.

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { RotateCw, AlertTriangle } from 'lucide-react';
// 1. ELIMINADO: import Layout

const API_URL = 'http://localhost:3000';

// Interfaz (la misma que Home.tsx)
interface Movie {
    idMovie: number;
    nameMovie: string;
    synapsisMovie: string;
    realseDateMovie: string; // ISO String
    posterMovie: string;
    stateMovie: boolean;
}

const PreSales = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 2. CORRECCIÓN: Llamar a la API (endpoint singular)
                const response = await axios.get<Movie[]>(`${API_URL}/movie`); 
                setMovies(response.data);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('No se pudieron cargar las preventas.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, []);

    // 3. Lógica de Filtro para Preventas
    const presaleMovies = movies.filter(movie => {
        const releaseDate = new Date(movie.realseDateMovie);
        const today = new Date();
        // Preventa = Activa Y su fecha de estreno es en el futuro
        today.setHours(0, 0, 0, 0); 
        return movie.stateMovie === true && releaseDate > today;
    });

    return (
      // 4. ELIMINADO: El <Layout> wrapper
      <div className="min-h-screen bg-gray-900 text-white p-8">
          <h1 className="text-4xl font-bold text-center text-blue-400 mb-10">Preventas</h1>
          
          {isLoading && (
              <div className="flex items-center justify-center min-h-[50vh]"><RotateCw className="w-12 h-12 animate-spin text-blue-500" /></div>
          )}

          {error && (
              <div className="flex flex-col items-center justify-center min-h-[50vh]"><AlertTriangle className="w-12 h-12 text-red-500 mb-4" /><p className="text-xl text-gray-400">{error}</p></div>
          )}
          
          {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {presaleMovies.length > 0 ? (
                      presaleMovies.map((movie, index) => {
                          // 5. CORRECCIÓN: Lógica robusta de URL de póster
                          let posterUrl = 'https://placehold.co/400x600/1f2937/9ca3af?text=No+Poster';
                          if (movie.posterMovie) {
                            if (movie.posterMovie.startsWith('/')) {
                              posterUrl = `${API_URL}${movie.posterMovie}`;
                            } else {
                              posterUrl = `${API_URL}/${movie.posterMovie}`;
                            }
                          }

                          return (
                              <motion.div
                                  key={movie.idMovie}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 cursor-pointer"
                              >
                                  <Link to={`/detail/${movie.idMovie}`}>
                                      <img 
                                          src={posterUrl} 
                                          alt={movie.nameMovie} 
                                          className="w-full h-96 object-cover" 
                                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/1f2937/9ca3af?text=Error';}}
                                      />
                                      <div className="p-4">
                                          <h3 className="text-xl font-bold text-white">{movie.nameMovie}</h3>
                                          <p className="text-sm text-gray-400 mt-1 h-10 overflow-hidden">{movie.synapsisMovie.substring(0, 50)}...</p>
                                      </div>
                                  </Link>
                              </motion.div>
                          );
                      })
                  ) : (
                      <p className="col-span-full text-center text-gray-400">No hay películas en preventa en este momento.</p>
                  )}
              </div>
          )}
      </div>
    );
};

export default PreSales;