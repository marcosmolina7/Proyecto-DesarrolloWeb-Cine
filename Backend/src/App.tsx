// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/shared/Header';
import Sidebar from './components/shared/Sidebar';
import Footer from './components/shared/Footer';
import Home from './pages/Home/Home';
import PreSales from './pages/PreSales/PreSales';
import TicketPurchase from './pages/Tickets/TicketPurchase';
import Login from './pages/Auth/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Cashier from './pages/Cashier/Cashier';
import CustomerMonitor from './pages/Cashier/CustomerMonitor';
import Employees from './pages/Employees/Employees';
import MovieDetail from './pages/MovieDetail/MovieDetail';

const Noticias = () => <div className="min-h-screen bg-gray-900 text-white p-8">Noticias Page</div>;
const Contacto = () => <div className="min-h-screen bg-gray-900 text-white p-8">Contacto Page</div>;

// ⬅️ Este nuevo componente es para agrupar todas las rutas que sí necesitan el Header, Sidebar y Footer
const MainLayout = ({ isSidebarOpen, toggleSidebar }) => (
  <>
    <Header onMenuToggle={toggleSidebar} />
    <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    <div className="pt-16 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preventas" element={<PreSales />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/detail/:id" element={<MovieDetail />} />
        <Route path="/buy/:id" element={<TicketPurchase />} />
      </Routes>
    </div>
    <Footer />
  </>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <Routes>
        {/* ⬅️ Esta es la ruta para la aplicación principal, que usa el nuevo MainLayout */}
        <Route path="/*" element={<MainLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />} />
        
        {/* ⬅️ Y esta es la ruta específica para el monitor, que no tiene Header ni Footer */}
        <Route path="/monitor" element={<CustomerMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;
