// src/pages/Catalogo.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight, FiArrowLeft, FiX } from "react-icons/fi";
import API from "../services/api";
import "./Catalogo.css";
import logoGlaze from "../assets/images/LOGOS/Isotipo/Glaze-verde.png";

function Catalogo() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false); // 🔥 NUEVO

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await API.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.log("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FILTRO COMBINADO: 
  // 1. Ocultar productos con estado "vendido"
  // 2. Filtrar por búsqueda en color o tipo_producto
  const filtrados = productos
    .filter(p => p.estado !== "vendido")
    .filter(p =>
      [p.color, p.tipo_producto].some(el =>
        el?.toLowerCase().includes(search.toLowerCase())
      )
    );

  const verDetalles = (id) => {
    navigate(`/producto/${id}`);
  };

  // 🔥 MANEJAR CIERRE DE BÚSQUEDA
  const cerrarBusqueda = () => {
    setSearch("");
    setSearchExpanded(false);
  };

  return (
    <div className="catalogo-page">
      {/* HEADER CON BRANDING GLAZE */}
      <header className="catalogo-header-glaze">
        <button className="btn-back-circle" onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </button>

        <div className="header-branding">
          <h1 className="glaze-title">GLAZE</h1>
          <p className="glaze-subtitle">CATÁLOGO DE INVERSIÓN</p>
        </div>

        {/* 🔥 BARRA DE BÚSQUEDA EXPANDIBLE EN HEADER */}
        <div className={`search-expandable ${searchExpanded ? "expanded" : ""}`}>
          {!searchExpanded ? (
            <button 
              className="btn-search-icon"
              onClick={() => setSearchExpanded(true)}
              aria-label="Abrir búsqueda"
            >
              <FiSearch size={18} />
            </button>
          ) : (
            <div className="search-expanded-content">
              <FiSearch size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Filtrar por color o tipo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input-expanded"
                autoFocus
              />
              <button 
                className="btn-clear-search"
                onClick={cerrarBusqueda}
                aria-label="Cerrar búsqueda"
              >
                <FiX size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="header-logo">
          <img 
            src={logoGlaze} 
            alt="Glaze" 
            className="logo-glaze"
          />
        </div>
      </header>

      {/* GRID DE PRODUCTOS */}
      <main className="catalogo-main">
        {loading ? (
          <div className="loading-container">
            <p>Cargando piezas exclusivas...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron resultados{search && ` para "${search}"`}</p>
          </div>
        ) : (
          <div className="productos-grid-glaze">
            {filtrados.map((producto) => (
              <div key={producto.id_producto} className="card-glaze-web">
                <div className="image-section">
                  <div className="watermark-bg"></div>
                  <div className="badge-certificado">CERTIFICADO</div>
                  <img
                    src={`http://glaze-backend-production-ad01.up.railway.app/uploads/${producto.imagen}`}
                    alt={producto.tipo_producto}
                    className="producto-imagen"
                  />
                </div>

                <div className="info-section">
                  <div className="specs-row">
                    <span className="spec-tag">{producto.color?.toUpperCase()}</span>
                    <span className="spec-divider">|</span>
                    <span className="spec-tag">{producto.peso} CT</span>
                  </div>

                  <p className="precio-label">VALORACIÓN ESTIMADA</p>
                  <p className="precio-value">
                    ${Number(producto.valor).toLocaleString()}
                  </p>

                  <button
                    className="btn-adquirir"
                    onClick={() => verDetalles(producto.id_producto)}
                  >
                    <span>ADQUIRIR PIEZA</span>
                    <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Catalogo;