import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import AlunoDetalhe from "./pages/AlunoDetalhe";
import TreinoDetalhe from "./pages/TreinoDetalhe";
import Exercicios from "./pages/Exercicios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
    setLoading(false);
  }, []);

  function handleLogin(user) {
    localStorage.setItem("userId", user._id);
    setIsAuthenticated(true);
    setUserId(user._id);
  }

  function handleLogout() {
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserId(null);
  }

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to={`/${userId}`} /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to={`/${userId}`} /> : <Register />}
        />

        {isAuthenticated ? (
          <Route element={<Layout onLogout={handleLogout} />}>
            {/* alterado de :id para :personalId para clareza */}
            <Route path="/:personalId" element={<Dashboard />} />
            <Route path="/:personalId/alunos" element={<Alunos />} />
            <Route path="/:personalId/alunos/:alunoId" element={<AlunoDetalhe />} />
            <Route path="/:personalId/alunos/:alunoId/treinos/:treinoId" element={<TreinoDetalhe />} />
            <Route path="/:personalId/exercicios" element={<Exercicios />} />
            
            <Route path="*" element={<Navigate to={`/${userId}`} />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;