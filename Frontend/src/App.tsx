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
import MovieDetail from './pages/MovieDetail/MovieDetail';
import TicketsMonitor from './pages/Monitor/TicketsMonitor';
import ProductsMonitor from './pages/Monitor/ProductsMonitor';
import TicketsCashier from './pages/Cashier/Tickets';
import Concessions from './pages/Cashier/Concessions';

// Nuevas vistas administrativas
import MoviesList from './pages/Admint/MoviesList';
import MovieForm from './pages/Admint/MovieForm';
import AdminEmployees from './pages/Admint/Employees';
import Schedules from './pages/Admint/Schedules';
import Products from './pages/Admint/Products';
import ProductForm from './pages/Admint/ProductForm';

const Noticias = () => <div className="min-h-screen bg-gray-900 text-white p-8">Noticias Page</div>;
const Contacto = () => <div className="min-h-screen bg-gray-900 text-white p-8">Contacto Page</div>;

// Componente para manejar las rutas con el layout principal
const MainLayout = ({ isSidebarOpen, toggleSidebar }) => (
  <>
    <Header onMenuToggle={toggleSidebar} />
    <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    <div className="pt-16 min-h-screen">
      <Routes>
        {/* Rutas generales */}
        <Route path="/" element={<Home />} />
        <Route path="/cartelera" element={<Home />} />
        <Route path="/preventas" element={<PreSales />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detail/:id" element={<MovieDetail />} />
        <Route path="/buy/:id" element={<TicketPurchase />} />
        <Route path="/caja/boletos" element={<TicketsCashier />} />
        <Route path="/caja/productos" element={<Concessions />} />

        {/* Rutas administrativas */}
        <Route path="/admin/movies" element={<MoviesList />} />
        <Route path="/admin/movies/new" element={<MovieForm />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
        <Route path="/admin/schedules" element={<Schedules />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
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
        {/* Rutas con layout principal */}
        <Route element={<MainLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}>
          {/* Todas las rutas están dentro del layout */}
          <Route path="/" element={<Home />} />
          <Route path="/cartelera" element={<Home />} />
          <Route path="/preventas" element={<PreSales />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detail/:id" element={<MovieDetail />} />
          <Route path="/buy/:id" element={<TicketPurchase />} />
          <Route path="/caja/boletos" element={<TicketsCashier />} />
          <Route path="/caja/productos" element={<Concessions />} />
          <Route path="/admin/movies" element={<MoviesList />} />
          <Route path="/admin/movies/new" element={<MovieForm />} />
          <Route path="/admin/employees" element={<AdminEmployees />} />
          <Route path="/admin/schedules" element={<Schedules />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/products/new" element={<ProductForm />} />
        </Route>

        {/* Rutas sin layout */}
        <Route path="/tickets-monitor" element={<TicketsMonitor />} />
        <Route path="/products-monitor" element={<ProductsMonitor />} />
      </Routes>
    </Router>
  );
}

export default App;
