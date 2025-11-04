// src/pages/Admint/RoomAssignSeatsModal.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertTriangle, CheckCircle, Armchair, RotateCw } from 'lucide-react'; 
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
interface Room {
  idRoom: number;
  nameRoom: string;
}
interface Seat { // Asiento del catálogo maestro
  idSeat: number;
  rowSeat: string;
  columnSeat: number;
}
interface RoomSeat { // Asiento ya asignado a esta sala
    idSeat: number;
    seat: Seat;
}
interface RoomAssignSeatsModalProps {
  room: Room;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

// --- COMPONENTE ---
const RoomAssignSeatsModal: React.FC<RoomAssignSeatsModalProps> = ({ room, onClose, onUpdateSuccess }) => {
  const [allSeats, setAllSeats] = useState<Seat[]>([]); // Catálogo maestro
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]); // IDs de asientos seleccionados
  const [initialSeatIds, setInitialSeatIds] = useState<Set<number>>(new Set()); // Para comparar cambios

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Cargar Catálogo de Asientos y Asientos Ya Asignados ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [allSeatsRes, roomDetailsRes] = await Promise.all([
          axios.get<Seat[]>(`${API_URL}/seat`),
          axios.get<{ roomSeats: RoomSeat[] }>(`${API_URL}/room/${room.idRoom}`) // Tu endpoint de "get by id"
        ]);
        
        // Ordenar el catálogo maestro
        const sortedSeats = allSeatsRes.data.sort((a, b) => {
          if (a.rowSeat < b.rowSeat) return -1;
          if (a.rowSeat > b.rowSeat) return 1;
          return a.columnSeat - b.columnSeat;
        });
        setAllSeats(sortedSeats);

        // Marcar los asientos ya asignados a esta sala
        const assignedIds = roomDetailsRes.data.roomSeats.map(rs => rs.idSeat);
        setSelectedSeatIds(assignedIds);
        setInitialSeatIds(new Set(assignedIds)); // Guardar estado original

      } catch (err) {
        setError("Error al cargar la configuración de la sala.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [room]);

  const handleSeatToggle = (seatId: number) => {
    setSelectedSeatIds(prev =>
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId) // Deseleccionar
        : [...prev, seatId] // Seleccionar
    );
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    
    // Tu backend espera un array de strings (ej: ["A1", "A2"])
    // Debemos convertir los IDs seleccionados a ese formato
    const selectedSeatNames = allSeats
      .filter(seat => selectedSeatIds.includes(seat.idSeat))
      .map(seat => `${seat.rowSeat}${seat.columnSeat}`);

    try {
      await axios.post(`${API_URL}/room/assign-seats`, {
        idRoom: room.idRoom,
        seats: selectedSeatNames // Enviamos el array de nombres de asientos
      });
      setIsSuccess(true);
    } catch (err) {
      let errorMsg = "Error al asignar asientos.";
      if (isAxiosError(err) && err.response?.data.message) {
        errorMsg = err.response.data.message;
      }
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSuccessClose = () => {
    onUpdateSuccess();
    onClose();
  };

  // Agrupar asientos por fila
  const seatsByRow = allSeats.reduce((acc, seat) => {
    (acc[seat.rowSeat] = acc[seat.rowSeat] || []).push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 rounded-xl w-full max-w-3xl border border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Asignar Asientos a: {room.nameRoom}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={isLoading || isSaving}><X /></button>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl text-white">¡Asientos Asignados!</h3>
            <p className="text-gray-300 mb-4">La sala ha sido actualizada.</p>
            <button onClick={handleSuccessClose} className="mt-4 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {error && <div className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2 mb-4"><AlertTriangle className="w-5 h-5" /><span>{error}</span></div>}
            
            {isLoading ? (
                <div className="text-center py-10 text-gray-400"><RotateCw className="w-8 h-8 animate-spin mx-auto mb-3" />Cargando asientos...</div>
            ) : (
                <div className="max-h-[60vh] overflow-y-auto p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-center mb-4 w-full">
                        <div className="bg-gray-700 text-gray-300 px-8 py-2 rounded-lg text-center font-mono w-full max-w-lg">PANTALLA</div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        {Object.entries(seatsByRow).map(([row, seatsInRow]) => (
                        <div key={row} className="flex gap-2 items-center">
                            <div className="w-8 text-center font-bold text-gray-400">{row}</div>
                            <div className="flex flex-wrap gap-2">
                            {seatsInRow.map((seat) => {
                                const isSelected = selectedSeatIds.includes(seat.idSeat);
                                const wasInitiallySelected = initialSeatIds.has(seat.idSeat);
                                
                                let bgColor = 'bg-gray-600'; // No seleccionado
                                if (isSelected) bgColor = 'bg-green-600'; // Seleccionado ahora
                                if (wasInitiallySelected && !isSelected) bgColor = 'bg-red-600'; // Deseleccionado

                                return (
                                <motion.button
                                    type="button"
                                    key={seat.idSeat}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleSeatToggle(seat.idSeat)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-white transition-colors ${bgColor}`}
                                >
                                    {seat.columnSeat}
                                </motion.button>
                                );
                            })}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-6">
              <button type="button" onClick={onClose} disabled={isLoading || isSaving} className="px-5 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700">Cancelar</button>
              <button type="submit" disabled={isLoading || isSaving} className="flex items-center space-x-2 px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800">
                {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 rounded-full"></span> : <Save />}
                <span>{isSaving ? 'Guardando...' : 'Guardar Asignación'}</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default RoomAssignSeatsModal;
