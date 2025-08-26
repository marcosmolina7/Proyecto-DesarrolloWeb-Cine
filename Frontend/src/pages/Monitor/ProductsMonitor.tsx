import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const products = [
  { id: 1, name: "Palomitas Grande", price: 35 },
  { id: 2, name: "Refresco Mediano", price: 25 },
  { id: 3, name: "Nachos con Queso", price: 45 },
  { id: 4, name: "Hot Dog", price: 30 },
];

const ProductsMonitor = () => {
  const [productCount, setProductCount] = useState<Record<number, number>>({});
  const [productsSubtotal, setProductsSubtotal] = useState(0);

  useEffect(() => {
    const updateTransactionState = () => {
      const data = localStorage.getItem('cashier-transaction');
      if (!data) return;

      try {
        const parsed = JSON.parse(data);

        if (parsed.productCount && typeof parsed.productCount === 'object') {
          setProductCount(parsed.productCount);
        }
        // Ya no dependemos de productsSubtotal guardado
      } catch (err) {
        console.error("Error al parsear transacción en ProductsMonitor:", err);
      }
    };

    window.addEventListener('storage', updateTransactionState);
    updateTransactionState();

    return () => {
      window.removeEventListener('storage', updateTransactionState);
    };
  }, []);

  // 🔹 Recalcular subtotal cada vez que cambie productCount
  useEffect(() => {
    let total = 0;
    for (const id in productCount) {
      const product = products.find(p => p.id === Number(id));
      if (product) {
        total += product.price * (productCount[Number(id)] || 0);
      }
    }
    setProductsSubtotal(total);
  }, [productCount]);

  const productList = Object.keys(productCount)
    .map(productId => {
      const product = products.find(p => p.id === Number(productId));
      return product && productCount[Number(productId)] > 0
        ? { name: product.name, count: productCount[Number(productId)] }
        : null;
    })
    .filter(Boolean) as { name: string; count: number }[];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-4xl shadow-2xl border border-gray-700"
      >
        <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">Resumen de Productos</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Productos</h2>
          <div className="space-y-3">
            {productList.length > 0 ? (
              productList.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                >
                  <p className="text-lg">{item.name}</p>
                  <p className="text-lg font-semibold">x{item.count}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No se han seleccionado productos.</p>
            )}
          </div>
        </div>
        <div className="border-t-2 border-gray-700 pt-6 mt-6">
          <div className="flex justify-between items-center text-4xl font-bold text-green-400">
            <p>Total a Pagar:</p>
            <p>{productsSubtotal} GTQ</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductsMonitor;
