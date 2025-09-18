import React from 'react';
import Layout from '../../components/shared/Layout';

const AdminEmployees = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Empleados del Cine</h1>
        <p className="text-gray-400 mb-4">
          Consulta la lista de empleados, sus roles y horarios asignados.
        </p>

        {/* Tabla de empleados (placeholder) */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-500">Aquí se mostrará la tabla de empleados.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminEmployees;
