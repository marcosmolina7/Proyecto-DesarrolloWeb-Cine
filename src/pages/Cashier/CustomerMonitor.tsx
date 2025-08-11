// src/pages/Cashier/CustomerMonitor.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeatingChart from '../../components/ui/SeatingChart';
import MovieCard from '../../components/ui/MovieCard';

// ⬅️ Actualizado: Se agregaron los mismos datos de películas que usa el componente Cashier
const allMovies = [
  { 
    id: 1, 
    title: "Misión Imposible: Deuda mortal", 
    type: "cartelera", 
    poster: "https://m.media-amazon.com/images/M/MV5BNjU3MjQ0ZjItMmNmOS00NTYxLTljYjYtNWViNzM4MjQ0ZDQxXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_FMjpg_UX1000_.jpg", 
    showtimes: [{ date: '2025-08-09', times: ['14:00', '16:30', '19:00'] }, { date: '2025-08-10', times: ['15:00', '18:00', '21:00'] }],
    director: 'Christopher McQuarrie',
    description: 'Ethan Hunt y su equipo se embarcan en su misión más peligrosa hasta la fecha: rastrear un arma aterradora que amenaza a toda la humanidad antes de que caiga en las manos equivocadas.',
    genre: 'Acción, Aventura, Thriller',
    duration: '2h 43min'
  },
  { 
    id: 2, 
    title: "Barbie", 
    type: "cartelera", 
    poster: "https://m.media-amazon.com/images/M/MV5BYzJkY2MxMWUtYmMxMS00OTY1LWE4MjQtNjBlYTI0ZjdiMzMyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg", 
    showtimes: [{ date: '2025-08-09', times: ['14:30', '17:00', '20:30'] }, { date: '2025-08-10', times: ['16:00', '19:00', '22:00'] }],
    description: "Barbie y Ken se aventuran en el mundo real.",
  },
  { 
    id: 3, 
    title: "Oppenheimer", 
    type: "cartelera", 
    poster: "https://m.media-amazon.com/images/M/MV5BMzY1NGQxZWMtNzUyYS00MWFmLWE0ZTEtYjYwZWMxMTAyNTJjXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_FMjpg_UX1000_.jpg", 
    showtimes: [{ date: '2025-08-09', times: ['15:00', '19:00', '23:00'] }, { date: '2025-08-10', times: ['14:00', '17:30', '21:30'] }],
    description: 'La historia de J. Robert Oppenheimer, el "padre de la bomba atómica".'
  },
  { id: 4, title: "Deadpool 3", type: "preventa", poster: "https://m.media-amazon.com/images/M/MV5BMzYxODQwOTQ3YkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg", showtimes: [{ date: '2025-08-15', times: ['18:00', '21:00'] }, { date: '2025-08-16', times: ['17:00', '20:00'] }], description: "La esperada tercera entrega del mercenario bocazas." },
  { id: 5, title: "Kung Fu Panda 4", type: "preventa", poster: "https://m.media-amazon.com/images/M/MV5BNzQ0NjM2NzE1N0tYkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg", showtimes: [{ date: '2025-08-20', times: ['14:00', '16:00'] }, { date: '2025-08-21', times: ['13:00', '15:30'] }], description: "Po debe encontrar un nuevo Guerrero Dragón." },
];

// ⬅️ Actualizado: Se agregaron los mismos productos que usa el componente Cashier
const products = [
  { id: 1, name: "Palomitas Grande", price: 35 },
  { id: 2, name: "Refresco Mediano", price: 25 },
  { id: 3, name: "Nachos con Queso", price: 45 },
  { id: 4, name: "Hot Dog", price: 30 },
];

const generateSeats = () => {
    const seatLabels = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 10;
    for (let i = 0; i < 48; i++) {
        const row = rows[Math.floor(i / seatsPerRow)];
        const seatNumber = (i % seatsPerRow) + 1;
        seatLabels.push(`${row}-${seatNumber}`);
    }
    return seatLabels;
};
const seats = generateSeats();

const CustomerMonitor = () => {
    const [transaction, setTransaction] = useState<any>(null);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

    useEffect(() => {
        const updateTransactionState = () => {
            const data = localStorage.getItem('cashier-transaction');
            if (data) {
                setTransaction(JSON.parse(data));
            } else {
                setTransaction(null);
            }
        };

        const carouselInterval = setInterval(() => {
            setCurrentMovieIndex(prevIndex => (prevIndex + 1) % allMovies.length);
        }, 5000); // Cambia de película cada 5 segundos

        window.addEventListener('storage', updateTransactionState);
        updateTransactionState();

        return () => {
            window.removeEventListener('storage', updateTransactionState);
            clearInterval(carouselInterval);
        };
    }, []);

    if (!transaction || (!transaction.selectedMovie && Object.keys(transaction.productCount).length === 0)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentMovieIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        className="w-1/2"
                    >
                        <MovieCard movie={allMovies[currentMovieIndex]} showButton={false} />
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }
    const movie = transaction.selectedMovie ? allMovies.find(m => m.id === transaction.selectedMovie.id) : null;
    const subtotal = transaction.subtotal;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-screen bg-gray-950 text-white p-8 flex flex-col"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-green-400 text-center mb-4 md:mb-0">Resumen de Compra</h1>
                <div className="text-center md:text-right">
                    <p className="text-xl font-bold">TOTAL:</p>
                    <p className="text-4xl font-extrabold text-green-400">{subtotal} GTQ</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col">
                    {movie && (
                        <div className="flex items-center space-x-6 mb-4">
                            <img src={movie.poster} alt={movie.title} className="w-24 h-36 rounded-lg object-cover" />
                            <div className="flex-grow">
                                <h2 className="text-3xl font-bold text-blue-300 mb-2">{movie.title}</h2>
                                <p className="text-lg text-gray-400">Boletos: {transaction.selectedSeats?.length}</p>
                                <p className="text-lg text-gray-400">Fecha: {new Date(transaction.selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                <p className="text-lg text-gray-400">Hora: {transaction.selectedTime}</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-blue-300 mb-2">Horarios Disponibles</h3>
                        <div className="flex flex-wrap gap-2">
                            {movie?.showtimes.find((s: any) => s.date === transaction.selectedDate)?.times.map((time: string) => (
                                <span
                                    key={time}
                                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors
                                        ${transaction.selectedTime === time
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-700 text-gray-300'
                                        }`}
                                >
                                    {time}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto">
                        <h3 className="text-xl font-semibold text-blue-300 mb-2">Productos Adicionales:</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-400">
                            {Object.keys(transaction.productCount).length > 0 ? (
                                Object.keys(transaction.productCount).map(productId => {
                                    const product = products.find(p => p.id === Number(productId));
                                    if (transaction.productCount?.[Number(productId)] > 0 && product) {
                                        return (
                                            <li key={productId}>
                                                {product.name} ({transaction.productCount?.[Number(productId)]})
                                            </li>
                                        );
                                    }
                                    return null;
                                })
                            ) : (
                                <p className="text-gray-500">No hay productos seleccionados.</p>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
                    <SeatingChart seats={seats} selectedSeats={transaction.selectedSeats} isClickable={false} seatSize="w-16 h-20" />
                </div>
            </div>
        </motion.div>
    );
};

export default CustomerMonitor;
