// src/pages/DashboardVendedor.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlusSquare,
  FiBox,
  FiDollarSign,
  FiUser,
  FiShield,
  FiHelpCircle,
  FiLogOut
} from "react-icons/fi";
import API from "../services/api";
import "./DashboardVendedor.css";

function DashboardVendedor() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [stats, setStats] = useState({ totalVentas: 0, piezasActivas: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const capitalizar = (texto) => {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    setUsuario(user);

    const nombre = capitalizar(user.primer_nombre || "");
    const apellido = capitalizar(user.primer_apellido || "");
    setNombreCompleto(`${nombre} ${apellido}`.trim());

    cargarEstadisticas(token);
  }, [navigate]);

  const cargarEstadisticas = async (token) => {
    try {
      setLoadingStats(true);
      const res = await API.get("/vendedores/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.ok) {
        setStats({
          totalVentas: res.data.totalVentas || 0,
          piezasActivas: res.data.piezasActivas || 0
        });
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!usuario) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando panel de socio...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* HEADER VERDE INSTITUCIONAL */}
      <header className="dashboard-top-header">
        <div className="header-content">
          <div className="header-left">
            <p className="header-greeting">
              Socio Estratégico, <strong>{nombreCompleto || usuario.usuario || "Especialista"}</strong>
            </p>
            <p className="header-subtitle">VENDEDOR AUTORIZADO • GLAZE</p>
          </div>
          <button
            className="btn-logout"
            onClick={cerrarSesion}
            aria-label="Cerrar sesión"
            type="button"
          >
            <FiLogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-main">
        {/* ESTADÍSTICAS */}
        <div className="stats-grid">
          <div className="stat-card stat-inventario">
            <div className="stat-icon">
              <FiBox size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">
                {loadingStats ? "..." : `${stats.piezasActivas} PCS`}
              </p>
              <p className="stat-label">Inventario Activo</p>
            </div>
          </div>

          <div className="stat-card stat-ventas">
            <div className="stat-icon">
              <FiDollarSign size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-value">
                {loadingStats ? "..." : `$${Number(stats.totalVentas).toLocaleString()}`}
              </p>
              <p className="stat-label">Ventas Totales</p>
            </div>
          </div>
        </div>

        {/* GRID PRINCIPAL (2 COLUMNAS) */}
        <div className="dashboard-grid">
          {/* COLUMNA IZQUIERDA: GESTIÓN DE ESMERALDAS */}
          <div className="dashboard-section">
            <h2 className="section-heading">Gestión de Esmeraldas</h2>

            <div className="option-cards-grid">
              <div className="option-card" onClick={() => navigate("/publicar")}>
                <div className="option-icon">
                  <FiPlusSquare size={32} />
                </div>
                <h3 className="option-title">Registrar Nueva Gema</h3>
                <p className="option-desc">Añadir activos a la bóveda</p>
              </div>

              <div className="option-card" onClick={() => navigate("/MiCatalogo")}>
                <div className="option-icon">
                  <FiBox size={32} />
                </div>
                <h3 className="option-title">Inventario Glaze</h3>
                <p className="option-desc">Administrar piezas publicadas</p>
              </div>

              <div className="option-card" onClick={() => navigate("/MisVentas")}>
                <div className="option-icon">
                  <FiDollarSign size={32} />
                </div>
                <h3 className="option-title">Liquidaciones</h3>
                <p className="option-desc">Historial de ventas y pagos</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: SEGURIDAD Y CUENTA */}
          <div className="dashboard-section">
            <h2 className="section-heading">Seguridad y Cuenta</h2>

            <div className="menu-list">
              <div className="menu-item" onClick={() => navigate("/perfil")}>
                <FiUser size={20} />
                <span>Perfil Profesional</span>
              </div>

              <div className="menu-item" onClick={() => navigate("/soporte")}>
                <FiShield size={20} />
                <span>Soporte Técnico</span>
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

export default DashboardVendedor;