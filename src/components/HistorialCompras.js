import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logoGlaze from "../assets/images/LOGOS/Isotipo/Glaze-verde.png";
import "./Historial.css";

function HistorialCompras() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!usuario || !usuario.id_usuario) {
      setError("Sesión no encontrada. Por favor inicia sesión.");
      setCargando(false);
      return;
    }
    cargarPedidos();
  }, []);

  function cargarPedidos() {
    setCargando(true);
    setError(null);
    API.get(`/historial/${usuario.id_usuario}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setPedidos(data);
      })
      .catch((err) => {
        console.error("Error al cargar pedidos:", err);
        setError("Error al cargar el historial.");
      })
      .finally(() => {
        setCargando(false);
      });
  }

  function formatearFecha(fecha) {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).toUpperCase();
  }

  function formatearReferencia(id) {
    return "GLZ-" + String(id).padStart(5, "0");
  }

  // Render sin JSX usando React.createElement
  const renderHeader = () =>
    React.createElement(
      "header",
      { className: "header-insti" },
      // Botón volver a la izquierda
      React.createElement(
        "button",
        {
          className: "btn-back-insti",
          onClick: () => navigate(-1),
          "aria-label": "Volver",
          type: "button"
        },
        "←"
      ),

      // Logo Glaze y título juntos
      React.createElement(
        "div",
        { className: "header-logo-insti" },
        React.createElement("img", {
          src: logoGlaze,
          alt: "Glaze",
          className: "logo-insti",
        }),
        React.createElement("div", null,
          React.createElement("h1", { className: "brand-title-insti" }, "Adquisiciones"),
          React.createElement("div", { className: "accent-line-insti" }),
          React.createElement("h2", { className: "brand-subtitle-insti" }, "HISTORIAL DE INVERSIONES")
        )
      )
    );

  if (cargando) {
    return React.createElement(
      "div",
      { className: "historial-page-insti" },
      renderHeader(),
      React.createElement("div", { className: "loading-container-insti" }, "Cargando historial...")
    );
  }

  if (error) {
    return React.createElement(
      "div",
      { className: "historial-page-insti" },
      renderHeader(),
      React.createElement("div", { className: "status-container-insti" },
        React.createElement("p", { className: "error-text-insti" }, error),
        React.createElement(
          "button",
          { onClick: () => navigate(-1), className: "btn-volver-minimal-insti", type: "button" },
          "Volver"
        )
      )
    );
  }

  if (pedidos.length === 0) {
    return React.createElement(
      "div",
      { className: "historial-page-insti" },
      renderHeader(),
      React.createElement(
        "div",
        { className: "status-container-insti empty-history-insti" },
        React.createElement("p", null, "No se registran piezas en su bóveda privada.")
      )
    );
  }

  return React.createElement(
    "div",
    { className: "historial-page-insti" },
    renderHeader(),
    React.createElement(
      "div",
      { className: "lista-pedidos-insti" },
      pedidos.map((p, index) =>
        React.createElement(
          "div",
          { className: "card-glaze-insti", key: `${p.id_venta || p.id_producto}-${index}` },
          React.createElement("div", { className: "side-accent-insti" }),
          React.createElement(
            "div",
            { className: "card-padding-insti" },
            React.createElement(
              "div",
              { className: "top-row-insti" },
              React.createElement("div", null,
                React.createElement("span", { className: "label-min-insti" }, "REFERENCIA DE VENTA"),
                React.createElement("h3", { className: "referencia-text-insti" }, formatearReferencia(p.id_venta || p.id_producto))
              ),
              React.createElement("span", { className: "badge-luxury-insti" }, "CONFIRMADA")
            ),
            React.createElement(
              "div",
              { className: "producto-row-insti" },
              p.imagen &&
                React.createElement("img", {
                  src: `http://localhost:3000/uploads/${p.imagen}`,
                  alt: p.nombre_producto || "Gema Exclusiva",
                  className: "miniature-insti",
                }),
              React.createElement(
                "div",
                { className: "producto-text-insti" },
                React.createElement("span", { className: "label-min-insti" }, "PIEZA ADQUIRIDA"),
                React.createElement("h4", { className: "nombre-gema-insti" }, (p.nombre_producto || "Gema Exclusiva").toUpperCase()),
                React.createElement("p", { className: "spec-text-insti" }, (p.color || "Especial") + " • " + (p.peso || "N/A") + " CT")
              )
            ),
            React.createElement(
              "div",
              { className: "details-row-insti" },
              React.createElement("div", null,
                React.createElement("span", { className: "label-min-insti" }, "FECHA DE SALIDA"),
                React.createElement("p", { className: "info-text-insti" }, formatearFecha(p.fecha_compra || p.fecha_salida))
              ),
              React.createElement("div", { className: "price-section-insti" },
                React.createElement("span", { className: "label-min-insti" }, "VALOR DE ADQUISICIÓN"),
                React.createElement(
                  "h3",
                  { className: "total-text-insti" },
                  `$${p.valor_compra != null ? Number(p.valor_compra).toLocaleString("es-CO") : "—"}`
                )
              )
            ),
            React.createElement(
              "button",
              {
                className: "btn-action-insti",
                onClick: () => window.print(),
                type: "button"
              },
              "📄 DESCARGAR CERTIFICADO DIGITAL"
            )
          )
        )
      )
    )
  );
}

export default HistorialCompras;
