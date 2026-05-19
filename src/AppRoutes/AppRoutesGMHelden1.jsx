import { Routes, Route } from "react-router-dom";
import DashboardGmHelden1 from "../pages/GMHelden1Lessons/DashboardGmHelden1";
import GmHelden1Lesson1 from "../pages/GMHelden1Lessons/GmHelden1Lesson1";
import GmHelden1Lesson2 from "../pages/GMHelden1Lessons/GmHelden1Lesson2";
import GmHelden1Lesson3 from "../pages/GMHelden1Lessons/GmHelden1Lesson3";
import GmHelden1Lesson4 from "../pages/GMHelden1Lessons/GmHelden1Lesson4";
import GmHelden1Lesson5 from "../pages/GMHelden1Lessons/GmHelden1Lesson5";
import GmHelden1Lesson6 from "../pages/GMHelden1Lessons/GmHelden1Lesson6";
import GmHelden1Lesson7 from "../pages/GMHelden1Lessons/GmHelden1Lesson7";
import GmHelden1Lesson8 from "../pages/GMHelden1Lessons/GmHelden1Lesson8";

const AppRoutesGMHelden1 = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardGmHelden1 />} />
      <Route path="/les-1" element={<GmHelden1Lesson1 />} />
      <Route path="/les-2" element={<GmHelden1Lesson2 />} />
      <Route path="/les-3" element={<GmHelden1Lesson3 />} />
      <Route path="/les-4" element={<GmHelden1Lesson4 />} />
      <Route path="/les-5" element={<GmHelden1Lesson5 />} />
      <Route path="/les-6" element={<GmHelden1Lesson6 />} />
      <Route path="/les-7" element={<GmHelden1Lesson7 />} />
      <Route path="/les-8" element={<GmHelden1Lesson8 />} />
    </Routes>
  );
};

export default AppRoutesGMHelden1;
