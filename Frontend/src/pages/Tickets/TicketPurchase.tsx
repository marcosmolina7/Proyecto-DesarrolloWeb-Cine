// src/pages/Tickets/TicketPurchase.tsx
// CORREGIDO: Se reemplaza SeatGrid por un nuevo visualizador interactivo (InteractiveSeatGrid)
// que coincide con el layout de 'Crear Sala' (pantalla centrada, scroll H/V).
// CORREGIDO: Arreglado el bug de scroll vertical (items-center -> items-start) y aumentada la altura (max-h-[50vh]).
// CORREGIDO: handleContinue ahora BORRA la transacción anterior en lugar de fusionarla.
// CORREGIDO: handleContinue ahora verifica si el usuario está autenticado antes de navegar a Checkout.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios, { isAxiosError } from 'axios';
import { RotateCw, AlertTriangle, Armchair } from 'lucide-react'; 
import AuthService from '../../services/AuthService'; // 1. Importar el servicio de Auth

const API_URL = 'http://localhost:3000';

// --- INTERFACES BASADAS EN schema.prisma ---
interface Movie {
  idMovie: number;
  nameMovie: string;
  posterMovie: string;
}
interface Seat { idSeat: number; rowSeat: string; columnSeat: number; }
interface RoomSeat { idSeat: number; seat: Seat; state: string; }
interface Room { idRoom: number; nameRoom: string; roomSeats: RoomSeat[]; }
interface Ticket { idSeat: number; } 
interface Showtime {
  idShowtime: number;
  dateTimeShowtime: string; // ISO String
  idRoom: number;
  room: Room; 
  tickets: Ticket[]; 
}
// ---------------------------------------------

const TICKET_PRICE = 50; 

// 3. AÑADIDO: Helper para las filas
const getRowLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // 65 es el código ASCII de 'A'
};

// --- 4. NUEVO COMPONENTE: Grid de Asientos Interactivo ---
interface InteractiveSeatGridProps {
  rows: string[]; // ['A', 'B', 'C']
  seatsPerRow: number; // 10
  selectedSeats: string[]; // ['A1', 'A5']
  unavailableSeats: string[]; // ['B2', 'C3']
  onSeatToggle: (seatId: string) => void;
}

