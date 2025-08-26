// src/components/ui/MovieCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster: string;
  description: string;
  type: string;
}

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  const linkTo = `/detail/${movie.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <Link to={linkTo}>
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="w-full h-80 object-cover" 
        />
        <div className="p-4">
          <h3 className="text-xl font-bold text-blue-400">{movie.title}</h3>
          <p className="text-sm text-gray-400 mt-1 h-12 overflow-hidden">{movie.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
