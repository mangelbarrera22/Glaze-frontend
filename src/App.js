import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import DashboardVendedor from "./components/DashboardVendedor";
import Catalogo from "./components/Catalogo";
import ProductoDetalle from "./components/ProductoDetalle";
import Favoritos from "./components/Favoritos";
import HistorialCompras from "./components/HistorialCompras";
import Perfil from "./components/Perfil";
import Soporte from "./components/Soporte";
import FAQ from "./components/FAQ";
import Publicar from "./components/Publicar";
import MiCatalogo from "./components/MiCatalogo";
import EditarProducto from "./components/EditarProducto";
import MisVentas from "./components/MisVentas";

function App() {
 return (
  <Router>
   <Routes>
    {/* Ruta raíz para solucionar la pantalla en blanco */}
    <Route path="/" element={<Login />} />

    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/dashboardVendedor" element={<DashboardVendedor />} />
    <Route path="/catalogo" element={<Catalogo />} />
    <Route path="/producto/:id" element={<ProductoDetalle />} />
    <Route path="/favoritos" element={<Favoritos />} />
    <Route path="/historialCompras" element={<HistorialCompras />} />
    <Route path="/perfil" element={<Perfil />} />
    <Route path="/soporte" element={<Soporte />} />
    <Route path="/FAQ" element={<FAQ />} />
    <Route path="/Publicar" element={<Publicar />} />
    <Route path="/MiCatalogo" element={<MiCatalogo />} />
    <Route path="/EditarProducto/:id_producto" element={<EditarProducto />} />
    <Route path="/MisVentas" element={<MisVentas />} />
   </Routes>
  </Router>
 );
}

export default App;