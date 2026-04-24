import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos el hook de navegación
import API from "../services/api";
import "./Historial.css";

function HistorialPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializamos la navegación

  const usuario = (() => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!usuario?.id_usuario) {
      setError("No se encontró el usuario en sesión.");
      return;
    }
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const res = await API.get(`/historial/${usuario.id_usuario}`);
      const data = Array.isArray(res.data) ? res.data : [];
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      setError("Error al cargar el historial.");
    }
  };

  if (error) return (
    <div className="error-message">
      <p>⚠️ {error}</p>
      <button onClick={() => navigate(-1)} className="btn-volver-minimal">Volver</button>
    </div>
  );

  return (
    <div className="historial-page">
      {/* BOTÓN VOLVER */}
      <button onClick={() => navigate(-1)} className="btn-volver-premium">
        <span className="arrow">←</span> Panel de Control
      </button>

      <div className="historial-header">
        <h1>Historial de Adquisiciones</h1>
        <p className="subtitulo-premium">Registro de tus piezas exclusivas</p>
      </div>

      <div className="historial-list">
        {pedidos.length === 0 ? (
          <div className="empty-history">
            <p>Aún no has realizado adquisiciones en nuestra selección premium.</p>
          </div>
        ) : (
          pedidos.map((p, index) => (
            <div className="pedido-card-premium" key={`${p.id_producto}-${index}`}>
              <div className="card-accent"></div>
              
              <div className="pedido-main-info">
                <div className="id-section">
                  <span className="label-min">REFERENCIA</span>
                  <h3>ADQ-{p.id_producto}00</h3>
                </div>
                
                <div className="status-section">
                  <span className="badge-completado">Confirmado</span>
                </div>
              </div>

              <div className="pedido-details">
                <div className="detail-item">
                  <span className="label-min">FECHA DE ADQUISICIÓN</span>
                  <p className="fecha-txt">
                    {new Date(p.fecha_salida).toLocaleDateString('es-ES', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="price-section">
                  <span className="label-min">INVERSIÓN TOTAL</span>
                  <h2 className="total-txt">${Number(p.valor).toLocaleString()} USD</h2>
                </div>
              </div>

              <div className="card-footer">
                <button className="btn-recibo" onClick={() => window.print()}>
                  Descargar Comprobante
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HistorialPedidos;