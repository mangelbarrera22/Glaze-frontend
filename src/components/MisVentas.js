import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MisVentas.css";

const BASE_URL = "glaze-backend-production-ad01.up.railway.app/api";

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
  }, []);

  const cargarVentas = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/ventas/vendedor/${usuario.id_usuario}`, {
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

  const totalVentas = ventas.reduce((acc, v) => acc + Number(v.valor_venta || 0), 0);

  if (error) return (
    <div className="ventas-error">
      <p>⚠️ {error}</p>
      <button onClick={() => navigate(-1)} className="btn-volver">← Volver</button>
    </div>
  );

  return (
    <div className="ventas-page">

      {/* HEADER */}
      <div className="ventas-header">
        <button onClick={() => navigate(-1)} className="btn-volver">← Volver</button>
        <div>
          <h1>Mis Ventas</h1>
          <p className="ventas-tag">HISTORIAL DE VENTAS • GLAZE</p>
        </div>
      </div>

      {/* STATS */}
      <div className="ventas-stats">
        <div className="stat-box">
          <span className="label-min">TOTAL VENTAS</span>
          <p className="stat-number">{ventas.length}</p>
        </div>
        <div className="stat-box">
          <span className="label-min">INGRESOS TOTALES</span>
          <p className="stat-number">${totalVentas.toLocaleString("es-CO")} USD</p>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="search-container">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Buscar por producto, comprador o referencia..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-busqueda"
        />
        {filtro && <button className="btn-clear" onClick={() => setFiltro("")}>✕</button>}
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
                <p>{formatFecha(v.fecha_venta)}</p>
              </div>
            </div>

            <div className="venta-footer">
              <div>
                <span className="label-min">INGRESO</span>
                <p className="valor-text">${Number(v.valor_venta).toLocaleString("es-CO")} USD</p>
              </div>
              <button className="btn-comprobante" onClick={() => window.print()}>
                📄 Comprobante
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default MisVentas;