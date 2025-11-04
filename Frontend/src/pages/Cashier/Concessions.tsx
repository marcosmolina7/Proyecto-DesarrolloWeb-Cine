// src/pages/Cashier/Concessions.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface Product {
  idProduct: number;
  nameProduct: string;
  priceProduct: number;
  stockProduct: number;
}

const Concessions = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    
    const savedTransaction = localStorage.getItem('cashier-transaction');
    if (savedTransaction) {
      try {
        const transaction = JSON.parse(savedTransaction);
        setProductCount(transaction.productCount || {});
      } catch (e) {
        console.error('Error al parsear cashier-transaction:', e);
      }
    }
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`);
      // Filtrar solo productos activos y con stock
      const activeProducts = response.data.filter(
        (p: Product) => p.stockProduct > 0
      );
      setProducts(activeProducts);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProductsSubtotal = (currentProducts: Record<number, number>) => {
    let total = 0;
    Object.keys(currentProducts).forEach(productId => {
      const product = products.find(p => p.idProduct === Number(productId));
      if (product) {
        total += product.priceProduct * (currentProducts[Number(productId)] || 0);
      }
    });
    return total;
  };

  const updateLocalStorage = (partial: any) => {
    const existing = JSON.parse(localStorage.getItem('cashier-transaction') || '{}');
    const updated = { ...existing, ...partial };
    localStorage.setItem('cashier-transaction', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleProductChange = (productId: number, change: number) => {
    const product = products.find(p => p.idProduct === productId);
    if (!product) return;

    setProductCount(prev => {
      const newCount = { ...prev };
      const currentQty = newCount[productId] || 0;
      const newQty = currentQty + change;

      // Validar stock
      if (newQty < 0) return prev;
      if (newQty > product.stockProduct) {
        alert(`Stock insuficiente. Disponible: ${product.stockProduct}`);
        return prev;
      }

      newCount[productId] = newQty;

      updateLocalStorage({
        productCount: newCount,
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
    navigate('/checkout');
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
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

        {loading ? (
          <p className="text-center text-gray-400">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <motion.div
                key={product.idProduct}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{product.nameProduct}</h3>
                <p className="text-gray-400 mb-2">{product.priceProduct} GTQ</p>
                <p className="text-gray-500 text-sm mb-4">Stock: {product.stockProduct}</p>
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleProductChange(product.idProduct, -1)}
                    className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    -
                  </motion.button>
                  <span className="text-2xl font-bold mx-4">{productCount[product.idProduct] || 0}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleProductChange(product.idProduct, 1)}
                    className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    +
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="w-96 bg-gray-800 p-8 pt-20 border-l border-gray-700 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-4">Resumen de Productos</h2>
          {Object.keys(productCount).some(id => productCount[Number(id)] > 0) ? (
            <>
              {Object.entries(productCount).map(([id, qty]) => {
                const product = products.find(p => p.idProduct === Number(id));
                if (!product || qty <= 0) return null;
                return (
                  <div key={id} className="flex justify-between mb-2">
                    <span className="text-gray-300">
                      {product.nameProduct} (x{qty})
                    </span>
                    <span className="font-semibold text-white">
                      {(product.priceProduct * qty).toFixed(2)} GTQ
                    </span>
                  </div>
                );
              })}
              <div className="border-t border-gray-600 mt-4 pt-4 flex justify-between text-xl font-bold text-green-400">
                <span>Total:</span>
                <span>{productsSubtotal.toFixed(2)} GTQ</span>
              </div>
            </>
          ) : (
            <p className="text-gray-400">No se han agregado productos.</p>
          )}
        </div>

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