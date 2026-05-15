import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LogIn from "../pages/LogIn";
import Avatar from "../pages/Avatar";
import Register from "../pages/Register";
import LearningDashboard from "../pages/LearningDashboard";
import AppRoutesGMHelden1 from "./AppRoutesGMHelden1";
import AppRoutesGMHelden2 from "./AppRoutesGMHelden2";
import AppRoutesGMHelden3 from "./AppRoutesGMHelden3";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/LogIn" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/LearningDashboard" element={<LearningDashboard />} />
        <Route path="/GMHelden1/*" element={<AppRoutesGMHelden1 />} />
        <Route path="/GMHelden2/*" element={<AppRoutesGMHelden2 />} />
        <Route path="/GMHelden3/*" element={<AppRoutesGMHelden3 />} />
        <Route path="/Avatar" element={<Avatar />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;