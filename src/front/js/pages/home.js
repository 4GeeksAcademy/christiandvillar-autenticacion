import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Cambiamos useHistory por useNavigate para redirigir
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
  const { store } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false); // Estado para alternar entre registro e inicio de sesión
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.BACKEND_URL;

  // Función para manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar el error antes de la solicitud

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Error en las credenciales");
      }

      localStorage.setItem("token", data.access_token);
      navigate("/protected"); // Redirigir al área protegida
    } catch (err) {
      setError(err.message);
      console.error("Error al iniciar sesión", err);
    }
  };

  // Función para manejar el registro de usuarios
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);  // Limpiar el error antes de la solicitud

    try {
        const response = await fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,    // Utiliza el estado email
                password: password,  // Utiliza el estado password
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || "Error en el registro");
        }

        alert("Registro exitoso. Por favor, inicia sesión.");
        setIsRegister(false);  // Volver al formulario de inicio de sesión después de registrarse
    } catch (err) {
        setError(err.message);
        console.error("Error al registrarse", err);
    }
  };

  return (
    <div className="text-center mt-5">
      <h1>{isRegister ? "Registro" : "Iniciar Sesión"}</h1>

      <form onSubmit={isRegister ? handleRegister : handleLogin}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isRegister ? "Registrarse" : "Iniciar Sesión"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <p className="mt-3">
        {isRegister ? (
          <>
            ¿Ya tienes una cuenta?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setIsRegister(false)}
            >
              Inicia sesión aquí
            </span>
          </>
        ) : (
          <>
            ¿No tienes cuenta?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => setIsRegister(true)}
            >
              Regístrate aquí
            </span>
          </>
        )}
      </p>

      <div className="alert alert-info mt-3">
        {store.message || "Esperando mensaje del backend..."}
      </div>
    </div>
  );
};
