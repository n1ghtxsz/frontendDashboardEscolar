import { useEffect, useState } from "react";
import api from "../services/api";

function History() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    api.get("/historico").then(res => setDados(res.data));
  }, []);

  return (
    <div className="mt-4">
      <h4>Histórico</h4>

      {dados.map(h => (
        <div key={h.id} className="card mb-1">
          <div className="card-body">
            <p>{h.acao}</p>
            <small>{new Date(h.data).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default History;