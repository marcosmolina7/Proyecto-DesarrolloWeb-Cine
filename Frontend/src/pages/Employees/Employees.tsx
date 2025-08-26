import { motion } from 'framer-motion';

const employees = [
  { id: 1, name: 'Juan Pérez', role: 'Gerente', status: 'Activo' },
  { id: 2, name: 'María Gómez', role: 'Cajero', status: 'Activo' },
  { id: 3, name: 'Carlos Ruiz', role: 'Limpieza', status: 'Inactivo' },
  { id: 4, name: 'Ana López', role: 'Asistente', status: 'Activo' },
];

const Employees = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-10"
      >
        Gestión de Empleados
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 overflow-x-auto"
      >
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b border-gray-600 text-gray-400">
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Rol</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="py-4 px-4">{employee.name}</td>
                <td className="py-4 px-4">{employee.role}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      employee.status === 'Activo'
                        ? 'bg-green-600 text-green-100'
                        : 'bg-red-600 text-red-100'
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-blue-400 hover:underline"
                  >
                    Editar
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Employees;