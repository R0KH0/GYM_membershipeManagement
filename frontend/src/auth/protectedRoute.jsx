import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get("api/users/me"); // validates cookie
        setAuth(true);
      } catch {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) return null; // or a spinner

  return auth ? children : <Navigate to="/" replace />; // redirect to login
};

export default AuthGuard;
