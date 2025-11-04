// src/pages/MovieDetail/MovieDetail.tsx
// CORREGIDO: Lógica de URL de póster robusta (maneja si falta o no la '/')

import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RotateCw, AlertTriangle } from 'lucide-react';
import Layout from '../../components/shared/Layout'; 

const API_URL = 'http://localhost:3000';

interface MovieDetail {
  idMovie: number;
  nameMovie: string;
  durationMovie: number;
  synapsisMovie: string;
  realseDateMovie: string; // ISO String
  posterMovie: string;
  director?: { nameDirector: string };
  ageRating?: { nameAgeRating: string };
  movieGenres?: { genre: { nameGenre: string } }[];
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; 

    const fetchMovieDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<MovieDetail>(`${API_URL}/movie/${id}`);
        setMovie(response.data);
      } catch (err) {
        console.error('Error fetching movie detail:', err);
        setError('No se pudo cargar la película. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]); 

  // ... (Manejo de estados de carga y error sin cambios) ...
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-900 text-white">
          <RotateCw className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  if (error) {
     return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-900 text-white">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-4xl font-bold mb-2">Error</h1>
          <p className="text-xl text-gray-400">{error}</p>
          <Link to="/" className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
            Volver a la Cartelera
          </Link>
        </div>
      </Layout>
    );
  }
  
  if (!movie) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-900 text-white">
          <h1 className="text-4xl font-bold">Película no encontrada</h1>
        </div>
      </Layout>
    );
  }


  // 1. CORRECCIÓN ROBUSTA:
  //    Comprueba si la ruta del póster ya empieza con '/'
  let posterUrl = 'https://placehold.co/400x600/1f2937/9ca3af?text=No+Poster';
  if (movie.posterMovie) {
    if (movie.posterMovie.startsWith('/')) {
      // Si ya tiene el slash (Ej: /uploads/img.jpg)
      posterUrl = `${API_URL}${movie.posterMovie}`;
    } else {
      // Si no tiene el slash (Ej: uploads/img.jpg)
      posterUrl = `${API_URL}/${movie.posterMovie}`;
    }
  }
  
  const buyLink = `/buy/${movie.idMovie}`;
  const buttonText = 'Comprar Boletos'; 

  const genres = movie.movieGenres?.map(mg => mg.genre?.nameGenre).join(', ') ?? 'Género no disponible';
  const releaseDate = new Date(movie.realseDateMovie).toLocaleDateString('es-GT', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const duration = `${Math.floor(movie.durationMovie / 60)}h ${movie.durationMovie % 60}m`;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 p-4">
              <img 
                src={posterUrl} // Usamos la URL robusta
                alt={`Poster de ${movie.nameMovie}`} 
                className="rounded-lg w-full h-auto object-cover" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x600/1f2937/9ca3af?text=Error';}}
              />
            </div>
            <div className="w-full lg:w-2/3 p-6">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {movie.ageRating?.nameAgeRating ?? 'N/C'}
              </span>
              <h1 className="text-4xl font-bold text-white mt-3 mb-2">{movie.nameMovie}</h1>
              <p className="text-gray-400 mb-4">Director: {movie.director?.nameDirector ?? 'Desconocido'}</p>
              <p className="text-lg text-gray-300 mb-6">{movie.synapsisMovie}</p>
              <p className="text-sm text-gray-400 mb-2">Género: {genres}</p>
              <p className="text-sm text-gray-400 mb-2">Duración: {duration}</p>
              <p className="text-md font-bold text-green-400 mb-4">Fecha de Estreno: {releaseDate}</p>
              
              <Link to={buyLink} className="inline-block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  {buttonText}
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default MovieDetail;