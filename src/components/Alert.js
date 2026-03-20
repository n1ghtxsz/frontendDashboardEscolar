function Alert({ tipo, mensagem, onClose }) {
  if (!mensagem) return null;

  return (
    <div
      className={`alert alert-${tipo} alert-dismissible fade show position-fixed`}
      style={{
        bottom: "20px",
        left: "20px",
        zIndex: 9999,
        maxWidth: "350px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}
      role="alert"
    >
      {mensagem}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
}

export default Alert;