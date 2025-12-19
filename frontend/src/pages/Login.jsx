import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../assets/HP.png";
import { FaEye, FaEyeSlash, FaSpinner, FaLock, FaEnvelope } from "react-icons/fa";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verSenha, setVerSenha] = useState(false);

  useEffect(() => {
    if (erro) setErro("");
  }, [email, senha]);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const botaoDesativado = !email || !emailValido || !senha || submitting;

  async function handleLogin(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);
      const response = await fetch("http://localhost:3000/personais", { signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) throw new Error();
      
      const usuarios = await response.json();
      const usuario = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.status === 'A');

      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        setErro("e-mail ou senha incorretos.");
        setSubmitting(false);
        return;
      }

      localStorage.setItem("userId", usuario._id);
      if (onLogin) onLogin(usuario);
    } catch (err) {
      setErro(err.name === 'AbortError' ? "servidor offline." : "falha na conexão.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white w-full overflow-hidden font-sans">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20">
        <div className="w-full max-w-sm">
          
          {/* logo centralizada e menor */}
          <div className="flex flex-col items-center mb-10 text-center">
            <img src={logo} alt="HP Athlet" className="w-16 md:w-20 object-contain mb-6" />
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
              Bem-vindo,<br /><span className="text-blue-600">personal.</span>
            </h1>
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-3">
              acesse sua plataforma de performance
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 group">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-black">
                E-mail Profissional
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input 
                  type="email" 
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className={`w-full p-4 pl-11 bg-gray-50 border ${email && !emailValido ? 'border-red-200' : 'border-gray-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none transition-all text-xs font-bold`}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-end px-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest transition-colors group-focus-within:text-black">
                  Senha
                </label>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input 
                  type={verSenha ? "text" : "password"} 
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none transition-all text-xs font-bold"
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)} 
                  required 
                />
                <Link to="/recovery" className="text-[8px] font-black text-gray-300 hover:text-black uppercase tracking-tighter transition-colors">
                  esqueceu a senha?
                </Link>
                <button 
                  type="button" 
                  onClick={() => setVerSenha(!verSenha)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                >
                  {verSenha ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100">
                {erro}
              </div>
            )}

            <button 
              type="submit" 
              disabled={botaoDesativado}
              className={`w-full py-4 rounded-2xl text-white font-black text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl mt-2 ${
                botaoDesativado 
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none" 
                  : "bg-black hover:bg-blue-600 active:scale-95 shadow-blue-900/10"
              }`}
            >
              {submitting ? <FaSpinner className="animate-spin" size={16} /> : "EFETUAR LOGIN"}
            </button>

            <div className="text-center pt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                novo por aqui? 
                <Link to="/register" className="ml-2 text-black border-b-2 border-blue-600 hover:text-blue-600 transition-colors">
                  criar conta de personal
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <div className="space-y-4">
            <span className="bg-blue-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest">
              High Performance
            </span>
            <h2 className="text-white text-5xl font-black leading-[0.9] tracking-tighter uppercase italic">
              Eleve o nível<br />
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}