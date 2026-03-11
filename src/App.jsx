import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import LearningDashboard from "./pages/LearningDashboard"; 
function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/LogIn">Log In</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/LearningDashboard" element={<LearningDashboard />} /> {}
      </Routes>
    </>
  );
}

export default App;