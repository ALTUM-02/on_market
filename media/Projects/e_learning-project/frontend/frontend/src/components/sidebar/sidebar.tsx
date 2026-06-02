import {
  FiHome,
  FiBook,
  FiVideo,
  FiShield,
  FiBarChart2,
  FiInfo,
} from "react-icons/fi";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-10">
        CyberSafe
      </h1>

      <nav className="space-y-4">

        <Link
          to="/"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FiHome />
          Dashboard
        </Link>

        <Link
          to="/lessons"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FiBook />
          Lessons
        </Link>

        <Link
          to="/multimedia"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FiVideo />
          Multimedia
        </Link>

        <Link
          to="/quiz"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FiShield />
          Quiz
        </Link>

        <Link
          to="/results"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FiBarChart2 />
          Results
        </Link>

        <Link
          to="/about"
          className="flex items-center gap-3 hover:text-cyan-400"
        >
          <FiInfo />
          About
        </Link>

      </nav>
    </aside>
  );
};

export default Sidebar;