// src/pages/Tickets/TicketPurchase.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SeatingChart from '../../components/ui/SeatingChart';

// Datos de ejemplo para las películas (cartelera y preventa)
export const moviesData = [
  {
    id: 1,
    title: "Misión Imposible: Deuda mortal",
    poster: "https://m.media-amazon.com/images/M/MV5BNjU3MjQ0ZjItMmNmOS00NTYxLTljYjYtNWViNzM4MjQ0ZDQxXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_FMjpg_UX1000_.jpg",
    type: 'cartelera',
    director: "Christopher McQuarrie",
    description: "Ethan Hunt y su equipo se enfrentan a una nueva amenaza global.",
    genre: "Acción, Aventura",
    duration: "2h 36m",
    releaseDate: "14 de julio de 2023",
    trailer: "https://www.youtube.com/watch?v=2Tz8D1z3f2Q",
    dates: [
      { day: 'Hoy', date: '9 de Ago' },
      { day: 'Mañana', date: '10 de Ago' },
      { day: 'Lun', date: '11 de Ago' },
      { day: 'Mar', date: '12 de Ago' },
    ],
    times: ['14:00', '16:30', '19:00', '21:30'],
    price: 10,
    purchaseText: "Selecciona tu función y asientos."
  },
  {
    id: 2,
    title: "Barbie",
    poster: "https://m.media-amazon.com/images/M/MV5BYzJkY2MxMWUtYmMxMS00OTY1LWE4MjQtNjBlYTI0ZjdiMzMyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
    type: 'cartelera',
    director: "Greta Gerwig",
    description: "Barbie y Ken se divierten en el mundo de Barbieland, pero cuando tienen la oportunidad de ir al mundo real, descubren los altibajos de la vida.",
    genre: "Comedia, Fantasía, Aventura",
    duration: "1h 54m",
    releaseDate: "20 de julio de 2023",
    trailer: "https://www.youtube.com/watch?v=pBk4NYhGh2Y",
    dates: [
      { day: 'Hoy', date: '9 de Ago' },
      { day: 'Mañana', date: '10 de Ago' },
      { day: 'Lun', date: '11 de Ago' },
      { day: 'Mar', date: '12 de Ago' },
    ],
    times: ['14:00', '16:30', '19:00', '21:30'],
    price: 10,
    purchaseText: "Selecciona tu función y asientos."
  },
  {
    id: 3,
    title: "Oppenheimer",
    poster: "https://m.media-amazon.com/images/M/MV5BMzY1NGQxZWMtNzUyYS00MWFmLWE0ZTEtYjYwZWMxMTAyNTJjXkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_FMjpg_UX1000_.jpg",
    type: 'cartelera',
    director: "Christopher Nolan",
    description: 'La historia de J. Robert Oppenheimer, el "padre de la bomba atómica".',
    genre: "Biografía, Drama, Historia",
    duration: "3h 0m",
    releaseDate: "21 de julio de 2023",
    trailer: "https://www.youtube.com/watch?v=F3x4K5tP-aE",
    dates: [
      { day: 'Hoy', date: '9 de Ago' },
      { day: 'Mañana', date: '10 de Ago' },
      { day: 'Lun', date: '11 de Ago' },
      { day: 'Mar', date: '12 de Ago' },
    ],
    times: ['14:00', '16:30', '19:00', '21:30'],
    price: 10,
    purchaseText: "Selecciona tu función y asientos."
  },
  {
    id: 4,
    title: "Deadpool 3",
    poster: "https://m.media-amazon.com/images/M/MV5BMzYxODQwOTQ3YkEyXkFqcGdeQXVyMTA3MDk2NDg2._V1_.jpg",
    type: 'preventa',
    director: "Shawn Levy",
    description: "Una nueva aventura de Deadpool con un invitado especial. Preventa para el 20 de septiembre.",
    genre: "Acción, Comedia, Ciencia Ficción",
    duration: "2h 5m",
    releaseDate: "20 de septiembre de 2025",
    trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    dates: [
      { day: 'Vie', date: '30 de Ago' },
      { day: 'Sab', date: '31 de Ago' },
      { day: 'Dom', date: '1 de Sep' },
      { day: 'Lun', date: '2 de Sep' },
    ],
    times: ['16:00', '18:30', '20:00', '22:30'],
    price: 12,
    purchaseText: "¡Asegura tus boletos antes que nadie!"
  },
  {
    id: 5,
    title: "Kung Fu Panda 4",
    poster: "https://m.media-amazon.com/images/M/MV5BNzQ0NjM2NzE1N0tYkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
    type: 'preventa',
    director: "Mike Mitchell",
    description: "Po debe encontrar un nuevo Guerrero Dragón mientras se enfrenta a una nueva villana. Preventa para el 15 de noviembre.",
    genre: "Animación, Aventura, Comedia",
    duration: "1h 34m",
    releaseDate: "15 de noviembre de 2025",
    trailer: "https://www.youtube.com/watch?v=kYmC6lJ2mG4",
    dates: [
      { day: 'Vie', date: '30 de Ago' },
      { day: 'Sab', date: '31 de Ago' },
      { day: 'Dom', date: '1 de Sep' },
      { day: 'Lun', date: '2 de Sep' },
    ],
    times: ['16:00', '18:30', '20:00', '22:30'],
    price: 12,
    purchaseText: "¡Asegura tus boletos antes que nadie!"
  },
  {
    id: 6,
    title: "Godzilla x Kong: El nuevo imperio",
    poster: "https://m.media-amazon.com/images/M/MV5BNzQ0NjM2NzE1N0tYkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
    type: 'preventa',
    director: "Adam Wingard",
    description: "Los dos titanes se unen para luchar contra una amenaza desconocida. Preventa para el 10 de diciembre.",
    genre: "Acción, Ciencia Ficción, Aventura",
    duration: "1h 55m",
    releaseDate: "10 de diciembre de 2025",
    trailer: "https://www.youtube.com/watch?v=S0y_6D3_sB0",
    dates: [
      { day: 'Vie', date: '30 de Ago' },
      { day: 'Sab', date: '31 de Ago' },
      { day: 'Dom', date: '1 de Sep' },
      { day: 'Lun', date: '2 de Sep' },
    ],
    times: ['16:00', '18:30', '20:00', '22:30'],
    price: 12,
    purchaseText: "¡Asegura tus boletos antes que nadie!"
  },
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

const TicketPurchase = () => {
  const { id } = useParams<{ id: string }>();
  const movie = moviesData.find(m => m.id === Number(id));
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(movie?.dates[0].date);
  const [selectedTime, setSelectedTime] = useState(movie?.times[0]);

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Película no encontrada</h1>
      </div>
    );
  }

  const handleSeatClick = (seatLabel: string) => {
    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatLabel));
    } else {
      setSelectedSeats([...selectedSeats, seatLabel]);
    }
  };

  const totalPrice = selectedSeats.length * movie.price;
  const titleText = movie.type === 'preventa' ? 'Preventa de boletos para ' : 'Compra de boletos para ';
  const summaryTitle = movie.type === 'preventa' ? 'Resumen del Pedido de Preventa' : 'Resumen del Pedido';
  const summaryText = movie.type === 'preventa' ? 'El pago se procesará al momento de la compra.' : 'Puedes agregar productos adicionales en el siguiente paso.';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-4xl font-bold text-center mb-8"
        >
          {titleText}{movie.title}
        </motion.h1>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <div className="flex items-center space-x-4 mb-6">
            <img src={movie.poster} alt={movie.title} className="w-24 h-36 rounded-lg object-cover" />
            <div>
              <h2 className="text-2xl font-bold text-blue-400">{movie.title}</h2>
              <p className="text-gray-400">{movie.description}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Selecciona fecha y hora</h3>
            <div className="flex space-x-4 mb-4 overflow-x-auto">
              {movie.dates.map(date => (
                <button
                  key={date.date}
                  onClick={() => setSelectedDate(date.date)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedDate === date.date ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <p className="text-sm">{date.day}</p>
                  <p className="text-xs">{date.date}</p>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {movie.times.map(time => (
                <motion.button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedTime === time ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Selecciona tus asientos</h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              <SeatingChart
                seats={seats}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
                isClickable={true}
                seatSize="w-8 h-8"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-4">{summaryTitle}</h3>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400">Boletos seleccionados ({selectedSeats.length})</p>
              <p className="text-lg font-bold">{totalPrice} GTQ</p>
            </div>
            <p className="text-sm text-gray-500">{summaryText}</p>
            
            <Link to="/cashier" className="block mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Continuar a Complementos y Pago
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPurchase;
