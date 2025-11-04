// src/services/AuthService.ts
import axios, { isAxiosError } from 'axios'; 

const API_URL = 'http://localhost:3000';
const TOKEN_KEY = 'cine_jwt_token'; // Clave para guardar el token

// 1. Configura Axios para que incluya el token en TODAS las peticiones
const setupAxiosInterceptors = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Intenta cargar el token al iniciar la aplicación
const token = localStorage.getItem(TOKEN_KEY);
setupAxiosInterceptors(token);

// 2. Servicio de Autenticación
const AuthService = {
    
    // Función para el login
    login: async (nameUser: string, passUser: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                nameUser,
                passUser,
            });
            
            const accessToken = response.data.access_token;
            
            // 3. Guardar token y configurar Axios
            localStorage.setItem(TOKEN_KEY, accessToken);
            setupAxiosInterceptors(accessToken);

            return response.data;
        } catch (error) {
            // Limpiar si el login falla
            AuthService.logout();
            throw error;
        }
    },

    // 4. NUEVA FUNCIÓN DE REGISTRO
    register: async (nameUser: string, passUser: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                nameUser,
                passUser,
            });
            return response.data;
        } catch (err) {
            if (isAxiosError(err)) {
                throw err;
            }
            throw new Error('Error de registro desconocido');
        }
    },

    // Función para el logout
    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setupAxiosInterceptors(null);
    },

    // Obtener estado de autenticación
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem(TOKEN_KEY);
    },
    
    // Obtener el token (para uso interno o debugging)
    getToken: (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    },
    
    // 5. CORRECCIÓN: Obtener info del usuario logueado
    getProfile: async () => {
        if (!AuthService.isAuthenticated()) return null;
        try {
            // Este endpoint debe devolver un objeto que contenga:
            // sub (idUser), nameUser, idRole, y role (nameRole)
            const response = await axios.get(`${API_URL}/profile`); 
            
            // 6. DEVOLVEMOS LOS DATOS ESPERADOS POR AuthContext
            return {
                sub: response.data.sub, // idUser
                nameUser: response.data.nameUser,
                idRole: response.data.idRole, // <- Clave para la lógica numérica
                role: response.data.role, // <- Clave para la lógica de nombre (string)
            };
        } catch (error) {
            // Si el token es inválido/expirado, hacemos logout
            AuthService.logout();
            return null;
        }
    }
};

export default AuthService;