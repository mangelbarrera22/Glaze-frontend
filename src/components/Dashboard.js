import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiShoppingBag, FiStar, FiClock, FiUser, 
  FiPhoneCall, FiHelpCircle, FiLogOut, FiTrendingUp, FiDollarSign 
} from "react-icons/fi";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [compras, setCompras] = useState(0);
  const [gasto, setGasto] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("usuario"));
    if (!data) {
      navigate("/login");
      return;
    }
    setUsuario(data.usuario);
    cargarEstadisticas(data.id_usuario);
  }, [navigate]);

  const cargarEstadisticas = async (id_usuario) => {
    try {
      const res = await API.get(`/usuario/estadisticas/${id_usuario}`);
      setCompras(res.data.compras);
      setGasto(res.data.gasto);
    } catch (error) {
      console.log("Error cargando estadísticas");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* HEADER TIPO BANNER */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <h1>Bienvenido, <span>{usuario}</span></h1>
            <p>Panel de Control • Esmeraldas Premium</p>
          </div>
          <button className="logout-mini" onClick={cerrarSesion} title="Cerrar Sesión">
            <FiLogOut /> <span>Salir</span>
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* TARJETAS DE ESTADÍSTICAS */}
        <section className="stats-container">
          <div className="stat-card">
            <div className="stat-icon pink">
              <FiTrendingUp />
            </div>
            <div className="stat-data">
              <h3>{compras}</h3>
              <p>Compras Realizadas</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FiDollarSign />
            </div>
            <div className="stat-data">
              <h3>${gasto.toLocaleString()}</h3>
              <p>Gasto Total</p>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* SECCIÓN CATÁLOGO */}
          <section className="menu-section">
            <h3 className="section-title">Catálogo y Compras</h3>
            <div className="menu-grid">
              <div className="menu-card" onClick={() => navigate("/catalogo")}>
                <FiShoppingBag className="card-icon" />
                <h4>Comprar Esmeraldas</h4>
                <p>Explora piezas exclusivas</p>
              </div>
              <div className="menu-card" onClick={() => navigate("/favoritos")}>
                <FiStar className="card-icon" />
                <h4>Favoritos</h4>
                <p>Lista de deseos</p>
              </div>
              <div className="menu-card" onClick={() => navigate("/historialCompras")}>
                <FiClock className="card-icon" />
                <h4>Historial</h4>
                <p>Pedidos anteriores</p>
              </div>
            </div>
          </section>

          {/* SECCIÓN CUENTA */}
          <section className="menu-section">
            <h3 className="section-title">Mi Cuenta</h3>
            <div className="menu-grid">
              <div className="account-item" onClick={() => navigate("/perfil")}>
                <FiUser /> <span>Editar Perfil</span>
              </div>
              <div className="account-item" onClick={() => navigate("/Soporte")}>
                <FiPhoneCall /> <span>Contactar Soporte</span>
              </div>
              <div className="account-item" onClick={() => navigate("/FAQ")}>
                <FiHelpCircle /> <span>Preguntas Frecuentes</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;