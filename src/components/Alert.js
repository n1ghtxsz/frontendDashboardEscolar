function Alert({ tipo, mensagem, onClose }) {
  if (!mensagem) return null;

  return (
    <div className={`toast ${tipo}`}>
      <div className="toast-icon">
        {tipo === "success" ? "✓" : "✕"}
      </div>
      <span className="toast-message">{mensagem}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}

export default Alert;