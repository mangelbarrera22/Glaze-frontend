import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiX } from "react-icons/fi";
import API from "../services/api";
import logoGlaze from "../assets/images/LOGOS/Isotipo/Glaze-verde.png";
import "./Historial.css";

function HistorialCompras() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

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

  function generarCertificadoHTML(p) {
    const imagenProducto = p.imagen || null;
    const certificado = p.certificado || null;
    const referencia = formatearReferencia(p.id_venta || p.id_producto);
    const valor = p.valor_compra != null
      ? Number(p.valor_compra).toLocaleString("es-CO")
      : "—";
    const fecha = formatearFecha(p.fecha_compra || p.fecha_salida);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificado ${referencia}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: Arial, Helvetica, sans-serif;
            color: #0a3d2e;
          }
          .page {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 45px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1f6f54;
            padding-bottom: 20px;
            margin-bottom: 25px;
          }
          .logo { font-size: 34px; font-weight: 300; letter-spacing: 7px; }
          .subtitle { font-size: 10px; letter-spacing: 3px; color: #94a3b8; margin-top: 8px; }
          .reference {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
          }
          .reference-label { font-size: 8px; color: #94a3b8; letter-spacing: 2px; }
          .reference-value { font-size: 17px; color: #0a3d2e; letter-spacing: 2px; }
          .status {
            background: #0a3d2e;
            color: white;
            display: inline-block;
            padding: 7px 12px;
            font-size: 8px;
            letter-spacing: 2px;
          }
          .product {
            display: flex;
            align-items: center;
            border: 1px solid #f1f5f9;
            padding: 25px;
            margin-top: 25px;
          }
          .product-image { width: 180px; height: 180px; object-fit: contain; margin-right: 35px; }
          .product-info { flex: 1; }
          .label { font-size: 8px; color: #94a3b8; letter-spacing: 2px; margin-bottom: 5px; }
          .value { font-size: 16px; color: #0a3d2e; margin-bottom: 18px; }
          .details {
            border-top: 1px solid #f1f5f9;
            border-bottom: 1px solid #f1f5f9;
            padding: 20px 0;
            margin-top: 25px;
          }
          .row { display: flex; justify-content: space-between; }
          .total { font-size: 24px; color: #0a3d2e; }
          .certificate { margin-top: 30px; text-align: center; }
          .certificate-title { font-size: 11px; letter-spacing: 3px; margin-bottom: 15px; }
          .certificate-image { max-width: 100%; max-height: 500px; object-fit: contain; }
          .footer {
            margin-top: 45px;
            padding-top: 15px;
            border-top: 1px solid #f1f5f9;
            text-align: center;
            color: #94a3b8;
            font-size: 8px;
            letter-spacing: 1px;
          }
          @media print {
            @page { size: A4; margin: 0; }
            body { width: 210mm; min-height: 297mm; }
            .page { width: 210mm; min-height: 297mm; padding: 20mm; }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="logo">GLAZE</div>
            <div class="subtitle">CERTIFICADO DIGITAL DE ADQUISICIÓN</div>
          </div>

          <div class="reference">
            <div>
              <div class="reference-label">REFERENCIA DE VENTA</div>
              <div class="reference-value">${referencia}</div>
            </div>
            <span class="status">COMPRA CONFIRMADA</span>
          </div>

          <div class="product">
            ${imagenProducto ? `<img class="product-image" src="${imagenProducto}" />` : ""}
            <div class="product-info">
              <div class="label">PIEZA ADQUIRIDA</div>
              <div class="value">${(p.nombre_producto || "Gema Exclusiva").toUpperCase()}</div>
              <div class="label">COLOR</div>
              <div class="value">${p.color || "Especial"}</div>
              <div class="label">PESO</div>
              <div class="value">${p.peso || "N/A"} CT</div>
            </div>
          </div>

          <div class="details">
            <div class="row">
              <div>
                <div class="label">FECHA DE ADQUISICIÓN</div>
                <div>${fecha}</div>
              </div>
              <div style="text-align:right">
                <div class="label">VALOR DE ADQUISICIÓN</div>
                <div class="total">$${valor}</div>
              </div>
            </div>
          </div>

          ${certificado ? `
            <div class="certificate">
              <div class="certificate-title">CERTIFICADO DE AUTENTICIDAD</div>
              <img class="certificate-image" src="${certificado}" />
            </div>
          ` : ""}

          <div class="footer">GLAZE · REGISTRO DIGITAL DE ADQUISICIONES</div>
        </div>
      </body>
      </html>
    `;
  }

  function imprimirCertificado(p) {
    const html = generarCertificadoHTML(p);
    const ventana = window.open("", "_blank", "width=900,height=1000");

    if (!ventana) {
      alert("Permite las ventanas emergentes para imprimir el certificado.");
      return;
    }

    ventana.document.open();
    ventana.document.write(html);
    ventana.document.close();

    setTimeout(() => {
      ventana.focus();
      ventana.print();
    }, 800);
  }

  // Filtrado de pedidos según tipo o color
  const pedidosFiltrados = pedidos.filter(p =>
    (p.nombre_producto || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (p.color || "").toLowerCase().includes(filtro.toLowerCase()) ||
    formatearReferencia(p.id_venta || p.id_producto).toLowerCase().includes(filtro.toLowerCase())
  );

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
        React.createElement(FiArrowLeft, { size: 20 })
      ),

      // Título e información a la izquierda
      React.createElement(
        "div",
        { className: "header-branding-insti" },
        React.createElement("h1", { className: "brand-title-insti" }, "Adquisiciones"),
        React.createElement("div", { className: "accent-line-insti" }),
        React.createElement("h2", { className: "brand-subtitle-insti" }, "HISTORIAL DE INVERSIONES")
      ),

      // Buscador expandible a la derecha (junto al logo)
      React.createElement(
        "div",
        { className: `search-expandable-insti ${isExpanded ? 'expanded' : ''}` },
        !isExpanded
          ? React.createElement(
              "button",
              {
                className: "btn-search-icon-insti",
                onClick: () => setIsExpanded(true),
                title: "Buscar",
                type: "button"
              },
              React.createElement(FiSearch, { size: 18 })
            )
          : React.createElement(
              "div",
              { className: "search-expanded-content-insti" },
              React.createElement(FiSearch, { size: 16, color: "#64748b" }),
              React.createElement("input", {
                type: "text",
                placeholder: "Buscar por gema, color o ref...",
                value: filtro,
                onChange: (e) => setFiltro(e.target.value),
                className: "search-input-expanded-insti",
                autoFocus: true
              }),
              filtro && React.createElement(
                "button",
                {
                  className: "btn-clear-search-insti",
                  onClick: () => setFiltro(""),
                  title: "Limpiar",
                  type: "button"
                },
                React.createElement(FiX, { size: 14 })
              ),
              React.createElement(
                "button",
                {
                  className: "btn-close-search-insti",
                  onClick: () => {
                    setIsExpanded(false);
                    setFiltro("");
                  },
                  title: "Cerrar",
                  type: "button"
                },
                React.createElement(FiX, { size: 18 })
              )
            )
      ),

      // Logo a la derecha
      React.createElement(
        "div",
        { className: "header-logo-insti" },
        React.createElement("img", {
          src: logoGlaze,
          alt: "Glaze",
          className: "logo-insti",
        })
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
      pedidosFiltrados.map((p, index) =>
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
                  src: p.imagen,
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
                onClick: () => imprimirCertificado(p),
                type: "button"
              },
              "DESCARGAR CERTIFICADO DIGITAL"
            )
          )
        )
      )
    )
  );
}

export default HistorialCompras;