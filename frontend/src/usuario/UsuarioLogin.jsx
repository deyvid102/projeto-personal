import { useState, useEffect } from "react";
// CORREÇÃO: Certifique-se de que o useNavigate está aqui
import { useNavigate } from "react-router-dom"; 
import logo from "../assets/HP.png";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import { Hash } from "lucide-react";

export default function UsuarioLogin({ onLogin }) {
  // Agora o hook funcionará corretamente
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState("");
  const [erro, setErro] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Limpa erro ao digitar
  useEffect(() => {
    if (erro) setErro("");
  }, [accessCode]);

  const botaoDesativado = !accessCode || submitting;

  async function handleLogin(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch("http://localhost:3000/alunos", { 
        signal: controller.signal 
      });
      clearTimeout(id);

      if (!response.ok) throw new Error();
      
      const alunos = await response.json();
      
      const aluno = alunos.find(
        (a) => a.codigoAcesso === accessCode.trim() && a.status === 'A'
      );

      if (!aluno) {
        setErro("código de acesso inválido ou expirado.");
        setSubmitting(false);
        return;
      }

      // Chama a função do App.js passando o tipo "aluno"
      if (onLogin) onLogin(aluno, "aluno");
      
      navigate(`/aluno/${aluno._id}`);
    } catch (err) {
      setErro(err.name === 'AbortError' ? "servidor offline." : "falha na conexão.");
      setSubmitting(false);
    }
  }

  return (
    <div className="h-screen flex bg-white w-full overflow-hidden font-sans relative">
      
      {/* BOTÃO VOLTAR */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-[10px] font-black uppercase tracking-widest"
      >
        <FaArrowLeft size={12} /> voltar
      </button>

      {/* LADO ESQUERDO: LOGIN DO ALUNO */}
      <div className="w-full md:w-1/2 flex items-start justify-center pt-16 md:pt-24 px-8">
        <div className="w-full max-w-sm">
          
          <div className="flex flex-col items-center mb-10 text-center">
            <img 
              src={logo} 
              alt="HP Athlet" 
              className="w-24 md:w-32 object-contain mb-4" 
            />

            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-tight">
              Área do<br /><span className="text-blue-600">Aluno.</span>
            </h1>
            <p className="text-gray-400 text-[8px] font-bold uppercase tracking-[0.3em] mt-2">
              insira o código fornecido pelo seu treinador
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 group">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-black">
                Código de Acesso
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 size-4" />
                <input 
                  type="text" 
                  placeholder="EX: HP-1234"
                  className="w-full p-4 pl-11 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-black outline-none transition-all text-sm font-black tracking-widest uppercase"
                  value={accessCode} 
                  onChange={(e) => setAccessCode(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 text-red-500 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-in fade-in zoom-in duration-200">
                {erro}
              </div>
            )}

            <button 
              type="submit" 
              disabled={botaoDesativado}
              className={`w-full py-4 rounded-2xl text-white font-black text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                botaoDesativado 
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none" 
                  : "bg-black hover:bg-blue-600 active:scale-95 shadow-blue-900/10"
              }`}
            >
              {submitting ? <FaSpinner className="animate-spin" size={16} /> : "ACESSAR MEUS TREINOS"}
            </button>

            <div className="text-center pt-4">
              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tight leading-relaxed">
                não possui um código? <br />
                solicite ao seu personal da hp athlet.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* LADO DIREITO: IMAGEM */}
      <div className="hidden md:block md:w-1/2 relative bg-cover bg-center" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')" }}>
            <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <div className="space-y-3">
            <span className="bg-blue-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest">
              High Performance
            </span>
            <h2 className="text-white text-4xl font-black leading-[0.9] tracking-tighter uppercase italic">
              Sua melhor<br />versão começa aqui.
            </h2>
            <div className="w-16 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}