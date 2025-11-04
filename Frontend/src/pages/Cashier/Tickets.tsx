// src/pages/Cashier/Tickets.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SeatingChart from '../../components/ui/SeatingChart';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface Movie {
  idMovie: number;
  nameMovie: string;
  posterMovie: string;
}

interface Seat {
  idSeat: number;
  rowSeat: string;
  columnSeat: number;
}

interface RoomSeat {
  idSeat: number;
  seat: Seat;
  state: string;
}

interface Room {
  idRoom: number;
  nameRoom: string;
  roomSeats: RoomSeat[];
}

interface Showtime {
  idShowtime: number;
  dateTimeShowtime: string;
  idRoom: number;
  idMovie: number;
  room: Room;
  tickets: any[];
}

const TicketsCashier = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  // Cargar películas al inicio
  useEffect(() => {
    loadMovies();
  }, []);

  // Cargar estado desde localStorage
  useEffect(() => {
    const savedTransaction = localStorage.getItem('cashier-transaction');
    if (savedTransaction) {
      try {
        const t = JSON.parse(savedTransaction);
        setSelectedMovie(t.selectedMovie || null);
        setSelectedShowtime(t.selectedShowtime || null);
        setSelectedSeats(t.selectedSeats || []);
      } catch (e) {
        console.error('Error al parsear la transacción:', e);
        localStorage.removeItem('cashier-transaction');
      }
    }
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/movie`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error al cargar películas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadShowtimes = async (movieId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/showtime/movie/${movieId}`);
      setShowtimes(response.data);
    } catch (error) {
      console.error('Error al cargar funciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const TICKET_PRICE = 50;
  const calculateTicketsSubtotal = (seats: string[]) => seats.length * TICKET_PRICE;

  const updateLocalStorage = (partialData: Record<string, any>) => {
    const existing = JSON.parse(localStorage.getItem('cashier-transaction') || '{}');
    const updated = {
      ...existing,
      ...partialData,
      productCount: partialData.productCount ?? existing.productCount ?? {},
      productsSubtotal: partialData.productsSubtotal ?? existing.productsSubtotal ?? 0,
    };
    localStorage.setItem('cashier-transaction', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedShowtime(null);
    setSelectedSeats([]);
    setShowtimes([]);
    loadShowtimes(movie.idMovie);

    updateLocalStorage({
      selectedMovie: movie,
      selectedShowtime: null,
      selectedSeats: [],
      ticketsSubtotal: 0,
    });
  };

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);

    updateLocalStorage({
      selectedMovie,
      selectedShowtime: showtime,
      selectedSeats: [],
      ticketsSubtotal: 0,
    });
  };

  const handleSeatClick = (seatLabel: string) => {
    const newSeats = selectedSeats.includes(seatLabel)
      ? selectedSeats.filter(s => s !== seatLabel)
      : [...selectedSeats, seatLabel];

    setSelectedSeats(newSeats);

    updateLocalStorage({
      selectedMovie,
      selectedShowtime,
      selectedSeats: newSeats,
      ticketsSubtotal: calculateTicketsSubtotal(newSeats),
    });
  };

  const filteredMovies = movies.filter(movie =>
    movie.nameMovie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openTicketsMonitor = () => {
    window.open('/tickets-monitor', '_blank', 'width=800,height=600');
  };

  // Generar asientos disponibles basados en showtime seleccionado
  const availableSeats = selectedShowtime
    ? selectedShowtime.room.roomSeats.map(rs => `${rs.seat.rowSeat}${rs.seat.columnSeat}`)
    : [];

  // Asientos ocupados
  const occupiedSeats = selectedShowtime
    ? selectedShowtime.tickets.map(ticket => {
        const rs = selectedShowtime.room.roomSeats.find(
          s => s.idSeat === ticket.idSeat
        );
        return rs ? `${rs.seat.rowSeat}${rs.seat.columnSeat}` : '';
      }).filter(Boolean)
    : [];

  const ticketsSubtotal = calculateTicketsSubtotal(selectedSeats);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <div className="flex-grow p-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-400">Terminal de Ventas - Boletos</h1>
          <motion.button
            onClick={openTicketsMonitor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
          >
            Abrir Monitor para Cliente
          </motion.button>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">1. Seleccionar Película</h2>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar películas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <p className="text-center text-gray-400">Cargando...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMovies.length > 0 ? (
                filteredMovies.map(movie => {
                  // ✅ CORREGIDO: Construir URL igual que en Home.tsx
                  const posterUrl = movie.posterMovie
                    ? `${API_URL}/${movie.posterMovie}`
                    : 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sin+Poster';

                  return (
                    <motion.div
                      key={movie.idMovie}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMovieSelect(movie)}
                      className={`bg-gray-700 p-3 rounded-lg cursor-pointer transition-transform ${
                        selectedMovie?.idMovie === movie.idMovie ? 'border-2 border-blue-500' : ''
                      }`}
                    >
                      <img
                        src={posterUrl}
                        alt={movie.nameMovie}
                        className="w-full h-48 object-cover rounded-md mb-2"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sin+Poster';
                          target.onerror = null;
                        }}
                      />
                      <p className="font-semibold text-center text-sm">{movie.nameMovie}</p>
                    </motion.div>
                  );
                })
              ) : (
                <p className="col-span-full text-center text-gray-400">No se encontraron películas.</p>
              )}
            </div>
          )}

          {selectedMovie && showtimes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-gray-700 rounded-lg"
            >
              <h3 className="text-xl font-bold mb-4">2. Seleccionar Función</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {showtimes.map(showtime => (
                  <motion.button
                    key={showtime.idShowtime}
                    onClick={() => handleShowtimeSelect(showtime)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedShowtime?.idShowtime === showtime.idShowtime
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-200'
                    }`}
                  >
                    {new Date(showtime.dateTimeShowtime).toLocaleString('es-GT', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                    <br />
                    <span className="text-xs">Sala: {showtime.room.nameRoom}</span>
                  </motion.button>
                ))}
              </div>

              {selectedShowtime && (
                <>
                  <h3 className="text-xl font-bold mb-4">3. Seleccionar Asientos</h3>
                  <SeatingChart
                    seats={availableSeats}
                    selectedSeats={selectedSeats}
                    occupiedSeats={occupiedSeats}
                    onSeatClick={handleSeatClick}
                    isClickable={true}
                  />
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Panel derecho: Resumen */}
      <div className="w-96 bg-gray-800 p-8 pt-20 border-l border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>

        <div>
          {selectedMovie ? (
            <div>
              <p className="text-lg font-semibold text-blue-300">{selectedMovie.nameMovie}</p>
              {selectedShowtime && (
                <p className="text-gray-400 mb-2">
                  Función:{' '}
                  {new Date(selectedShowtime.dateTimeShowtime).toLocaleString('es-GT', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </p>
              )}
              <p className="text-gray-400 mb-2">{selectedSeats.length} boleto(s) seleccionado(s)</p>
              <p className="text-gray-400 mb-4">Asientos: {selectedSeats.join(', ') || 'Ninguno'}</p>
            </div>
          ) : (
            <p className="text-gray-400">Selecciona una película.</p>
          )}

          <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-700">
            <p className="text-xl font-bold">Total:</p>
            <p className="text-xl font-bold text-green-400">{ticketsSubtotal} GTQ</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = '/caja/productos')}
            className="w-full px-6 py-3 mt-4 bg-blue-600 text-white rounded-lg font-bold"
          >
            Continuar a Productos
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TicketsCashier;