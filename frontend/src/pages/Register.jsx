import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import logo from "../images/logo-hpathlet.png";
import { FaEye, FaEyeSlash, FaSpinner, FaChevronDown } from "react-icons/fa";
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

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const senhasCoincidem = senha === repitaSenha;
  const botaoDesativado = !nome || !email || !emailValido || !senha || !senhasCoincidem || !sexo || submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const checkResponse = await fetch("http://10.0.0.121:3000/personal");
      const usuarios = await checkResponse.json();
      if (usuarios.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        showAlert("Este e-mail já está cadastrado", "error");
        setSubmitting(false);
        return;
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const response = await fetch("http://10.0.0.121:3000/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha: senhaHash, sexo, status: "A" }),
      });

      if (!response.ok) throw new Error("Falha ao registrar.");
      showAlert("Conta criada com sucesso!", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      showAlert("Erro na conexão.", "error");
      setSubmitting(false);
    }
  }

  return (
    <div className="h-screen flex bg-white w-full overflow-hidden">
      <Alert message={alert.message} type={alert.type} />

      {/* SEÇÃO DO FORMULÁRIO COM SCROLL INTERNO SE NECESSÁRIO */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          
          {/* LOGO REDUZIDA */}
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="HP Athlete Logo" 
              className="w-full max-w-[180px] md:max-w-[220px] object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105" 
            />
          </div>

          <div className="text-left space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Cadastro</h1>
            <p className="text-gray-400 text-sm font-medium">Crie sua conta de Coach agora.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* NOME COMPLETO */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all duration-300 text-sm"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            {/* GRID 1: EMAIL E SEXO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
                <input
                  type="email"
                  placeholder="coach@email.com"
                  className={`w-full p-3.5 bg-gray-50 border ${email && !emailValido ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-sm transition-all`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Sexo</label>
                <div className="relative">
                  <select
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black outline-none appearance-none cursor-pointer text-sm"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    required
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="N">Não Informar</option>
                  </select>
                  <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={10} />
                </div>
              </div>
            </div>

            {/* GRID 2: SENHA E CONFIRMAÇÃO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative">
                  <input
                    type={verSenha ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-sm"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setVerSenha(!verSenha)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                  >
                    {verSenha ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirmar</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full p-3.5 bg-gray-50 border ${senha && repitaSenha && !senhasCoincidem ? 'border-red-400' : 'border-gray-100'} rounded-2xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-sm`}
                  value={repitaSenha}
                  onChange={(e) => setRepitaSenha(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              disabled={botaoDesativado}
              className={`w-full py-4 rounded-2xl text-white font-black tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg mt-2
                ${botaoDesativado ? "bg-gray-200 cursor-not-allowed shadow-none" : "bg-black hover:bg-gray-800 active:scale-[0.98]"}`}
            >
              {submitting ? <FaSpinner className="animate-spin" size={18} /> : "FINALIZAR CADASTRO"}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">
                Já é um Coach da HP? 
                <Link to="/login" className="ml-2 text-black font-black border-b border-black hover:bg-black hover:text-white transition-all px-1">
                  LOGIN
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* BANNER LATERAL MANTIDO */}
      <div
        className="hidden md:block md:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=1600&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-grayscale-[0.5]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-16">
          <h2 className="text-white text-5xl font-black leading-none max-w-sm tracking-tighter uppercase">
            Performance Máxima.
          </h2>
          <div className="w-24 h-2 bg-white mt-8 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}