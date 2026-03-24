import { Routes, Route } from "react-router-dom";
import DashboardGmHelden1 from "../pages/GMHelden1Lessons/DashboardGmHelden1";
import GmHelden1Lesson1 from "../pages/GMHelden1Lessons/GmHelden1Lesson1";
import GmHelden1Lesson2 from "../pages/GMHelden1Lessons/GmHelden1Lesson2";

const AppRoutesGMHelden1 = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardGmHelden1 />} />
      <Route path="/les-1" element={<GmHelden1Lesson1 />} />
      <Route path="/les-2" element={<GmHelden1Lesson2 />} />
    </Routes>
  );
};

export default AppRoutesGMHelden1;