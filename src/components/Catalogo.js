import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiLayers, FiMaximize2, FiTag } from "react-icons/fi";
import API from "../services/api";
import "./Catalogo.css";

function Catalogo() {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await API.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.log("Error cargando productos");
    }
  };

  const verDetalles = (id) => {
    navigate(`/producto/${id}`);
  };

  return (
    <div className="catalogo-wrapper">
      <header className="catalogo-header">
        <div className="header-info">
          <h1 className="titulo-premium">Exclusivo Catálogo</h1>
          <p>Piezas únicas seleccionadas por expertos</p>
        </div>
        <div className="search-bar-fake">
          <FiSearch /> <span>Buscar por tipo o color...</span>
        </div>
      </header>

      <div className="grid-premium">
        {productos.map((producto) => (
          <div key={producto.id_producto} className="card-premium">
            <div className="image-container">
              <img 
                src={`http://localhost:3000/uploads/${producto.imagen}`}
                alt={producto.tipo_producto}
                className="gem-image"
              />
              <div className="badge-tipo">
                <FiTag size={12} /> {producto.tipo_producto}
              </div>
            </div>

            <div className="content-box">
              <div className="main-info">
                <div className="spec-item">
                  <FiLayers size={14} /> <span>{producto.color}</span>
                </div>
                <div className="spec-item">
                  <FiMaximize2 size={14} /> <span>{producto.peso} ct</span>
                </div>
              </div>

              <div className="price-container">
                <label>Precio Estimado</label>
                <h3 className="valor-text">${Number(producto.valor).toLocaleString()}</h3>
              </div>

              <button 
                className="btn-ver-mas"
                onClick={() => verDetalles(producto.id_producto)}
              >
                VER DETALLES
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;