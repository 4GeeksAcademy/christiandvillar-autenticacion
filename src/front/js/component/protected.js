/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/card.css"; // Asegúrate de que esta ruta sea correcta

const Protected = () => {
  const navigate = useNavigate(); // Inicializar useNavigate
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
              <td>{palo}</td>
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

  const handleHomeClick = () => {
    navigate("/"); // Cambiar "/" por la ruta de tu página de inicio si es diferente
  };

  return (
    <div className="protected container mt-4"> {/* Añadido 'protected' como clase */}
      <div className="card text-center">
        <div className="card-header">
          <h3>
            <span
              id="mostarArriba"
              className={paloMostarArriba === "♥" || paloMostarArriba === "♦" ? "text-danger" : ""}
            >
              {paloMostarArriba}
            </span>
          </h3>
        </div>
        <div className="card-body">
          <h1
            id="valor"
            className={paloMostarArriba === "♥" || paloMostarArriba === "♦" ? "text-danger" : ""}
          >
            {valor}
          </h1>
        </div>
        <div className="card-footer">
          <h3>
            <span
              id="mostarAbajo"
              className={paloMostarAbajo === "♥" || paloMostarAbajo === "♦" ? "text-danger" : ""}
              style={{ transform: "rotate(180deg)", display: "inline-block" }}
            >
              {paloMostarAbajo}
            </span>
          </h3>
        </div>
      </div>
      <button className="btn btn-primary mt-4" onClick={generarcarta}>
        Cambiar Carta
      </button>
      <button className="btn btn-secondary mt-4" onClick={handleHomeClick}>
        Volver a Inicio
      </button>
  
      <div id="tablaCartas" className="mt-4">
        {tablaCartas}
      </div>
    </div>
  );
  
};

export default Protected;