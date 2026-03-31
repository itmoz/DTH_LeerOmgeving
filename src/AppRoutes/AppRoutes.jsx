import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import Avatar from "../pages/Avatar";
import Register from "../pages/Register";
import LearningDashboard from "../pages/LearningDashboard";
import AppRoutesGMHelden1 from "./AppRoutesGMHelden1";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/LogIn" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/LearningDashboard" element={<LearningDashboard />} />
      <Route path="/GMHelden1/*" element={<AppRoutesGMHelden1 />} />
      <Route path="/Avatar" element={<Avatar />} />
    </Routes>
  );
};

export default AppRoutes;