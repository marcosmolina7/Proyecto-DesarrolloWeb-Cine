// src/pages/Admint/RoomForm.tsx
// CORREGIDO: Layout "full screen"
// CORREGIDO: handleSubmit usa 2 llamadas (POST /room, POST /room/assign-seats)
// CORREGIDO: El grid de asientos ahora se centra si es pequeño
// CORREGIDO: La PANTALLA ahora se ajusta dinámicamente al ancho del grid

import React, { useState, type FormEvent, ChangeEvent, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, DoorOpen, Columns, Rows, Armchair, CheckSquare, XSquare } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// Interfaz sin cambios
interface RoomFormData {
  nameRoom: string;
  rows: number | '';
  columns: number | '';
}

// --- 2. COMPONENTE VISUALIZADOR DE ASIENTOS ---
interface SeatGridVisualizerProps {
  rows: number;
  columns: number;
  enabledSeats: Set<string>;
  onSeatToggle: (seatId: string) => void;
}
const getRowLabel = (index: number): string => {
    return String.fromCharCode(65 + index); 
};

// Constantes para el tamaño del asiento (40px + 8px de gap)
const SEAT_WIDTH_PX = 40;
const SEAT_GAP_PX = 8;

const SeatGridVisualizer: React.FC<SeatGridVisualizerProps> = ({ rows, columns, enabledSeats, onSeatToggle }) => {
    
    const grid = useMemo(() => {
        const newGrid = [];
        for (let r = 0; r < rows; r++) {
            const rowLabel = getRowLabel(r);
            const seatButtons = [];
            for (let c = 1; c <= columns; c++) {
                const seatId = `${rowLabel}${c}`;
                const isEnabled = enabledSeats.has(seatId);
                seatButtons.push(
                    <motion.button
                        type="button"
                        key={seatId}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onSeatToggle(seatId)}
                        // w-10 h-10 (40px)
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold transition-colors flex-shrink-0`} 
                        style={{
                          backgroundColor: isEnabled ? '#16A34A' : '#4B5563', // green-600 | gray-600
                          color: isEnabled ? 'white' : '#D1D5DB' // text-white | text-gray-400
                        }}
                    >
                        {c}
                    </motion.button>
                );
            }
            newGrid.push(
                <div key={rowLabel} className="flex gap-2 items-center">
                    <div className="w-8 text-center font-bold text-gray-400 flex-shrink-0">{rowLabel}</div>
                    {/* gap-2 (8px) y flex-nowrap */}
                    <div className="flex flex-nowrap gap-2">
                        {seatButtons}
                    </div>
                </div>
            );
        }
        return newGrid;
    }, [rows, columns, enabledSeats, onSeatToggle]);

    // Calculamos el ancho del grid + un padding
    const gridWidth = useMemo(() => {
        if (columns === 0) return '90%';
        const width = (SEAT_WIDTH_PX * columns) + (SEAT_GAP_PX * (columns - 1)) + 40; // 40px padding
        return `${width}px`;
    }, [columns]);

    return (
        <div className="mt-6 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Paso 2: Habilitar Asientos para esta Sala</h3>
            <div className="p-4 bg-gray-900 rounded-lg flex flex-col flex-grow items-center"> {/* Centramos el contenido */}
                
                <div 
                    className="bg-gray-700 text-gray-300 py-2 rounded-lg text-center font-mono w-full flex-shrink-0 mb-4"
                    style={{ maxWidth: gridWidth }} // Se ajusta al ancho del grid
                >
                    PANTALLA
                </div>
                
                {/* overflow-auto (scroll H y V) y centrado */}
                <div className="flex justify-center items-center flex-grow overflow-auto p-2 w-full">
                    <div className="flex flex-col items-start gap-3">
                        {grid}
                    </div>
                </div>
            </div>
        </div>
    );
};
// ---------------------------------------------


const RoomForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RoomFormData>({ nameRoom: '', rows: '', columns: '' });
  const [enabledSeats, setEnabledSeats] = useState(new Set<string>());
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isDimension = name === 'rows' || name === 'columns';
    setFormData(prev => ({
      ...prev,
      [name]: isDimension ? (value ? Number(value) : '') : value
    }));
    if (isDimension) {
        setEnabledSeats(new Set<string>());
    }
    setError(null);
  };

  const handleSeatToggle = (seatId: string) => {
    setEnabledSeats(prev => {
        const newSet = new Set(prev);
        if (newSet.has(seatId)) {
            newSet.delete(seatId);
        } else {
            newSet.add(seatId);
        }
        return newSet;
    });
  };

  const handleEnableAll = () => {
    const { rows, columns } = formData;
    if (rows === '' || columns === '' || rows <= 0 || columns <= 0) return;
    const newSet = new Set<string>();
    for (let r = 0; r < rows; r++) {
        const rowLabel = getRowLabel(r);
        for (let c = 1; c <= columns; c++) {
            newSet.add(`${rowLabel}${c}`);
        }
    }
    setEnabledSeats(newSet);
  };

  const handleDisableAll = () => {
    setEnabledSeats(new Set<string>());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const { nameRoom, rows, columns } = formData;

    if (!nameRoom.trim() || rows === '' || columns === '') {
      setError("El nombre, las filas y las columnas son obligatorios.");
      setIsSaving(false);
      return;
    }
    if (rows <= 0 || columns <= 0) {
        setError("Las filas y columnas deben ser mayores a 0.");
        setIsSaving(false);
        return;
    }
    if (enabledSeats.size === 0) {
        setError("Debe habilitar al menos un asiento para la sala.");
        setIsSaving(false);
        return;
    }

    try {
      // 1. Crear Sala
      const roomPayload = {
        nameRoom: nameRoom.trim(),
        rows: Number(rows),
        columns: Number(columns),
      };
      const roomResponse = await axios.post(`${API_URL}/room`, roomPayload);
      const newRoomId = roomResponse.data?.idRoom; 
      if (!newRoomId) {
          throw new Error("El backend no devolvió un ID de sala válido.");
      }
      
      // 2. Asignar Asientos
      const seatsPayload = {
        idRoom: newRoomId,
        seats: Array.from(enabledSeats) 
      };
      await axios.post(`${API_URL}/room/assign-seats`, seatsPayload);
      
      setIsSuccess(true);
      setTimeout(() => navigate('/admin/rooms'), 1500);

    } catch (err) {
      let errorMsg = "Error al crear la sala.";
      if (isAxiosError(err) && err.response?.data.message) {
        if (Array.isArray(err.response.data.message)) {
            errorMsg = err.response.data.message.join(', ');
        } else {
            errorMsg = err.response.data.message;
        }
      }
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const showGrid = formData.rows !== '' && formData.columns !== '' && formData.rows > 0 && formData.columns > 0;

  return (
    <Layout>
      <div className="h-full flex flex-col p-6"> 
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center flex-shrink-0"><DoorOpen className="w-8 h-8 mr-3 text-red-400" />Agregar Nueva Sala</h1>
        <p className="text-gray-400 mb-6 flex-shrink-0">Crea una nueva sala y define su distribución (filas y columnas).</p>
        
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col flex-grow">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">¡Sala Creada!</h2>
                <p className="text-gray-300">Redirigiendo a la lista...</p>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow">
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2 flex-shrink-0"><AlertTriangle className="w-5 h-5" /><span>{error}</span></motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex-shrink-0">
                  <label htmlFor="nameRoom" className="block text-sm font-medium text-gray-400 mb-2">Paso 1: Nombre de la Sala</label>
                  <input
                    type="text"
                    id="nameRoom"
                    name="nameRoom"
                    value={formData.nameRoom}
                    onChange={handleChange}
                    placeholder="Ej: Sala 1"
                    disabled={isSaving}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                    required
                  />
                </div>
                
                <div className="flex space-x-4 flex-shrink-0">
                  <div className="flex-1">
                    <label htmlFor="rows" className="block text-sm font-medium text-gray-400 mb-2 flex items-center"><Rows className="w-4 h-4 mr-1"/> N° de Filas (A, B, C...)</label>
                    <input
                      type="number"
                      id="rows"
                      name="rows"
                      value={formData.rows}
                      onChange={handleChange}
                      min="1"
                      max="26" // Límite de la A a la Z
                      placeholder="Ej: 10"
                      disabled={isSaving}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="columns" className="block text-sm font-medium text-gray-400 mb-2 flex items-center"><Columns className="w-4 h-4 mr-1"/> N° de Columnas (1, 2, 3...)</label>
                    <input
                      type="number"
                      id="columns"
                      name="columns"
                      value={formData.columns}
                      onChange={handleChange}
                      min="1"
                      placeholder="Ej: 12"
                      disabled={isSaving}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                      required
                    />
                  </div>
                </div>

                <AnimatePresence>
                {showGrid && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 flex flex-col flex-grow"
                    >
                        <div className="flex space-x-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={handleEnableAll}
                                className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
                            >
                                <CheckSquare className="w-4 h-4" />
                                <span>Habilitar Todos</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleDisableAll}
                                className="flex-1 flex items-center justify-center space-x-2 p-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
                            >
                                <XSquare className="w-4 h-4" />
                                <span>Limpiar Selección</span>
                            </button>
                        </div>
                        
                        <SeatGridVisualizer
                            rows={Number(formData.rows)}
                            columns={Number(formData.columns)}
                            enabledSeats={enabledSeats}
                            onSeatToggle={handleSeatToggle}
                        />
                    </motion.div>
                )}
                </AnimatePresence>
                
                <div className="pt-4 flex-shrink-0">
                  <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500">
                    {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span> : <Save className="w-5 h-5" />}
                    <span>{isSaving ? 'Creando...' : 'Crear Sala'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default RoomForm;