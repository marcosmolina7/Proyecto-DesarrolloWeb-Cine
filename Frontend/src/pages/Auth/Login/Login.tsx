// src/pages/Auth/Login/Login.tsx
// CORREGIDO: Conectado a AuthContext (useAuth) en lugar de AuthService.
// CORREGIDO: Eliminada la redirección manual (la maneja el contexto).

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { isAxiosError } from 'axios';
import { AlertTriangle } from 'lucide-react'; 

const Login = () => {
  const [nameUser, setNameUser] = useState(''); 
  const [passUser, setPassUser] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!nameUser || !passUser) {
        setError("Correo y Contraseña son obligatorios."); // ✅ CAMBIADO
        setIsLoading(false);
        return;
    }

    try {
      await login(nameUser, passUser);

    } catch (err) {
      console.error('Login error:', err);
      let errorMsg = "Ocurrió un error al contactar al servidor.";

      if (isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
            errorMsg = "Credenciales incorrectas o usuario inactivo.";
        } else {
            errorMsg = err.response.data.message || `Error del servidor (Código: ${err.response.status})`;
        }
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-gray-800 rounded-xl shadow-lg w-full max-w-md border border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">Iniciar Sesión</h2>
        
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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="nameUser">
              Correo Electrónico {/* ✅ CAMBIADO */}
            </label>
            <input
              type="email" // ✅ CAMBIADO de "text" a "email"
              id="nameUser"
              name="nameUser"
              value={nameUser}
              onChange={(e) => setNameUser(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com" // ✅ CAMBIADO
              disabled={isLoading}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="passUser">
              Contraseña
            </label>
            <input
              type="password"
              id="passUser"
              name="passUser"
              value={passUser}
              onChange={(e) => setPassUser(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-500"
          >
            {isLoading ? 'Cargando...' : 'Entrar'}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          ¿Eres un cliente y no tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
            Regístrate aquí
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;