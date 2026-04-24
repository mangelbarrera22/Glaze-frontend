import { useEffect, useState } from "react";
import API from "../services/api";
import "./Favoritos.css";

function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [filtro, setFiltro] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const cargarFavoritos = async () => {
    try {
      const res = await API.get(`/favoritos/${usuario.id_usuario}`);
      setFavoritos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filtrados = favoritos.filter(p =>
    p.tipo_producto.toLowerCase().includes(filtro.toLowerCase()) ||
    p.color.toLowerCase().includes(filtro.toLowerCase()) ||
    p.peso.toString().includes(filtro)
  );

  const eliminarFavorito = async (id_producto) => {
    try {
      await API.delete(`/favoritos/${usuario.id_usuario}/${id_producto}`);
      cargarFavoritos();
    } catch (error) {
      console.log(error);
    }
  };

  const comprar = async (id_producto) => {
    try {
      await API.post("/comprar", {
        id_usuario: usuario.id_usuario,
        id_producto
      });
      alert("Compra realizada con éxito 🛒");
      cargarFavoritos();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="favoritos-page">
      <div className="favoritos-header">
        <h1>Mis Favoritos</h1>
        <p>Gestiona las piezas exclusivas que has guardado en tu colección personal.</p>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Filtrar por color, peso o gema..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="input-busqueda-premium"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="favoritos-grid">
        {filtrados.length > 0 ? (
          filtrados.map((p) => {
            const noDisponible = p.estado === "vendido";

            return (
              <div className={`favorito-card ${noDisponible ? 'item-sold' : ''}`} key={p.id_producto}>
                <div className="image-wrapper">
                  <img
                    src={`http://localhost:3000/uploads/${p.imagen}`}
                    alt={p.tipo_producto}
                    className="favorito-img"
                  />
                  {noDisponible && <div className="sold-overlay">No Disponible</div>}
                </div>

                <div className="favorito-info">
                  <span className="categoria-tag">{p.tipo_producto}</span>
                  <h3>{p.tipo_producto} Selección</h3>
                  
                  <div className="details-row">
                    <span><b>Color:</b> {p.color}</span>
                    <span><b>Peso:</b> {p.peso} ct</span>
                  </div>

                  <div className="precio-tag">
                    ${Number(p.valor).toLocaleString()}
                  </div>

                  <div className="favorito-acciones">
                    <button
                      disabled={noDisponible}
                      onClick={() => comprar(p.id_producto)}
                      className="btn-comprar-fav"
                    >
                      {noDisponible ? "Agotado" : "Comprar Ahora"}
                    </button>

                    <button
                      onClick={() => eliminarFavorito(p.id_producto)}
                      className="btn-eliminar-fav"
                      title="Quitar de favoritos"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No tienes piezas guardadas que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favoritos;