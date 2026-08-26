// src/pages/Dashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiShoppingBag, 
  FiStar, 
  FiClock, 
  FiUser, 
  FiShield, 
  FiHelpCircle, 
  FiLogOut
} from "react-icons/fi";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [stats, setStats] = useState({
    totalCompras: 0,
    gastoTotal: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // ==========================
  // 🧩 FUNCIÓN CAPITALIZAR
  // ==========================
  const capitalizar = (texto) => {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  // ==========================
  // 👤 CARGAR USUARIO
  // ==========================
  const cargarUsuario = () => {
    try {
      const data = localStorage.getItem("usuario");

      if (!data) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(data);

      // 🔥 EXTRAER NOMBRE Y APELLIDO CAPITALIZADOS
      const nombre = capitalizar(user.primer_nombre || "");
      const apellido = capitalizar(user.primer_apellido || "");

      setNombreCompleto(`${nombre} ${apellido}`);

    } catch (error) {
      console.log("Error usuario:", error);
      navigate("/login");
    }
  };

  // ==========================
  // 📊 CARGAR ESTADÍSTICAS
  // ==========================
  const cargarEstadisticas = async () => {
    try {
      setLoadingStats(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await API.get("/dashboard/estadisticas", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStats({
        totalCompras: res.data.totalCompras || 0,
        gastoTotal: res.data.gastoTotal || 0
      });

    } catch (error) {
      console.log("Error stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // ==========================
  // 🔄 CARGAR AL MONTAR
  // ==========================
  useEffect(() => {
    cargarUsuario();
    cargarEstadisticas();
  }, []);

  // ==========================
  // 🔓 LOGOUT
  // ==========================
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      {/* HEADER VERDE */}
      <header className="dashboard-top-header">
        <div className="header-content">
          <div className="header-left">
            <p className="header-greeting">Bienvenido, <strong>{nombreCompleto || "Usuario"}</strong></p>
            <p className="header-subtitle">Panel de Control • Esmeraldas Premium</p>
          </div>
          <button className="btn-logout" onClick={cerrarSesion}>
            <FiLogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-main">
        {/* 📊 ESTADÍSTICAS */}
        <div className="stats-grid">
          <div className="stat-card stat-compras">
            <div className="stat-icon">
              <FiShoppingBag size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">
                {loadingStats ? "..." : stats.totalCompras}
              </p>
              <p className="stat-label">Compras Realizadas</p>
            </div>
          </div>

          <div className="stat-card stat-gasto">
            <div className="stat-icon">
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>$</span>
            </div>
            <div className="stat-info">
              <p className="stat-value">
                {loadingStats 
                  ? "..." 
                  : `$${Number(stats.gastoTotal).toLocaleString()}`
                }
              </p>
              <p className="stat-label">Gasto Total</p>
            </div>
          </div>
        </div>

        {/* GRID DE OPCIONES */}
        <div className="dashboard-grid">
          {/* COLUMNA IZQUIERDA: CATÁLOGO */}
          <div className="dashboard-section">
            <h2 className="section-heading">Catálogo y Compras</h2>
            
            <div className="option-cards-grid">
              <div className="option-card" onClick={() => navigate("/catalogo")}>
                <div className="option-icon">
                  <FiShoppingBag size={32} />
                </div>
                <h3 className="option-title">Comprar Esmeraldas</h3>
                <p className="option-desc">Explora piezas exclusivas</p>
              </div>

              <div className="option-card" onClick={() => navigate("/favoritos")}>
                <div className="option-icon">
                  <FiStar size={32} />
                </div>
                <h3 className="option-title">Favoritos</h3>
                <p className="option-desc">Lista de deseos</p>
              </div>

              <div className="option-card" onClick={() => navigate("/HistorialCompras")}>
                <div className="option-icon">
                  <FiClock size={32} />
                </div>
                <h3 className="option-title">Historial</h3>
                <p className="option-desc">Pedidos anteriores</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: MI CUENTA */}
          <div className="dashboard-section">
            <h2 className="section-heading">Mi Cuenta</h2>
            
            <div className="menu-list">
              <div className="menu-item" onClick={() => navigate("/Perfil")}>
                <FiUser size={20} />
                <span>Editar Perfil</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/soporte")}>
                <FiShield size={20} />
                <span>Contactar Soporte</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/faq")}>
                <FiHelpCircle size={20} />
                <span>Preguntas Frecuentes</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;