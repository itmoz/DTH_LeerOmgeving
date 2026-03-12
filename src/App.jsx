import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import LearningDashboard from "./pages/LearningDashboard"; 
import Avatar from "./pages/Avatar";
function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/LogIn">Log In</Link> |{" "}
        <Link to="/Avatar">My Avatar</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/LearningDashboard" element={<LearningDashboard />} />
        <Route path="/Avatar" element={<Avatar />} />
      </Routes>
    </>
  );
}

export default App;