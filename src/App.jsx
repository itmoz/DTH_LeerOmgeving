import { Link } from "react-router-dom";
import AppRoutes from "./AppRoutes/AppRoutes";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/LogIn">Log In</Link>
      </nav>
      <AppRoutes />
    </>
  );
}

export default App;