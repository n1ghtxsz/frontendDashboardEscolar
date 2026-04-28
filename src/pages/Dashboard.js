import { useState, useEffect, useCallback } from "react";
import { FaCalendar, FaList, FaSearch, FaBook, FaHourglassEnd, FaCheckSquare } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Alert from "../components/Alert";
import SubjectManager from "../components/SubjectManager";
import History from "../components/History";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard() {
  const [tarefas, setTarefas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [activeTab, setActiveTab] = useState("tarefas");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMateria, setFilterMateria] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerta, setAlerta] = useState({ tipo: "", mensagem: "" });

  const carregarTarefas = useCallback(() => {
    api.get("/tarefas").then(res => setTarefas(res.data || []));
  }, []);

  const carregarMaterias = useCallback(() => {
    api.get("/materias").then(res => setMaterias(res.data || []));
  }, []);

  useEffect(() => {
    carregarTarefas();
    carregarMaterias();
  }, [carregarTarefas, carregarMaterias]);

  useEffect(() => {
    if (alerta.mensagem) {
      const timer = setTimeout(() => setAlerta({ tipo: "", mensagem: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  // Stats
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const stats = {
    total: tarefas.length,
    pendentes: tarefas.filter(t => !t.concluida).length,
    concluidas: tarefas.filter(t => t.concluida).length,
    atrasadas: tarefas.filter(t =>
      !t.concluida && t.data_entrega && new Date(t.data_entrega + "T00:00:00") < hoje
    ).length,
  };

  // Filtering
  const filteredTarefas = tarefas.filter(t => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!t.titulo.toLowerCase().includes(q) && !(t.descricao || "").toLowerCase().includes(q)) return false;
    }
    if (filterStatus === "pendente" && t.concluida) return false;
    if (filterStatus === "concluida" && !t.concluida) return false;
    if (filterStatus === "atrasada") {
      if (t.concluida || !t.data_entrega || new Date(t.data_entrega + "T00:00:00") >= hoje) return false;
    }
    if (filterMateria && String(t.materia_id) !== filterMateria) return false;
    return true;
  });

  // Handlers
  const handleToggle = (task) => {
    api.put(`/tarefas/${task.id}`, { concluida: !task.concluida })
      .then(() => {
        carregarTarefas();
        setAlerta({ tipo: "success", mensagem: task.concluida ? "Tarefa reaberta!" : "Tarefa concluída! ✓" });
      })
      .catch(() => setAlerta({ tipo: "danger", mensagem: "Erro ao atualizar status" }));
  };

  const handleDelete = (id) => {
    api.delete(`/tarefas/${id}`)
      .then(() => {
        carregarTarefas();
        setAlerta({ tipo: "success", mensagem: "Tarefa excluída!" });
      })
      .catch(() => setAlerta({ tipo: "danger", mensagem: "Erro ao excluir tarefa" }));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleSaveTask = (taskData) => {
    const request = editingTask
      ? api.put(`/tarefas/${editingTask.id}/editar`, taskData)
      : api.post("/tarefas", taskData);

    request
      .then(() => {
        carregarTarefas();
        setAlerta({ tipo: "success", mensagem: editingTask ? "Tarefa atualizada!" : "Tarefa criada!" });
        setShowTaskForm(false);
        setEditingTask(null);
      })
      .catch(() => setAlerta({ tipo: "danger", mensagem: "Erro ao salvar tarefa" }));
  };

  const handleAddMateria = (nome) => {
    api.post("/materias", { nome })
      .then(() => {
        carregarMaterias();
        setAlerta({ tipo: "success", mensagem: "Matéria adicionada!" });
      })
      .catch(() => setAlerta({ tipo: "danger", mensagem: "Erro ao adicionar matéria" }));
  };

  const handleDeleteMateria = (id) => {
    api.delete(`/materias/${id}`)
      .then(() => {
        carregarMaterias();
        setAlerta({ tipo: "success", mensagem: "Matéria removida!" });
      })
      .catch(() => setAlerta({ tipo: "danger", mensagem: "Erro ao remover matéria" }));
  };

  const formatarData = (data) => {
    if (!data) return "Sem data";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const closeSidebar = () => setSidebarOpen(false);

  const pageTitle = activeTab === "tarefas" ? "Minhas Tarefas" : "Histórico por Bimestre";

  return (
    <div className="dashboard">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><MdSpaceDashboard /></div>
          <div className="sidebar-logo-text">
            UpsideTask
            <span>Escolar</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${activeTab === "tarefas" ? "active" : ""}`}
            onClick={() => { setActiveTab("tarefas"); closeSidebar(); }}
          >
            <span className="nav-icon"><FaList /></span>
            Tarefas
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === "historico" ? "active" : ""}`}
            onClick={() => { setActiveTab("historico"); closeSidebar(); }}
          >
            <span className="nav-icon"><FaCalendar /></span>
            Histórico por Bimestre
          </button>
        </nav>

        <div className="sidebar-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
              closeSidebar();
            }}
          >
            <IoAddCircle /> Nova Tarefa
          </button>
          <button
            className="btn btn-secondary btn-block"
            onClick={() => { setShowSubjectManager(true); closeSidebar(); }}
          >
            <FaBook /> Gerenciar Matérias
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <h1>{pageTitle}</h1>
          {activeTab === "tarefas" && (
            <div className="search-box">
              <span className="search-icon"><FaSearch /></span>
              <input
                type="text"
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </header>

        <div className="main-body">
          {activeTab === "tarefas" && (
            <>
              {/* Stat Cards */}
              <div className="stat-cards">
                <div className="stat-card total">
                  <div className="stat-card-icon"><MdSpaceDashboard fill="blue"/></div>
                  <div className="stat-card-label">Total</div>
                  <div className="stat-card-value">{stats.total}</div>
                </div>
                <div className="stat-card pendentes">
                  <div className="stat-card-icon"><FaHourglassEnd fill="yellow"/></div>
                  <div className="stat-card-label">Pendentes</div>
                  <div className="stat-card-value">{stats.pendentes}</div>
                </div>
                <div className="stat-card concluidas">
                  <div className="stat-card-icon"><FaCheckSquare fill="lightgreen"/></div>
                  <div className="stat-card-label">Concluídas</div>
                  <div className="stat-card-value">{stats.concluidas}</div>
                </div>
                <div className="stat-card atrasadas">
                  <div className="stat-card-icon"><IoIosWarning fill="red"/></div>
                  <div className="stat-card-label">Atrasadas</div>
                  <div className="stat-card-value">{stats.atrasadas}</div>
                </div>
              </div>

              {/* Filters */}
              <div className="filters-bar">
                <div className="filter-group">
                  {[
                    { key: "all", label: "Todas" },
                    { key: "pendente", label: "Pendentes" },
                    { key: "concluida", label: "Concluídas" },
                    { key: "atrasada", label: "Atrasadas" },
                  ].map(f => (
                    <button
                      key={f.key}
                      className={`filter-btn ${filterStatus === f.key ? "active" : ""}`}
                      onClick={() => setFilterStatus(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <select
                  className="filter-select"
                  value={filterMateria}
                  onChange={e => setFilterMateria(e.target.value)}
                >
                  <option value="">Todas as matérias</option>
                  {materias.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>

              {/* Task List */}
              <TaskList
                tarefas={filteredTarefas}
                hoje={hoje}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                formatarData={formatarData}
              />
            </>
          )}

          {activeTab === "historico" && (
            <History formatarData={formatarData} />
          )}
        </div>
      </main>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onClose={() => { setShowTaskForm(false); setEditingTask(null); }}
          onSave={handleSaveTask}
          editingTask={editingTask}
          materias={materias}
        />
      )}

      {/* Subject Manager Modal */}
      {showSubjectManager && (
        <SubjectManager
          onClose={() => setShowSubjectManager(false)}
          materias={materias}
          onAdd={handleAddMateria}
          onDelete={handleDeleteMateria}
        />
      )}

      {/* Toast */}
      <Alert
        tipo={alerta.tipo}
        mensagem={alerta.mensagem}
        onClose={() => setAlerta({ tipo: "", mensagem: "" })}
      />
    </div>
  );
}

export default Dashboard;