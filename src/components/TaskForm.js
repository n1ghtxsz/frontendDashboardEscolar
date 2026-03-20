import { useEffect, useState } from "react";
import api from "../services/api";

function TaskForm({ setAlerta }) {
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [materias, setMaterias] = useState([]);
  const [materiaId, setMateriaId] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    api.get("/materias").then(res => setMaterias(res.data));
  }, []);

  const criar = () => {
    if (!titulo) {
      setAlerta({
        tipo: "danger",
        mensagem: "Título é obrigatório"
      });
      return;
    }

    api.post("/tarefas", {
      titulo,
      descricao,
      data_entrega: data,
      materia_id: materiaId
    })
      .then(() => {
        setAlerta({
          tipo: "success",
          mensagem: "Tarefa criada com sucesso!"
        });

        setTitulo("");
        setDescricao("");
        setData("");
        setMateriaId("");
      })
      .catch(() => {
        setAlerta({
          tipo: "danger",
          mensagem: "Erro ao criar tarefa"
        });
      });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5>Nova Tarefa</h5>

        <input
          className="form-control mb-2"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />

        <input
          type="date"
          className="form-control mb-2"
          value={data}
          onChange={e => setData(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
        />

        <select
          className="form-control mb-2"
          value={materiaId}
          onChange={e => setMateriaId(e.target.value)}
        >
          <option value="">Selecione matéria</option>
          {materias.map(m => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>

        <button className="btn btn-primary w-100" onClick={criar}>
          Adicionar
        </button>
      </div>
    </div>
  );
}

export default TaskForm;