import { useState } from "react";
import { FaBook, FaTrash, FaPen, FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function SubjectManager({ onClose, materias, onAdd, onEdit, onDelete }) {
  const [nome, setNome] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editNome, setEditNome] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onAdd(nome.trim());
    setNome("");
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditNome(m.nome);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNome("");
  };

  const saveEdit = (id) => {
    if (!editNome.trim()) return;
    onEdit(id, editNome.trim());
    setEditingId(null);
    setEditNome("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Gerenciar Matérias</h2>
          <button className="modal-close" onClick={onClose}><IoClose /></button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
            <input
              className="form-input"
              placeholder="Nome da matéria"
              value={nome}
              onChange={e => setNome(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              Adicionar
            </button>
          </form>

          <div className="subject-list">
            {materias.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--text-tertiary)", padding: "20px 0", fontSize: "0.85rem" }}>
                Nenhuma matéria cadastrada
              </p>
            )}
            {materias.map(m => (
              <div key={m.id} className="subject-item">
                {editingId === m.id ? (
                  <>
                    <input
                      className="form-input"
                      value={editNome}
                      onChange={e => setEditNome(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") saveEdit(m.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                      style={{ flex: 1, marginRight: "8px" }}
                    />
                    <button
                      className="subject-edit-btn"
                      onClick={() => saveEdit(m.id)}
                      title="Salvar"
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="subject-delete-btn"
                      onClick={cancelEdit}
                      title="Cancelar"
                    >
                      <IoClose />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="subject-name"><FaBook /> {m.nome}</span>
                    <button
                      className="subject-edit-btn"
                      onClick={() => startEdit(m)}
                      title="Editar matéria"
                    >
                      <FaPen />
                    </button>
                    <button
                      className="subject-delete-btn"
                      onClick={() => onDelete(m.id)}
                      title="Remover matéria"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubjectManager;
