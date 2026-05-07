import { Routes, Route } from "react-router-dom";
import DashboardGmHelden3 from "../pages/GMHelden3Lessons/DashboardGmHelden3";
import GmHelden3Lesson1 from "../pages/GMHelden3Lessons/GMHelden3Lesson1";
import GmHelden3Lesson2 from "../pages/GMHelden3Lessons/GMHelden3Lesson2";
import GmHelden3LessonGD1 from "../pages/GMHelden3Lessons/GMHelden3LessonGD1";
import GmHelden3LessonGD2 from "../pages/GMHelden3Lessons/GMHelden3LessonGD2";
import GmHelden3LessonPE1 from "../pages/GMHelden3Lessons/GMHelden3LessonPE1";
import GmHelden3LessonPE2 from "../pages/GMHelden3Lessons/GMHelden3LessonPE2";
import GmHelden3LessonLD1 from "../pages/GMHelden3Lessons/GMHelden3LessonLD1";
import GmHelden3LessonLD2 from "../pages/GMHelden3Lessons/GMHelden3LessonLD2";

const AppRoutesGMHelden3 = () => {
  return (
    <Routes>
        <Route path="/" element={<DashboardGmHelden3 />} />
        <Route path="/les-1" element={<GmHelden3Lesson1 />} />
        <Route path="/les-2" element={<GmHelden3Lesson2 />} />
        <Route path="/les-gd-1" element={<GmHelden3LessonGD1 />} />
        <Route path="/les-gd-2" element={<GmHelden3LessonGD2 />} />
        <Route path="/les-pe-1" element={<GmHelden3LessonPE1 />} />
        <Route path="/les-pe-2" element={<GmHelden3LessonPE2 />} />
        <Route path="/les-ld-1" element={<GmHelden3LessonLD1 />} />
        <Route path="/les-ld-2" element={<GmHelden3LessonLD2 />} />
    </Routes>
    );
}

export default AppRoutesGMHelden3;