import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Dumbbell, ArrowRight } from 'lucide-react';
import logo from "../assets/HP.png";

const SelectProfile = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (selected === 'aluno') {
      // Navega para a rota do UsuarioLogin
      navigate('/login-aluno');
    } else if (selected === 'personal') {
      // Navega para a rota do Login de Personal
      navigate('/login');
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* IMAGEM DE FUNDO COM OVERLAY ESCURO - SEM BLUR */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* CONTAINER CENTRALIZADO */}
      <div className="relative z-10 w-full max-w-lg p-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8 animate-in fade-in zoom-in duration-500">
          
          {/* HEADER COM LOGO */}
          <div className="flex flex-col items-center text-center">
            <img 
              src={logo} 
              alt="HP Athlet" 
              className="w-20 md:w-28 object-contain mb-6" 
            />
            <header className="space-y-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-tight">
                como você quer <br />
                <span className="text-blue-600">acessar o app?</span>
              </h1>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                selecione seu perfil de acesso
              </p>
            </header>
          </div>

          {/* OPÇÕES DE SELEÇÃO */}
          <div className="grid grid-cols-1 gap-4">
            {/* Card Personal */}
            <button
              type="button"
              onClick={() => setSelected('personal')}
              className={`relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 group ${
                selected === 'personal'
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <div className={`p-3.5 rounded-xl mr-4 transition-colors ${
                selected === 'personal' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 group-hover:text-blue-600'
              }`}>
                <Dumbbell size={24} />
              </div>
              <div className="text-left">
                <h3 className={`font-black text-xs uppercase tracking-tight ${selected === 'personal' ? 'text-blue-600' : 'text-gray-900'}`}>
                  sou personal
                </h3>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">gestão de alunos e treinos.</p>
              </div>
            </button>

            {/* Card Aluno */}
            <button
              type="button"
              onClick={() => setSelected('aluno')}
              className={`relative flex items-center p-5 rounded-2xl border-2 transition-all duration-300 group ${
                selected === 'aluno'
                  ? 'border-black bg-gray-50 shadow-lg'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <div className={`p-3.5 rounded-xl mr-4 transition-colors ${
                selected === 'aluno' ? 'bg-black text-white' : 'bg-white text-gray-400 group-hover:text-black'
              }`}>
                <User size={24} />
              </div>
              <div className="text-left">
                <h3 className={`font-black text-xs uppercase tracking-tight ${selected === 'aluno' ? 'text-black' : 'text-gray-900'}`}>
                  sou aluno
                </h3>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">meu plano e evolução.</p>
              </div>
            </button>
          </div>

          {/* BOTÃO DE AÇÃO */}
          <div className="pt-2">
            <button
              disabled={!selected}
              onClick={handleNavigation}
              className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl ${
                selected 
                  ? 'bg-black text-white hover:bg-blue-600 active:scale-95 shadow-black/20' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
              }`}
            >
              entrar na plataforma
              <ArrowRight size={18} />
            </button>
          </div>

          {/* FOOTER DISCRETO */}
          <p className="text-center text-gray-300 text-[9px] font-black uppercase tracking-widest">
            hp athlet — high performance system
          </p>
        </div>
      </div>

      {/* DETALHE DE DESIGN: BADGE NO CANTO */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
         <span className="text-white/20 text-6xl font-black italic uppercase tracking-tighter select-none">
            HP Athlet
         </span>
      </div>

    </div>
  );
};

export default SelectProfile;