import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { FiPlusSquare, FiBox, FiDollarSign, FiUser, FiShield, FiHelpCircle, FiLogOut } from "react-icons/fi";
import "./DashboardVendedor.css";

function DashboardVendedor() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState({ totalVentas: 0, piezasActivas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const storedUser = localStorage.getItem("usuario");
      const token = localStorage.getItem("token");
      if (!storedUser || !token) {
        navigate("/login");
        return;
      }
      setUsuario(JSON.parse(storedUser));

      try {
        setLoading(true);
        const res = await API.get("/vendedores/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
        setLoading(false);
      }
    }
    cargarDatos();
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const createOptionCard = (IconComp, title, desc, onClick) => {
    return React.createElement(
      "div",
      { className: "option-card", onClick, role: "button", tabIndex: 0, onKeyPress: e => { if (e.key === "Enter") onClick(); } },
      React.createElement("div", { className: "option-icon" },
        React.createElement(IconComp, { size: 32 })
      ),
      React.createElement("h3", { className: "option-title" }, title),
      React.createElement("p", { className: "option-desc" }, desc)
    );
  };

  const createMenuItem = (IconComp, text, onClick) => {
    return React.createElement(
      "div",
      {
        className: "menu-item",
        onClick,
        role: "button",
        tabIndex: 0,
        onKeyPress: e => { if (e.key === "Enter") onClick(); }
      },
      React.createElement(IconComp, { size: 20 }),
      React.createElement("span", null, text)
    );
  };

  if (!usuario) {
    return React.createElement("div", { className: "loading-container" }, "Cargando...");
  }

  return React.createElement(
    "div",
    { className: "dashboard-vendedor-page" },

    React.createElement("header", { className: "header" },
      React.createElement("div", { className: "user-info" },
        React.createElement("p", { className: "welcome" }, "Socio Estratégico,"),
        React.createElement("h2", { className: "username" }, usuario.usuario || "Especialista"),
        React.createElement("span", { className: "role-tag" }, "VENDEDOR AUTORIZADO • EMERALD TRADE")
      ),
      React.createElement("button", { className: "logout-btn", onClick: cerrarSesion, "aria-label": "Cerrar sesión", type: "button" },
        React.createElement(FiLogOut, { size: 18 })
      )
    ),

    React.createElement("section", { className: "stats-section" },
      React.createElement("div", { className: "stat-card" },
        React.createElement("span", { className: "stat-label" }, "INVENTARIO ACTIVO"),
        React.createElement("span", { className: "stat-value" }, loading ? "..." : `${stats.piezasActivas} PCS`)
      ),
      React.createElement("div", { className: "stat-card stat-highlight" },
        React.createElement("span", { className: "stat-label" }, "VENTAS TOTALES"),
        React.createElement("span", { className: "stat-value" }, loading ? "..." : `$${Number(stats.totalVentas).toLocaleString()}`)
      )
    ),

    React.createElement("section", { className: "menu-section" },
      React.createElement("h3", { className: "menu-title" }, "Gestión de Esmeraldas"),

      React.createElement("div", { className: "options-grid" },
        createOptionCard(FiPlusSquare, "Registrar Nueva Gema", "Añadir activos a la bóveda", () => navigate("/publicar")),
        createOptionCard(FiBox, "Inventario Glaze", "Administrar piezas publicadas", () => navigate("/MiCatalogo")),
        createOptionCard(FiDollarSign, "Liquidaciones", "Historial de ventas y pagos", () => navigate("/MisVentas"))
      ),

      React.createElement("h3", { className: "menu-title", style: { marginTop: 40 } }, "Seguridad y Cuenta"),
      createMenuItem(FiUser, "Perfil Profesional", () => navigate("/perfil")),
      createMenuItem(FiShield, "Soporte Técnico", () => navigate("/soporte")),
      createMenuItem(FiHelpCircle, "Preguntas Frecuentes", () => navigate("/faq"))
    )
  );
}

export default DashboardVendedor;
