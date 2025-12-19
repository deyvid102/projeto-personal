import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../assets/HP.png";
import { FaEye, FaEyeSlash, FaSpinner, FaChevronDown, FaUser, FaEnvelope, FaLock, FaVenusMars } from "react-icons/fa";
import Alert from "../components/Alert";
import { useAlert } from "../components/hooks/useAlert";

export default function Register() {
  const navigate = useNavigate();
  const { alert, showAlert } = useAlert();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repitaSenha, setRepitaSenha] = useState("");
  const [sexo, setSexo] = useState(""); 
  const [submitting, setSubmitting] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  const [showSelect, setShowSelect] = useState(false);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhasCoincidem = senha === repitaSenha;
  const botaoDesativado = !nome || !email || !emailValido || !senha || !senhasCoincidem || submitting;

  const opcoesSexo = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Feminino" },
    { value: "", label: "N/A" } 
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const checkResponse = await fetch("http://localhost:3000/personais");
      const usuarios = await checkResponse.json();
      if (usuarios.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        showAlert("este e-mail já está cadastrado", "error");
        setSubmitting(false);
        return;
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const response = await fetch("http://localhost:3000/personais", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha: senhaHash, sexo, status: "A" }),
      });

      if (!response.ok) throw new Error();
      showAlert("conta criada com sucesso!", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showAlert("erro na conexão.", "error");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white w-full overflow-hidden font-sans">
      <Alert message={alert.message} type={alert.type} />

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <div className="w-full max-w-sm py-4">
          
          {/* logo centralizada e menor - padrão com o login */}
          <div className="flex flex-col items-center mb-8 text-center">
            <img src={logo} alt="HP Athlet" className="w-16 md:w-20 object-contain mb-6" />
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
              Junte-se ao<br /><span className="text-blue-600">Time.</span>
            </h1>
            <p className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-3">
              sua jornada de alta performance
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1 group">
              <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-black">
                Nome Completo
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-2.5" />
                <input 
                  type="text" 
                  placeholder="ex: joão silva"
                  className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none transition-all text-[11px] font-bold"
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 group">
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-black transition-colors">
                  E-mail
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-2.5" />
                  <input 
                    type="email" 
                    placeholder="coach@email.com"
                    className={`w-full p-3 pl-10 bg-gray-50 border ${email && !emailValido ? 'border-red-200' : 'border-gray-100'} rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none text-[11px] font-bold transition-all`}
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors">
                  Sexo
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSelect(!showSelect)}
                    className="w-full p-3 pl-10 pr-8 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none text-left text-[11px] font-bold transition-all flex items-center"
                  >
                    <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-2.5" />
                    <span className={sexo !== "" ? "text-gray-900" : "text-gray-400 uppercase"}>
                      {sexo !== "" ? opcoesSexo.find(o => o.value === sexo)?.label : "sexo"}
                    </span>
                    <FaChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 transition-transform ${showSelect ? 'rotate-180' : ''}`} size={8} />
                  </button>

                  {showSelect && (
                    <div className="absolute z-50 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                      {opcoesSexo.map((op) => (
                        <button
                          key={op.label}
                          type="button"
                          onClick={() => { setSexo(op.value); setShowSelect(false); }}
                          className="w-full p-3 text-left text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 group">
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-black transition-colors">
                  Senha
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-2.5" />
                  <input 
                    type={verSenha ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full p-3 pl-10 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none text-[11px] font-bold transition-all"
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1 group">
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-black transition-colors">
                  Confirmar
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-2.5" />
                  <input 
                    type={verSenha ? "text" : "password"} 
                    placeholder="••••••••"
                    className={`w-full p-3 pl-10 bg-gray-50 border ${senha && repitaSenha && !senhasCoincidem ? 'border-red-200' : 'border-gray-100'} rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none text-[11px] font-bold transition-all`}
                    value={repitaSenha} 
                    onChange={(e) => setRepitaSenha(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setVerSenha(!verSenha)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black"
                  >
                    {verSenha ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={botaoDesativado}
              className={`w-full py-3.5 rounded-xl text-white font-black text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg mt-1 ${
                botaoDesativado 
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none" 
                  : "bg-black hover:bg-blue-600 active:scale-95 shadow-blue-900/10"
              }`}
            >
              {submitting ? <FaSpinner className="animate-spin" size={14} /> : "FINALIZAR CADASTRO"}
            </button>

            <div className="text-center pt-2">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                já possui conta? 
                <Link to="/login" className="ml-2 text-black border-b-2 border-blue-600 hover:text-blue-600 transition-colors">
                  fazer login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop" 
          alt="Performance"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <div className="space-y-4">
            <span className="bg-blue-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest">
              Join the Squad
            </span>
            <h2 className="text-white text-5xl font-black leading-[0.9] tracking-tighter uppercase italic">
              Performance<br />sem limites.
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}