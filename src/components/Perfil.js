import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Perfil.css";

function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: ""
  });

  // Estado para el manejo de contraseñas
  const [passwords, setPasswords] = useState({
    actual: "",
    nueva: "",
    confirmar: ""
  });

  const user = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      const res = await API.get(`/usuario/${user.id_usuario}`);
      setUsuario(res.data);
      setForm({
        nombre: res.data.nombre,
        correo: res.data.correo,
        telefono: res.data.telefono,
        direccion: res.data.direccion
      });
    } catch (error) {
      console.log(error);
    }
  };

  const actualizarDatos = async () => {
    try {
      await API.put(`/usuario/${user.id_usuario}`, form);
      alert("Perfil actualizado con éxito ✅");
    } catch (error) {
      console.log(error);
    }
  };

  const cambiarPassword = async () => {
    if (passwords.nueva !== passwords.confirmar) {
      alert("La nueva contraseña y la confirmación no coinciden ❌");
      return;
    }

    try {
      // Enviamos la actual para validar en backend y la nueva para actualizar
      await API.put(`/usuario/password/${user.id_usuario}`, {
        passwordActual: passwords.actual,
        nuevaPassword: passwords.nueva
      });

      alert("Contraseña actualizada con éxito 🔐");
      setPasswords({ actual: "", nueva: "", confirmar: "" });
    } catch (error) {
      alert("Error: La contraseña actual es incorrecta o hubo un problema en el servidor.");
      console.log(error);
    }
  };

  if (!usuario) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Preparando su perfil exclusivo...</p>
    </div>
  );

  return (
    <div className="perfil-page">
      <button onClick={() => navigate(-1)} className="btn-volver-premium">
        <span className="arrow">←</span> Regresar
      </button>

      <div className="perfil-header">
        <h1>Gestión de Perfil</h1>
        <p className="subtitulo-premium">Administre su información y seguridad</p>
      </div>

      <div className="perfil-grid">
        {/* SECCIÓN DE DATOS PERSONALES */}
        <section className="perfil-section">
          <div className="section-header">
            <span className="section-icon">👤</span>
            <h3>Información Personal</h3>
          </div>
          
          <div className="input-group">
            <label className="label-min">NOMBRE COMPLETO</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej. Lulo Barrera"
            />
          </div>

          <div className="input-group">
            <label className="label-min">CORREO ELECTRÓNICO</label>
            <input
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label className="label-min">TELÉFONO</label>
              <input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="+00 000 000"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="label-min">DIRECCIÓN DE RESIDENCIA</label>
            <input
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              placeholder="Calle, Ciudad, País"
            />
          </div>

          <button className="btn-principal-premium" onClick={actualizarDatos}>
            Actualizar Información
          </button>
        </section>

        {/* SECCIÓN DE SEGURIDAD */}
        <section className="perfil-section">
          <div className="section-header">
            <span className="section-icon">🔐</span>
            <h3>Seguridad y Privacidad</h3>
          </div>

          <div className="input-group">
            <label className="label-min">CONTRASEÑA ACTUAL</label>
            <input
              type="password"
              value={passwords.actual}
              onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="divider-premium" />

          <div className="input-group">
            <label className="label-min">NUEVA CONTRASEÑA</label>
            <input
              type="password"
              value={passwords.nueva}
              onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="input-group">
            <label className="label-min">CONFIRMAR NUEVA CONTRASEÑA</label>
            <input
              type="password"
              value={passwords.confirmar}
              onChange={(e) => setPasswords({ ...passwords, confirmar: e.target.value })}
              placeholder="Repita su nueva contraseña"
            />
          </div>

          <button className="btn-secundario-premium" onClick={cambiarPassword}>
            Cambiar Contraseña
          </button>
        </section>
      </div>
    </div>
  );
}

export default Perfil;