import { Routes, Route } from "react-router-dom";

import DashboardGmHelden2 from "../pages/GMHelden2Lessons/DashboardGmHelden2";
import GmHelden2Lesson1 from "../pages/GMHelden2Lessons/GmHelden2Lesson1";

const AppRoutesGMHelden2 = () => {
  return (
    <Routes>
        <Route path="/" element={<DashboardGmHelden2 />} />
        <Route path="/les-1" element={<GmHelden2Lesson1 />} />
    </Routes>
  );
}

export default AppRoutesGMHelden2;