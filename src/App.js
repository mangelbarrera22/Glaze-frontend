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
import Soporte  from "./components/Soporte";
import FAQ from "./components/FAQ";
import Publicar from "./components/Publicar";
import MiCatalogo from "./components/MiCatalogo";
import EditarProducto from "./components/EditarProducto";
import MisVentas from "./components/MisVentas";

function App() {

 return (

  <Router>

   <Routes>

    <Route path="/login" element={<Login />} />

    <Route path="/registro" element={<Register />} />

    <Route path="/dashboard" element={<Dashboard />} />

    <Route path="/dashboardVendedor" element={<DashboardVendedor />} />

     <Route path="/catalogo" element={<Catalogo/>}/>

     <Route path="/producto/:id" element={<ProductoDetalle />} />

     <Route path="/favoritos" element={<Favoritos/>} ></Route>
     
     <Route path="/historialCompras" element={<HistorialCompras/>} ></Route>

     <Route path="/perfil" element={<Perfil/>} ></Route>

     <Route path="/soporte" element={<Soporte/>} ></Route>

      <Route path="/FAQ" element={<FAQ/>} ></Route>

       <Route path="/Publicar" element={<Publicar/>} ></Route>

       <Route path="/MiCatalogo" element={<MiCatalogo/>} ></Route>

       <Route path="EditarProducto/:id_producto" element={<EditarProducto />} />

       <Route path="/MisVentas" element={<MisVentas />} />

   </Routes>

  </Router>

 );

}

export default App;