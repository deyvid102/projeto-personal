import { useState } from "react";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../images/logo-hpathlet.png";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verSenha, setVerSenha] = useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const botaoDesativado = !email || !emailValido || !senha || submitting;

  async function handleLogin(e) {
    e.preventDefault();
    if (submitting) return;

    setErro("");
    setSubmitting(true);

    try {
      // Timeout de segurança para evitar travamentos de rede
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);

      const response = await fetch("http://10.0.0.121:3000/personal", { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) throw new Error("Erro na rede");

      const usuarios = await response.json();
      const usuario = usuarios.find((u) => u.email === email && u.status === 'A');

      if (!usuario) {
        setErro("Credenciais inválidas ou conta pendente.");
        setSubmitting(false);
        return;
      }

      // Validação da senha com bcrypt
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        setErro("E-mail ou senha incorretos.");
        setSubmitting(false);
        return;
      }

      localStorage.setItem("userId", usuario._id);
      
      if (onLogin) {
        onLogin(usuario);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErro(err.name === 'AbortError' ? "Servidor demorou a responder." : "Falha na conexão.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white w-full overflow-x-hidden">
      {/* SEÇÃO DO FORMULÁRIO */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-12">
          
          {/* LOGO AREA - FOCO TOTAL NA MARCA */}
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-center p-2">
              <img 
                src={logo} 
                alt="HP Athlete Logo" 
                className="w-full max-w-[340px] md:max-w-[420px] object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105" 
              />
            </div>
          </div>

          <div className="text-left space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">LOGIN</h1>
            <p className="text-gray-400 font-medium">Bem-vindo de volta, Coach.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* INPUT E-MAIL */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail de acesso</label>
              <input
                type="email"
                placeholder="exemplo@hpathlet.com"
                className={`w-full p-4 bg-gray-50 border ${email && !emailValido ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all duration-300`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* INPUT SENHA */}
            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Senha secreta</label>
              <div className="relative">
                <input
                  type={verSenha ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all duration-300"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setVerSenha(!verSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                >
                  {verSenha ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            {/* MENSAGEM DE ERRO */}
            {erro && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 animate-pulse">
                ⚠️ {erro}
              </div>
            )}

            {/* BOTÃO DE ACESSO */}
            <button
              type="submit"
              disabled={botaoDesativado}
              className={`w-full py-5 rounded-2xl text-white font-black tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl
                ${botaoDesativado ? "bg-gray-200 cursor-not-allowed shadow-none" : "bg-black hover:bg-gray-800 active:scale-[0.97]"}`}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" size={20} />
                  AUTENTICANDO...
                </>
              ) : (
                "ENTRAR NO SISTEMA"
              )}
            </button>

            {/* LINK DE REGISTRO */}
            <div className="text-center pt-6">
              <p className="text-sm text-gray-400">
                Não possui uma conta? 
                <Link
                  to="/register"
                  className="ml-2 text-black font-black border-b-2 border-black hover:bg-black hover:text-white transition-all px-1"
                >
                  REGISTRAR
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* BANNER LATERAL */}
      <div
        className="hidden md:block md:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.5]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-16">
          <h2 className="text-white text-5xl font-black leading-none max-w-sm tracking-tighter">
            FOCO TOTAL NA PERFORMANCE.
          </h2>
          <div className="w-24 h-2 bg-white mt-8 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}