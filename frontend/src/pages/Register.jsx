import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import Alert from "../components/Alert";
import { useAlert } from "../components/hooks/useAlert";
import { Link } from "react-router-dom";
import logo from "../images/logo-athletiq.png";

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repitaSenha, setRepitaSenha] = useState("");
  const [sexo, setSexo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { alert, showAlert } = useAlert();

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const botaoDesativado =
    !nome ||
    !email ||
    !emailValido ||
    !senha ||
    senha !== repitaSenha ||
    submitting;

  async function handleSubmit(e) {
  e.preventDefault();
  if (submitting) return;

  setSubmitting(true);

  try {
    // BUSCA USUARIOS EXISTENTES
    const checkResponse = await fetch("http://localhost:3000/personal");

    if (!checkResponse.ok) {
      throw new Error("Erro ao validar email");
    }

    const usuarios = await checkResponse.json();

    const emailJaExiste = usuarios.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailJaExiste) {
      showAlert("Este email já está cadastrado", "error");
      setSubmitting(false);
      return;
    }

    // HASH DA SENHA
    const senhaHash = await bcrypt.hash(senha, 10);

    // CADASTRO
    const response = await fetch("http://localhost:3000/personal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        senha: senhaHash,
        sexo,
      }),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.message || "Erro interno no servidor");
    }

    showAlert("Cadastro realizado com sucesso!", "success");

    setTimeout(() => navigate("/login"), 2000);

  } catch (err) {
    console.error(err);
    showAlert(err.message || "Erro ao cadastrar", "error");
    setSubmitting(false);
  }
}


  return (
    <div className="min-h-screen flex">
      <Alert message={alert.message} type={alert.type} />

      {/* FORMULÁRIO */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

          {/* LOGO */}
                    <div className="relative">
            <img
              src={logo}
              alt="AthletIQ"
              className="w-200 object-contain ml-0"
            />
          </div>
          

          <h1 className="text-2xl font-bold text-center mb-6">
            REGISTRAR
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome"
              className="w-full mb-3 p-2 border rounded"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <select
              className="w-full mb-4 p-2 border rounded"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
            >
              <option value="" disabled hidden>Sexo</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="">Prefiro não dizer</option>
            </select>

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {!emailValido && email && (
              <p className="text-red-500 text-sm mb-2">Email inválido</p>
            )}

            <input
              type="password"
              placeholder="Senha"
              className="w-full mb-3 p-2 border rounded"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <input
              type="password"
              placeholder="Repita a senha"
              className="w-full mb-4 p-2 border rounded"
              value={repitaSenha}
              onChange={(e) => setRepitaSenha(e.target.value)}
            />

            {senha && repitaSenha && senha !== repitaSenha && (
              <p className="text-red-500 text-sm mb-3">
                As senhas não coincidem
              </p>
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
              {submitting ? "Registrando..." : "Registrar"}
            </button>
          </form>

          <div className="flex justify-center mt-4">
              
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                  Já possui uma conta?
                </span>
                <Link
                  to="/login"
                  className="ml-1 text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
          </div>
        </div>
      </div>

      {/* IMAGEM */}
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
