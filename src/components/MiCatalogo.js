import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiX,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiPlus
} from "react-icons/fi";
import API from "../services/api";
import "./MiCatalogo.css";

function MiCatalogo() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  })();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!usuario || !usuario.id_usuario || !token) {
      navigate("/login");
      return;
    }
    cargarProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError(null);
      const res = await API.get(`/productos/vendedor/${usuario.id_usuario}`, {
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
      await API.delete(`/productos/${id_producto}`, {
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

  if (!usuario) {
    return null;
  }

  return (
    <div className="catalogo-page">

      {/* HEADER */}
      <div className="catalogo-header">
        <div className="catalogo-header-left">
          <button
            className="btn-volver-catalogo"
            onClick={() => navigate(-1)}
            type="button"
            aria-label="Volver"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1>Mi Catálogo</h1>
            <p className="catalogo-tag">
              {productos.length} PIEZA{productos.length !== 1 ? "S" : ""} • GLAZE
            </p>
          </div>
        </div>
        <Link to="/publicar" className="btn-nueva-pieza">
          <FiPlus size={16} />
          <span>Nueva Pieza</span>
        </Link>
      </div>

      {/* BUSCADOR */}
      <div className="search-container">
        <FiSearch size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por color, tipo, peso..."
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
          {!filtro && <Link to="/publicar" className="btn-retry">PUBLICAR PRIMERA PIEZA</Link>}
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
                  ? <img src={p.imagen} alt={p.tipo_producto} className="card-imagen" />
                  : (
                    <div className="card-imagen-placeholder">
                      <FiImage size={36} />
                    </div>
                  )
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
                  <Link to={`/EditarProducto/${p.id_producto}`} className="btn-editar">
                    <FiEdit2 size={13} />
                    <span>EDITAR</span>
                  </Link>
                  <button onClick={() => eliminarProducto(p.id_producto)} className="btn-eliminar">
                    <FiTrash2 size={13} />
                    <span>ELIMINAR</span>
                  </button>
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