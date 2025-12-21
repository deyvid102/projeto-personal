import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import AlunoDetalhe from "./pages/AlunoDetalhe";
import TreinoDetalhe from "./pages/TreinoDetalhe";
import Exercicios from "./pages/Exercicios"; // <-- adicione esta importação

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
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

  return (
    <BrowserRouter>
      <Routes>
        {/* rotas públicas */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to={`/${userId}`} /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to={`/${userId}`} /> : <Register />
          }
        />

        {/* rotas privadas */}
        {isAuthenticated ? (
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/:id" element={<Dashboard />} />
            <Route path="/:id/alunos" element={<Alunos />} />
            <Route path="/:id/alunos/:alunoId" element={<AlunoDetalhe />} />
            <Route path="/:id/alunos/:alunoId/treinos/:treinoId" element={<TreinoDetalhe />} />
            <Route path="/:id/exercicios" element={<Exercicios />} /> {/* <-- rota adicionada */}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;