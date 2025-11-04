// src/App.tsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/shared/Header';
import Sidebar from './components/shared/Sidebar';
import Footer from './components/shared/Footer';
import AuthProvider from './context/AuthContext';

// Vistas Generales
import Home from './pages/Home/Home';
import PreSales from './pages/PreSales/PreSales';
import TicketPurchase from './pages/Tickets/TicketPurchase';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import TicketsMonitor from './pages/Monitor/TicketsMonitor';
import ProductsMonitor from './pages/Monitor/ProductsMonitor';
import TicketsCashier from './pages/Cashier/Tickets';
import Concessions from './pages/Cashier/Concessions';
import Checkout from './pages/Cashier/Checkout';
import Noticias from './pages/Noticias/Noticias';
import Contacto from './pages/Contacto/Contacto'; 

// Vistas Administrativas
import MoviesList from './pages/Admint/MoviesList';
import MovieForm from './pages/Admint/MovieForm';
import ScheduleList from './pages/Admint/ScheduleList'; 
import ScheduleForm from './pages/Admint/ScheduleForm'; 
import ProductList from './pages/Admint/ProductList'; 
import ProductForm from './pages/Admint/ProductForm'; 
import DirectorList from './pages/Admint/DirectorList'; 
import DirectorForm from './pages/Admint/DirectorForm'; 
import AgeRatingList from './pages/Admint/AgeRatingList'; 
import AgeRatingForm from './pages/Admint/AgeRatingForm'; 
import GenreList from './pages/Admint/GenreList'; 
import GenreForm from './pages/Admint/GenreForm'; 
import RoleList from './pages/Admint/RoleList'; 
import RoleNew from './pages/Admint/RoleNew';  
import SizeList from './pages/Admint/SizeList'; 
import SizeForm from './pages/Admint/SizeForm'; 
import CategoryList from './pages/Admint/CategoryList'; 
import CategoryForm from './pages/Admint/CategoryForm';
import SupplierList from './pages/Admint/SupplierList'; 
import SupplierForm from './pages/Admint/SupplierForm';
import UserList from './pages/Admint/UserList'; 
import UserForm from './pages/Admint/UserForm';
import EmployeeList from './pages/Admint/EmployeeList'; 
import EmployeeForm from './pages/Admint/EmployeeForm'; 
import SeatList from './pages/Admint/SeatList'; 
import SeatForm from './pages/Admint/SeatForm'; 
import RoomList from './pages/Admint/RoomList'; 
import RoomForm from './pages/Admint/RoomForm';
import InventoryList from './pages/Admint/InventoryList';

// Interfaz para tipar el componente MainLayout
interface MainLayoutProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

// Componente para manejar las rutas con el layout principal
const MainLayout = ({ isSidebarOpen, toggleSidebar }: MainLayoutProps) => { 
  
  return (
    <>
      <Header onMenuToggle={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="flex-grow pt-16 min-h-screen">
        <Outlet /> 
      </div>
      <Footer />
    </>
  );
}

// Envolver todo en un div flex-col
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router> 
      <div className="flex flex-col min-h-screen bg-gray-900">
        <AuthProvider>
          <Routes>
            {/* Rutas con layout principal */}
            <Route element={<MainLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}>
              
              {/* Rutas generales */}
              <Route path="/" element={<Home />} />
              <Route path="/cartelera" element={<Home />} />
              <Route path="/preventas" element={<PreSales />} />
              <Route path="/noticias" element={<Noticias />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> 
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/detail/:id" element={<MovieDetail />} />
              <Route path="/buy/:id" element={<TicketPurchase />} />

              {/* Rutas de Caja (POS) */}
              <Route path="/caja/boletos" element={<TicketsCashier />} />
              <Route path="/caja/productos" element={<Concessions />} />
              <Route path="/checkout" element={<Checkout />} /> 
              
              {/* Rutas administrativas: Películas */}
              <Route path="/admin/movies" element={<MoviesList shouldReload={false} />} /> 
              <Route path="/admin/movies/new" element={<MovieForm />} />
              
              {/* Rutas administrativas: Catálogos de Película */}
              <Route path="/admin/directors" element={<DirectorList />} />
              <Route path="/admin/directors/new" element={<DirectorForm />} /> 
              <Route path="/admin/ageratings" element={<AgeRatingList />} />
              <Route path="/admin/ageratings/new" element={<AgeRatingForm />} /> 
              <Route path="/admin/genres" element={<GenreList />} />
              <Route path="/admin/genres/new" element={<GenreForm />} /> 

              {/* Rutas administrativas: Personal y Acceso */}
              <Route path="/admin/roles" element={<RoleList />} />
              <Route path="/admin/roles/new" element={<RoleNew />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/new" element={<UserForm />} />
              <Route path="/admin/employees" element={<EmployeeList />} />
              <Route path="/admin/employees/new" element={<EmployeeForm />} />
              
              {/* Rutas administrativas: Horarios y Salas */}
              <Route path="/admin/schedules" element={<ScheduleList />} />
              <Route path="/admin/schedules/new" element={<ScheduleForm />} />
              <Route path="/admin/seats" element={<SeatList />} /> 
              <Route path="/admin/seats/new" element={<SeatForm />} /> 
              <Route path="/admin/rooms" element={<RoomList />} />  
              <Route path="/admin/rooms/new" element={<RoomForm />} /> 

              {/* Rutas administrativas: PRODUCTOS E INVENTARIO */}
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/sizes" element={<SizeList />} />
              <Route path="/admin/sizes/new" element={<SizeForm />} />
              <Route path="/admin/categories" element={<CategoryList />} />
              <Route path="/admin/categories/new" element={<CategoryForm />} />
              <Route path="/admin/suppliers" element={<SupplierList />} />
              <Route path="/admin/suppliers/new" element={<SupplierForm />} />
              <Route path="/admin/inventory" element={<InventoryList />} /> 
              
            </Route>

            {/* Rutas sin layout (Monitores de Cliente) */}
            <Route path="/tickets-monitor" element={<TicketsMonitor />} />
            <Route path="/products-monitor" element={<ProductsMonitor />} />
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App; 