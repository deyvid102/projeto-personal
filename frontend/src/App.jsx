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

// IMPORTAÇÃO DO USUARIO LOGIN (EM SRC/USUARIO)
import UsuarioLogin from "./usuario/UsuarioLogin";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserType = localStorage.getItem("userType");
    
    if (storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUserType(storedUserType);
    }
    setLoading(false);
  }, []);

  function handleLogin(user) {
    const type = localStorage.getItem("userType");
    
    localStorage.setItem("userId", user._id);
    setIsAuthenticated(true);
    setUserId(user._id);
    setUserType(type);
  }

  function handleLogout() {
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    setIsAuthenticated(false);
    setUserId(null);
    setUserType(null);
  }

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTA INICIAL: SELEÇÃO DE PERFIL */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              userType === "personal" ? <Navigate to={`/${userId}`} /> : <Navigate to={`/aluno/${userId}`} />
            ) : (
              <SelectProfile />
            )
          } 
        />

        {/* ROTA DE LOGIN DO PERSONAL */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              userType === "personal" ? <Navigate to={`/${userId}`} /> : <Navigate to={`/aluno/${userId}`} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* ROTA DE LOGIN DO ALUNO (CRIADA AGORA) */}
        <Route
          path="/login-aluno"
          element={
            isAuthenticated ? (
              userType === "aluno" ? <Navigate to={`/aluno/${userId}`} /> : <Navigate to={`/${userId}`} />
            ) : (
              <UsuarioLogin />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              userType === "personal" ? <Navigate to={`/${userId}`} /> : <Navigate to={`/aluno/${userId}`} />
            ) : (
              <Register />
            )
          }
        />

        {/* ROTAS PROTEGIDAS PARA PERSONAL */}
        {isAuthenticated && userType === "personal" ? (
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/:personalId" element={<Dashboard />} />
            <Route path="/:personalId/alunos" element={<Alunos />} />
            <Route path="/:personalId/alunos/:alunoId" element={<AlunoDetalhe />} />
            <Route path="/:personalId/alunos/:alunoId/projetos/:projetoId/treinos/:treinoId" element={<TreinoDetalhe />} />
            <Route path="/:personalId/exercicios" element={<Exercicios />} />
            <Route path="/:personalId/alunos/:alunoId/projetos/:projetoId" element={<ProjetoDetalhe />} />
            
            <Route path="*" element={<Navigate to={`/${userId}`} />} />
          </Route>
        ) : isAuthenticated && userType === "aluno" ? (
          /* ROTAS ESPECÍFICAS DO ALUNO */
          <Route path="/aluno/:alunoId" element={<div>tela do aluno em desenvolvimento</div>} />
        ) : (
          /* SE NÃO ESTIVER AUTENTICADO */
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;