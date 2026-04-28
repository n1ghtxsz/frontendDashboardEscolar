import { useState, useEffect } from "react";

function TaskList({ tarefas, hoje, onToggle, onEdit, onDelete, formatarData }) {
  const [openBimestres, setOpenBimestres] = useState({});

  const getStatus = (t) => {
    if (t.concluida) return "concluida";
    if (t.data_entrega && new Date(t.data_entrega + "T00:00:00") < hoje) return "atrasada";
    return "pendente";
  };

  // Determine bimestre based on the user's specific end dates
  const getBimestre = (dateStr) => {
    if (!dateStr) return { bimestre: 0, year: 0, key: "sem-data", label: "Sem Data Definida" };
    const date = new Date(dateStr + "T00:00:00");
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-based
    const day = date.getDate();

    // Bimestre end dates (month, day):
    // 1º Bimestre: até 23/04
    // 2º Bimestre: até 03/07
    // 3º Bimestre: até 01/10
    // 4º Bimestre: até 16/12
    let bimestre;
    if (month < 4 || (month === 4 && day <= 23)) {
      bimestre = 1;
    } else if (month < 7 || (month === 7 && day <= 3)) {
      bimestre = 2;
    } else if (month < 10 || (month === 10 && day <= 1)) {
      bimestre = 3;
    } else {
      bimestre = 4;
    }

    return {
      bimestre,
      year,
      key: `${year}-B${bimestre}`,
      label: `${bimestre}º Bimestre — ${year}`,
    };
  };

  // Group tasks by bimestre
  const grouped = {};
  (tarefas || []).forEach(t => {
    const info = getBimestre(t.data_entrega);
    if (!grouped[info.key]) {
      grouped[info.key] = { ...info, tarefas: [] };
    }
    grouped[info.key].tarefas.push(t);
  });

  // Sort groups: current year first, then by bimestre ascending; "sem-data" at end
  const sortedGroups = Object.values(grouped).sort((a, b) => {
    if (a.key === "sem-data") return 1;
    if (b.key === "sem-data") return -1;
    if (a.year !== b.year) return b.year - a.year;
    return a.bimestre - b.bimestre;
  });

  const toggleBimestre = (key) => {
    setOpenBimestres(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Default: open all groups on first load
  useEffect(() => {
    if (sortedGroups.length > 0 && Object.keys(openBimestres).length === 0) {
      const initial = {};
      sortedGroups.forEach(g => { initial[g.key] = true; });
      setOpenBimestres(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tarefas]);

  if (!tarefas || tarefas.length === 0) {
    return (
      <div className="task-list">
        <div className="task-list-empty">
          <div className="empty-icon">📭</div>
          <p>Nenhuma tarefa encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      {sortedGroups.map(group => {
        const isOpen = openBimestres[group.key] !== false;
        const concluidas = group.tarefas.filter(t => t.concluida).length;
        const pendentes = group.tarefas.filter(t => !t.concluida).length;
        const total = group.tarefas.length;

        return (
          <div className="bimestre-section" key={group.key}>
            <div className="bimestre-header" onClick={() => toggleBimestre(group.key)}>
              <h3>{group.label}</h3>
              <span className="bimestre-badge">
                {concluidas}/{total} concluídas · {pendentes} pendentes
              </span>
              <span className={`bimestre-chevron ${isOpen ? "open" : ""}`}>▾</span>
            </div>

            {isOpen && (
              <div className="bimestre-tasks">
                {group.tarefas.map(t => {
                  const status = getStatus(t);
                  return (
                    <div className={`task-card ${status}`} key={t.id}>
                      <button
                        className={`task-checkbox ${t.concluida ? "checked" : ""}`}
                        onClick={() => onToggle(t)}
                        title={t.concluida ? "Reabrir tarefa" : "Concluir tarefa"}
                      >
                        {t.concluida ? "✓" : ""}
                      </button>

                      <div className="task-info">
                        <div className="task-title">{t.titulo}</div>
                        {t.descricao && <div className="task-desc">{t.descricao}</div>}
                        <div className="task-meta">
                          {t.materias?.nome && (
                            <span className="task-badge">{t.materias.nome}</span>
                          )}
                          <span className={`task-date ${status === "atrasada" ? "atrasada" : ""}`}>
                            📅 {formatarData(t.data_entrega)}
                          </span>
                        </div>
                      </div>

                      <div className="task-actions">
                        <button
                          className="task-action-btn"
                          onClick={() => onEdit(t)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="task-action-btn delete"
                          onClick={() => onDelete(t.id)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TaskList;