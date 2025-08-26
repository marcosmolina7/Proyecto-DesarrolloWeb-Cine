import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import Sidebar from './components/shared/Sidebar';
import Footer from './components/shared/Footer';
import Home from './pages/Home/Home';
import PreSales from './pages/PreSales/PreSales';
import TicketPurchase from './pages/Tickets/TicketPurchase';
import Login from './pages/Auth/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Employees from './pages/Employees/Employees';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import TicketsMonitor from './pages/Monitor/TicketsMonitor';
import ProductsMonitor from './pages/Monitor/ProductsMonitor';
import TicketsCashier from './pages/Cashier/Tickets';
import Concessions from './pages/Cashier/Concessions';

const Noticias = () => <div className="min-h-screen bg-gray-900 text-white p-8">Noticias Page</div>;
const Contacto = () => <div className="min-h-screen bg-gray-900 text-white p-8">Contacto Page</div>;

// Componente para manejar las rutas con el layout principal
const MainLayout = ({ isSidebarOpen, toggleSidebar }) => (
  <>
    <Header onMenuToggle={toggleSidebar} />
    <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    <div className="pt-16 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cartelera" element={<Home />} />
        <Route path="/preventas" element={<PreSales />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/detail/:id" element={<MovieDetail />} />
        <Route path="/buy/:id" element={<TicketPurchase />} />
        <Route path="/caja/boletos" element={<TicketsCashier />} />
        <Route path="/caja/productos" element={<Concessions />} />
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
        {/*
          Esta ruta renderiza el MainLayout para todas las páginas de la aplicación.
          Se eliminó el comodín /* para que no se aplique a los monitores.
        */}
        <Route element={<MainLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}>
          <Route path="/" element={<Home />} />
          <Route path="/cartelera" element={<Home />} />
          <Route path="/preventas" element={<PreSales />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/detail/:id" element={<MovieDetail />} />
          <Route path="/buy/:id" element={<TicketPurchase />} />
          <Route path="/caja/boletos" element={<TicketsCashier />} />
          <Route path="/caja/productos" element={<Concessions />} />
        </Route>
        
        {/*
          Estas rutas de monitores no tienen el MainLayout,
          por lo que se mostrarán sin el encabezado ni el pie de página.
        */}
        <Route path="/tickets-monitor" element={<TicketsMonitor />} />
        <Route path="/products-monitor" element={<ProductsMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;