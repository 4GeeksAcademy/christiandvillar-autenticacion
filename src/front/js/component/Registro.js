import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Registro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL = process.env.BACKEND_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
  
    console.log("Registrando con", email, password);
    console.log("Backend URL:", BACKEND_URL);
  
    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
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
        throw new Error(data.msg || "Error en el registro");
      }
  
      alert("Registro exitoso. Por favor, inicia sesión.");
    } catch (err) {
      console.error("Error al registrarse", err);
      setError(err.message);
    }
  };

  return (
    <div className="text-center mt-5">
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleRegister}>
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
          Registrarse
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};
