// src/data.js

export const allMovies = [
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

export const products = [
  { id: 1, name: "Palomitas Grande", price: 35 },
  { id: 2, name: "Refresco Mediano", price: 25 },
  { id: 3, name: "Nachos con Queso", price: 45 },
  { id: 4, name: "Hot Dog", price: 30 },
];