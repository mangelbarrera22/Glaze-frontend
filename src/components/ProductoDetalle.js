import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./ProductoDetalle.css";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarProducto();
  }, []);

  const cargarProducto = async () => {
    try {
      const res = await API.get(`/productos/${id}`);
      setProducto(res.data);
    } catch (error) {
      console.log("Error cargando producto", error);
    }
  };

  const agregarFavorito = async () => {
    try {
      const res = await API.post("/favoritos", {
        id_usuario: usuario.id_usuario,
        id_producto: producto.id_producto
      });
      alert(res.data.mensaje);
    } catch (error) {
      console.log(error);
      alert("Error agregando favorito");
    }
  };

  const comprarProducto = async () => {
    try {
      const res = await API.post("/comprar", {
        id_producto: producto.id_producto
      });
      alert(res.data.mensaje);
      cargarProducto();
    } catch (error) {
      console.log(error);
      alert("Error en la compra");
    }
  };

  const contactarVendedor = () => {
    navigate(`/chat/${producto.id_vendedor}`);
  };

  if (!producto) {
    return <div className="loading-screen"><h2>Cargando pieza exclusiva...</h2></div>;
  }

  return (
    <div className="detalle-wrapper">
      <div className="detalle-container">
        <button className="btn-volver" onClick={() => navigate(-1)}>
          ← Volver al catálogo
        </button>

        <div className="detalle-grid">
          {/* COLUMNA IZQUIERDA: GALERÍA */}
          <div className="detalle-visuals">
            <div className="main-image-card">
              <Zoom>
                <img
                  src={`http://localhost:3000/uploads/${producto.imagen}`}
                  alt={producto.tipo_producto}
                  className="img-principal"
                />
              </Zoom>
            </div>
            
            <div className="certificado-card">
              <div className="card-header-mini">
                <h3>📜 Certificado de Autenticidad</h3>
              </div>
              <div className="cert-content">
                <Zoom>
                  <img
                    src={`http://localhost:3000/uploads/${producto.certificado}`}
                    alt="certificado"
                    className="certificado-img"
                  />
                </Zoom>
                <p>GIA / CDTEC Certified Quality</p>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: INFORMACIÓN */}
          <div className="detalle-info">
            <div className="info-header">
              <span className="sku-label">ID PRODUCTO: #00{producto.id_producto}</span>
              <h2 className="titulo-producto">{producto.tipo_producto} Selección Premium</h2>
              <p className="vendedor-tag">Por: <b>{producto.vendedor}</b></p>
            </div>

            <div className="specs-grid-v2">
              <div className="spec-tile">
                <label>Color</label>
                <span>{producto.color}</span>
              </div>
              <div className="spec-tile">
                <label>Peso</label>
                <span>{producto.peso} ct</span>
              </div>
              <div className="spec-tile">
                <label>Tratamiento</label>
                <span>{producto.tratamiento || "Natural"}</span>
              </div>
              <div className="spec-tile">
                <label>Estado</label>
                <span className={producto.estado === "vendido" ? "status-vendido" : "status-disponible"}>
                  {producto.estado}
                </span>
              </div>
            </div>

            <div className="precio-box">
              <label>VALOR DE ADQUISICIÓN</label>
              <h1>${Number(producto.valor).toLocaleString()} <small>USD</small></h1>
              {producto.estado === "vendido" && (
                <p className="error-text">Esta pieza ya no se encuentra disponible.</p>
              )}
            </div>

            <div className="acciones-premium">
              <button
                className="btn-comprar"
                onClick={comprarProducto}
                disabled={producto.estado === "vendido"}
              >
                {producto.estado === "vendido" ? "PIEZA ADQUIRIDA" : "ADQUIRIR AHORA"}
              </button>

              <div className="acciones-secundarias">
                <button className="btn-favorito" onClick={agregarFavorito}>
                  ⭐ Guardar
                </button>
                <button className="btn-contacto" onClick={contactarVendedor}>
                  💬 Consultar
                </button>
              </div>
            </div>

            {producto.tipo_producto === "joya" && (
              <div className="joya-box-premium">
                <h3>Composición de Orfebrería</h3>
                <div className="joya-grid">
                  <p><b>Esmeralda:</b> {producto.tiene_esmeralda}</p>
                  <p><b>Oro:</b> {producto.oro}</p>
                  <p><b>Plata:</b> {producto.plata}</p>
                  <p><b>Oro Rosado:</b> {producto.oro_rosado}</p>
                </div>
              </div>
            )}
            
            <div className="stock-info">
              <p>Unidades en Stock: <b>{producto.stock}</b></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoDetalle;