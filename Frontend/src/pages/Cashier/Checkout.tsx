// src/pages/Cashier/Checkout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import axios, { isAxiosError } from 'axios';
import AuthService from '../../services/AuthService';

const API_URL = 'http://localhost:3000';

interface Movie { idMovie: number; nameMovie: string; }
interface Seat { idSeat: number; rowSeat: string; columnSeat: number; }
interface RoomSeat { idSeat: number; seat: Seat; state: string; }
interface Room { idRoom: number; nameRoom: string; roomSeats: RoomSeat[]; }
interface Showtime {
  idShowtime: number;
  idRoom: number;
  room: Room; 
}
interface Transaction {
  selectedMovie?: Movie;
  selectedShowtime?: Showtime;
  selectedSeats?: string[];
  ticketsSubtotal?: number;
  productCount?: Record<number, number>;
  productsSubtotal?: number;
}

const productsDB = [
  { idProduct: 1, nameProduct: "Palomitas Grande", priceProduct: 35 },
  { idProduct: 2, nameProduct: "Refresco Mediano", priceProduct: 25 },
  { idProduct: 3, nameProduct: "Nachos con Queso", priceProduct: 45 },
];
const TICKET_PRICE = 50; 

const Checkout = () => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const savedTransaction = localStorage.getItem('cashier-transaction');
    if (savedTransaction) {
      setTransaction(JSON.parse(savedTransaction));
    }
    
    if (!AuthService.isAuthenticated()) {
        setError("Necesitas iniciar sesión para pagar.");
        setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const handleConfirmSale = async () => {
    if (!transaction) return;
    setIsProcessing(true);
    setError(null);

    const totalTickets = transaction.ticketsSubtotal || 0;
    const totalProducts = transaction.productsSubtotal || 0;
    const granTotal = totalTickets + totalProducts;

    try {
      // PASO A: Crear la Venta (Sale)
      const saleResponse = await axios.post(`${API_URL}/sale`, {
        totalSale: granTotal 
      });
      
      const newSaleId = saleResponse.data.idSale;
      if (!newSaleId) {
        throw new Error("El backend no devolvió un ID de venta (idSale).");
      }

      // PASO B: Registrar los Boletos (Tickets)
      if (transaction.selectedSeats && transaction.selectedShowtime) {
        const { selectedShowtime, selectedSeats } = transaction;

        const ticketPromises = selectedSeats.map(seatName => {
            const row = seatName.match(/[a-zA-Z]+/)?.[0];
            const col = parseInt(seatName.match(/\d+/)?.[0] || '0');
            
            const roomSeat = selectedShowtime.room.roomSeats.find(rs => 
                rs.seat.rowSeat === row && rs.seat.columnSeat === col
            );
            
            if (!roomSeat) {
                 console.error(`Error: Asiento ${seatName} no encontrado en la sala.`);
                 throw new Error(`Asiento ${seatName} no válido.`);
            }

            const ticketDto = {
                idShowtime: selectedShowtime.idShowtime,
                idRoom: selectedShowtime.idRoom,
                idSeat: roomSeat.idSeat,
                idSale: newSaleId,
                priceTicket: TICKET_PRICE 
            };
            return axios.post(`${API_URL}/tickets`, ticketDto);
        });
        
        await Promise.all(ticketPromises);
      }

      // PASO C: Registrar los Productos (ProductsSale)
      if (transaction.productCount) {
        const productPromises = Object.entries(transaction.productCount)
          .filter(([id, qty]) => (qty as number) > 0)
          .map(([id, qty]) => {
            const product = productsDB.find(p => p.idProduct === Number(id));
            const productSaleDto = {
              idSale: newSaleId,
              idProduct: Number(id),
              quantity: qty,
              unitPrice: product?.priceProduct || 0
            };
            
            // ✅ DESCOMENTADO: Ahora el endpoint existe
            return axios.post(`${API_URL}/products-sale`, productSaleDto); 
          });
          
        await Promise.all(productPromises);
      }

      // PASO D: Éxito
      localStorage.removeItem('cashier-transaction'); 
      setIsProcessing(false);
      setSaleSuccess(true);
      
      setTimeout(() => {
        navigate('/'); 
      }, 3000);

    } catch (err) {
      console.error('Error al registrar la venta:', err);
      let errorMsg = "Error al registrar la venta.";
      if (isAxiosError(err) && err.response) {
          errorMsg = err.response.data.message || `Error del servidor (Código: ${err.response.status})`;
      }
      setError(errorMsg);
      setIsProcessing(false);
    }
  };

  if (saleSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-10">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-2">¡Venta Exitosa!</h1>
          <p className="text-lg text-gray-400">Gracias por tu compra. Redirigiendo...</p>
        </motion.div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-xl">No hay transacción activa.</p>
        <Link to="/" className="text-blue-400 mt-2">Volver a la cartelera</Link>
      </div>
    );
  }

  const productList = transaction.productCount 
    ? Object.entries(transaction.productCount)
      .map(([id, qty]) => {
        const product = productsDB.find(p => p.idProduct === Number(id));
        if (product && (qty as number) > 0) {
          return { name: product.nameProduct, qty: (qty as number) };
        }
        return null;
      }).filter(Boolean) as { name: string, qty: number }[]
    : [];

  const totalTickets = transaction.ticketsSubtotal || 0;
  const totalProducts = transaction.productsSubtotal || 0;
  const granTotal = totalTickets + totalProducts;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700"
      >
        <h1 className="text-4xl font-bold text-blue-400 mb-6 text-center">Confirmar Pago</h1>

        {transaction.selectedMovie && totalTickets > 0 && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">Boletos</h2>
            <p className="text-gray-300">
              {transaction.selectedMovie.nameMovie} ({transaction.selectedSeats?.length || 0}x)
            </p>
            <p className="text-gray-400 text-sm">
              Asientos: {transaction.selectedSeats?.join(', ') || 'N/A'}
            </p>
            <div className="text-right text-lg font-bold text-white mt-2">
              Subtotal: {totalTickets.toFixed(2)} GTQ
            </div>
          </div>
        )}

        {productList.length > 0 && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">Productos</h2>
            {productList.map((item, index) => (
              <p key={index} className="text-gray-300">
                {item.name} (x{item.qty})
              </p>
            ))}
            <div className="text-right text-lg font-bold text-white mt-2">
              Subtotal: {totalProducts.toFixed(2)} GTQ
            </div>
          </div>
        )}

        <div className="border-t-2 border-blue-500 pt-6 mt-6">
          <div className="flex justify-between items-center text-4xl font-bold text-green-400 mb-6">
            <span>TOTAL A PAGAR:</span>
            <span>{granTotal.toFixed(2)} GTQ</span>
          </div>
          
          <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-800 p-3 rounded-lg text-sm text-red-100 mb-4 flex items-center space-x-2"
                >
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </motion.div>
            )}
          </AnimatePresence>

          <h3 className="text-lg font-semibold text-gray-300 mb-3">Método de Pago</h3>
          <div className="flex space-x-4 mb-8">
            <button className="flex-1 p-4 bg-gray-700 rounded-lg flex items-center justify-center space-x-2 text-white border-2 border-blue-500 ring-2 ring-blue-500">
              <DollarSign />
              <span>Efectivo</span>
            </button>
            <button className="flex-1 p-4 bg-gray-700 rounded-lg flex items-center justify-center space-x-2 text-gray-400 border-2 border-gray-600">
              <CreditCard />
              <span>Tarjeta</span>
            </button>
          </div>

          <motion.button
            onClick={handleConfirmSale}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-xl hover:bg-green-700 transition-colors disabled:bg-gray-500"
          >
            {isProcessing ? 'Procesando Venta...' : 'Finalizar Venta'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;