const InteractiveSeatGrid: React.FC<InteractiveSeatGridProps> = ({ 
    rows, 
    seatsPerRow, 
    selectedSeats, 
    unavailableSeats, 
    onSeatToggle 
}) => {
    
    // Generamos las filas del grid
    const grid = useMemo(() => {
        return rows.map(rowLabel => {
            const seatButtons = [];
            for (let c = 1; c <= seatsPerRow; c++) {
                const seatId = `${rowLabel}${c}`;
                const isSelected = selectedSeats.includes(seatId);
                const isUnavailable = unavailableSeats.includes(seatId);

                // Definimos el color del asiento
                let bgColor = 'bg-gray-600 hover:bg-gray-500'; // Disponible
                if (isUnavailable) {
                    bgColor = 'bg-red-800 cursor-not-allowed'; // Ocupado
                }
                if (isSelected) {
                    bgColor = 'bg-green-600 hover:bg-green-500'; // Seleccionado por el usuario
                }

                seatButtons.push(
                    <motion.button
                        type="button"
                        key={seatId}
                        whileHover={{ scale: isUnavailable ? 1 : 1.1 }}
                        whileTap={{ scale: isUnavailable ? 1 : 0.9 }}
                        onClick={() => onSeatToggle(seatId)}
                        disabled={isUnavailable}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-white transition-colors flex-shrink-0 ${bgColor}`}
                    >
                        {c}
                    </motion.button>
                );
            }
            return (
                <div key={rowLabel} className="flex gap-2 items-center">
                    <div className="w-8 text-center font-bold text-gray-400 flex-shrink-0">{rowLabel}</div>
                    <div className="flex flex-nowrap gap-2">
                        {seatButtons}
                    </div>
                </div>
            );
        });
    }, [rows, seatsPerRow, selectedSeats, unavailableSeats, onSeatToggle]);

    // Calculamos el ancho del grid + un padding
    const gridWidth = useMemo(() => {
        if (seatsPerRow === 0) return '90%';
        const width = (40 * seatsPerRow) + (8 * (seatsPerRow - 1)) + 40; // 40px w, 8px gap, 40px padding
        return `${width}px`;
    }, [seatsPerRow]);


    return (
        <div className="p-4 bg-gray-700 rounded-lg">
            <div className="flex justify-center mb-4 w-full">
                <div className="bg-gray-800 text-gray-300 px-8 py-2 rounded-lg text-center font-mono w-full" style={{ maxWidth: gridWidth }}>
                    PANTALLA
                </div>
            </div>
            
            <div className="flex justify-center items-start flex-grow overflow-auto p-2 w-full max-h-[50vh]">
                <div className="flex flex-col items-start gap-3">
                    {grid}
                </div>
            </div>
            {/* Leyenda de colores */}
            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-300">
                <span className="flex items-center"><span className="w-4 h-4 bg-gray-600 rounded mr-2"></span> Disponible</span>
                <span className="flex items-center"><span className="w-4 h-4 bg-green-600 rounded mr-2"></span> Seleccionado</span>
                <span className="flex items-center"><span className="w-4 h-4 bg-red-800 rounded mr-2"></span> Ocupado</span>
            </div>
        </div>
    );
};
// --------------------------------------------------


const TicketPurchase = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  // ... (Estados sin cambios) ...
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [roomRows, setRoomRows] = useState<string[]>([]); 
  const [seatsPerRow, setSeatsPerRow] = useState(0); 
  const [unavailableSeats, setUnavailableSeats] = useState<string[]>([]); 
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null); // 2. Nuevo estado para la alerta de login

  // --- CARGA DE DATOS (Película y Horarios) ---
  useEffect(() => {
    // ... (fetchMovieAndShowtimes sin cambios) ...
    if (!id) return;
    const fetchMovieAndShowtimes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [movieRes, showtimesRes] = await Promise.all([
          axios.get<Movie>(`${API_URL}/movie/${id}`),
          axios.get<Showtime[]>(`${API_URL}/showtime/movie/${id}`) 
        ]);
        
        setMovie(movieRes.data);
        const sortedShowtimes = showtimesRes.data.sort((a, b) => 
            new Date(a.dateTimeShowtime).getTime() - new Date(b.dateTimeShowtime).getTime()
        );
        setShowtimes(sortedShowtimes);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No se pudieron cargar los datos de la película o los horarios.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieAndShowtimes();
  }, [id]);

  // --- LÓGICA DE SELECCIÓN DE HORARIO ---
  const handleShowtimeSelect = (showtime: Showtime) => {
    // ... (lógica sin cambios) ...
    setSelectedShowtime(showtime);
    setSelectedSeats([]); 
    setAuthError(null); // Limpiar error de auth si cambia la selección
    
    const soldSeatNames = showtime.tickets.map(ticket => {
        const roomSeat = showtime.room.roomSeats.find(rs => rs.idSeat === ticket.idSeat);
        if (!roomSeat) return null;
        return `${roomSeat.seat.rowSeat}${roomSeat.seat.columnSeat}`;
    }).filter(Boolean) as string[];
    
    setUnavailableSeats(soldSeatNames);

    const rows = [...new Set(showtime.room.roomSeats.map(rs => rs.seat.rowSeat))].sort((a, b) => a.localeCompare(b));
    
    const cols = showtime.room.roomSeats.filter(rs => rs.seat.rowSeat === rows[0]).length;
    
    setRoomRows(rows);
    setSeatsPerRow(cols > 0 ? cols : 0);
  };
  
  // --- LÓGICA DE SELECCIÓN DE ASIENTOS ---
  const handleSeatClick = (seatId: string) => {
    // ... (lógica sin cambios) ...
    if (unavailableSeats.includes(seatId)) return;
    setAuthError(null); // Limpiar error de auth si cambia la selección
    setSelectedSeats(prev => 
      prev.includes(seatId)
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  // --- NAVEGAR A CHECKOUT ---
  const handleContinue = () => {
      
      // 3. CORRECCIÓN: Verificar autenticación PRIMERO
      if (!AuthService.isAuthenticated()) {
          setAuthError("Debes iniciar sesión como cajero o administrador para continuar con la venta.");
          // Opcional: Redirigir al login
          // setTimeout(() => navigate('/login'), 2500);
          return; // Detener la ejecución
      }

      // Si está autenticado, procede a crear la transacción
      const transaction = {
          selectedMovie: movie,
          selectedShowtime,
          selectedSeats, 
          ticketsSubtotal: selectedSeats.length * TICKET_PRICE,
          productCount: {},
          productsSubtotal: 0
      };
      
      localStorage.setItem('cashier-transaction', JSON.stringify(transaction));
      
      navigate('/checkout'); 
  };
  
  // --- Helper para formatear y agrupar horarios ---
  const groupedShowtimes = useMemo(() => {
    // ... (lógica sin cambios) ...
    return showtimes.reduce((acc, st) => {
        const date = new Date(st.dateTimeShowtime).toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'short' });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(st);
        return acc;
    }, {} as Record<string, Showtime[]>);
  }, [showtimes]);
  

  // --- RENDERIZADO ---
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-900 text-white">
          <RotateCw className="w-12 h-12 animate-spin text-blue-500" />
        </div>
    );
  }
  // ... (renderizado de error y !movie sin cambios) ...
  if (error) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-900 text-white">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h1 className="text-4xl font-bold mb-2">Error</h1>
          <p className="text-xl text-gray-400">{error}</p>
          <Link to="/" className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">
            Volver a la Cartelera
          </Link>
        </div>
    );
  }
  if (!movie) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-900 text-white">
          <h1 className="text-4xl font-bold">Película no encontrada</h1>
        </div>
    );
  }
  
  let posterUrl = 'https://placehold.co/100x150/1f2937/9ca3af?text=No+Poster';
  if (movie.posterMovie) {
    if (movie.posterMovie.startsWith('/')) {
      posterUrl = `${API_URL}${movie.posterMovie}`;
    } else {
      posterUrl = `${API_URL}/${movie.posterMovie}`;
    }
  }
  
  const totalPrice = selectedSeats.length * TICKET_PRICE;
  const titleText = `Compra de boletos para ${movie.nameMovie}`;
  const summaryTitle = 'Resumen del Pedido';
  const summaryText = 'Puedes agregar productos adicionales en el siguiente paso.';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-4xl font-bold text-center mb-8"
        >
          {titleText}
        </motion.h1>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center space-x-4 mb-6">
            <img 
              src={posterUrl} 
              alt={movie.nameMovie} 
              className="w-24 h-36 rounded-lg object-cover" 
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x150/1f2937/9ca3af?text=Error';}}
            />
            <div>
              <h2 className="text-2xl font-bold text-blue-400">{movie.nameMovie}</h2>
            </div>
          </div>

          {/* SELECCIÓN DE HORARIOS (DINÁMICA) */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Selecciona fecha y hora</h3>
            {Object.keys(groupedShowtimes).length === 0 && !isLoading ? (
                <p className="text-gray-400">No hay funciones programadas para esta película.</p>
            ) : (
                Object.entries(groupedShowtimes).map(([date, showtimesOnDate]) => (
                    <div key={date} className="mb-4">
                        <p className="text-sm font-semibold text-gray-300 mb-2 capitalize">{date}</p>
                        <div className="flex flex-wrap gap-4">
                            {showtimesOnDate.map(st => (
                                <motion.button
                                    key={st.idShowtime}
                                    onClick={() => handleShowtimeSelect(st)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                        selectedShowtime?.idShowtime === st.idShowtime 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {new Date(st.dateTimeShowtime).toLocaleTimeString('es-GT', { timeStyle: 'short', hour12: true })}
                                    <span className="text-xs ml-2 opacity-70">({st.room.nameRoom})</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                ))
            )}
          </div>

          {/* SELECCIÓN DE ASIENTOS (DINÁMICA) */}
          <AnimatePresence>
          {selectedShowtime && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 overflow-hidden"
            >
              <h3 className="text-xl font-semibold mb-4">Selecciona tus asientos (Sala: {selectedShowtime.room.nameRoom})</h3>
              
              <InteractiveSeatGrid
                rows={roomRows}
                seatsPerRow={seatsPerRow}
                selectedSeats={selectedSeats}
                unavailableSeats={unavailableSeats}
                onSeatToggle={handleSeatClick}
              />
            </motion.div>
          )}
          </AnimatePresence>
          
          {/* Resumen */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-4">{summaryTitle}</h3>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400">Boletos seleccionados ({selectedSeats.length})</p>
              <p className="text-lg font-bold">{totalPrice.toFixed(2)} GTQ</p>
            </div>
            <p className="text-sm text-gray-500">{summaryText}</p>
            
            {/* 4. AÑADIDO: Mensaje de alerta de autenticación */}
            <AnimatePresence>
                {authError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-800 p-3 rounded-lg text-sm text-red-100 my-4 flex items-center space-x-2"
                    >
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span>
                            {authError} 
                            <Link to="/login" className="font-bold underline hover:text-white ml-1">
                                Iniciar Sesión Aquí
                            </Link>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <motion.button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0 || !selectedShowtime}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed mt-6"
            >
              Continuar a Complementos y Pago
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPurchase;