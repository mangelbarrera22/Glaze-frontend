// src/pages/ProductoDetalle.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiStar, FiMessageSquare } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import API from "../services/api";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./ProductoDetalle.css";
import logoGlaze from "../assets/images/LOGOS/Isotipo/Glaze-verde.png";

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarProducto();
    if (usuario) {
      verificarFavorito();
    }
  }, [id]);

  const cargarProducto = async () => {
    try {
      const res = await API.get(`/productos/${id}`);
      setProducto(res.data);
    } catch (error) {
      console.log("Error cargando producto", error);
    }
  };

  const verificarFavorito = async () => {
    if (!usuario) return;
    try {
      const res = await API.get(`/favoritos/${usuario.id_usuario}`);
      const yaEstaEnFavoritos = res.data.some(fav => fav.id_producto === parseInt(id));
      setEsFavorito(yaEstaEnFavoritos);
    } catch (error) {
      console.log("Error verificando favoritos", error);
    }
  };

  const agregarFavorito = async () => {
    if (!usuario) {
      alert("Inicie sesión para guardar en favoritos");
      return;
    }
    try {
      const res = await API.post("/favoritos", {
        id_usuario: usuario.id_usuario,
        id_producto: producto.id_producto
      });
      alert("Éxito agregando a favoritos");
      setEsFavorito(true);
    } catch (error) {
      console.log(error);
      const mensaje = error.response?.data?.error || "Error agregando favorito";
      
      if (mensaje.includes("ya está") || mensaje.includes("duplicado")) {
        setEsFavorito(true);
      }
      alert(mensaje);
    }
  };

  // 🔥 COMPRA CON WOMPI
  const comprarProducto = async () => {
    if (!usuario) {
      alert("Inicie sesión para continuar con la adquisición");
      return;
    }
    
    try {
      setLoadingAction(true);
      
      const datosPago = {
        id_producto: producto.id_producto,
        id_vendedor: producto.id_vendedor || 1
      };

      console.log("📤 Iniciando pago con Wompi:", datosPago);
      
      const res = await API.post("/pagos/iniciar", datosPago);

      if (res.data && res.data.urlPago) {
        const { urlPago, referencia, monto } = res.data;
        
        console.log("✅ URL de pago generada:", urlPago);
        
        // Guardar referencia
        localStorage.setItem("ultimaReferencia", referencia);
        
        // Abrir Wompi en nueva pestaña
        const ventanaPago = window.open(urlPago, "_blank");
        
        if (ventanaPago) {
          alert(
            `Pago iniciado\n\nReferencia: ${referencia}\nMonto: $${monto.toLocaleString()} COP\n\nSerás redirigido a Wompi para completar el pago.`
          );
          
          // Polling cada 5 segundos para verificar estado
          const intervalo = setInterval(async () => {
            try {
              const estadoRes = await API.get(`/pagos/estado/${referencia}`);
              
              if (estadoRes.data.estado === 'APROBADO') {
                clearInterval(intervalo);
                alert("¡Pago aprobado! La pieza ha sido adquirida correctamente.");
                await cargarProducto();
                navigate("/historial-pedidos");
              } else if (estadoRes.data.estado === 'RECHAZADO') {
                clearInterval(intervalo);
                alert("Pago rechazado. La transacción no pudo ser procesada.");
              }
            } catch (error) {
              console.log("Error verificando estado:", error);
            }
          }, 5000);
          
          // Detener después de 5 minutos
          setTimeout(() => {
            clearInterval(intervalo);
          }, 300000);
        } else {
          alert("Por favor permite ventanas emergentes para procesar el pago");
        }
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.error || "No se pudo iniciar el pago");
    } finally {
      setLoadingAction(false);
    }
  };

  const iniciarChat = async () => {
    if (!usuario) {
      alert("Inicie sesión para contactar al vendedor");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/conversaciones", {
        id_vendedor: producto.id_vendedor
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/conversacion/${res.data.id_conversacion}`);
    } catch (error) {
      console.log(error);
      alert("No se pudo iniciar la conversación");
    }
  };

  if (!producto) {
    return (
      <div className="loading-detalle">
        <p>CARGANDO PIEZA...</p>
      </div>
    );
  }

  const noDisponible = producto.estado === "vendido";

  return (
    <div className="detalle-page-glaze">
      <div className="detalle-header-row">
        <button className="btn-back-detalle" onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
          <span>Volver al catálogo</span>
        </button>
        
        <div className="logo-detalle-container">
          <img 
            src={logoGlaze} 
            alt="Glaze" 
            className="logo-detalle-glaze"
          />
        </div>
      </div>

      <div className="detalle-grid-glaze">
        <div className="imagen-section">
          <div className="imagen-wrapper">
            <div className="watermark-detalle"></div>
            <Zoom>
              <img
                src={`http://localhost:3000/uploads/${producto.imagen}`}
                alt={producto.tipo_producto}
                className="imagen-principal-glaze"
              />
            </Zoom>
          </div>
        </div>

        <div className="info-section-glaze">
          <div className="info-header-glaze">
            <div className="header-top-row">
              <span className="ref-tag">REF. VZ-{producto.id_producto}00</span>
              <div className={`estado-badge ${noDisponible ? 'vendido' : 'disponible'}`}>
                <span>{(producto.estado || "DISPONIBLE").toUpperCase()}</span>
              </div>
            </div>
            <h1 className="titulo-pieza">{(producto.tipo_producto || "PIEZA").toUpperCase()}</h1>
            <p className="coleccion-tag">COLECCIÓN: {(producto.vendedor || "GLAZE").toUpperCase()}</p>
          </div>

          <div className="separador-glaze"></div>

          <div className="specs-grid-glaze">
            <div className="spec-item-glaze">
              <span className="spec-label-glaze">COLOR</span>
              <span className="spec-value-glaze">{producto.color || "N/A"}</span>
            </div>
            <div className="spec-item-glaze">
              <span className="spec-label-glaze">QUILATES</span>
              <span className="spec-value-glaze">{producto.peso || "0"} ct</span>
            </div>
            {producto.tratamiento && (
              <div className="spec-item-glaze">
                <span className="spec-label-glaze">TRATAMIENTO</span>
                <span className="spec-value-glaze">{producto.tratamiento}</span>
              </div>
            )}
            {producto.stock && (
              <div className="spec-item-glaze">
                <span className="spec-label-glaze">STOCK</span>
                <span className="spec-value-glaze">{producto.stock}</span>
              </div>
            )}
          </div>

          <div className="precio-box-glaze">
            <p className="precio-heading">VALORACIÓN</p>
            <p className="precio-valor">
              ${Number(producto.valor || 0).toLocaleString()}{" "}
              <span className="usd">COP</span>
            </p>
          </div>

          {producto.tipo_producto === "joya" && (
            <div className="joya-composicion">
              <h3>Composición de Orfebrería</h3>
              <div className="joya-detalles">
                <p><strong>Esmeralda:</strong> {producto.tiene_esmeralda}</p>
                <p><strong>Oro:</strong> {producto.oro}</p>
                <p><strong>Plata:</strong> {producto.plata}</p>
                <p><strong>Oro Rosado:</strong> {producto.oro_rosado}</p>
              </div>
            </div>
          )}

          <div className="acciones-footer-glaze">
            <button 
              className={`btn-secundario-glaze ${esFavorito ? 'favorito-activo' : ''}`}
              onClick={agregarFavorito}
            >
              {esFavorito ? <FaStar size={20} /> : <FiStar size={20} />}
            </button>

            <button
              className={`btn-principal-glaze ${noDisponible || loadingAction ? 'disabled' : ''}`}
              onClick={comprarProducto}
              disabled={noDisponible || loadingAction}
            >
              {loadingAction ? "PROCESANDO..." : noDisponible ? "PIEZA VENDIDA" : "PAGAR CON WOMPI"}
            </button>

            <button className="btn-secundario-glaze" onClick={iniciarChat}>
              <FiMessageSquare size={20} />
            </button>
          </div>
        </div>
      </div>

      {producto.certificado && (
        <div className="certificado-section-glaze">
          <h3>📜 Certificado de Autenticidad</h3>
          <div className="certificado-content">
            <Zoom>
              <img
                src={`http://localhost:3000/uploads/${producto.certificado}`}
                alt="certificado"
                className="certificado-imagen"
              />
            </Zoom>
            <p>GIA / CDTEC Certified Quality</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductoDetalle;