import { useState, useEffect } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Alert from "../components/Alert";
import SubjectManager from "../components/SubjectManager";
import History from "../components/History";
import '../styles/Alert.css'

function Dashboard() {
  const [alerta, setAlerta] = useState({
    tipo: "",
    mensagem: ""
  });

  useEffect(() => {
    if (alerta.mensagem) {
      const timer = setTimeout(() => {
        setAlerta({ tipo: "", mensagem: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alerta]);

  return (
    <div className="container mt-4">
      <Alert
        tipo={alerta.tipo}
        mensagem={alerta.mensagem}
        onClose={() => setAlerta({ tipo: "", mensagem: "" })}
      />

      <h1 className="mb-4 text-center fw-bold">📚 School Dashboard</h1>

      <div className="row">
        <div className="col-md-4">
          <TaskForm setAlerta={setAlerta} />
          <SubjectManager setAlerta={setAlerta} />
        </div>

        <div className="col-md-8">
          <TaskList setAlerta={setAlerta} />
          <History setAlerta={setAlerta} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;