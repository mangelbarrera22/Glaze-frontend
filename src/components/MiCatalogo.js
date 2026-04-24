import { useEffect, useState } from "react";
import axios from "axios";
import "./MiCatalogo.css";

const BASE_URL = "http://192.168.101.60:3000/api";

function MiCatalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/productos/vendedor/${usuario.id_usuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(res.data);
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al cargar el catálogo.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id_producto) => {
    if (!window.confirm("¿Eliminar esta pieza del catálogo?")) return;
    try {
      await axios.delete(`${BASE_URL}/productos/${id_producto}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarProductos();
    } catch {
      alert("No se pudo eliminar la pieza.");
    }
  };

  const filtrados = productos.filter((p) =>
    p.color?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.tipo_producto?.toLowerCase().includes(filtro.toLowerCase()) ||
    p.peso?.toString().includes(filtro)
  );

  const getBadge = (estado) => {
    switch (estado) {
      case "vendido":   return { label: "VENDIDO",    cls: "badge-vendido" };
      case "reservado": return { label: "RESERVADO",  cls: "badge-reservado" };
      default:          return { label: "DISPONIBLE", cls: "badge-disponible" };
    }
  };

  return (
    <div className="catalogo-page">

      {/* HEADER */}
      <div className="catalogo-header">
        <div>
          <h1>Mi Catálogo</h1>
          <p className="catalogo-tag">
            {productos.length} PIEZA{productos.length !== 1 ? "S" : ""} • GLAZE
          </p>
        </div>
        <a href="/publicar" className="btn-nueva-pieza">+ Nueva Pieza</a>
      </div>

      {/* BUSCADOR */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar por color, tipo, peso..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-busqueda"
        />
        {filtro && (
          <button className="btn-clear" onClick={() => setFiltro("")}>✕</button>
        )}
      </div>

      {/* ESTADOS */}
      {cargando && (
        <div className="estado-container">
          <div className="spinner" />
          <p>Cargando piezas...</p>
        </div>
      )}

      {!cargando && error && (
        <div className="estado-container error">
          <p>{error}</p>
          <button onClick={cargarProductos} className="btn-retry">REINTENTAR</button>
        </div>
      )}

      {!cargando && !error && filtrados.length === 0 && (
        <div className="estado-container vacio">
          <p>{filtro ? "Sin resultados para tu búsqueda." : "Aún no has publicado ninguna pieza."}</p>
          {!filtro && <a href="/publicar" className="btn-retry">PUBLICAR PRIMERA PIEZA</a>}
        </div>
      )}

      {/* GRID */}
      <div className="catalogo-grid">
        {!cargando && !error && filtrados.map((p) => {
          const badge = getBadge(p.estado);
          const vendido = p.estado === "vendido";

          return (
            <div className={`catalogo-card ${vendido ? "card-vendido" : ""}`} key={p.id_producto}>

              <div className="card-imagen-wrapper">
                {p.imagen
                  ? <img src={`http://localhost:3000/uploads/${p.imagen}`} alt={p.tipo_producto} className="card-imagen" />
                  : <div className="card-imagen-placeholder">💎</div>
                }
                {vendido && <div className="sold-overlay">No Disponible</div>}
              </div>

              <div className="card-body">
                <div className="card-top-row">
                  <div>
                    <span className="label-min">REFERENCIA</span>
                    <p className="ref-text">GZ-{String(p.id_producto).padStart(4, "0")}</p>
                  </div>
                  <span className={`badge ${badge.cls}`}>{badge.label}</span>
                </div>

                <div className="card-details">
                  <div>
                    <span className="label-min">TIPO</span>
                    <p>{p.tipo_producto}</p>
                  </div>
                  <div>
                    <span className="label-min">COLOR</span>
                    <p>{p.color || "—"}</p>
                  </div>
                  <div>
                    <span className="label-min">PESO</span>
                    <p>{p.peso} ct</p>
                  </div>
                </div>

                <div className="card-valor">
                  <span className="label-min">VALOR</span>
                  <p className="valor-text">${Number(p.valor).toLocaleString("es-CO")} USD</p>
                </div>

                <div className="card-acciones">
                  <a href={`/EditarProducto/${p.id_producto}`} className="btn-editar">✏️ EDITAR</a>
                  <button onClick={() => eliminarProducto(p.id_producto)} className="btn-eliminar">🗑️ ELIMINAR</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MiCatalogo;