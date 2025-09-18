import React from 'react';
import Layout from '../../components/shared/Layout';

const Schedules = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Horarios de Funciones y Turnos</h1>
        <p className="text-gray-400 mb-4">
          Administra los horarios de las películas y los turnos del personal.
        </p>

        {/* Calendario o tabla de horarios (placeholder) */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-500">Aquí se configurarán los horarios.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Schedules;
