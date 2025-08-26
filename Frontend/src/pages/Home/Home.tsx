// src/pages/Home/Home.tsx
import React, { useState } from 'react';
import { allMovies } from '../../data'; // ⬅️ Importamos de data.js
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMovies = allMovies.filter(movie => {
        return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 pt-20">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.length > 0 ? (
                    filteredMovies.map(movie => (
                        <motion.div
                            key={movie.id}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700"
                        >
                            <img src={movie.poster} alt={movie.title} className="w-full h-72 object-cover" />
                            <div className="p-4">
                                <h2 className="text-xl font-bold text-white mb-1">{movie.title}</h2>
                                <p className="text-gray-400 text-sm">{movie.description}</p>
                                <div className="mt-4 flex space-x-2">
                                    <Link to={`/detail/${movie.id}`}>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                                            Detalles
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-400">No se encontraron películas.</p>
                )}
            </div>
        </div>
    );
};

export default Home;