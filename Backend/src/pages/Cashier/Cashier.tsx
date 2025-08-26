// src/pages/Cashier/Cashier.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SeatingChart from '../../components/ui/SeatingChart'; // Importamos el nuevo componente

const allMovies = [
  { id: 1, title: "Misión Imposible: Deuda mortal", type: "cartelera", poster: "https://m.media-amazon.com/images/M/MV5BNjU3MjQ0ZjItMmNmOS00NTYxLTljYjYtNWViNzM4MjQ0ZDQxXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_FMjpg_UX1000_.jpg", showtimes: [{ date: '2025-08-09', times: ['14:00', '16:30', '19:00'] }, { date: '2025-08-10', times: ['15:00', '18:00', '21:00'] }] },
  { id: 2, title: "Barbie", type: "cartelera", poster: "https://m.media-amazon.com/images/M/MV5BYzJkY2MxMWUtYmMxMS00OTY1LWE4MjQtNjBlYTI0ZjdiMzMyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg", showtimes: [{ date: '2025-08-09', times: ['14:30', '17:00', '20:30'] }, { date: '2025-08-10', times: ['16:00', '19:00', '22:00'] }] },
  { id: 3, title: "Oppenheimer", type: "cartelera", poster: "https://m.media-amazon.com/images/M/MV5BMzY1NGQxZWMtNzUyYS00MWFmLWE0ZTEtYjYwZWMxMTAyNTJjXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_FMjpg_UX1000_.jpg", showtimes: [{ date: '2025-08-09', times: ['15:00', '19:00', '23:00'] }, { date: '2025-08-10', times: ['14:00', '17:30', '21:30'] }] },
  { id: 4, title: "Deadpool 3", type: "preventa", poster: "https://m.media-amazon.com/images/M/MV5BMzYxODQwOTQ3YkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg", showtimes: [{ date: '2025-08-15', times: ['18:00', '21:00'] }, { date: '2025-08-16', times: ['17:00', '20:00'] }] },
  { id: 5, title: "Kung Fu Panda 4", type: "preventa", poster: "https://m.media-amazon.com/images/M/MV5BNzQ0NjM2NzE1N0tYkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg", showtimes: [{ date: '2025-08-20', times: ['14:00', '16:00'] }, { date: '2025-08-21', times: ['13:00', '15:30'] }] },
];

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

let customerMonitorWindow: Window | null = null;

