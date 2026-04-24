import { useState } from "react";
import axios from "axios";

function CrearProducto() {

  const [form, setForm] = useState({
    tipo_producto: "esmeralda",
    color: "",
    peso: "",
    tratamiento: "",
    valor: "",
    stock: "",
    imagen: null,
    certificado: null,

    // joya
    tiene_esmeralda: false,
    oro: false,
    oro_rosado: false,
    plata: false
  });

  // =========================
  // MANEJO DE INPUTS
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // =========================
  // ENVIAR FORMULARIO
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // 🔴 VALIDACIÓN CLAVE
    if (!token) {
      alert("No estás autenticado ❌");
      return;
    }

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] === null) return; // evita null en archivos

      if (typeof form[key] === "boolean") {
        data.append(key, form[key] ? 1 : 0);
      } else {
        data.append(key, form[key]);
      }
    });

    try {

      console.log("TOKEN ENVIADO:", token); // 🔍 DEBUG

      const res = await axios.post(
        "http://localhost:3000/api/productos",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 CLAVE
          },
        }
      );

      console.log("RESPUESTA:", res.data);

      alert("Producto creado 🔥");

      // 🔄 limpiar formulario
      setForm({
        tipo_producto: "esmeralda",
        color: "",
        peso: "",
        tratamiento: "",
        valor: "",
        stock: "",
        imagen: null,
        certificado: null,
        tiene_esmeralda: false,
        oro: false,
        oro_rosado: false,
        plata: false
      });

    } catch (error) {
      console.log("ERROR COMPLETO:", error);

      if (error.response) {
        console.log("ERROR BACKEND:", error.response.data);
        alert(error.response.data.mensaje || "Error del servidor");
      } else {
        alert("Error de conexión");
      }
    }
  };

  return (
    <div>
      <h2>Publicar nueva esmeralda</h2>

      <form onSubmit={handleSubmit}>

        {/* TIPO */}
        <select name="tipo_producto" value={form.tipo_producto} onChange={handleChange}>
          <option value="esmeralda">Esmeralda</option>
          <option value="joya">Joya</option>
        </select>

        {/* DATOS */}
        <input name="color" placeholder="Color" value={form.color} onChange={handleChange} />
        <input name="peso" placeholder="Peso" value={form.peso} onChange={handleChange} />
        <input name="tratamiento" placeholder="Tratamiento" value={form.tratamiento} onChange={handleChange} />
        <input name="valor" placeholder="Valor" type="number" value={form.valor} onChange={handleChange} />
        <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />

        {/* ARCHIVOS */}
        <label>Imagen:</label>
        <input type="file" name="imagen" onChange={handleChange} />

        <label>Certificado:</label>
        <input type="file" name="certificado" onChange={handleChange} />

        {/* 💍 JOYA */}
        {form.tipo_producto === "joya" && (
          <>
            <h3>Datos de la joya</h3>

            <label>
              <input type="checkbox" name="tiene_esmeralda" checked={form.tiene_esmeralda} onChange={handleChange} />
              Tiene esmeralda
            </label>

            <label>
              <input type="checkbox" name="oro" checked={form.oro} onChange={handleChange} />
              Oro
            </label>

            <label>
              <input type="checkbox" name="oro_rosado" checked={form.oro_rosado} onChange={handleChange} />
              Oro rosado
            </label>

            <label>
              <input type="checkbox" name="plata" checked={form.plata} onChange={handleChange} />
              Plata
            </label>
          </>
        )}

        <button type="submit">Publicar</button>
      </form>
    </div>
  );
}

export default CrearProducto;