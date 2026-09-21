import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiX,
  FiFileText,
  FiAlertTriangle,
  FiShoppingBag,
  FiDollarSign
} from "react-icons/fi";
import API from "../services/api";
import "./MisVentas.css";
import logoGlaze from "../assets/images/LOGOS/Isotipo/Glaze-verde.png";

function MisVentas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  const usuario = (() => {
    try { return JSON.parse(localStorage.getItem("usuario")); }
    catch { return null; }
  })();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!usuario?.id_usuario) {
      setError("No se encontró el usuario en sesión.");
      setCargando(false);
      return;
    }
    cargarVentas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarVentas = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await API.get(`/ventas/vendedor/${usuario.id_usuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVentas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al cargar las ventas.");
    } finally {
      setCargando(false);
    }
  };

  const filtradas = ventas.filter((v) =>
    v.nombre_producto?.toLowerCase().includes(filtro.toLowerCase()) ||
    v.nombre_comprador?.toLowerCase().includes(filtro.toLowerCase()) ||
    String(v.id_venta).includes(filtro)
  );

  const formatFecha = (fecha) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-CO", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const totalVentas = ventas.reduce(
    (acc, v) => acc + Number(v.valor_compra ?? v.valor_venta ?? 0),
    0
  );

  // Genera el HTML del comprobante de UNA sola venta
  const generarComprobanteHTML = (v) => {
    const referencia = `VTA-${String(v.id_venta).padStart(4, "0")}`;
    const valor = Number(v.valor_compra ?? v.valor_venta ?? 0).toLocaleString("es-CO");
    const fecha = formatFecha(v.fecha_compra ?? v.fecha_venta);
    const imagenProducto = v.imagen || null;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Comprobante ${referencia}</title>
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
            <div class="subtitle">COMPROBANTE DIGITAL DE VENTA</div>
          </div>

          <div class="reference">
            <div>
              <div class="reference-label">REFERENCIA DE VENTA</div>
              <div class="reference-value">${referencia}</div>
            </div>
            <span class="status">VENTA CONFIRMADA</span>
          </div>

          <div class="product">
            ${imagenProducto ? `<img class="product-image" src="${imagenProducto}" />` : ""}
            <div class="product-info">
              <div class="label">PIEZA VENDIDA</div>
              <div class="value">${(v.nombre_producto || "Gema Exclusiva").toUpperCase()}</div>
              <div class="label">COMPRADOR</div>
              <div class="value">${v.nombre_comprador || "—"}</div>
            </div>
          </div>

          <div class="details">
            <div class="row">
              <div>
                <div class="label">FECHA DE VENTA</div>
                <div>${fecha}</div>
              </div>
              <div style="text-align:right">
                <div class="label">INGRESO POR VENTA</div>
                <div class="total">$${valor} USD</div>
              </div>
            </div>
          </div>

          <div class="footer">GLAZE · REGISTRO DIGITAL DE VENTAS</div>
        </div>
      </body>
      </html>
    `;
  };

  // Abre una ventana nueva e imprime SOLO la venta seleccionada
  const imprimirComprobante = (v) => {
    const html = generarComprobanteHTML(v);
    const ventana = window.open("", "_blank", "width=900,height=1000");

    if (!ventana) {
      alert("Permite las ventanas emergentes para imprimir el comprobante.");
      return;
    }

    ventana.document.open();
    ventana.document.write(html);
    ventana.document.close();

    setTimeout(() => {
      ventana.focus();
      ventana.print();
    }, 800);
  };

  if (error) return (
    <div className="ventas-error">
      <FiAlertTriangle size={28} />
      <p>{error}</p>
      <button onClick={() => navigate(-1)} className="btn-volver">
        <FiArrowLeft size={16} />
        <span>Volver</span>
      </button>
    </div>
  );

  return (
    <div className="ventas-page">

      {/* HEADER */}
      <div className="ventas-header">
        <button onClick={() => navigate(-1)} className="btn-volver" type="button">
          <FiArrowLeft size={16} />
          <span>Volver</span>
        </button>
        <div>
          <h1>Mis Ventas</h1>
          <p className="ventas-tag">HISTORIAL DE VENTAS • GLAZE</p>
        </div>
      </div>

      {/* STATS */}
      <div className="ventas-stats">
        <div className="stat-box">
          <div className="stat-icon">
            <FiShoppingBag size={20} />
          </div>
          <div>
            <span className="label-min">TOTAL VENTAS</span>
            <p className="stat-number">{ventas.length}</p>
          </div>
        </div>
        <div className="stat-box stat-box-gold">
          <div className="stat-icon">
            <FiDollarSign size={20} />
          </div>
          <div>
            <span className="label-min">INGRESOS TOTALES</span>
            <p className="stat-number">${totalVentas.toLocaleString("es-CO")} USD</p>
          </div>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="search-container">
        <FiSearch size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por producto, comprador o referencia..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-busqueda"
        />
        {filtro && (
          <button className="btn-clear" onClick={() => setFiltro("")} aria-label="Limpiar búsqueda">
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* CARGANDO */}
      {cargando && (
        <div className="estado-container">
          <div className="spinner" />
          <p>Cargando ventas...</p>
        </div>
      )}

      {/* VACÍO */}
      {!cargando && !error && filtradas.length === 0 && (
        <div className="estado-container vacio">
          <p>{filtro ? "Sin resultados para tu búsqueda." : "Aún no has realizado ninguna venta."}</p>
        </div>
      )}

      {/* LISTA */}
      <div className="ventas-list">
        {!cargando && !error && filtradas.map((v, index) => (
          <div className="venta-card" key={`${v.id_venta}-${index}`}>
            <div className="card-accent" />

            <div className="venta-imagen-wrapper">
              {v.imagen
                ? <img src={v.imagen} alt={v.nombre_producto} className="venta-imagen" />
                : (
                  <div className="venta-imagen-placeholder">
                    <img src={logoGlaze} alt="" className="placeholder-logo-glaze" />
                  </div>
                )
              }
            </div>

            <div className="venta-contenido">
              <div className="venta-top">
                <div>
                  <span className="label-min">REFERENCIA</span>
                  <h3 className="ref-text">VTA-{String(v.id_venta).padStart(4, "0")}</h3>
                </div>
                <span className="badge-confirmado">CONFIRMADO</span>
              </div>

              <div className="venta-details">
                <div className="detail-group">
                  <span className="label-min">PRODUCTO</span>
                  <p>{v.nombre_producto || `Producto #${v.id_producto}`}</p>
                </div>
                <div className="detail-group">
                  <span className="label-min">COMPRADOR</span>
                  <p>{v.nombre_comprador || "—"}</p>
                </div>
                <div className="detail-group">
                  <span className="label-min">FECHA</span>
                  <p>{formatFecha(v.fecha_compra ?? v.fecha_venta)}</p>
                </div>
              </div>

              <div className="venta-footer">
                <div>
                  <span className="label-min">INGRESO</span>
                  <p className="valor-text">
                    ${Number(v.valor_compra ?? v.valor_venta ?? 0).toLocaleString("es-CO")} USD
                  </p>
                </div>
                <button className="btn-comprobante" onClick={() => imprimirComprobante(v)} type="button">
                  <FiFileText size={14} />
                  <span>Comprobante</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default MisVentas;