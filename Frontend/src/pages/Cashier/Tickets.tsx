import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SeatingChart from '../../components/ui/SeatingChart';
import { allMovies } from '../../data';

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

const TicketsCashier = () => {
  const [activeTab, setActiveTab] = useState<'cartelera' | 'preventa'>('cartelera');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Cargar estado inicial desde la transacción unificada
  useEffect(() => {
    const savedTransaction = localStorage.getItem('cashier-transaction');
    if (savedTransaction) {
      try {
        const t = JSON.parse(savedTransaction);
        setSelectedMovie(t.selectedMovie || null);
        setSelectedSeats(t.selectedSeats || []);
        setSelectedDate(t.selectedDate || null);
        setSelectedTime(t.selectedTime || null);
      } catch (e) {
        console.error('Error al parsear la transacción de localStorage:', e);
        localStorage.removeItem('cashier-transaction');
      }
    }
  }, []);

  // Precio por boleto (ajusta según tu lógica)
  const calculateTicketsSubtotal = (currentSeats: string[]) => (currentSeats ? currentSeats.length : 0) * 50;

  // Guardado unificado: preserva productCount y productsSubtotal si no vienen en partialData
  const updateLocalStorage = (partialData: Record<string, any>) => {
    const existing = JSON.parse(localStorage.getItem('cashier-transaction') || '{}');

    const has = (obj: any, key: string) => Object.prototype.hasOwnProperty.call(obj, key);

    const updated = {
      ...existing,
      ...partialData,

      // Preservar datos de productos si no se están modificando
      productCount: has(partialData, 'productCount')
        ? partialData.productCount
        : existing.productCount ?? {},
      productsSubtotal: has(partialData, 'productsSubtotal')
        ? partialData.productsSubtotal
        : existing.productsSubtotal ?? 0,
    };

    localStorage.setItem('cashier-transaction', JSON.stringify(updated));
    // Notificar a otros tabs/componentes dentro de la misma pestaña
    window.dispatchEvent(new Event('storage'));
  };

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    setSelectedSeats([]);
    setSelectedDate(null);
    setSelectedTime(null);

    updateLocalStorage({
      selectedMovie: movie,
      selectedSeats: [],
      selectedDate: null,
      selectedTime: null,
      ticketsSubtotal: 0, // total de boletos separado
    });
  };

  const handleSeatClick = (seatLabel: string) => {
    const newSeats = selectedSeats.includes(seatLabel)
      ? selectedSeats.filter(s => s !== seatLabel)
      : [...selectedSeats, seatLabel];

    setSelectedSeats(newSeats);

    updateLocalStorage({
      selectedMovie,
      selectedSeats: newSeats,
      selectedDate,
      selectedTime,
      ticketsSubtotal: calculateTicketsSubtotal(newSeats),
    });
  };

  const handleTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);

    updateLocalStorage({
      selectedMovie,
      selectedSeats,
      selectedDate: date,
      selectedTime: time,
      ticketsSubtotal: calculateTicketsSubtotal(selectedSeats),
    });
  };

  const filteredMovies = allMovies.filter(movie => {
    const matchesTab = movie.type === activeTab;
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const openTicketsMonitor = () => {
    window.open('/tickets-monitor', '_blank', 'width=800,height=600');
  };

  const ticketsSubtotal = calculateTicketsSubtotal(selectedSeats);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <div className="flex-grow p-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-400">Terminal de Ventas</h1>
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
          <h2 className="text-2xl font-bold mb-4">1. Seleccionar Película y Asientos</h2>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Buscar películas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('cartelera')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'cartelera' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Cartelera
            </button>
            <button
              onClick={() => setActiveTab('preventa')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'preventa' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Preventas
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.length > 0 ? (
              filteredMovies.map(movie => (
                <motion.div
                  key={movie.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMovieSelect(movie)}
                  className={`bg-gray-700 p-3 rounded-lg cursor-pointer transition-transform ${selectedMovie?.id === movie.id ? 'border-2 border-blue-500' : ''}`}
                >
                  <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover rounded-md mb-2" />
                  <p className="font-semibold text-center">{movie.title}</p>
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">No se encontraron películas.</p>
            )}
          </div>

          {selectedMovie && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-gray-700 rounded-lg"
            >
              <h3 className="text-xl font-bold mb-4">Seleccionar Horario y Asientos para {selectedMovie.title}</h3>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Horarios:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMovie?.showtimes?.map((showtime: any) =>
                    showtime?.times?.map((time: string) => (
                      <motion.button
                        key={`${showtime.date}-${time}`}
                        onClick={() => handleTimeSelect(showtime.date, time)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedTime === time && selectedDate === showtime.date ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200'}`}
                      >
                        {time}
                      </motion.button>
                    ))
                  )}
                </div>
              </div>

              <SeatingChart
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
                isClickable={true}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Panel derecho: Resumen del Pedido */}
      <div className="w-96 bg-gray-800 p-8 pt-20 border-l border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Resumen del Pedido</h2>
        </div>

        <div>
          {selectedMovie ? (
            <div>
              <p className="text-lg font-semibold text-blue-300">{selectedMovie.title}</p>
              <p className="text-gray-400 mb-2">
                Horario: {selectedTime ? `${selectedDate} ${selectedTime}` : 'N/A'}
              </p>
              <p className="text-gray-400 mb-2">
                {selectedSeats.length} boleto(s) seleccionado(s)
              </p>
              <p className="text-gray-400 mb-4">
                Asientos: {selectedSeats.join(', ') || 'Ninguno'}
              </p>
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
            className="w-full px-6 py-3 mt-4 bg-blue-600 text-white rounded-lg font-bold"
          >
            Continuar a Pago
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TicketsCashier;
