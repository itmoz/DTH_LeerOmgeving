import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        const res = await fetch("http://localhost:3000/user", {
          credentials: "include"
        });

        if (!isMounted) return;
        setStatus(res.ok ? "authorized" : "unauthorized");
      } catch {
        if (!isMounted) return;
        setStatus("unauthorized");
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "checking") {
    return null;
  }

  if (status === "unauthorized") {
    return <Navigate to="/LogIn" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
