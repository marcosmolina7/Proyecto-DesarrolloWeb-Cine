import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/shared/Layout';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white text-center mb-10"
        >
          Dashboard de Administración
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Widgets */}
          <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-semibold text-blue-400 mb-2">Ventas de Hoy</h2>
            <p className="text-4xl font-bold text-white">$1,500</p>
            <p className="text-sm text-gray-400 mt-2">120 boletos vendidos</p>
          </motion.div>

          <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-semibold text-green-400 mb-2">Película más vista</h2>
            <p className="text-2xl font-bold text-white">Barbie</p>
            <p className="text-sm text-gray-400 mt-2">Boletos: 50</p>
          </motion.div>

          <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Snacks Vendidos</h2>
            <p className="text-4xl font-bold text-white">250</p>
            <p className="text-sm text-gray-400 mt-2">Bebidas y palomitas</p>
          </motion.div>

          <motion.div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
            <h2 className="text-xl font-semibold text-red-400 mb-2">Ocupación Promedio</h2>
            <p className="text-4xl font-bold text-white">65%</p>
            <p className="text-sm text-gray-400 mt-2">En todas las salas</p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
