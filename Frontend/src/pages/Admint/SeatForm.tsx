// src/pages/Admint/SeatForm.tsx
// MEJORADO: Ahora tiene dos modos: "Individual" y "Masivo"

import React, { useState, type FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertTriangle, CheckCircle, Armchair, Plus, Grid } from 'lucide-react'; 
import Layout from '../../components/shared/Layout';
import axios, { isAxiosError } from 'axios';

const API_URL = 'http://localhost:3000';

// --- TIPOS ---
type CreateMode = 'individual' | 'bulk';

interface IndividualFormData {
  rowSeat: string;
  columnSeat: number | '';
}
interface BulkFormData {
  rows: number | '';
  columns: number | '';
}

// --- COMPONENTE ---
const SeatForm: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CreateMode>('individual');
  
  const [individualData, setIndividualData] = useState<IndividualFormData>({ rowSeat: '', columnSeat: '' });
  const [bulkData, setBulkData] = useState<BulkFormData>({ rows: '', columns: '' });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleModeChange = (newMode: CreateMode) => {
    setMode(newMode);
    setError(null);
    setIsSuccess(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(null);

    if (mode === 'individual') {
      setIndividualData(prev => ({
        ...prev,
        [name]: name === 'columnSeat' ? (value ? Number(value) : '') : value.toUpperCase()
      }));
    } else {
      setBulkData(prev => ({
        ...prev,
        [name]: (value ? Number(value) : '')
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setIsSuccess(false);

    try {
      if (mode === 'individual') {
        // --- LÓGICA DE MODO INDIVIDUAL ---
        const { rowSeat, columnSeat } = individualData;
        if (!rowSeat.trim() || columnSeat === '') {
          throw new Error("La fila y la columna son obligatorias.");
        }
        const payload = {
          rowSeat: rowSeat.trim(),
          columnSeat: Number(columnSeat)
        };
        await axios.post(`${API_URL}/seat`, payload);
        setSuccessMessage(`Asiento ${payload.rowSeat}${payload.columnSeat} creado exitosamente.`);
        setIndividualData({ rowSeat: '', columnSeat: '' }); // Limpiar formulario individual

      } else {
        // --- LÓGICA DE MODO MASIVO ---
        const { rows, columns } = bulkData;
        if (rows === '' || columns === '' || rows <= 0 || columns <= 0) {
          throw new Error("Las filas y columnas deben ser números mayores a 0.");
        }
        const payload = { rows: Number(rows), columns: Number(columns) };
        const response = await axios.post(`${API_URL}/seat/bulk-create`, payload);
        setSuccessMessage(`${response.data.count} asientos creados/actualizados exitosamente.`);
        setBulkData({ rows: '', columns: '' }); // Limpiar formulario masivo
      }
      
      setIsSuccess(true);
      // No redirigimos, permitimos crear más

    } catch (err) {
      let errorMsg = "Error al crear asientos.";
      if (isAxiosError(err) && err.response?.data.message) {
        errorMsg = err.response.data.message;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDERIZADO DE FORMULARIOS ---

  const renderIndividualForm = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <p className="text-sm text-gray-400">Crea un asiento específico (ej. Fila 'A', Columna '1').</p>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="rowSeat" className="block text-sm font-medium text-gray-400 mb-2">Fila (Letra)</label>
          <input
            type="text"
            id="rowSeat"
            name="rowSeat"
            value={individualData.rowSeat}
            onChange={handleChange}
            maxLength={2}
            placeholder="A"
            disabled={isSaving}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="columnSeat" className="block text-sm font-medium text-gray-400 mb-2">Columna (Número)</label>
          <input
            type="number"
            id="columnSeat"
            name="columnSeat"
            value={individualData.columnSeat}
            min="1"
            placeholder="1"
            onChange={handleChange}
            disabled={isSaving}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            required
          />
        </div>
      </div>
    </motion.div>
  );

  const renderBulkForm = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <p className="text-sm text-gray-400">Crea un lote de asientos (ej. 10 filas A-J, con 12 columnas 1-12 cada una).</p>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="rows" className="block text-sm font-medium text-gray-400 mb-2">Total de Filas (A, B...)</label>
          <input
            type="number"
            id="rows"
            name="rows"
            value={bulkData.rows}
            onChange={handleChange}
            min="1"
            max="26" // Límite A-Z
            placeholder="Ej: 10"
            disabled={isSaving}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            required
          />
        </div>
        <div className="flex-1">
          <label htmlFor="columns" className="block text-sm font-medium text-gray-400 mb-2">Total de Columnas (1, 2...)</label>
          <input
            type="number"
            id="columns"
            name="columns"
            value={bulkData.columns}
            min="1"
            placeholder="Ej: 12"
            onChange={handleChange}
            disabled={isSaving}
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            required
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <div className="max-w-xl mx-auto py-8 px-4"> 
        <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center"><Armchair className="w-8 h-8 mr-3 text-cyan-400" />Agregar Asientos al Catálogo</h1>
        <p className="text-gray-400 mb-6">Elige un modo para crear los asientos maestros.</p>
        
        {/* --- PESTAÑAS DE MODO --- */}
        <div className="flex mb-4 rounded-lg bg-gray-700 p-1">
          <button
            onClick={() => handleModeChange('individual')}
            className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${mode === 'individual' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
          >
            <Plus className="w-5 h-5 inline mr-1" />
            Crear Individual
          </button>
          <button
            onClick={() => handleModeChange('bulk')}
            className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${mode === 'bulk' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
          >
            <Grid className="w-5 h-5 inline mr-1" />
            Crear Masivo (Lote)
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {mode === 'individual' ? renderIndividualForm() : renderBulkForm()}
            </AnimatePresence>
            
            {/* --- MENSAJES Y BOTÓN DE GUARDAR --- */}
            <div className="mt-6 space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-800 p-3 rounded-lg text-sm flex items-center space-x-2"><AlertTriangle className="w-5 h-5" /><span>{error}</span></motion.div>
                )}
                {isSuccess && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-green-800 p-3 rounded-lg text-sm flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>{successMessage}</span></motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4">
                <button type="submit" disabled={isSaving} className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-500">
                  {isSaving ? <span className="animate-spin h-5 w-5 border-t-2 border-r-2 border-white rounded-full"></span> : <Save className="w-5 h-5" />}
                  <span>{isSaving ? 'Creando...' : 'Crear Asientos'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SeatForm;