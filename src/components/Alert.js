function Alert({ tipo, mensagem, onClose }) {
  if (!mensagem) return null;

  return (
    <div className={`alert alert-${tipo} alert-dismissible fade show`} role="alert">
      {mensagem}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
}

export default Alert;