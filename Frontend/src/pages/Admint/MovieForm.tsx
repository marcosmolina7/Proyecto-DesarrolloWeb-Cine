import React from 'react';
import Layout from '../../components/shared/Layout';

const MovieForm = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Agregar Nueva Película</h1>
        <p className="text-gray-400 mb-4">
          Completa el siguiente formulario para registrar una nueva película en el sistema.
        </p>

        {/* Formulario de película (placeholder) */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-500">Aquí irá el formulario de ingreso de película.</p>
        </div>
      </div>
    </Layout>
  );
};

export default MovieForm;
