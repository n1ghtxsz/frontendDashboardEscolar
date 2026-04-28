import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

function TaskForm({ onClose, onSave, editingTask, materias }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [materiaId, setMateriaId] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitulo(editingTask.titulo || "");
      setDescricao(editingTask.descricao || "");
      setData(editingTask.data_entrega || "");
      setMateriaId(editingTask.materia_id || "");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    onSave({
      titulo: titulo.trim(),
      descricao: descricao.trim() || null,
      data_entrega: data || null,
      materia_id: materiaId || null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</h2>
          <button className="modal-close" onClick={onClose}><IoClose /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                className="form-input"
                placeholder="Ex: Trabalho de Matemática"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-textarea"
                placeholder="Detalhes da tarefa..."
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data de Entrega</label>
              <input
                type="date"
                className="form-input"
                value={data}
                onChange={e => setData(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Matéria</label>
              <select
                className="form-select"
                value={materiaId}
                onChange={e => setMateriaId(e.target.value)}
              >
                <option value="">Selecione uma matéria</option>
                {materias.map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTask ? "Salvar Alterações" : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;