// src/pages/Home/Home.tsx

import React from 'react';
import MovieCard from '../../components/ui/MovieCard';
import { moviesData } from '../Tickets/TicketPurchase'; // ⬅️ Importamos los datos universales

const Home = () => {
  // ⬅️ Ahora filtramos las películas de cartelera del arreglo universal
  const carteleraMovies = moviesData.filter(movie => movie.type === 'cartelera');

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-10">Cartelera</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {carteleraMovies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Home;
