import { useState } from "react";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../assets/logo-hpathlet.png";
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
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);
      const response = await fetch("http://localhost:3000/personal", { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) throw new Error("Erro na rede");
      const usuarios = await response.json();
      const usuario = usuarios.find((u) => u.email === email && u.status === 'A');

      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        setErro("Credenciais inválidas ou conta pendente.");
        setSubmitting(false);
        return;
      }

      localStorage.setItem("userId", usuario._id);
      if (onLogin) onLogin(usuario);
    } catch (err) {
      setErro(err.name === 'AbortError' ? "Servidor demorou a responder." : "Falha na conexão.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white w-full overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" className="w-full max-w-[350px] object-contain transition-transform hover:scale-105" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter">LOGIN</h1>
            <p className="text-gray-400 text-sm font-medium">Bem-vindo de volta, Coach.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <input type="email" placeholder="exemplo@hpathlet.com"
                className={`w-full p-3.5 bg-gray-50 border ${email && !emailValido ? 'border-red-400' : 'border-gray-100'} rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all`}
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1 relative">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <input type={verSenha ? "text" : "password"} placeholder="••••••••"
                  className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  value={senha} onChange={(e) => setSenha(e.target.value)} required />
                <button type="button" onClick={() => setVerSenha(!verSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black">
                  {verSenha ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {erro && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100"> {erro}</div>}

            <button type="submit" disabled={botaoDesativado}
              className={`w-full py-4 rounded-xl text-white font-black tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg ${botaoDesativado ? "bg-gray-200 cursor-not-allowed" : "bg-black hover:bg-gray-800 active:scale-[0.98]"}`}>
              {submitting ? <FaSpinner className="animate-spin" size={18} /> : "ENTRAR"}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">Não possui uma conta? 
                <Link to="/register" className="ml-2 text-black font-black border-b-2 border-black hover:bg-black hover:text-white transition-all px-1">REGISTRAR</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.5]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent flex flex-col justify-end p-12">
          <h2 className="text-white text-4xl font-black leading-none max-w-xs tracking-tighter">FOCO TOTAL NA PERFORMANCE.</h2>
          <div className="w-16 h-1.5 bg-white mt-6 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}