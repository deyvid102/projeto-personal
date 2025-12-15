import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const botaoDesativado = !email || !emailValido || !senha;

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:3000/personal");

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const usuarios = await response.json();

      // valida email e senha
      const usuarioValido = usuarios.find(
        (user) => user.email === email && user.senha === senha
      );

      if (!usuarioValido) {
        setErro("Email ou senha inválidos");
        return;
      }

      // guarda o _id
      localStorage.setItem("userId", usuarioValido._id);

      // opcional: enviar usuário para o estado global
      onLogin(usuarioValido);

      // redireciona para /:id
      navigate(`/${usuarioValido._id}`);
    } catch (err) {
      setErro("Erro ao realizar login");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">LOGIN</h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!emailValido && email && (
            <p className="text-red-500 text-sm">Email inválido</p>
          )}

          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && (
            <p className="text-red-500 text-sm text-center">{erro}</p>
          )}

          <button
            type="submit"
            disabled={botaoDesativado}
            className={`w-full p-2 rounded text-white font-semibold
              ${
                botaoDesativado
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Entrar
          </button>

          <div className="flex justify-center mt-4">
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              Registrar
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
