// src/pages/Monitor/ProductsMonitor.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface Product {
  idProduct: number;
  nameProduct: string;
  priceProduct: number | string; // ✅ CORREGIDO: Puede ser number o Decimal (string)
}

const ProductsMonitor = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState<Record<number, number>>({});
  const [productsSubtotal, setProductsSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Cargar productos del backend
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Escuchar cambios en localStorage
  useEffect(() => {
    const updateTransactionState = () => {
      const data = localStorage.getItem('cashier-transaction');
      if (!data) return;

      try {
        const parsed = JSON.parse(data);

        if (parsed.productCount && typeof parsed.productCount === 'object') {
          setProductCount(parsed.productCount);
        }
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

  // Recalcular subtotal cada vez que cambie productCount o products
  useEffect(() => {
    if (products.length === 0) return;

    let total = 0;
    for (const id in productCount) {
      const product = products.find(p => p.idProduct === Number(id));
      if (product) {
        // ✅ CORREGIDO: Convertir Decimal a número
        const price = Number(product.priceProduct);
        total += price * (productCount[Number(id)] || 0);
      }
    }
    setProductsSubtotal(total);
  }, [productCount, products]);

  const productList = Object.keys(productCount)
    .map(productId => {
      const product = products.find(p => p.idProduct === Number(productId));
      if (!product || !productCount[Number(productId)] || productCount[Number(productId)] <= 0) {
        return null;
      }

      // ✅ CORREGIDO: Convertir Decimal a número
      const price = Number(product.priceProduct);
      const count = productCount[Number(productId)];
      const subtotal = price * count;

      return { 
        name: product.nameProduct, 
        count: count,
        price: price,
        subtotal: subtotal
      };
    })
    .filter(Boolean) as { name: string; count: number; price: number; subtotal: number }[];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-2xl">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-8 rounded-xl w-full max-w-4xl shadow-2xl border border-gray-700"
      >
        <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">
          Monitor de Productos - Cliente
        </h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">Productos Seleccionados</h2>
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
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      {item.price.toFixed(2)} GTQ x {item.count}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-400">
                    {item.subtotal.toFixed(2)} GTQ
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-2xl mb-2">
                  No se han seleccionado productos
                </p>
                <p className="text-gray-600">
                  Los productos aparecerán aquí en tiempo real
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t-2 border-gray-700 pt-6 mt-6">
          <div className="flex justify-between items-center text-4xl font-bold text-green-400">
            <p>Total a Pagar:</p>
            <p>{productsSubtotal.toFixed(2)} GTQ</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductsMonitor;