import React from 'react';
import Layout from '../../components/shared/Layout';

const MoviesList = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Gestión de Películas</h1>
        <p className="text-gray-400 mb-4">
          Aquí puedes ver todas las películas registradas, editarlas o eliminarlas.
        </p>

        {/* Tabla de películas (placeholder) */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-500">La tabla de películas aparecerá aquí.</p>
        </div>
      </div>
    </Layout>
  );
};

export default MoviesList;
