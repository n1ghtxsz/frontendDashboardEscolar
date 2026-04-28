import { useState } from "react";
import { FaBook, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function SubjectManager({ onClose, materias, onAdd, onDelete }) {
  const [nome, setNome] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onAdd(nome.trim());
    setNome("");
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
                <span className="subject-name"><FaBook /> {m.nome}</span>
                <button
                  className="subject-delete-btn"
                  onClick={() => onDelete(m.id)}
                  title="Remover matéria"
                >
                  <FaTrash />
                </button>
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