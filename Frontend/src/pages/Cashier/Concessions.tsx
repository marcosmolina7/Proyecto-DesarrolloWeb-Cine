// src/pages/Cashier/Concessions.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const products = [
  { id: 1, name: "Palomitas Grande", price: 35 },
  { id: 2, name: "Refresco Mediano", price: 25 },
  { id: 3, name: "Nachos con Queso", price: 45 },
  { id: 4, name: "Hot Dog", price: 30 },
];

const Concessions = () => {
  const [productCount, setProductCount] = useState<Record<number, number>>({});
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTransaction = localStorage.getItem('cashier-transaction');
    if (savedTransaction) {
      try {
        const transaction = JSON.parse(savedTransaction);
        setSelectedMovie(transaction.selectedMovie || null);
        setSelectedSeats(transaction.selectedSeats || []);
        setProductCount(transaction.productCount || {});
        setSelectedDate(transaction.selectedDate || null);
        setSelectedTime(transaction.selectedTime || null);
      } catch (e) {
        console.error('Error al parsear cashier-transaction:', e);
      }
    }
  }, []);

  // Solo total de productos (no boletos)
  const calculateProductsSubtotal = (currentProducts: Record<number, number>) => {
    let productsPrice = 0;
    if (currentProducts) {
      Object.keys(currentProducts).forEach(productId => {
        const product = products.find(p => p.id === Number(productId));
        if (product) {
          productsPrice += product.price * (currentProducts[Number(productId)] || 0);
        }
      });
    }
    return productsPrice;
  };

  // Guardar fusionando con lo existente para no borrar otras claves
  const updateLocalStorage = (partial: any) => {
    const existing = JSON.parse(localStorage.getItem('cashier-transaction') || '{}');
    const updated = { ...existing, ...partial };
    localStorage.setItem('cashier-transaction', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleProductChange = (productId: number, change: number) => {
    setProductCount(prev => {
      const newCount = { ...prev };
      newCount[productId] = (newCount[productId] || 0) + change;
      if (newCount[productId] < 0) newCount[productId] = 0;

      // Guardamos: solo cambiamos la parte de productos y mantenemos el resto
      updateLocalStorage({
        selectedMovie,
        selectedSeats,
        selectedDate,
        selectedTime,
        productCount: newCount,
        // Si en otra vista quieres total general, puedes calcularlo allá.
        productsSubtotal: calculateProductsSubtotal(newCount),
      });

      return newCount;
    });
  };

  const openProductsMonitor = () => {
    window.open('/products-monitor', '_blank', 'width=800,height=600');
  };

  const productsSubtotal = calculateProductsSubtotal(productCount);

  const handleContinueToPayment = () => {
    // Ajusta la ruta según tu flujo
    navigate('/checkout');
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      {/* Columna izquierda: selección de productos */}
      <div className="flex-grow p-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-blue-400">Productos Adicionales</h1>
          <motion.button
            onClick={openProductsMonitor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold"
          >
            Abrir Monitor para Cliente
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-400 mb-4">{product.price} GTQ</p>
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleProductChange(product.id, -1)}
                  className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                  -
                </motion.button>
                <span className="text-2xl font-bold mx-4">{productCount[product.id] || 0}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleProductChange(product.id, 1)}
                  className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
                >
                  +
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Columna derecha: Resumen de Productos */}
      <div className="w-96 bg-gray-800 p-8 pt-20 border-l border-gray-700 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Resumen de Productos</h2>
          {Object.keys(productCount).some(id => (productCount as any)[id] > 0) ? (
            <>
              {Object.entries(productCount).map(([id, qty]) => {
                const product = products.find(p => p.id === Number(id));
                if (!product || (qty as number) <= 0) return null;
                return (
                  <div key={id} className="flex justify-between mb-2">
                    <span className="text-gray-300">{product.name} (x{qty})</span>
                    <span className="font-semibold text-white">{product.price * (qty as number)} GTQ</span>
                  </div>
                );
              })}
              <div className="border-t border-gray-600 mt-4 pt-4 flex justify-between text-xl font-bold text-green-400">
                <span>Total:</span>
                <span>{productsSubtotal} GTQ</span>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Puedes agregar o quitar productos antes de continuar al pago.
              </p>
            </>
          ) : (
            <p className="text-gray-400">No se han agregado productos.</p>
          )}
        </div>

        {/* Botón Continuar a Pago */}
        <motion.button
          onClick={handleContinueToPayment}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-6 py-3 mt-6 bg-blue-600 text-white rounded-lg font-bold"
        >
          Continuar a Pago
        </motion.button>
      </div>
    </div>
  );
};

export default Concessions;
