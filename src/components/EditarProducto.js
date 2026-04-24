import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditarProducto.css";

const BASE_URL = "http://192.168.101.60:3000/api";

function EditarProducto() {
  const { id_producto } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenNueva, setImagenNueva] = useState(null);

  const [form, setForm] = useState({
    tipo_producto: "esmeralda",
    color: "",
    peso: "",
    tratamiento: "",
    valor: "",
    stock: "",
    imagen: null,
    tiene_esmeralda: false,
    oro: false,
    oro_rosado: false,
    plata: false,
  });

  useEffect(() => {
    cargarProducto();
  }, []);

  const cargarProducto = async () => {
    try {
      setCargando(true);
      const res = await axios.get(`${BASE_URL}/productos/${id_producto}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const p = res.data;
      setForm({
        tipo_producto: p.tipo_producto || "esmeralda",
        color: p.color || "",
        peso: p.peso?.toString() || "",
        tratamiento: p.tratamiento || "",
        valor: p.valor?.toString() || "",
        stock: p.stock?.toString() || "",
        imagen: p.imagen || null,
        tiene_esmeralda: !!p.tiene_esmeralda,
        oro: !!p.oro,
        oro_rosado: !!p.oro_rosado,
        plata: !!p.plata,
      });
      if (p.imagen) {
        setImagenPreview(`http://192.168.101.60:3000/uploads/${p.imagen}`);
      }
    } catch (err) {
      alert("No se pudo cargar el producto.");
      navigate(-1);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagenNueva(file);
    setImagenPreview(URL.createObjectURL(file));
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    if (!form.color || !form.peso || !form.valor) {
      alert("Completa los campos obligatorios.");
      return;
    }
    try {
      setGuardando(true);
      const data = new FormData();
      data.append("tipo_producto", form.tipo_producto);
      data.append("color", form.color);
      data.append("peso", form.peso);
      data.append("tratamiento", form.tratamiento);
      data.append("valor", form.valor);
      data.append("stock", form.stock);
      data.append("tiene_esmeralda", form.tiene_esmeralda ? 1 : 0);
      data.append("oro", form.oro ? 1 : 0);
      data.append("oro_rosado", form.oro_rosado ? 1 : 0);
      data.append("plata", form.plata ? 1 : 0);
      if (imagenNueva) data.append("imagen", imagenNueva);

      await axios.put(`${BASE_URL}/productos/${id_producto}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Pieza actualizada correctamente 💎");
      navigate("/mi-catalogo");
    } catch (err) {
      alert(err.response?.data?.mensaje || "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return (
    <div className="editar-loading">
      <div className="spinner" />
      <p>Cargando pieza...</p>
    </div>
  );

  return (
    <div className="editar-page">

      {/* HEADER */}
      <div className="editar-header">
        <button onClick={() => navigate(-1)} className="btn-volver">← Volver</button>
        <div>
          <h1>Editar Pieza</h1>
          <p className="editar-tag">GZ-{String(id_producto).padStart(4, "0")} • GLAZE</p>
        </div>
      </div>

      <form onSubmit={guardarCambios} className="editar-form">

        {/* TIPO */}
        <div className="editar-card">
          <p className="card-section">TIPO DE PRODUCTO</p>
          <div className="tipo-row">
            {["esmeralda", "joya"].map((tipo) => (
              <button
                key={tipo}
                type="button"
                className={`tipo-btn ${form.tipo_producto === tipo ? "tipo-btn-active" : ""}`}
                onClick={() => setForm((prev) => ({ ...prev, tipo_producto: tipo }))}
              >
                {tipo === "esmeralda" ? "💎 Esmeralda" : "💍 Joya"}
              </button>
            ))}
          </div>
        </div>

        {/* DETALLES */}
        <div className="editar-card">
          <p className="card-section">DETALLES DE LA PIEZA</p>

          <div className="input-grid">
            <div className="input-group">
              <label className="label-min">COLOR</label>
              <input name="color" value={form.color} onChange={handleChange} placeholder="Ej: Verde oscuro" />
            </div>
            <div className="input-group">
              <label className="label-min">PESO (ct)</label>
              <input name="peso" value={form.peso} onChange={handleChange} placeholder="Ej: 2.5" type="number" />
            </div>
            <div className="input-group">
              <label className="label-min">TRATAMIENTO</label>
              <input name="tratamiento" value={form.tratamiento} onChange={handleChange} placeholder="Ej: Menor" />
            </div>
            <div className="input-group">
              <label className="label-min">VALOR ($)</label>
              <input name="valor" value={form.valor} onChange={handleChange} placeholder="Ej: 500000" type="number" />
            </div>
            <div className="input-group">
              <label className="label-min">STOCK</label>
              <input name="stock" value={form.stock} onChange={handleChange} placeholder="Ej: 1" type="number" />
            </div>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="editar-card">
          <p className="card-section">FOTOGRAFÍA</p>

          {imagenPreview && (
            <div className="imagen-preview-wrapper">
              <span className="label-min">{imagenNueva ? "NUEVA IMAGEN" : "IMAGEN ACTUAL"}</span>
              <img src={imagenPreview} alt="preview" className="imagen-preview" />
            </div>
          )}

          <label className="btn-imagen">
            📷 {imagenNueva ? "Cambiar imagen" : "Reemplazar imagen"}
            <input type="file" accept="image/*" onChange={handleImagen} style={{ display: "none" }} />
          </label>
        </div>

        {/* JOYA */}
        {form.tipo_producto === "joya" && (
          <div className="editar-card">
            <p className="card-section">MATERIALES DE LA JOYA</p>
            {[
              { name: "tiene_esmeralda", label: "Tiene esmeralda" },
              { name: "oro",             label: "Oro" },
              { name: "oro_rosado",      label: "Oro rosado" },
              { name: "plata",           label: "Plata" },
            ].map(({ name, label }) => (
              <label key={name} className="check-row">
                <span>{label}</span>
                <input
                  type="checkbox"
                  name={name}
                  checked={form[name]}
                  onChange={handleChange}
                  className="check-input"
                />
              </label>
            ))}
          </div>
        )}

        {/* BOTÓN */}
        <button type="submit" className="btn-guardar" disabled={guardando}>
          {guardando ? "Guardando..." : "GUARDAR CAMBIOS"}
        </button>

      </form>
    </div>
  );
}

export default EditarProducto;