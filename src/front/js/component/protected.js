import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Protected = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [cartas, setCartas] = useState({
    "♥": Array(12).fill(0),
    "♦": Array(12).fill(0),
    "♠": Array(12).fill(0),
    "♣": Array(12).fill(0),
  });
  const [paloMostarArriba, setPaloMostarArriba] = useState("");
  const [paloMostarAbajo, setPaloMostarAbajo] = useState("");
  const [valor, setValor] = useState("");
  const [tablaCartas, setTablaCartas] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    

    // Guardar el token en el estado
    setToken(storedToken);

    if (storedToken) {
      cargarCartas();
      generarcarta();
    }
  }, []);

  const cargarCartas = () => {
    const cartasGuardadas = localStorage.getItem("cartas");
    if (cartasGuardadas) {
      setCartas(JSON.parse(cartasGuardadas));
    }
  };

  const guardarCartas = (newCartas) => {
    localStorage.setItem("cartas", JSON.stringify(newCartas));
  };

  const generarcarta = () => {
    let palo = ["♥", "♦", "♠", "♣"];
    let valorCarta = [
      "AS",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "King",
      "Queen",
    ];

    let indexpalo = Math.floor(Math.random() * palo.length);
    let eleccionPalo = palo[indexpalo];
    let indexvalor = Math.floor(Math.random() * valorCarta.length);
    let eleccionValor = valorCarta[indexvalor];

    setPaloMostarArriba(eleccionPalo);
    setPaloMostarAbajo(eleccionPalo);
    setValor(eleccionValor);

    let newCartas = { ...cartas };
    newCartas[eleccionPalo][indexvalor] += 1;
    setCartas(newCartas);
    guardarCartas(newCartas);
    mostrarTablaCartas(newCartas);
  };

  const mostrarTablaCartas = (cartas) => {
    const valores = [
      "AS",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "King",
      "Queen",
    ];

    const tabla = (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Palo</th>
            {valores.map((valor, index) => (
              <th key={index}>{valor}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(cartas).map((palo, index) => (
            <tr key={index}>
              <td className={palo === "♥" || palo === "♦" ? "text-danger" : ""}>
                {palo}
              </td>
              {cartas[palo].map((cantidad, i) => (
                <td key={i}>{cantidad}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );

    setTablaCartas(tabla);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  // Mostrar error 404 si el token no está presente
  if (!token) {
    return (
      <div className="container text-center mt-5">
        <h1>Error 404</h1>
        <p>Página no encontrada o acceso denegado.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate("/")}>
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card text-center bg-white">
        <div className="card-header d-flex justify-content-start">
          <h3>
            <span
              id="mostarArriba"
              className={`${
                paloMostarArriba === "♥" || paloMostarArriba === "♦" ? "text-danger" : "text-dark"
              }`}
            >
              {paloMostarArriba}
            </span>
          </h3>
        </div>
        <div className="card-body">
          <h1
            id="valor"
            className={`${
              paloMostarArriba === "♥" || paloMostarArriba === "♦" ? "text-danger" : "text-dark"
            }`}
          >
            {valor}
          </h1>
        </div>
        <div className="card-footer d-flex justify-content-end">
          <h3 style={{ transform: "rotate(180deg)" }}>
            <span
              id="mostarAbajo"
              className={`${
                paloMostarAbajo === "♥" || paloMostarAbajo === "♦" ? "text-danger" : "text-dark"
              }`}
            >
              {paloMostarAbajo}
            </span>
          </h3>
        </div>
      </div>

      <button className="btn btn-primary mt-4" onClick={generarcarta}>
        Cambiar Carta
      </button>

      <button className="btn btn-secondary mt-4" onClick={handleLogout}>
        Cerrar sesión
      </button>

      <div id="tablaCartas" className="mt-4">
        {tablaCartas}
      </div>
    </div>
  );
};

export default Protected;
