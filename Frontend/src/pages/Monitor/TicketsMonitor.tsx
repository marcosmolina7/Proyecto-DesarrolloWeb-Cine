import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeatingChart from '../../components/ui/SeatingChart';
import { allMovies } from '../../data';
import MovieCard from '../../components/ui/MovieCard';

const generateSeats = () => {
  const seatLabels: string[] = [];
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

const TicketsMonitor = () => {
  const [transaction, setTransaction] = useState<any>(null);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [ticketsTotal, setTicketsTotal] = useState(0);

  useEffect(() => {
    const updateTransactionState = () => {
      const data = localStorage.getItem('cashier-transaction');
      if (!data) return;

      try {
        const parsedData = JSON.parse(data);

        setTransaction((prev: any) => ({
          ...prev,
          selectedMovie: parsedData.selectedMovie || prev?.selectedMovie || null,
          selectedSeats: parsedData.selectedSeats || prev?.selectedSeats || [],
          selectedDate: parsedData.selectedDate || prev?.selectedDate || null,
          selectedTime: parsedData.selectedTime || prev?.selectedTime || null
        }));
      } catch (e) {
        console.error("Error al parsear la transacción en el monitor:", e);
      }
    };

    const carouselInterval = setInterval(() => {
      setCurrentMovieIndex(prevIndex => (prevIndex + 1) % allMovies.length);
    }, 5000);

    window.addEventListener('storage', updateTransactionState);
    updateTransactionState();

    return () => {
      window.removeEventListener('storage', updateTransactionState);
      clearInterval(carouselInterval);
    };
  }, []);

  // 🔹 Recalcular total cada vez que cambien los asientos seleccionados
  useEffect(() => {
    if (transaction?.selectedSeats) {
      const total = transaction.selectedSeats.length * 50; // Precio por boleto
      setTicketsTotal(total);
    }
  }, [transaction?.selectedSeats]);

  // Si no hay datos de boletos, mostrar carrusel de películas
  if (!transaction || !transaction.selectedMovie) {
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

  const { selectedMovie, selectedSeats, selectedTime, selectedDate } = transaction;
  const movie = allMovies.find(m => m.id === selectedMovie.id);

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
          <p className="text-4xl font-extrabold text-green-400">{ticketsTotal} GTQ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col">
          <div className="flex items-center space-x-6 mb-4">
            <img src={movie.poster} alt={movie.title} className="w-24 h-36 rounded-lg object-cover" />
            <div className="flex-grow">
              <h2 className="text-3xl font-bold text-blue-300 mb-2">{movie.title}</h2>
              <p className="text-lg text-gray-400">Boletos: {selectedSeats?.length}</p>
              <p className="text-lg text-gray-400">
                Fecha: {selectedDate
                  ? new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
                  : 'N/A'}
              </p>
              <p className="text-lg text-gray-400">Hora: {selectedTime || 'N/A'}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-blue-300 mb-2">Horarios Disponibles</h3>
            <div className="flex flex-wrap gap-2">
              {movie?.showtimes.map(showtime => (
                showtime?.times?.map(time => (
                  <span
                    key={`${showtime.date}-${time}`}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors
                      ${selectedTime === time && selectedDate === showtime.date
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                      }`}
                  >
                    {time}
                  </span>
                ))
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
          <SeatingChart 
            seats={seats} 
            selectedSeats={selectedSeats} 
            isClickable={false} 
            seatSize="w-16 h-20" 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TicketsMonitor;
