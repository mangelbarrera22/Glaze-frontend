// src/pages/CrearProducto.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiDroplet,
  FiBox,
  FiActivity,
  FiDollarSign,
  FiCamera,
  FiShield,
  FiAlertCircle,
  FiCheck,
  FiFileText,
  FiExternalLink
} from "react-icons/fi";
import API from "../services/api";
import "./publicar.css";
import logoGlaze from "../assets/images/LOGOS/Isotipo/Glaze-blanco.png";

function CrearProducto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const [form, setForm] = useState({
    tipo_producto: "esmeralda",
    color: "",
    peso: "",
    tratamiento: "",
    valor: "",
    stock: "1",
    imagen: null,
    certificado: null,
    tiene_esmeralda: false,
    oro: false,
    oro_rosado: false,
    plata: false
  });

  const [previewImagen, setPreviewImagen] = useState(null);
  const [certificadoNombre, setCertificadoNombre] = useState("");
  const [previewCertificado, setPreviewCertificado] = useState(null);
  const [certificadoEsPdf, setCertificadoEsPdf] = useState(false);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, imagen: file }));
    setPreviewImagen(URL.createObjectURL(file));
  };

  const handleCertificadoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, certificado: file }));
    setCertificadoNombre(file.name);
    setCertificadoEsPdf(file.type === "application/pdf");
    setPreviewCertificado(URL.createObjectURL(file));
  };

  // Subida directa a Cloudinary (igual que mobile)
  const subirArchivoCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "glaze_unsigned");
    data.append("cloud_name", "kadud08u");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/kadud08u/image/upload",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.secure_url;
    } catch (error) {
      console.error("Error subiendo a Cloudinary:", error.response?.data || error.message);
      throw new Error("No se pudo subir el archivo a la nube.");
    }
  };

  const resetForm = () => {
    setForm({
      tipo_producto: "esmeralda",
      color: "",
      peso: "",
      tratamiento: "",
      valor: "",
      stock: "1",
      imagen: null,
      certificado: null,
      tiene_esmeralda: false,
      oro: false,
      oro_rosado: false,
      plata: false
    });
    setPreviewImagen(null);
    setCertificadoNombre("");
    setPreviewCertificado(null);
    setCertificadoEsPdf(false);
    setStatusMsg({ text: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: "", type: "" });

    if (!form.color || !form.peso || !form.valor || !form.imagen) {
      setStatusMsg({ text: "Los campos marcados son obligatorios.", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setStatusMsg({ text: "No estás autenticado.", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const imagenUrl = await subirArchivoCloudinary(form.imagen);

      let certificadoUrl = null;
      if (form.certificado) {
        certificadoUrl = await subirArchivoCloudinary(form.certificado);
      }

      const fechaActual = new Date().toISOString().slice(0, 19).replace("T", " ");

      const payload = {
        fecha_ingreso: fechaActual,
        tipo_producto: form.tipo_producto,
        color: form.color,
        peso: form.peso,
        tratamiento: form.tratamiento,
        valor: form.valor,
        stock: form.stock,
        imagen: imagenUrl,
        certificado: certificadoUrl,
        tiene_esmeralda: form.tiene_esmeralda ? "1" : "0",
        oro: form.oro ? "1" : "0",
        oro_rosado: form.oro_rosado ? "1" : "0",
        plata: form.plata ? "1" : "0"
      };

      const res = await API.post("/productos", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.ok || res.status === 201) {
        setStatusMsg({ text: "Activo registrado en el inventario Glaze.", type: "success" });
        setTimeout(() => resetForm(), 2000);
      }
    } catch (error) {
      console.error("Error al registrar activo:", error.response?.data || error.message);
      const mensaje = error.response?.data?.mensaje || "Error en la conexión o subida.";
      setStatusMsg({ text: mensaje, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publicar-page">
      {/* HEADER */}
      <header className="publicar-header">
        <div className="publicar-header-content">
          <div className="publicar-header-left">
            <button
              className="btn-back-publicar"
              onClick={() => navigate(-1)}
              type="button"
              aria-label="Volver"
            >
              <FiArrowLeft size={22} />
            </button>
            <div>
              <h1 className="publicar-header-title">NUEVO ACTIVO</h1>
              <p className="publicar-header-tag">CURADURÍA GLAZE</p>
            </div>
          </div>
          <img src={logoGlaze} alt="Glaze" className="publicar-logo" />
        </div>
      </header>

      <form className="publicar-content" onSubmit={handleSubmit}>
        <div className="publicar-grid">
          {/* COLUMNA IZQUIERDA: CAMPOS DE TEXTO */}
          <div className="publicar-col-izq">
            {/* SELECTOR DE CATEGORÍA */}
            <div className="publicar-section">
              <p className="section-label-publicar">NATURALEZA DEL ACTIVO</p>
              <div className="tab-row-publicar">
                <button
                  type="button"
                  className={`tab-publicar ${form.tipo_producto === "esmeralda" ? "active" : ""}`}
                  onClick={() => handleChange("tipo_producto", "esmeralda")}
                >
                  GEMA SUELTA
                </button>
                <button
                  type="button"
                  className={`tab-publicar ${form.tipo_producto === "joya" ? "active" : ""}`}
                  onClick={() => handleChange("tipo_producto", "joya")}
                >
                  JOYERÍA PIEZA
                </button>
              </div>
            </div>

            {/* ESPECIFICACIONES TÉCNICAS */}
            <div className="card-publicar">
              <p className="section-label-publicar">ESPECIFICACIONES TÉCNICAS</p>

              <div className="input-group-publicar">
                <label className="field-title-publicar">COLOR / TONALIDAD</label>
                <div className="input-box-publicar">
                  <input
                    type="text"
                    placeholder="Ej: Deep Green"
                    value={form.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                  />
                  <FiDroplet size={15} className="input-icon-publicar" />
                </div>
              </div>

              <div className="input-group-publicar">
                <label className="field-title-publicar">PESO (QUILATES)</label>
                <div className="input-box-publicar">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00 ct"
                    value={form.peso}
                    onChange={(e) => handleChange("peso", e.target.value)}
                  />
                  <FiBox size={15} className="input-icon-publicar" />
                </div>
              </div>

              <div className="input-group-publicar">
                <label className="field-title-publicar">TRATAMIENTO</label>
                <div className="input-box-publicar">
                  <input
                    type="text"
                    placeholder="Insignificante / Menor / Aceite"
                    value={form.tratamiento}
                    onChange={(e) => handleChange("tratamiento", e.target.value)}
                  />
                  <FiActivity size={15} className="input-icon-publicar" />
                </div>
              </div>

              <div className="input-group-publicar">
                <label className="field-title-publicar">VALOR COMERCIAL (USD)</label>
                <div className="input-box-publicar">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="$ 0,00"
                    value={form.valor}
                    onChange={(e) => handleChange("valor", e.target.value)}
                  />
                  <FiDollarSign size={15} className="input-icon-publicar" />
                </div>
              </div>
            </div>

            {/* DETALLES DE COMPOSICIÓN (SOLO JOYA) */}
            {form.tipo_producto === "joya" && (
              <div className="card-publicar">
                <p className="section-label-publicar">DETALLES DE COMPOSICIÓN</p>

                {[
                  { label: "Esmeralda Certificada", name: "tiene_esmeralda" },
                  { label: "Oro de 18 Kilates", name: "oro" },
                  { label: "Plata de Ley 950", name: "plata" }
                ].map((item) => (
                  <div key={item.name} className="switch-row-publicar">
                    <span className="switch-label-publicar">{item.label}</span>
                    <label className="switch-toggle-publicar">
                      <input
                        type="checkbox"
                        checked={form[item.name]}
                        onChange={(e) => handleChange(item.name, e.target.checked)}
                      />
                      <span className="switch-slider-publicar" />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: IMAGEN, CERTIFICADO Y CONFIRMAR */}
          <div className="publicar-col-der">
            <div className="card-publicar">
              <p className="section-label-publicar">DOCUMENTACIÓN VISUAL</p>

              <label className="file-btn-publicar">
                <FiCamera size={18} />
                <span>{form.imagen ? "IMAGEN CARGADA" : "ADJUNTAR FOTOGRAFÍA"}</span>
                <input type="file" accept="image/*" onChange={handleImagenChange} hidden />
              </label>

              {previewImagen && (
                <div className="preview-container-publicar">
                  <img src={previewImagen} alt="Vista previa" className="preview-image-publicar" />
                  <span className="preview-badge-publicar">PREVIEW</span>
                </div>
              )}

              <label className="file-btn-publicar" style={{ marginTop: 15 }}>
                <FiShield size={18} />
                <span>{certificadoNombre || "CERTIFICACIÓN GIA / CDTEC"}</span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleCertificadoChange}
                  hidden
                />
              </label>

              {previewCertificado && (
                <div className="preview-container-publicar">
                  {certificadoEsPdf ? (
                    <a
                      href={previewCertificado}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="preview-pdf-publicar"
                    >
                      <FiFileText size={28} />
                      <span className="preview-pdf-nombre-publicar">{certificadoNombre}</span>
                      <FiExternalLink size={14} />
                    </a>
                  ) : (
                    <img
                      src={previewCertificado}
                      alt="Vista previa del certificado"
                      className="preview-image-publicar"
                    />
                  )}
                  <span className="preview-badge-publicar">PREVIEW</span>
                </div>
              )}
            </div>

            {statusMsg.text !== "" && (
              <div className={`status-banner-publicar ${statusMsg.type === "error" ? "bg-error" : "bg-success"}`}>
                {statusMsg.type === "error" ? <FiAlertCircle size={16} /> : <FiCheck size={16} />}
                <span>{statusMsg.text.toUpperCase()}</span>
              </div>
            )}

            <button className="boton-publicar" type="submit" disabled={loading}>
              {loading ? "PROCESANDO..." : "REGISTRAR EN INVENTARIO"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CrearProducto;