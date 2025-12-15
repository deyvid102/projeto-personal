import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Tela_Personal";
import Alunos from "./pages/Alunos";
import AlunoDetalhe from "./pages/AlunoDetalhe";
import TreinoDetalhe from "./pages/TreinoDetalhe";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // armazenar _id do usuário

  return (
    <BrowserRouter>
      <Routes>

        {/* ROTAS PÚBLICAS */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userId}`} />
            ) : (
              <Login
                onLogin={(user) => {
                  setIsAuthenticated(true);
                  setUserId(user._id);
                }}
              />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={`/${userId}`} />
            ) : (
              <Register />
            )
          }
        />

        {/* ROTAS PRIVADAS */}
        {isAuthenticated ? (
          <Route element={<Layout />}>
            
            {/* Dashboard do personal */}
            <Route path="/:id" element={<Dashboard />} />

            {/* Rota dinâmica para alunos do personal */}
            <Route path="/:id/alunos" element={<Alunos />} />
            <Route path="/:id/alunos/:alunoId" element={<AlunoDetalhe />} />
            <Route
              path="/:id/alunos/:alunoId/treinos/:treinoId"
              element={<TreinoDetalhe />}
            />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
