import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Protected = () => {
  const navigate = useNavigate();
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
    cargarCartas();
    generarcarta();
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
              {/* Cambia el color del palo si es ♥ o ♦ */}
              <td className={palo === "♥" || palo === "♦" ? "text-danger" : ""}>{palo}</td>
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

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Eliminar el token de sessionStorage
    sessionStorage.removeItem("token");

    // Redirigir a la página de inicio pública
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <div className="card text-center bg-white">
        {/* Símbolo arriba a la izquierda */}
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

        {/* Valor (negro para ♠ y ♣, rojo para ♥ y ♦) */}
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

        {/* Símbolo y valor abajo a la derecha con rotación 180° */}
        <div className="card-footer d-flex justify-content-end">
          <h3 style={{ transform: "rotate(180deg)" }}> {/* Rotación 180° */}
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

      {/* Botón de cierre de sesión */}
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