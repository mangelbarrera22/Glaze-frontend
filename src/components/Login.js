// src/pages/Login.js
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import API from "../services/api";
import "./Login.css";
import logoGlaze from "../assets/images/LOGOS/Imagotipo/Glaze-verde.png";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (!usuario || !password) {
      setMensaje("Por favor rellena todos los campos");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      const res = await API.post("/auth/login", { usuario, password });
      const { token, usuario: userData } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(userData));

      if (userData.tipo_usuario === "vendedor") {
        navigate("/DashboardVendedor");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "Error de conexión con el servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      {/* HEADER CON LOGO GLAZE */}
      <div className="login-header">
            <img 
  src={logoGlaze} 
  alt="Glaze" 
  className="logo-glaze"
/>
        <p className="brand-subtitle">ESMERALDAS DE COLECCIÓN</p>
      </div>

      {/* CARD PRINCIPAL */}
      <div className="login-card">
        <h2 className="card-title">Acceso Exclusivo</h2>

        <form onSubmit={iniciarSesion}>
          {/* USUARIO */}
          <div className="input-container">
            <label className="input-label">NOMBRE DE USUARIO</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="ej. usuario.usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div className="input-container">
            <label className="input-label">CONTRASEÑA</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>

          {/* MENSAJE ERROR */}
          {mensaje && (
            <div className="error-container">
              <p className="error-text">{mensaje}</p>
            </div>
          )}

          {/* BOTÓN PRINCIPAL */}
          <button 
            type="submit" 
            className="boton-principal"
            disabled={loading}
          >
            {loading ? "CARGANDO..." : "INICIAR SESIÓN"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="register-link">
          <p className="footer-text">
            ¿No es miembro?{" "}
            <Link to="/registro" className="link-bold">
              Solicitar Registro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;