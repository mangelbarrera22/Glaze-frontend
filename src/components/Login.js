import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi"; 
import API from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await API.post("/auth/login", {
        usuario,
        password
      });

      console.log("RESPUESTA BACKEND:", res.data); // 🔍 debug

      // 🔥 DESESTRUCTURAR CORRECTO
      const { token, usuario: user } = res.data;

      // 🔐 GUARDAR TOKEN
      localStorage.setItem("token", token);

      // 🔥 GUARDAR SOLO EL USUARIO (NO TODO EL RESPONSE)
      localStorage.setItem("usuario", JSON.stringify(user));

      // 🚀 REDIRECCIÓN SEGÚN ROL
      if (user.tipo_usuario === "vendedor") {
        navigate("/DashboardVendedor");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log("ERROR LOGIN:", error);

      setMensaje(
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "Error de conexión"
      );
    }
  };

  return (
    <div className="login-screen">
      <div className="login-header">
        <img src="/diamond.png" alt="logo" className="main-logo" />
        <h1>Esmeraldas Premium</h1>
        <p>Portal de Usuarios</p>
      </div>

      <div className="login-card">
        <h2>Iniciar Sesión</h2>

        <form onSubmit={handleLogin}>
          {/* Usuario */}
          <div className="input-group">
            <FiUser className="icon-left" />
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <FiLock className="icon-left" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="icon-right toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="submit" className="btn-primary">
            INGRESAR
          </button>
        </form>

        {/* MENSAJE ERROR */}
        {mensaje && (
          <div className="error-alert">
            <FiAlertCircle />
            <span>{mensaje}</span>
          </div>
        )}

        <div className="form-footer">
          <span>¿No tienes cuenta?</span>
          <Link to="/registro">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;