import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiAlertCircle, FiCheckCircle, FiUsers } from "react-icons/fi";
import API from "../services/api";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo: "",
    celular: "",
    password: "",
    confirmarPassword: "", // Campo nuevo
    tipo_usuario: "comprador" // Campo nuevo con valor por defecto
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError(false);

    // Validación de contraseñas iguales
    if (form.password !== form.confirmarPassword) {
      setError(true);
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await API.post("/register", form);
      setMensaje(`${res.data.mensaje} | Usuario: ${res.data.usuario}`);
      setError(false);
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || "Error al registrar usuario");
      setError(true);
    }
  };

  return (
    <div className="register-screen">
      <div className="register-card fade-in">
        <div className="register-header">
          <img src="/diamond.png" alt="logo" className="small-logo" />
          <h2>Crear Cuenta</h2>
          <p>Únete a Esmeraldas Premium</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-grid">
            <div className="input-group">
              <FiUser className="input-icon" />
              <input name="primer_nombre" placeholder="Primer nombre" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <FiUser className="input-icon" />
              <input name="segundo_nombre" placeholder="Segundo nombre" onChange={handleChange} />
            </div>
            <div className="input-group">
              <FiUser className="input-icon" />
              <input name="primer_apellido" placeholder="Primer apellido" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <FiUser className="input-icon" />
              <input name="segundo_apellido" placeholder="Segundo apellido" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <FiMail className="input-icon" />
            <input type="email" name="correo" placeholder="Correo electrónico" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FiPhone className="input-icon" />
            <input name="celular" placeholder="Celular" onChange={handleChange} required />
          </div>

          {/* Selector de Tipo de Usuario */}
          <div className="input-group">
            <FiUsers className="input-icon" />
            <select name="tipo_usuario" className="select-input" onChange={handleChange} value={form.tipo_usuario}>
              <option value="comprador">Comprador</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <FiLock className="input-icon" />
            <input type="password" name="confirmarPassword" placeholder="Confirmar contraseña" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-register">REGISTRARSE</button>
        </form>

        {mensaje && (
          <div className={error ? "status-box error-shake" : "status-box success-pop"}>
            {error ? <FiAlertCircle /> : <FiCheckCircle />}
            <span>{mensaje}</span>
          </div>
        )}

        <div className="register-footer">
          <span>¿Ya tienes cuenta?</span>
          <Link to="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;