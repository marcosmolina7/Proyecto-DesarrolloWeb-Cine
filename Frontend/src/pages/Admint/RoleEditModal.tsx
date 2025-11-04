// src/pages/Admint/RoleEditModal.tsx
// CORREGIDO: Sincronizado con schema.prisma (idRole, nameRole, descriptionRole)

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCw, Key, FileText } from 'lucide-react';
import axios, { isAxiosError } from 'axios';

// --- CONFIGURACIÓN Y TIPOS ---
const API_URL = 'http://localhost:3000';

interface Role {
    idRole: number;
    nameRole: string;
    descriptionRole: string;
}

interface RoleEditModalProps {
    role: Role | null; // Nulo si es 'isNew'
    onClose: () => void;
    onSuccess: (message: string) => void;
    isNew: boolean; // Indica si es una operación de creación o edición
}

const RoleEditModal: React.FC<RoleEditModalProps> = ({ role, onClose, onSuccess, isNew }) => {
    
    // 1. CORRECCIÓN: Usar los campos del schema (nameRole, descriptionRole)
    const initialData = {
        nameRole: role?.nameRole || '',
        descriptionRole: role?.descriptionRole || '',
    };

    const [formData, setFormData] = useState(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Actualizar el formulario si el rol (prop) cambia
    useEffect(() => {
        if (!isNew && role) {
             setFormData({
                nameRole: role.nameRole,
                descriptionRole: role.descriptionRole,
             });
        }
    }, [role, isNew]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);
        
        // 2. CORRECCIÓN: Validar los campos correctos
        if (!formData.nameRole.trim()) {
            setError('El nombre del rol es obligatorio.');
            setIsSaving(false);
            return;
        }
        
        // La descripción es opcional según tu schema (String?)
        // Así que no la validamos como obligatoria

        try {
            let successMessage: string;
            // 3. CORRECCIÓN: Enviar el payload con los nombres de campo correctos
            const payload = {
                nameRole: formData.nameRole,
                descriptionRole: formData.descriptionRole || null, // Enviar null si está vacío
            };

            if (isNew) {
                // 4. CORRECCIÓN: Endpoint singular
                await axios.post(`${API_URL}/role`, payload);
                successMessage = `Rol "${formData.nameRole}" creado exitosamente.`;
            } else if (role) {
                // 4. CORRECCIÓN: Endpoint singular y idRole
                await axios.put(`${API_URL}/role/${role.idRole}`, payload);
                successMessage = `Rol "${formData.nameRole}" actualizado exitosamente.`;
            } else {
                throw new Error("Datos de rol no proporcionados para la edición.");
            }

            onSuccess(successMessage);
            onClose(); // Cerrar el modal

        } catch (err) {
            console.error(isNew ? 'Error creating role:' : 'Error updating role:', err);
            let errorMsg = isNew ? "Ocurrió un error al crear el rol." : "Ocurrió un error al actualizar el rol.";
            
            if (isAxiosError(err) && err.response) {
                 if (err.response.data.message?.includes('unique constraint') || err.response.data.message?.includes('Unique constraint failed')) {
                    errorMsg = "El nombre del rol proporcionado ya existe.";
                } else {
                    errorMsg = err.response.data.message || `Error del servidor (Código: ${err.response.status})`;
                }
            }
            setError(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };


    const title = isNew ? "Crear Nuevo Rol" : `Editar Rol: ${role?.nameRole}`;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg border border-gray-700 p-6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        {/* 5. CORRECCIÓN: htmlFor, id, name, value deben usar 'nameRole' */}
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="nameRole">
                                Nombre del Rol
                            </label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="nameRole"
                                    name="nameRole"
                                    value={formData.nameRole}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500 transition duration-150"
                                    placeholder="Ej: Administrador"
                                    required
                                />
                            </div>
                        </div>

                        {/* 6. CORRECCIÓN: htmlFor, id, name, value deben usar 'descriptionRole' */}
                        <div className="mb-6">
                            <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="descriptionRole">
                                Descripción (Opcional)
                            </label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    id="descriptionRole"
                                    name="descriptionRole"
                                    value={formData.descriptionRole || ''} // Manejar nulo
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-gray-700 text-white rounded-lg p-3 pl-10 border border-gray-600 focus:outline-none focus:border-blue-500 transition duration-150 resize-none"
                                    placeholder="Describe los permisos de este rol (Ej: Acceso total al panel de admin)."
                                />
                            </div>
                        </div>

                        {/* ... (Mensaje de Error) ... */}
                        {error && (
                            <div className="bg-red-800 border border-red-700 text-red-100 p-3 rounded-lg text-sm mb-4">
                                {error}
                            </div>
                        )}

                        {/* ... (Botones de Acción) ... */}
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSaving}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-500 flex items-center space-x-2"
                            >
                                {isSaving ? (
                                    <RotateCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                <span>{isSaving ? (isNew ? 'Creando...' : 'Guardando...') : (isNew ? 'Crear' : 'Guardar Cambios')}</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RoleEditModal;
