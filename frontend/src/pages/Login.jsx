import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../assets/HP.png";
import { FaEye, FaEyeSlash, FaSpinner, FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function Login({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [verSenha, setVerSenha] = useState(false);

  useEffect(() => {
    if (location.state?.emailPreenchido) setEmail(location.state.emailPreenchido);
    if (location.state?.senhaPreenchida) setSenha(location.state.senhaPreenchida);
  }, [location.state]);

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
      localStorage.setItem("userType", "personal");
      if (onLogin) onLogin(usuario);
    } catch (err) {
      setErro(err.name === 'AbortError' ? "servidor offline." : "falha na conexão.");
      setSubmitting(false);
    }
  }

  return (
    <div className="h-screen flex bg-white w-full overflow-hidden font-sans relative">
      
      <button 
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest"
      >
        <FaArrowLeft size={10} /> voltar
      </button>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          
          <div className="flex flex-col items-center mb-6 md:mb-10 text-center">
            <img src={logo} alt="HP Athlet" className="w-20 md:w-32 object-contain mb-4" />
            <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-tight">
              Bem-vindo,<br /><span className="text-blue-600">personal.</span>
            </h1>
            <p className="hidden xs:block text-gray-400 text-[8px] font-bold uppercase tracking-[0.3em] mt-2">
              acesse sua plataforma de performance
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1 group">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-black">
                E-mail Profissional
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input 
                  type="email" 
                  placeholder="seu@email.com"
                  className={`w-full p-3 pl-11 bg-gray-50 border ${email && !emailValido ? 'border-red-200' : 'border-gray-100'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none transition-all text-xs font-bold`}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1 group">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-black">
                Senha
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input 
                  type={verSenha ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full p-3 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none transition-all text-xs font-bold"
                  value={senha} 
                  onChange={(e) => setSenha(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setVerSenha(!verSenha)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black"
                >
                  {verSenha ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              <div className="flex justify-end px-1">
                <Link to="/recovery" className="text-[8px] font-black text-gray-300 hover:text-black uppercase">
                  esqueceu a senha?
                </Link>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 text-red-500 p-3 rounded-2xl text-[10px] font-black uppercase border border-red-100">
                {erro}
              </div>
            )}

            <button 
              type="submit" 
              disabled={botaoDesativado}
              className={`w-full py-3.5 rounded-2xl text-white font-black text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                botaoDesativado ? "bg-gray-100 text-gray-300" : "bg-black hover:bg-blue-600 shadow-xl"
              }`}
            >
              {submitting ? <FaSpinner className="animate-spin" size={16} /> : "ENTRAR"}
            </button>

            <div className="text-center pt-2">
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                novo por aqui? 
                <Link to="/register" className="ml-2 text-black border-b-2 border-blue-600">
                  criar conta
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="space-y-3">
            <span className="bg-blue-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest">HP Athlet</span>
            <h2 className="text-white text-4xl font-black uppercase italic">Eleve o nível.</h2>
            <div className="w-16 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}