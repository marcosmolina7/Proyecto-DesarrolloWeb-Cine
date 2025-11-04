// src/pages/Noticias/Noticias.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  contenido: string;
  fecha: string;
  autor: string;
  imagen: string;
  categoria: string;
}

const noticias: Noticia[] = [
  {
    id: 1,
    titulo: "Nueva Sala Premium con Tecnología IMAX",
    resumen: "CineApp inaugura su primera sala IMAX con sonido envolvente de última generación.",
    contenido: "Estamos emocionados de anunciar la apertura de nuestra nueva sala IMAX, equipada con la tecnología más avanzada en proyección y audio. Esta sala ofrece una experiencia cinematográfica inmersiva sin precedentes.",
    fecha: "2025-10-28",
    autor: "Redacción CineApp",
    imagen: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    categoria: "Tecnología"
  },
  {
    id: 2,
    titulo: "Estrenos Navideños: Las Películas Más Esperadas",
    resumen: "Conoce los próximos estrenos que llegarán a nuestras salas durante la temporada navideña.",
    contenido: "La temporada navideña trae consigo algunos de los estrenos más esperados del año. Desde blockbusters de acción hasta emotivos dramas familiares, tenemos algo para todos.",
    fecha: "2025-10-25",
    autor: "María González",
    imagen: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    categoria: "Estrenos"
  },
  {
    id: 3,
    titulo: "Descuentos Especiales para Estudiantes",
    resumen: "Presentando tu carnet universitario, obtén hasta 30% de descuento en boletos.",
    contenido: "Como parte de nuestro compromiso con la educación, ofrecemos descuentos especiales para estudiantes. Válido de lunes a jueves en funciones antes de las 6:00 PM.",
    fecha: "2025-10-20",
    autor: "Departamento de Marketing",
    imagen: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&q=80",
    categoria: "Promociones"
  },
  {
    id: 4,
    titulo: "Festival de Cine Clásico en Noviembre",
    resumen: "Revive los clásicos del cine en la pantalla grande durante todo el mes de noviembre.",
    contenido: "El próximo mes presentaremos un festival especial con las películas clásicas más icónicas de la historia del cine. No te pierdas esta oportunidad única.",
    fecha: "2025-10-15",
    autor: "Carlos Ramírez",
    imagen: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    categoria: "Eventos"
  }
];

const Noticias = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-blue-400 mb-4">Noticias y Novedades</h1>
          <p className="text-xl text-gray-400">
            Mantente al día con las últimas noticias de CineApp
          </p>
        </motion.div>

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {noticias.map((noticia, index) => (
            <motion.article
              key={noticia.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300"
            >
              {/* Imagen */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {noticia.categoria}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-3 hover:text-blue-400 transition-colors">
                  {noticia.titulo}
                </h2>
                
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {noticia.resumen}
                </p>

                {/* Meta información */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(noticia.fecha).toLocaleDateString('es-GT', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{noticia.autor}</span>
                  </div>
                </div>

                {/* Botón leer más */}
                <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors group">
                  Leer más
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Noticias;