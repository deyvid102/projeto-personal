import { useState } from "react";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../images/logo-hpathlet.png";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const botaoDesativado = !email || !emailValido || !senha || submitting;

  async function handleLogin(e) {
  e.preventDefault();
  if (submitting) return;

  setErro("");
  setSubmitting(true);

  try {
    const response = await fetch("http://10.0.0.121:3000/personal");
    if (!response.ok) throw new Error("Erro ao buscar usuários");

    const usuarios = await response.json();

    // encontra usuário pelo email e verifica se o status é 'A'
    const usuario = usuarios.find((u) => u.email === email && u.status == 'A');

    if (!usuario) {
      setErro("Email ou senha inválidos ou usuário não autorizado");
      setSubmitting(false);
      return;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      setErro("Email ou senha inválidos");
      setSubmitting(false);
      return;
    }

    localStorage.setItem("userId", usuario._id);
    onLogin(usuario);
  } catch (err) {
    console.error(err);
    setErro("Erro ao realizar login");
    setSubmitting(false);
  }
}

  return (
    <div className="min-h-screen flex">

      {/* FORMULÁRIO */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50"> 
        <div className="w-full max-w-md bg-white p-4 rounded-xl shadow-md">

          {/* LOGO */}
          <div className="relative">
            <img
              src={logo}
              className="w-100 p--1 object-contain"
            />
          </div>

          <h1 className="text-2xl mt-10 font-bold text-center mb-6">
            LOGIN
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!emailValido && email && (
              <p className="text-red-500 text-sm">Email inválido</p>
            )}

            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black-500"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && (
              <p className="text-red-500 text-sm text-center">{erro}</p>
            )}

            <button
              type="submit"
              disabled={botaoDesativado}
              className={`w-full p-3 rounded-md text-white font-semibold transition
                ${botaoDesativado ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-600"}`}
            >
              {submitting ? "Entrando..." : "Entrar"}
            </button>

            {/* LINK PARA REGISTRO */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Ainda não tem conta?
              </span>
              <Link
                to="/register"
                className="ml-1 text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 "
              >
                Registrar
              </Link>
            </div>

          </form>
        </div>
      </div>

      {/* IMAGEM LATERAL */}
      <div
        className="hidden md:block md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
    </div>
  );
}
