import { useEffect, useState } from "react";
import api from "../services/api";

function SubjectManager() {
  const [nome, setNome] = useState("");
  const [materias, setMaterias] = useState([]);

  const carregar = () => {
    api.get("/materias").then(res => setMaterias(res.data));
  };

  useEffect(() => {
    carregar();
  }, []);

  const criar = () => {
    api.post("/materias", { nome }).then(() => {
      setNome("");
      carregar();
    });
  };

  const deletar = (id) => {
    api.delete(`/materias/${id}`).then(() => carregar());
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5>Matérias</h5>

        <input
          className="form-control mb-2"
          placeholder="Nova matéria"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />

        <button className="btn btn-dark w-100 mb-2" onClick={criar}>
          Adicionar
        </button>

        {materias.map(m => (
          <div key={m.id} className="d-flex justify-content-between mb-1">
            <span>{m.nome}</span>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => deletar(m.id)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectManager;