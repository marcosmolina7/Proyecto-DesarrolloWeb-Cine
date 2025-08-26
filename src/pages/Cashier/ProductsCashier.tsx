import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const products = [
  { id: 1, name: "Palomitas Grande", price: 35 },
  { id: 2, name: "Refresco Mediano", price: 25 },
  { id: 3, name: "Nachos con Queso", price: 45 },
  { id: 4, name: "Hot Dog", price: 30 },
  { id: 5, name: "Agua embotellada", price: 15 },
  { id: 6, name: "Chocolate", price: 10 },
  { id: 7, name: "Alitas de Pollo", price: 50 },
  { id: 8, name: "Helado", price: 20 },
];

const ProductsCashier = () => {
  const [productCount, setProductCount] = useState<Record<number, number>>({});
  const [productsSubtotal, setProductsSubtotal] = useState(0);

  useEffect(() => {
    let newSubtotal = 0;
    for (const productId in productCount) {
      const product = products.find(p => p.id === Number(productId));
      if (product) {
        newSubtotal += product.price * (productCount[Number(productId)] || 0);
      }
    }
    setProductsSubtotal(newSubtotal);

    const existing = JSON.parse(localStorage.getItem('cashier-transaction') || '{}');
    const updated = {
      ...existing,
      productCount,
      productsSubtotal: newSubtotal
    };
    localStorage.setItem('cashier-transaction', JSON.stringify(updated));

  }, [productCount]);

  const addProduct = (productId: number) => {
    setProductCount(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeProduct = (productId: number) => {
    setProductCount(prev => {
      const newCount = { ...prev };
      if (newCount[productId] > 0) {
        newCount[productId]--;
      }
      return newCount;
    });
  };

  const clearTransaction = () => {
    setProductCount({});
    const existing = JSON.parse(localStorage.getItem('cashier-transaction') || '{}');
    const updated = {
      ...existing,
      productCount: {},
      productsSubtotal: 0
    };
    localStorage.setItem('cashier-transaction', JSON.stringify(updated));
  };

  const productList = Object.keys(productCount)
    .map(productId => {
      const product = products.find(p => p.id === Number(productId));
      if (product && productCount[Number(productId)] > 0) {
        return {
          ...product,
          count: productCount[Number(productId)],
          total: product.price * productCount[Number(productId)]
        };
      }
      return null;
    })
    .filter(Boolean) as { id: number; name: string; price: number; count: number; total: number }[];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-8 text-center">Caja de Productos</h1>
      <div className="w-full max-w-6xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Selección de productos */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Seleccionar Productos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(product => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-700 p-4 rounded-lg flex flex-col items-center cursor-pointer shadow-lg transition-all duration-300"
                onClick={() => addProduct(product.id)}
              >
                <p className="text-lg font-semibold text-center">{product.name}</p>
                <p className="text-xl font-bold text-green-400 mt-2">{product.price} GTQ</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Columna derecha */}
        <div>
          {/* Resumen de Productos estilo boletos */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-inner border border-gray-600 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Resumen de Productos</h2>
            {productList.length > 0 ? (
              <>
                {productList.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded-lg border border-gray-600 mb-2"
                  >
                    <div className="flex items-center">
                      <p className="text-lg font-semibold text-white">{item.name}</p>
                      <p className="text-lg font-bold text-gray-400 ml-2">x{item.count}</p>
                    </div>
                    <p className="text-xl font-bold text-green-400">{item.total} GTQ</p>
                  </div>
                ))}
                <div className="border-t-2 border-gray-600 pt-4 mt-4 flex justify-between items-center text-xl font-bold text-blue-400">
                  <p>Total:</p>
                  <p>{productsSubtotal} GTQ</p>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center text-lg">No se han agregado productos.</p>
            )}
          </div>

          {/* Bloque editable de la transacción */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-inner border border-gray-600">
            {productList.length > 0 ? (
              <div className="space-y-4">
                {productList.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-center">
                      <p className="text-lg font-semibold text-white">{item.name}</p>
                      <p className="text-lg font-bold text-gray-400 ml-2">x{item.count}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-xl font-bold text-green-400">
                        {item.total} GTQ
                      </p>
                      <button
                        onClick={() => removeProduct(item.id)}
                        className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                      >
                        -
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center text-lg">
                No se han agregado productos.
              </p>
            )}
            
            <div className="border-t-2 border-gray-600 pt-6 mt-6">
              <div className="flex justify-between items-center text-4xl font-bold text-blue-400">
                <p>Total:</p>
                <p>{productsSubtotal} GTQ</p>
              </div>
              <button
                onClick={clearTransaction}
                className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition"
              >
                Limpiar Transacción
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsCashier;
