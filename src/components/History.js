import { useEffect, useState } from "react";
import api from "../services/api";

function History({ formatarData }) {
  const [dados, setDados] = useState([]);
  const [openBimestres, setOpenBimestres] = useState({});

  useEffect(() => {
    api.get("/historico").then(res => setDados(res.data || []));
  }, []);

  // Group by bimestre
  const getBimestre = (dateStr) => {
    if (!dateStr) return { bimestre: 0, year: 0, key: "sem-data", label: "Sem Data Definida" };
    const date = new Date(dateStr + "T00:00:00");
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Bimestre end dates:
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

  const grouped = {};
  dados.forEach(t => {
    const info = getBimestre(t.data_entrega);
    if (!grouped[info.key]) {
      grouped[info.key] = { ...info, tarefas: [] };
    }
    grouped[info.key].tarefas.push(t);
  });

  // Sort groups: most recent first, "sem-data" at end
  const sortedGroups = Object.values(grouped).sort((a, b) => {
    if (a.key === "sem-data") return 1;
    if (b.key === "sem-data") return -1;
    if (a.year !== b.year) return b.year - a.year;
    return b.bimestre - a.bimestre;
  });

  const toggleBimestre = (key) => {
    setOpenBimestres(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Default: open first group
  useEffect(() => {
    if (sortedGroups.length > 0 && Object.keys(openBimestres).length === 0) {
      setOpenBimestres({ [sortedGroups[0].key]: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dados]);

  if (dados.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">📅</div>
        <p>Nenhuma tarefa no histórico</p>
      </div>
    );
  }

  return (
    <div>
      {sortedGroups.map(group => {
        const isOpen = openBimestres[group.key] !== false;
        const concluidas = group.tarefas.filter(t => t.concluida).length;
        const total = group.tarefas.length;

        return (
          <div className="bimestre-section" key={group.key}>
            <div className="bimestre-header" onClick={() => toggleBimestre(group.key)}>
              <h3>{group.label}</h3>
              <span className="bimestre-badge">
                {concluidas}/{total} concluídas
              </span>
              <span className={`bimestre-chevron ${isOpen ? "open" : ""}`}>▾</span>
            </div>

            {isOpen && (
              <div className="bimestre-tasks">
                {group.tarefas.map(t => (
                  <div
                    className={`task-card ${t.concluida ? "concluida" : "pendente"}`}
                    key={t.id}
                  >
                    <div
                      className={`task-checkbox ${t.concluida ? "checked" : ""}`}
                      style={{ cursor: "default" }}
                    >
                      {t.concluida ? "✓" : ""}
                    </div>
                    <div className="task-info">
                      <div className="task-title">{t.titulo}</div>
                      {t.descricao && <div className="task-desc">{t.descricao}</div>}
                      <div className="task-meta">
                        {t.materias?.nome && (
                          <span className="task-badge">{t.materias.nome}</span>
                        )}
                        <span className="task-date">
                          📅 {formatarData(t.data_entrega)}
                        </span>
                        <span className="task-badge" style={{
                          background: t.concluida ? "var(--success-bg)" : "var(--warning-bg)",
                          color: t.concluida ? "var(--success)" : "var(--warning)",
                        }}>
                          {t.concluida ? "Concluída" : "Pendente"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default History;