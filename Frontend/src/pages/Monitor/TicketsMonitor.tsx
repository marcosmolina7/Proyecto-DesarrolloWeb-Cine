// src/pages/Monitor/TicketsMonitor.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeatingChart from '../../components/ui/SeatingChart';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface Movie {
  idMovie: number;
  nameMovie: string;
  posterMovie: string;
  synapsisMovie: string;
}

interface Seat {
  idSeat: number;
  rowSeat: string;
  columnSeat: number;
}

interface RoomSeat {
  idSeat: number;
  seat: Seat;
}

interface Room {
  idRoom: number;
  nameRoom: string;
  roomSeats: RoomSeat[];
}

interface Showtime {
  idShowtime: number;
  dateTimeShowtime: string;
  room: Room;
  tickets: any[];
}

const TicketsMonitor = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [transaction, setTransaction] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [ticketsTotal, setTicketsTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/movie`);
        setMovies(response.data);
      } catch (error) {
        console.error('Error al cargar películas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const loadShowtimes = async () => {
      if (transaction?.selectedMovie?.idMovie) {
        try {
          const response = await axios.get(`${API_URL}/showtime/movie/${transaction.selectedMovie.idMovie}`);
          setShowtimes(response.data);
        } catch (error) {
          console.error('Error al cargar horarios:', error);
          setShowtimes([]);
        }
      } else {
        setShowtimes([]);
      }
    };

    loadShowtimes();
  }, [transaction?.selectedMovie?.idMovie]);

  useEffect(() => {
    const updateTransactionState = () => {
      const data = localStorage.getItem('cashier-transaction');
      if (!data) return;

      try {
        const parsedData = JSON.parse(data);

        setTransaction((prev: any) => ({
          ...prev,
          selectedMovie: parsedData.selectedMovie || prev?.selectedMovie || null,
          selectedShowtime: parsedData.selectedShowtime || prev?.selectedShowtime || null,
          selectedSeats: parsedData.selectedSeats || prev?.selectedSeats || [],
        }));
      } catch (e) {
        console.error("Error al parsear la transacción en el monitor:", e);
      }
    };

    window.addEventListener('storage', updateTransactionState);
    updateTransactionState();

    return () => {
      window.removeEventListener('storage', updateTransactionState);
    };
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    const carouselInterval = setInterval(() => {
      setCurrentMovieIndex(prevIndex => (prevIndex + 1) % movies.length);
    }, 5000);

    return () => {
      clearInterval(carouselInterval);
    };
  }, [movies]);

  useEffect(() => {
    if (transaction?.selectedSeats) {
      const total = transaction.selectedSeats.length * 50;
      setTicketsTotal(total);
    }
  }, [transaction?.selectedSeats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-2xl">Cargando...</p>
      </div>
    );
  }

  if (!transaction || !transaction.selectedMovie) {
    const currentMovie = movies[currentMovieIndex];
    
    if (!currentMovie) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
          <p className="text-2xl">No hay películas disponibles</p>
        </div>
      );
    }

    const posterUrl = currentMovie.posterMovie
      ? `${API_URL}/${currentMovie.posterMovie}`
      : 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Sin+Poster';

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMovieIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
              <img
                src={posterUrl}
                alt={currentMovie.nameMovie}
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/400x600/1f2937/ffffff?text=Sin+Poster';
                }}
              />
              <div className="p-6">
                <h2 className="text-3xl font-bold text-white mb-3">
                  {currentMovie.nameMovie}
                </h2>
                <p className="text-gray-400 text-lg">
                  {currentMovie.synapsisMovie}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const { selectedMovie, selectedShowtime, selectedSeats } = transaction;

  const posterUrl = selectedMovie.posterMovie
    ? `${API_URL}/${selectedMovie.posterMovie}`
    : 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sin+Poster';

  const availableSeats = selectedShowtime?.room?.roomSeats
    ? selectedShowtime.room.roomSeats.map((rs: RoomSeat) => 
        `${rs.seat.rowSeat}${rs.seat.columnSeat}`
      )
    : [];

  const occupiedSeats = selectedShowtime?.tickets
    ? selectedShowtime.tickets.map((ticket: any) => {
        const rs = selectedShowtime.room.roomSeats.find(
          (s: RoomSeat) => s.idSeat === ticket.idSeat
        );
        return rs ? `${rs.seat.rowSeat}${rs.seat.columnSeat}` : '';
      }).filter(Boolean)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-950 text-white p-8 flex flex-col"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-green-400 text-center mb-4 md:mb-0">
          Resumen de Compra - Boletos
        </h1>
        <div className="text-center md:text-right">
          <p className="text-2xl font-bold">TOTAL:</p>
          <p className="text-6xl font-extrabold text-green-400">{ticketsTotal} GTQ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        <div className="bg-gray-800 p-10 rounded-xl border border-gray-700 flex flex-col">
          <div className="flex items-start space-x-8 mb-8">
            <img
              src={posterUrl}
              alt={selectedMovie.nameMovie}
              className="w-56 h-80 rounded-lg object-cover flex-shrink-0 shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/200x300/1f2937/ffffff?text=Sin+Poster';
              }}
            />
            <div className="flex-grow">
              <h2 className="text-5xl font-bold text-blue-300 mb-4 leading-tight">
                {selectedMovie.nameMovie}
              </h2>
              <p className="text-3xl text-gray-300 mb-3 font-semibold">
                🎫 {selectedSeats?.length || 0} Boletos
              </p>
              {selectedShowtime && (
                <>
                  <p className="text-2xl text-gray-400 mb-3">
                    📅 {new Date(selectedShowtime.dateTimeShowtime).toLocaleString('es-GT', {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </p>
                  <p className="text-2xl text-gray-400">
                    🎬 Sala: {selectedShowtime.room.nameRoom}
                  </p>
                </>
              )}
            </div>
          </div>

          {showtimes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-3xl font-semibold text-blue-300 mb-4">
                Horarios Disponibles
              </h3>
              <div className="flex flex-wrap gap-4">
                {showtimes.map(showtime => (
                  <span
                    key={showtime.idShowtime}
                    className={`px-6 py-3 rounded-full text-xl font-semibold transition-colors ${
                      selectedShowtime?.idShowtime === showtime.idShowtime
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {new Date(showtime.dateTimeShowtime).toLocaleString('es-GT', {
                      timeStyle: 'short',
                    })}
                    <br />
                    <span className="text-base">
                      {showtime.room.nameRoom}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedSeats && selectedSeats.length > 0 && (
            <div className="mt-auto p-8 bg-gray-700 rounded-lg shadow-inner">
              <h3 className="text-3xl font-semibold text-blue-300 mb-4">
                🪑 Asientos Seleccionados
              </h3>
              <p className="text-3xl text-white font-mono font-bold leading-relaxed">
                {selectedSeats.join(', ')}
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
          {availableSeats.length > 0 ? (
            <SeatingChart
              seats={availableSeats}
              selectedSeats={selectedSeats || []}
              occupiedSeats={occupiedSeats}
              isClickable={false}
              seatSize="w-10 h-10"
            />
          ) : (
            <p className="text-gray-500 text-xl">
              Esperando selección de función...
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TicketsMonitor;