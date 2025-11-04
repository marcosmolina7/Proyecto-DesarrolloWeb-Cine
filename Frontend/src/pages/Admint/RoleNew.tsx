// src/pages/Admint/RoleNew.tsx
// Vista para crear un nuevo rol, usando RoleEditModal en modo 'isNew'.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield } from 'lucide-react';
import Layout from '../../components/shared/Layout';
import RoleEditModal from './RoleEditModal'; 
import { motion, AnimatePresence } from 'framer-motion';

// Definimos un tipo simple para la interfaz del modal
interface NewRoleData {
    name: string;
    description: string;
}

const RoleNew: React.FC = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSuccess = (message: string) => {
        setSuccessMessage(message);
        // Navegar de vuelta a la lista después de un tiempo
        setTimeout(() => {
            navigate('/admin/roles');
        }, 2000);
    };

    const handleClose = () => {
        // Al cerrar el modal, volvemos a la lista
        navigate('/admin/roles');
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                    <h1 className="text-4xl font-extrabold text-white flex items-center">
                        <Shield className="w-8 h-8 mr-3 text-purple-400" />
                        Crear Nuevo Rol
                    </h1>
                </div>

                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-green-800 border border-green-700 p-4 rounded-lg text-green-100 mb-6 flex items-center space-x-3"
                        >
                            <CheckCircle className="w-6 h-6" />
                            <span>{successMessage} Redirigiendo a la lista...</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!successMessage && (
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                        <RoleEditModal
                            role={null} 
                            onClose={handleClose}
                            onSuccess={handleSuccess}
                            isNew={true}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default RoleNew;
