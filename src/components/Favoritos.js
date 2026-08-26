// src/pages/Favoritos.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiArchive, FiArrowRight } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import API from "../services/api";
import "./Favoritos.css";
import logoGlaze from "../assets/images/LOGOS/Isotipo/Glaze-verde.png";

function Favoritos() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/favoritos/${usuario.id_usuario}`);
      setFavoritos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ELIMINAR FAVORITO (igual que mobile)
  const eliminarFavorito = async (id_favorito, id_producto) => {
    try {
      // Enviamos solo el id_favorito al endpoint DELETE
      await API.delete(`/favoritos/${id_favorito}`);
      
      // Actualización optimista: quitamos de la lista visual
      setFavoritos(prev => prev.filter(item => item.id_producto !== id_producto));
    } catch (error) {
      console.error("Error al eliminar:", error.response?.data || error.message);
      alert("No se pudo actualizar su selección.");
    }
  };

  // Filtrado por tipo o color
  const filtrados = favoritos.filter(p =>
    (p.tipo_producto || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (p.color || "").toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="favoritos-page-glaze">
      {/* HEADER */}
      <div className="favoritos-header-glaze">
        <button className="btn-back-favoritos" onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </button>

        <div className="header-branding-fav">
          <h1 className="brand-title-fav">Favoritos</h1>
          <div className="accent-line-fav"></div>
          <p className="brand-subtitle-fav">MI SELECCIÓN PRIVADA</p>
        </div>

        <div className="logo-fav-container">
          <img 
                      src={logoGlaze} 
                      alt="Glaze" 
                      className="logo-fav-glaze"
                    />
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="search-container-fav">
        <div className="search-input-wrapper-fav">
          <FiSearch size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Buscar por color o tipo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="search-input-fav"
          />
        </div>
      </div>

      {/* GRID DE FAVORITOS */}
      <div className="favoritos-main">
        {loading ? (
          <div className="loading-favoritos">
            <p>Cargando selección...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="empty-state-fav">
            <FiArchive size={40} color="#e2e8f0" />
            <p>Tu selección está vacía.</p>
          </div>
        ) : (
          <div className="favoritos-grid-glaze">
            {filtrados.map((p) => {
              const noDisponible = p.estado === "vendido";

              return (
                <div 
                  key={p.id_producto} 
                  className={`card-favorito-glaze ${noDisponible ? 'card-disabled' : ''}`}
                >
                  {/* SECCIÓN IMAGEN */}
                  <div className="image-section-fav">
                    <div className="watermark-fav"></div>
                    
                    <div className="top-row-fav">
                      <div className="badge-exclusivo">PIEZA EXCLUSIVA</div>
                      
                      {/* 🔥 BOTÓN CORAZÓN PARA ELIMINAR */}
                      <button
                        className="heart-btn-fav"
                        onClick={() => eliminarFavorito(p.id_favorito, p.id_producto)}
                        title="Quitar de favoritos"
                      >
                        <FaHeart size={18} color="#e11d48" />
                      </button>
                    </div>

                    <img
                      src={`http://localhost:3000/uploads/${p.imagen}`}
                      alt={p.tipo_producto}
                      className="gem-image-fav"
                    />

                    {noDisponible && (
                      <div className="sold-overlay-fav">
                        <span className="sold-text-fav">ADQUIRIDA</span>
                      </div>
                    )}
                  </div>

                  {/* SECCIÓN INFO */}
                  <div className="info-section-fav">
                    <span className="vendedor-tag-fav">
                      {(p.vendedor || "COLECCIÓN GLAZE").toUpperCase()}
                    </span>
                    <h3 className="nombre-gema-fav">
                      {(p.tipo_producto || "GEMA").toUpperCase()}
                    </h3>

                    <div className="spec-row-fav">
                      <span className="spec-text-fav">{p.color} • {p.peso} CT</span>
                      <span className="price-value-fav">
                        ${Number(p.valor).toLocaleString()}
                      </span>
                    </div>

                    <button
                      className={`btn-detalles-fav ${noDisponible ? 'btn-inactive-fav' : ''}`}
                      onClick={() => navigate(`/producto/${p.id_producto}`)}
                    >
                      <span>
                        {noDisponible ? "PIEZA NO DISPONIBLE" : "DETALLES DE INVERSIÓN"}
                      </span>
                      {!noDisponible && <FiArrowRight size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;