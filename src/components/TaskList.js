import { useEffect, useState } from "react";
import api from "../services/api";

function TaskList() {
  const [tarefas, setTarefas] = useState([]);
  const [editando, setEditando] = useState(null);
  const formatarData = (data) => {
    if (!data) return "Sem data";

    const [ano, mes, dia] = data.split("-");

    return `${dia}/${mes}/${ano}`;
  };

  const carregar = () => {
    api.get("/tarefas").then(res => setTarefas(res.data));
  };

  useEffect(() => {
    carregar();
  }, []);

  const toggle = (t) => {
    api.put(`/tarefas/${t.id}`, {
      concluida: !t.concluida
    }).then(() => carregar());
  };

  return (
    <div>
      <h4>Tarefas</h4>

      {tarefas.map(t => (
        <div className="card mb-2" key={t.id}>
          <div className="card-body">
            <h5>{t.titulo}</h5>
            <p>{t.descricao}</p>
            <p>{t.materias?.nome}</p>
            <p>Entrega: {formatarData(t.data_entrega)}</p>

            <button
              className={`btn ${t.concluida ? "btn-success" : "btn-warning"}`}
              onClick={() => toggle(t)}
            >
              {t.concluida ? "Concluída" : "Pendente"}
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={() => {
                api.delete(`/tarefas/${t.id}`)
                  .then(() => carregar());
              }}
            >
              Excluir
            </button>
            <button
              className="btn btn-primary ms-2"
              onClick={() => setEditando(t)}
            >
              Editar
            </button>
            {editando && (
              <div className="card mt-3">
                <div className="card-body">
                  <h5>Editando tarefa</h5>

                  <input
                    className="form-control mb-2"
                    value={editando.titulo}
                    onChange={e =>
                      setEditando({ ...editando, titulo: e.target.value })
                    }
                  />

                  <textarea
                    className="form-control mb-2"
                    value={editando.descricao || ""}
                    onChange={e =>
                      setEditando({ ...editando, descricao: e.target.value })
                    }
                  />

                  <input
                    type="date"
                    className="form-control mb-2"
                    value={editando.data_entrega || ""}
                    onChange={e =>
                      setEditando({ ...editando, data_entrega: e.target.value })
                    }
                  />

                  <button
                    className="btn btn-success me-2"
                    onClick={() => {
                      api.put(`/tarefas/${editando.id}/editar`, editando)
                        .then(() => {
                          setEditando(null);
                          carregar();
                        });
                    }}
                  >
                    Salvar
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditando(null)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

  );

}

export default TaskList;