import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Lessons from "../pages/Lessons";
import Home from "../pages/Home";
import Quiz from "../pages/Quiz";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path="/multimedia" element={<Home />} />
      <Route path="/quiz" element={<Home />} />
      <Route path="/results" element={<Home />} />
      <Route path="/about" element={<Home />} />
      <Route path="*" element={<Home />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  );
};

export default AppRoutes;