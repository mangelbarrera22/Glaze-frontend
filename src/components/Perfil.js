import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Perfil.css";

function Perfil() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    direccion: ""
  });

  const [passwords, setPasswords] = useState({
    actual: "",
    nueva: "",
    confirmar: ""
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (!user?.id_usuario) return;

    const cargarUsuario = async () => {
      try {
        const res = await API.get(`/usuarios/${user.id_usuario}`);
        setForm({
          nombre: res.data.nombre_completo || "",
          correo: res.data.correo || "",
          telefono: res.data.celular || "",
          direccion: res.data.direccion || ""
        });
      } catch (error) {
        console.error("Error cargando usuario:", error);
        alert("Error al cargar datos del usuario.");
      }
    };
    cargarUsuario();
  }, [user]);

  const actualizarDatos = async () => {
    if (!user?.id_usuario) return;

    if (!form.correo.trim() || !form.telefono.trim()) {
      alert("Correo y teléfono son obligatorios.");
      return;
    }

    try {
      await API.put(`/usuario/${user.id_usuario}`, {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
        direccion: form.direccion.trim()
      });

      alert("Perfil actualizado con éxito ✅");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Hubo un error al actualizar el perfil.");
    }
  };

  const cambiarPassword = async () => {
    if (!passwords.actual || !passwords.nueva) {
      alert("Debe ingresar la contraseña actual y la nueva.");
      return;
    }
    if (passwords.nueva !== passwords.confirmar) {
      alert("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    if (!user?.id_usuario) {
      alert("Usuario no válido.");
      return;
    }

    try {
      await API.put(`/usuarios/password/${user.id_usuario}`, {
        passwordActual: passwords.actual,
        nuevaPassword: passwords.nueva
      });

      alert("Contraseña actualizada con éxito");
      setPasswords({ actual: "", nueva: "", confirmar: "" });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error.response ?? error);
      const message = error.response?.data?.error || "Error al actualizar la contraseña.";
      alert(message);
    }
  };

  if (!user || !form) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Preparando su perfil exclusivo...</p>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <button onClick={() => navigate(-1)} className="btn-volver-premium" type="button">
        <span className="arrow">←</span> Regresar
      </button>

      <div className="perfil-header">
        <h1>Gestión de Perfil</h1>
        <p className="subtitulo-premium">Administre su información y seguridad</p>
      </div>

      <div className="perfil-grid">
        <section className="perfil-section">
          <div className="section-header">
            <span className="section-icon" role="img" aria-label="persona">👤</span>
            <h3>Información Personal</h3>
          </div>

          <div className="input-group">
            <label className="label-min" htmlFor="nombre">NOMBRE COMPLETO</label>
            <input
              id="nombre"
              type="text"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej. Lulo Barrera"
            />
          </div>

          <div className="input-group">
            <label className="label-min" htmlFor="correo">CORREO ELECTRÓNICO</label>
            <input
              id="correo"
              type="email"
              value={form.correo}
              onChange={e => setForm({ ...form, correo: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="input-group">
            <label className="label-min" htmlFor="telefono">TELÉFONO</label>
            <input
              id="telefono"
              type="tel"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              placeholder="+00 000 000"
            />
          </div>

          <div className="input-group">
            <label className="label-min" htmlFor="direccion">DIRECCIÓN DE RESIDENCIA</label>
            <input
              id="direccion"
              type="text"
              value={form.direccion}
              onChange={e => setForm({ ...form, direccion: e.target.value })}
              placeholder="Calle, Ciudad, País"
            />
          </div>

          <button className="btn-principal-premium" onClick={actualizarDatos} type="button">
            Actualizar Información
          </button>
        </section>

        <section className="perfil-section">
          <div className="section-header">
            <span className="section-icon" role="img" aria-label="candado">🔐</span>
            <h3>Seguridad y Privacidad</h3>
          </div>

          <div className="input-group">
            <label className="label-min" htmlFor="password-actual">CONTRASEÑA ACTUAL</label>
            <input
              id="password-actual"
              type="password"
              value={passwords.actual}
              onChange={e => setPasswords({ ...passwords, actual: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="divider-premium" />

          <div className="input-group">
            <label className="label-min" htmlFor="password-nueva">NUEVA CONTRASEÑA</label>
            <input
              id="password-nueva"
              type="password"
              value={passwords.nueva}
              onChange={e => setPasswords({ ...passwords, nueva: e.target.value })}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="input-group">
            <label className="label-min" htmlFor="password-confirmar">CONFIRMAR NUEVA CONTRASEÑA</label>
            <input
              id="password-confirmar"
              type="password"
              value={passwords.confirmar}
              onChange={e => setPasswords({ ...passwords, confirmar: e.target.value })}
              placeholder="Repita su nueva contraseña"
            />
          </div>

          <button className="btn-secundario-premium" onClick={cambiarPassword} type="button">
            Cambiar Contraseña
          </button>
        </section>
      </div>
    </div>
  );
}

export default Perfil;
