import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import SubjectManager from "../components/SubjectManager";
import History from "../components/History";

function Dashboard() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4 mx-auto text-center">SchoolDashboard</h1>

      <div className="row">
        <div className="col-md-4">
          <TaskForm />
          <SubjectManager />
        </div>

        <div className="col-md-8">
          <TaskList />
          <History />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;