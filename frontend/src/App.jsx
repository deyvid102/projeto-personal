import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import AlunoDetalhe from "./pages/AlunoDetalhe";
import ProjetoDetalhe from "./pages/ProjetoDetalhe";
import TreinoDetalhe from "./pages/TreinoDetalhe";
import Exercicios from "./pages/Exercicios";
import SelectProfile from "./pages/SelectProfile";
import UsuarioLogin from "./usuario/UsuarioLogin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserType = localStorage.getItem("userType");
    
    if (storedUserId && storedUserType) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUserType(storedUserType);
    }
    setLoading(false);
  }, []);

  // Alterado para receber o tipo explicitamente
  function handleLogin(user, type) {
    localStorage.setItem("userId", user._id);
    localStorage.setItem("userType", type);
    setIsAuthenticated(true);
    setUserId(user._id);
    setUserType(type);
  }

  function handleLogout() {
    localStorage.clear(); // Limpa tudo de uma vez
    setIsAuthenticated(false);
    setUserId(null);
    setUserType(null);
  }

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={
          isAuthenticated ? (
            userType === "personal" ? <Navigate to={`/${userId}`} /> : <Navigate to={`/aluno/${userId}`} />
          ) : <SelectProfile />
        } />

        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={(u) => handleLogin(u, "personal")} />
        } />

        <Route path="/login-aluno" element={
          isAuthenticated ? <Navigate to="/" /> : <UsuarioLogin onLogin={(u) => handleLogin(u, "aluno")} />
        } />

        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" /> : <Register />
        } />

        {/* ROTAS PROTEGIDAS - PERSONAL */}
        {isAuthenticated && userType === "personal" && (
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/:personalId" element={<Dashboard />} />
            <Route path="/:personalId/alunos" element={<Alunos />} />
            <Route path="/:personalId/alunos/:alunoId" element={<AlunoDetalhe />} />
            <Route path="/:personalId/alunos/:alunoId/projetos/:projetoId/treinos/:treinoId" element={<TreinoDetalhe />} />
            <Route path="/:personalId/exercicios" element={<Exercicios />} />
            <Route path="/:personalId/alunos/:alunoId/projetos/:projetoId" element={<ProjetoDetalhe />} />
          </Route>
        )}

        {/* ROTAS PROTEGIDAS - ALUNO */}
        {isAuthenticated && userType === "aluno" && (
          <Route path="/aluno/:alunoId" element={<div>Tela do Aluno em Desenvolvimento - ID: {userId}</div>} />
        )}

        {/* REDIRECIONAMENTO GLOBAL PARA NÃO AUTENTICADOS */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;