import { useState } from "react";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repitaSenha, setRepitaSenha] = useState("");
  const [sexo, setSexo] = useState("");
  const [loading, setLoading] = useState(false);

  // valida formato de email
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // regra geral para habilitar/desabilitar botão
  const botaoDesativado =
    !nome ||
    !email ||
    !emailValido ||
    !senha ||
    senha !== repitaSenha ||
    loading;

  // ✅ MÉTODO POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar");
      }

      const data = await response.json();
      console.log("Usuário cadastrado:", data);

      alert("Cadastro realizado com sucesso!");

      // limpar formulário
      setNome("");
      setEmail("");
      setSenha("");
      setRepitaSenha("");

    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">REGISTRAR</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome"
            className="w-full mb-3 p-2 border rounded"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {!emailValido && email && (
            <p className="text-red-500 text-sm mb-2">
              Email inválido
            </p>
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

          <select
            name="sexo"
            className="w-full mb-4 p-2 border rounded"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="" disabled hidden>
              Sexo
            </option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="">Prefiro não dizer</option>
          </select>

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
              }
            `}
          >
            {loading ? "Salvando..." : "Registrar"}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 underline underline-offset-4"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