const Cashier = () => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [productCount, setProductCount] = useState<{ [key: number]: number }>({});
  const [activeTab, setActiveTab] = useState("cartelera");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const TICKET_PRICE = 45;

  const calculateSubtotal = () => {
    const ticketsTotal = selectedSeats.length * TICKET_PRICE;
    const productsTotal = Object.keys(productCount).reduce((total, productId) => {
      const product = products.find(p => p.id === Number(productId));
      return total + (product ? product.price * (productCount[Number(productId)] || 0) : 0);
    }, 0);
    return ticketsTotal + productsTotal;
  };

  const subtotal = calculateSubtotal();

  const updateCustomerMonitor = () => {
    const transactionData = {
      selectedMovie,
      selectedSeats,
      productCount,
      subtotal,
      selectedDate,
      selectedTime,
    };
    localStorage.setItem('cashier-transaction', JSON.stringify(transactionData));
  };

  useEffect(() => {
    if (selectedMovie) {
        setSelectedDate(selectedMovie.showtimes[0]?.date || '');
        setSelectedTime(selectedMovie.showtimes[0]?.times[0] || '');
    }
  }, [selectedMovie]);

  useEffect(() => {
    updateCustomerMonitor();
  }, [selectedMovie, selectedSeats, productCount, selectedDate, selectedTime]);

  const openCustomerMonitor = () => {
    if (customerMonitorWindow && !customerMonitorWindow.closed) {
      customerMonitorWindow.focus();
    } else {
      customerMonitorWindow = window.open('/monitor', '_blank', 'width=800,height=600');
    }
  };

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    setSelectedSeats([]);
  };

  const handleSeatClick = (seatLabel: string) => {
    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatLabel));
    } else {
      setSelectedSeats([...selectedSeats, seatLabel]);
    }
  };

  const handleProductChange = (productId: number, count: number) => {
    setProductCount(prev => ({ ...prev, [productId]: count }));
  };

  const filteredMovies = allMovies
    .filter(movie => movie.type === activeTab)
    .filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <div className="w-full lg:w-2/3 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-blue-500 mb-8">Terminal de Ventas</h1>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Resumen del Pedido</h2>
          <motion.button
            onClick={openCustomerMonitor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
          >
            Abrir Monitor para Cliente
          </motion.button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">1. Seleccionar Película y Asientos</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar películas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex space-x-2 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("cartelera")}
              className={`px-6 py-2 font-semibold transition-colors ${
                activeTab === "cartelera" ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              Cartelera
            </button>
            <button
              onClick={() => setActiveTab("preventa")}
              className={`px-6 py-2 font-semibold transition-colors ${
                activeTab === "preventa" ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              Preventas
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {filteredMovies.map(movie => (
              <motion.button
                key={movie.id}
                onClick={() => handleMovieSelect(movie)}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  selectedMovie?.id === movie.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <img src={movie.poster} alt={movie.title} className="w-full h-auto rounded-md mb-2" />
                <span className="text-sm font-semibold">{movie.title}</span>
              </motion.button>
            ))}
          </div>

          {selectedMovie && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-4">Fechas y Horarios</h3>
              <div className="flex space-x-4 mb-4 overflow-x-auto">
                {selectedMovie.showtimes.map((showtime: any) => (
                  <button
                    key={showtime.date}
                    onClick={() => setSelectedDate(showtime.date)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedDate === showtime.date ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <p className="text-sm">{new Date(showtime.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                {selectedMovie.showtimes.find((s: any) => s.date === selectedDate)?.times.map((time: string) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedTime === time ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <SeatingChart seats={seats} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} isClickable={true} />
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">2. Productos Adicionales</h2>
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-400">{product.price} GTQ</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleProductChange(product.id, (productCount[product.id] || 0) - 1)}
                    disabled={(productCount[product.id] || 0) === 0}
                    className="px-3 py-1 bg-red-600 text-white rounded-md disabled:opacity-50"
                  >
                    -
                  </motion.button>
                  <span className="w-8 text-center">{productCount[product.id] || 0}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleProductChange(product.id, (productCount[product.id] || 0) + 1)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/3 bg-gray-800 p-8 shadow-inner border-l border-gray-700 sticky top-0 h-screen overflow-y-auto">
        <div className="bg-gray-800 p-6 rounded-xl h-full flex flex-col">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Resumen del Pedido</h2>
          
          {selectedMovie ? (
            <div className="flex items-center space-x-4 mb-4">
              <img src={selectedMovie.poster} alt={selectedMovie.title} className="w-16 h-24 rounded-lg object-cover" />
              <div>
                <p className="text-lg font-semibold text-blue-300">{selectedMovie.title}</p>
                <p className="text-gray-400">Fecha: {selectedDate ? new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }) : 'N/A'}</p>
                <p className="text-gray-400">Hora: {selectedTime || 'N/A'}</p>
                <p className="text-gray-400">Boletos: {selectedSeats.length} (Asientos: {selectedSeats.join(', ')})</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">Selecciona una película.</p>
          )}

          <div className="mb-auto">
            <p className="text-lg font-semibold text-blue-300">Productos:</p>
            <ul className="list-disc list-inside text-gray-400 mb-4">
              {Object.keys(productCount).length > 0 ? (
                Object.keys(productCount).map(productId => {
                  const product = products.find(p => p.id === Number(productId));
                  if (productCount[Number(productId)] > 0 && product) {
                    return (
                      <li key={productId}>
                        {product.name} ({productCount[Number(productId)]})
                      </li>
                    );
                  }
                  return null;
                })
              ) : (
                <p className="text-gray-500">No se han seleccionado productos.</p>
              )}
            </ul>
          </div>

          <div className="border-t border-gray-700 pt-4 mt-auto">
            <div className="flex justify-between items-center text-2xl font-bold">
              <p>Total:</p>
              <p>{subtotal} GTQ</p>
            </div>
            <Link to="/checkout" className="block mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Continuar a Pago
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cashier;