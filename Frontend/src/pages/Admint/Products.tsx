import React from 'react';
import Layout from '../../components/shared/Layout';

const Products = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Productos de la Dulcería</h1>
        <p className="text-gray-400 mb-4">
          Visualiza y gestiona los productos disponibles en el cine.
        </p>

        {/* Tabla de productos (placeholder) */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-500">Aquí se listarán los productos.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
