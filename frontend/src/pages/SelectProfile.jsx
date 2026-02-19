import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Dumbbell, ArrowRight } from 'lucide-react';
import logo from "../assets/HP.png";

const SelectProfile = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (selected === 'aluno') {
      navigate('/login-aluno');
    } else if (selected === 'personal') {
      navigate('/login');
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-black">
      
      {/* IMAGEM DE FUNDO */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* CONTAINER CENTRALIZADO - REDUZIDO PARA MOBILE (max-w-[85%]) */}
      <div className="relative z-10 w-full max-w-[85%] sm:max-w-md lg:max-w-lg">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-12 space-y-6 animate-in fade-in zoom-in duration-500">
          
          {/* HEADER COM LOGO */}
          <div className="flex flex-col items-center text-center">
            <img 
              src={logo} 
              alt="HP Athlet" 
              className="w-14 md:w-24 object-contain mb-4" 
            />
            <header className="space-y-1">
              <h1 className="text-lg md:text-3xl font-black text-gray-900 tracking-tighter italic uppercase leading-tight">
                como você quer <br />
                <span className="text-blue-600">acessar o app?</span>
              </h1>
              <p className="text-gray-400 text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em]">
                selecione seu perfil
              </p>
            </header>
          </div>

          {/* OPÇÕES DE SELEÇÃO - MAIS COMPACTAS */}
          <div className="grid grid-cols-1 gap-3">
            {/* Card Personal */}
            <button
              type="button"
              onClick={() => setSelected('personal')}
              className={`relative flex items-center p-3.5 md:p-5 rounded-2xl border-2 transition-all duration-300 group ${
                selected === 'personal'
                  ? 'border-blue-600 bg-blue-50 shadow-lg scale-[1.02]'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl mr-3 transition-colors ${
                selected === 'personal' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 group-hover:text-blue-600'
              }`}>
                <Dumbbell size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="text-left">
                <h3 className={`font-black text-[10px] md:text-xs uppercase tracking-tight ${selected === 'personal' ? 'text-blue-600' : 'text-gray-900'}`}>
                  sou personal
                </h3>
                <p className="hidden sm:block text-[9px] font-medium text-gray-500 uppercase tracking-tighter">gestão de treinos.</p>
              </div>
            </button>

            {/* Card Aluno */}
            <button
              type="button"
              onClick={() => setSelected('aluno')}
              className={`relative flex items-center p-3.5 md:p-5 rounded-2xl border-2 transition-all duration-300 group ${
                selected === 'aluno'
                  ? 'border-black bg-gray-50 shadow-lg scale-[1.02]'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl mr-3 transition-colors ${
                selected === 'aluno' ? 'bg-black text-white' : 'bg-white text-gray-400 group-hover:text-black'
              }`}>
                <User size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="text-left">
                <h3 className={`font-black text-[10px] md:text-xs uppercase tracking-tight ${selected === 'aluno' ? 'text-black' : 'text-gray-900'}`}>
                  sou aluno
                </h3>
                <p className="hidden sm:block text-[9px] font-medium text-gray-500 uppercase tracking-tighter">minha evolução.</p>
              </div>
            </button>
          </div>

          {/* BOTÃO DE AÇÃO */}
          <div className="pt-2">
            <button
              disabled={!selected}
              onClick={handleNavigation}
              className={`w-full py-3 md:py-4 rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl ${
                selected 
                  ? 'bg-black text-white hover:bg-blue-600 active:scale-95 shadow-black/20' 
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
              }`}
            >
              entrar
              <ArrowRight size={14} />
            </button>
          </div>
        </div>     
      </div>
      {/* DETALHE DE DESIGN: BADGE NO CANTO */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
         <span className="text-white/10 text-6xl font-black italic uppercase tracking-tighter select-none">
            HP Athlet
         </span>
      </div>
      </div>
  );
};

export default SelectProfile;