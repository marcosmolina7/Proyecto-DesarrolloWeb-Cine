// src/context/AuthContext.tsx
// CORREGIDO: Arreglado el error de exportación para la compatibilidad con Vite HMR.
// Usando export default y exports nombrados para el hook.

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService'; 
import { RotateCw } from 'lucide-react';

// 1. Definimos las constantes de ID de Rol (Para claridad)
const ROLE_ADMIN = 2; 
const ROLE_CASHIER = 3; 
const ROLE_CLIENT = 4; 

// 2. Definimos el tipo de usuario (usando idRole numérico)
interface AuthUser {
  idUser: number;
  nameUser: string;
  idRole: number; 
  roleName: string; 
}

// 3. Definimos lo que nuestro Contexto proveerá
interface IAuthContext {
  user: AuthUser | null;
  login: (nameUser: string, passUser: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// 4. Creamos el Contexto
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// 5. Creamos el "Proveedor" (El componente que envuelve la App)
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => { 
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

  // 6. Verificamos si ya existe un token al cargar la app
  useEffect(() => {
    const validateToken = async () => {
      setIsLoading(true);
      const token = AuthService.getToken();
      if (token) {
        try {
          const profile = await AuthService.getProfile(); 
          if (profile) {
            setUser({
              idUser: profile.sub, 
              nameUser: profile.nameUser,
              idRole: profile.idRole, 
              roleName: profile.role, 
            });
          }
        } catch (error) {
          console.error("Token inválido, deslogueando.");
          AuthService.logout(); 
        }
      }
      setIsLoading(false);
    };
    validateToken();
  }, []);

  // 7. Función de Login (actualiza el estado global)
  const login = async (nameUser: string, passUser: string) => {
    await AuthService.login(nameUser, passUser);
    
    const profile = await AuthService.getProfile();
    if (profile) {
      setUser({
        idUser: profile.sub,
        nameUser: profile.nameUser,
        idRole: profile.idRole, 
        roleName: profile.role, 
      });
      
      // Lógica de Redirección basada en ID numérico
      if (profile.idRole === ROLE_ADMIN) {
        navigate('/dashboard');
      } else if (profile.idRole === ROLE_CASHIER) { 
        navigate('/caja/boletos'); 
      } else if (profile.idRole === ROLE_CLIENT) {
        navigate('/'); 
      } else {
        navigate('/'); 
      }
    }
  };

  // 8. Función de Logout (limpia el estado global)
  const logout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/login'); 
  };

  // 9. Mientras verifica el token, muestra un 'Cargando...'
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <RotateCw className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  // 10. Provee el estado y las funciones a toda la app
  return (
    <AuthContext.Provider value={{ 
        user, 
        login, 
        logout, 
        isLoading, 
        isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// 11. Hook personalizado para consumir el contexto fácilmente
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// 12. EXPORTACIONES FINALES
export { useAuth };
export default AuthProvider; // Usamos default para el Provider
