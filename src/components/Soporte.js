import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Soporte.css";

// Iconos SVG internos para evitar errores de librerías faltantes
const IconMessage = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

export default function Soporte() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    asunto: "",
    mensaje: ""
  });

  const userId = 6;

  const validar = () => {
    if (!form.asunto.trim() || !form.mensaje.trim()) {
      alert("Por favor, complete todos los campos obligatorios.");
      return false;
    }
    if (form.mensaje.length < 10) {
      alert("El mensaje debe ser más descriptivo (mínimo 10 caracteres).");
      return false;
    }
    return true;
  };

  const enviarMensaje = async () => {
    if (!validar()) return;
    try {
      await axios.post("http://localhost:3000/api/soporte", {
        ...form,
        id_usuario: userId
      });
      alert("Su mensaje ha sido enviado ✅");
      setForm({ asunto: "", mensaje: "" });
    } catch (error) {
      alert("Error al enviar. Verifique su conexión.");
    }
  };

  return (
    <div className="soporte-page">
      <button onClick={() => navigate(-1)} className="btn-regresar-premium">
        ← Regresar al Panel
      </button>

      <div className="soporte-header">
        <h1>Centro de Asistencia</h1>
        <p className="subtitulo-premium">Estamos aquí para garantizar su experiencia exclusiva</p>
      </div>

      <div className="soporte-grid">
        <div className="soporte-info-card">
          <div className="info-item">
            <div className="icon-wrapper"><IconMessage /></div>
            <div>
              <h4>Soporte Especializado</h4>
              <p>Respuesta garantizada en menos de 24 horas hábiles.</p>
            </div>
          </div>
        </div>

        <div className="soporte-card-main">
          <div className="accent-line"></div>
          <div className="card-body">
            <h3>Enviar una Consulta</h3>
            
            <div className="input-group-premium">
              <label className="label-min">ASUNTO DE LA CONSULTA</label>
              <input
                type="text"
                placeholder="Ej. Información sobre piezas"
                value={form.asunto}
                onChange={(e) => setForm({ ...form, asunto: e.target.value })}
              />
            </div>

            <div className="input-group-premium">
              <label className="label-min">DETALLE DE SU MENSAJE</label>
              <textarea
                placeholder="Describa su inquietud..."
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              />
            </div>

            <button className="btn-enviar-premium" onClick={enviarMensaje}>
              <IconSend />
              <span>ENVIAR CONSULTA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}