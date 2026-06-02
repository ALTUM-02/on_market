import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatsCard from "../components/statsCard/statsCard";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ lessons: 0, questions: 0, results: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("lessons/"), api.get("questions/"), api.get("results/")])
      .then(([lessonsResponse, questionsResponse, resultsResponse]) => {
        setStats({
          lessons: lessonsResponse.data.length,
          questions: questionsResponse.data.length,
          results: resultsResponse.data.length,
        });
      })
      .catch(() => {
        setError("Unable to load dashboard data from the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>

      <div className="mb-10">

        <h1 className="text-5xl font-bold">

          CyberSafe Learn

        </h1>

        <p className="text-gray-600 mt-3">

          Learn Cyber Security Interactively

        </p>

      </div>

      {loading && <p className="text-gray-500 mb-6">Loading dashboard data…</p>}
      {error && <p className="text-red-500 mb-6">{error}</p>}

      <div className="grid md:grid-cols-4 gap-6">

        <StatsCard
          title="Lessons"
          value={stats.lessons.toString()}
        />

        <StatsCard
          title="Videos"
          value="5"
        />

        <StatsCard
          title="Quiz Questions"
          value={stats.questions.toString()}
        />

        <StatsCard
          title="Quiz Results"
          value={stats.results.toString()}
        />

        <StatsCard
          title="Certificates"
          value="1"
        />

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;