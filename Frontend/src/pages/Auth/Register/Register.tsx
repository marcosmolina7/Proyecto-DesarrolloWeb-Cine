import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom'; // 1. CORRECCIÓN: Importar desde 'react-router-dom'
import AuthService from '../../../services/AuthService'; 
import { isAxiosError } from 'axios';
import { AlertTriangle, UserPlus, CheckCircle } from 'lucide-react';
import Layout from '../../../components/shared/Layout'; 

const Register = () => {
  const [nameUser, setNameUser] = useState('');
  const [passUser, setPassUser] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (passUser !== confirmPass) {
        setError("Las contraseñas no coinciden.");
        setIsLoading(false);
        return;
    }
    if (passUser.length < 6) { // Asumiendo una regla de 6 caracteres
        setError("La contraseña debe tener al menos 6 caracteres.");
        setIsLoading(false);
        return;
    }

    try {
      // Esta función 'register' la añadimos a AuthService.ts
      await AuthService.register(nameUser, passUser); 
      
      setSuccess("¡Cuenta creada con éxito! Serás redirigido al login.");
      // Limpiamos el formulario en éxito
      setNameUser('');
      setPassUser('');
      setConfirmPass('');
      
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      console.error('Register error:', err);
      let errorMsg = "Ocurrió un error al registrar.";
      if (isAxiosError(err) && err.response) {
        if (err.response.data.message?.includes('unique constraint') || err.response.data.message?.includes('Unique constraint failed')) {
          errorMsg = "Ese nombre de usuario ya existe.";
        } else if (Array.isArray(err.response.data.message)) {
            errorMsg = err.response.data.message.join(', ');
        }
         else {
          errorMsg = err.response.data.message || 'Error del servidor';
        }
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-900 -mt-16"> {/* Ajuste para centrar */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 bg-gray-800 rounded-xl shadow-lg w-full max-w-md border border-gray-700"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-6 flex items-center justify-center">
              <UserPlus className="w-8 h-8 mr-2"/>Crear Cuenta de Cliente
          </h2>
          
          <AnimatePresence>
              {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-800 p-3 rounded-lg text-sm text-red-100 mb-4 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <span>{error}</span>
                  </motion.div>
              )}
              {success && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-green-800 p-3 rounded-lg text-sm text-green-100 mb-4 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{success}</span>
                  </motion.div>
              )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="nameUser">Usuario (Username)</label>
              <input type="text" id="nameUser" value={nameUser} onChange={(e) => setNameUser(e.target.value)} className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600" required disabled={isLoading}/>
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 mb-2" htmlFor="passUser">Contraseña (mín. 6 caracteres)</label>
              <input type="password" id="passUser" value={passUser} onChange={(e) => setPassUser(e.target.value)} className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600" required disabled={isLoading}/>
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 mb-2" htmlFor="confirmPass">Confirmar Contraseña</label>
              <input type="password" id="confirmPass" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600" required disabled={isLoading}/>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-500">
              {isLoading ? 'Registrando...' : 'Registrarme'}
            </motion.button>
          </form>
          
          <p className="text-center text-gray-400 text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Register;