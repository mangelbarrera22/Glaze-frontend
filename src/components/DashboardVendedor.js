import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardVendedor.css";

function DashboardVendedor(){

 const navigate = useNavigate();
 const [usuario,setUsuario] = useState(null);

 useEffect(()=>{

  const user = JSON.parse(localStorage.getItem("usuario"));

  if(!user){
   navigate("/login");
  }else{
   setUsuario(user);
  }

 },[]);


 return(

  <div className="dashboard">

   {/* HEADER */}
   <div className="header">

    <div>
     <p>Bienvenido,</p>
     <h2>{usuario?.usuario}</h2>
     <span>VENDEDOR • EMERALD TRADE</span>
    </div>

    <button
     className="logout"
     onClick={()=>{
      localStorage.removeItem("usuario");
      navigate("/login");
     }}
    >
     ⎋
    </button>

   </div>


   {/* OPCIONES */}
   <div className="menu">

    <h4>Gestión de Esmeraldas</h4>

    <div className="item" onClick={()=>navigate("/Publicar")}>
     <span>💎</span>
     <div>
      <h3>Publicar Nueva Esmeralda</h3>
      <p>Agrega nuevos productos al catálogo</p>
     </div>
    </div>

    <div className="item" onClick={()=>navigate("/MiCatalogo")}>
     <span>📦</span>
     <div>
      <h3>Ver mi Catálogo</h3>
      <p>Administra tus esmeraldas</p>
     </div>
    </div>

    <div className="item" onClick={()=>navigate("/MisVentas")}>
     <span>💰</span>
     <div>
      <h3>Esmeraldas Vendidas</h3>
      <p>Historial de ventas</p>
     </div>
    </div>


    <h4>Mi Cuenta</h4>

    <div className="item" onClick={()=>navigate("/Perfil")}>
     <span>👤</span>
     <div>
      <h3>Editar Perfil</h3>
      <p>Actualiza tu información</p>
     </div>
    </div>

    <div className="item" onClick={()=>navigate("/soporte")}>
     <span>🛟</span>
     <div>
      <h3>Contactar Soporte</h3>
      <p>¿Necesitas ayuda?</p>
     </div>
    </div>

    <div className="item" onClick={()=>navigate("/faq")}>
     <span>❓</span>
     <div>
      <h3>Preguntas Frecuentes</h3>
      <p>Resuelve tus dudas</p>
     </div>
    </div>

   </div>

  </div>

 );

}

export default DashboardVendedor;