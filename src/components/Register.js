// src/pages/Register.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiLock } from "react-icons/fi";
import API from "../services/api";
import "./Register.css";
import logoGlaze from "../assets/images/LOGOS/Imagotipo/Glaze-blanco.png";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo: "",
    celular: "",
    tipo_usuario: "comprador",
    password: "",
    confirmarPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmarPassword) {
      setError(true);
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setMensaje("");
    setError(false);

    try {
      const res = await API.post("/auth/register", form);
      setError(false);
      setMensaje(`${res.data.mensaje} | Usuario: ${res.data.usuario}`);
      
      // Opcional: redirigir al login después de 10 segundos
      setTimeout(() => navigate("/login"), 10000);
    } catch (err) {
      setError(true);
      setMensaje(err.response?.data?.mensaje || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-screen">
      {/* HEADER CON LOGO GLAZE */}
      <div className="register-header">
       
            <img 
  src={logoGlaze} 
  alt="Glaze" 
  className="logo-glaze"
/>  
        <p className="brand-subtitle-register">CREAR CUENTA EXCLUSIVA</p>
      </div>

      {/* CARD PRINCIPAL */}
      <div className="register-card">
        <h2 className="card-title-register">Registro de Miembro</h2>

        <form onSubmit={handleRegister}>
          {/* FILA: NOMBRES */}
          <div className="form-row">
            <div className="input-container-register half">
              <label className="input-label-register">1ER NOMBRE</label>
              <div className="input-wrapper-register">
                <input
                  type="text"
                  name="primer_nombre"
                  placeholder="Ej. Juan"
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="input-container-register half">
              <label className="input-label-register">2DO NOMBRE</label>
              <div className="input-wrapper-register">
                <input
                  type="text"
                  name="segundo_nombre"
                  placeholder="Ej. Pablo"
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* FILA: APELLIDOS */}
          <div className="form-row">
            <div className="input-container-register half">
              <label className="input-label-register">1ER APELLIDO</label>
              <div className="input-wrapper-register">
                <input
                  type="text"
                  name="primer_apellido"
                  placeholder="Ej. Perez"
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="input-container-register half">
              <label className="input-label-register">2DO APELLIDO</label>
              <div className="input-wrapper-register">
                <input
                  type="text"
                  name="segundo_apellido"
                  placeholder="Ej. Rodriguez"
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* CORREO */}
          <div className="input-container-register">
            <label className="input-label-register">CORREO ELECTRÓNICO</label>
            <div className="input-wrapper-register">
              <FiMail className="input-icon-register" />
              <input
                type="email"
                name="correo"
                placeholder="email@ejemplo.com"
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* FILA: CELULAR Y TIPO */}
          <div className="form-row">
            <div className="input-container-register half-plus">
              <label className="input-label-register">CELULAR</label>
              <div className="input-wrapper-register">
                <FiPhone className="input-icon-register" />
                <input
                  type="tel"
                  name="celular"
                  placeholder="300..."
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className="input-container-register half-minus">
              <label className="input-label-register">PERFIL</label>
              <div className="input-wrapper-register">
                <select
                  name="tipo_usuario"
                  value={form.tipo_usuario}
                  onChange={handleChange}
                  disabled={loading}
                  className="select-perfil"
                >
                  <option value="comprador">Comprador</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </div>
            </div>
          </div>

          {/* CONTRASEÑAS */}
          <div className="input-container-register">
            <label className="input-label-register">CONTRASEÑA</label>
            <div className="input-wrapper-register">
              <FiLock className="input-icon-register" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="input-container-register">
            <label className="input-label-register">CONFIRMAR CONTRASEÑA</label>
            <div className="input-wrapper-register">
              <FiLock className="input-icon-register" />
              <input
                type="password"
                name="confirmarPassword"
                placeholder="••••••••"
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* MENSAJE ERROR/ÉXITO */}
          {mensaje && (
            <div className={error ? "status-box-register error-box" : "status-box-register success-box"}>
              <p className={error ? "error-text-register" : "success-text-register"}>
                {mensaje}
              </p>
            </div>
          )}

          {/* BOTÓN PRINCIPAL */}
          <button 
            type="submit" 
            className="boton-principal-register"
            disabled={loading}
          >
            {loading ? "PROCESANDO..." : "REGISTRARSE"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="footer-link-register">
          <p className="footer-text-register">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="link-bold-register">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;