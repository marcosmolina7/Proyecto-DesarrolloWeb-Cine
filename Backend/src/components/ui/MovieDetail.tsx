// src/pages/MovieDetail/MovieDetail.tsx

import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import React from 'react';
import { moviesData } from '../Tickets/TicketPurchase';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  // ⬅️ Buscamos la película por ID
  const movie = moviesData.find(m => m.id === Number(id));

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Película no encontrada</h1>
      </div>
    );
  }

  const isPreSale = movie.type === 'preventa';
  // ⬅️ La ruta de compra ahora es universal
  const buyLink = `/buy/${movie.id}`;
  const buttonText = isPreSale ? 'Comprar Preventa' : 'Comprar Boletos';

  return (
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
              src={movie.poster} 
              alt={`Poster de ${movie.title}`} 
              className="rounded-lg w-full h-auto object-cover" 
            />
          </div>
          <div className="w-full lg:w-2/3 p-6">
            <h1 className="text-4xl font-bold text-blue-400 mb-2">{movie.title}</h1>
            <p className="text-gray-400 mb-4">**Director:** {movie.director}</p>
            <p className="text-lg mb-6">{movie.description}</p>
            <p className="text-sm text-gray-400 mb-2">**Género:** {movie.genre}</p>
            <p className="text-sm text-gray-400 mb-2">**Duración:** {movie.duration}</p>
            <p className="text-md font-bold text-green-400 mb-4">Fecha de Estreno: {movie.releaseDate}</p>

            <motion.a
              href={movie.trailer}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              Ver Tráiler
            </motion.a>

            <Link to={buyLink} className="inline-block ml-4">
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
  );
};

export default MovieDetail;
