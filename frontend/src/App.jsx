import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Layout from "./layouts/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Tela_Personal";
import Alunos from "./pages/Alunos";
import AlunoDetalhe from "./pages/AlunoDetalhe";
import TreinoDetalhe from "./pages/TreinoDetalhe";
// import Treinos from "./pages/Treinos";
// import Avaliacoes from "./pages/Avaliacoes";
// import Perfil from "./pages/Perfil";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Login onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />

        {isAuthenticated ? (
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/alunos/:id" element={<AlunoDetalhe />} />
            <Route path="/alunos/:id/treinos/:treinoId" element={<TreinoDetalhe />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
