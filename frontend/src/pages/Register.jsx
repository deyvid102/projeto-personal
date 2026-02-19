import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../assets/HP.png";
import { FaEye, FaEyeSlash, FaSpinner, FaChevronDown, FaUser, FaEnvelope, FaLock, FaVenusMars, FaArrowLeft } from "react-icons/fa";
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
      navigate("/login", { state: { emailPreenchido: email, senhaPreenchida: senha } });
    } catch (err) {
      showAlert("erro na conexão.", "error");
      setSubmitting(false);
    }
  }

  return (
    <div className="h-screen flex bg-white w-full overflow-hidden font-sans relative">
      <Alert message={alert.message} type={alert.type} />

      <button onClick={() => navigate("/")} className="absolute top-4 left-4 z-10 flex items-center gap-2 text-gray-400 hover:text-black text-[10px] font-black uppercase tracking-widest">
        <FaArrowLeft size={10} /> voltar
      </button>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          
          <div className="flex flex-col items-center mb-6 text-center">
            <img src={logo} alt="HP Athlet" className="w-16 md:w-24 object-contain mb-3" />
            <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-tight">
              Junte-se ao<br /><span className="text-blue-600">Time.</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
            <div className="space-y-1 group">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                <input 
                  type="text" 
                  placeholder="ex: joão silva"
                  className="w-full p-3 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white text-xs font-bold outline-none transition-all"
                  value={nome} onChange={(e) => setNome(e.target.value)} required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              <div className="space-y-1 group">
                <label className="text-[9px] font-black text-gray-400 uppercase">E-mail</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                  <input 
                    type="email" placeholder="coach@email.com"
                    className="w-full p-3 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white text-xs font-bold outline-none"
                    value={email} onChange={(e) => setEmail(e.target.value)} required 
                  />
                </div>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[9px] font-black text-gray-400 uppercase">Sexo</label>
                <button
                  type="button"
                  onClick={() => setShowSelect(!showSelect)}
                  className="w-full p-3 pl-11 bg-gray-50 border border-gray-100 rounded-2xl text-left text-xs font-bold flex items-center relative"
                >
                  <FaVenusMars className="absolute left-4 text-gray-300 size-3" />
                  <span className={sexo ? "text-gray-900" : "text-gray-400 uppercase"}>{sexo ? opcoesSexo.find(o => o.value === sexo)?.label : "sexo"}</span>
                  <FaChevronDown className="absolute right-3 text-gray-300" size={10} />
                </button>
                {showSelect && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                    {opcoesSexo.map((op) => (
                      <button key={op.label} type="button" onClick={() => { setSexo(op.value); setShowSelect(false); }} className="w-full p-2.5 text-left text-[9px] font-black uppercase hover:bg-gray-50 transition-colors">
                        {op.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              <div className="space-y-1 group">
                <label className="text-[9px] font-black text-gray-400 uppercase">Senha</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                  <input 
                    type={verSenha ? "text" : "password"} placeholder="••••••••"
                    className="w-full p-3 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white text-xs font-bold outline-none"
                    value={senha} onChange={(e) => setSenha(e.target.value)} required 
                  />
                </div>
              </div>
              <div className="space-y-1 group">
                <label className="text-[9px] font-black text-gray-400 uppercase">Confirmar</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-3" />
                  <input 
                    type={verSenha ? "text" : "password"} placeholder="••••••••"
                    className={`w-full p-3 pl-11 bg-gray-50 border ${senha && repitaSenha && !senhasCoincidem ? 'border-red-200' : 'border-gray-100'} rounded-2xl focus:bg-white text-xs font-bold outline-none`}
                    value={repitaSenha} onChange={(e) => setRepitaSenha(e.target.value)} required 
                  />
                  <button type="button" onClick={() => setVerSenha(!verSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black">
                    {verSenha ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" disabled={botaoDesativado}
              className={`w-full py-3.5 rounded-2xl text-white font-black text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                botaoDesativado ? "bg-gray-100 text-gray-300" : "bg-black hover:bg-blue-600 shadow-xl"
              }`}
            >
              {submitting ? <FaSpinner className="animate-spin" size={16} /> : "FINALIZAR CADASTRO"}
            </button>

            <div className="text-center pt-2">
              <p className="text-[9px] font-bold text-gray-400 uppercase">
                já possui conta? <Link to="/login" className="ml-2 text-black border-b-2 border-blue-600">login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="space-y-3">
            <span className="bg-blue-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest">HP Athlet</span>
            <h2 className="text-white text-4xl font-black uppercase italic">Performance sem limites.</h2>
            <div className="w-16 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

