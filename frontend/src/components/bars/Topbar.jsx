import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  FaSearch, FaUserCircle, FaBell, FaSignOutAlt, 
  FaUserCog, FaChevronDown, FaUserGraduate, FaDumbbell 
} from "react-icons/fa";

export default function Topbar({ onLogout }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [nomeExibicao, setNomeExibicao] = useState("Carregando..."); 
  
  const menuRef = useRef(null);
  const buscaRef = useRef(null);
  const { id: personalId } = useParams();

  // Busca o nome completo do personal usando o "userId" do login
  useEffect(() => {
    const idLogado = localStorage.getItem("userId");

    if (idLogado) {
      fetch(`http://localhost:3000/personal/${idLogado}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.nome) {
            // Lógica para pegar Nome e Sobrenome
            const partes = data.nome.trim().split(/\s+/);
            const formatado = partes.length > 1 
              ? `${partes[0]} ${partes[1]}` 
              : partes[0];
            
            setNomeExibicao(formatado);
          }
        })
        .catch((err) => {
          console.error("Erro ao carregar personal:", err);
          setNomeExibicao("Personal Trainer");
        });
    }
  }, []);

  // Bloqueia o scroll da página quando a pesquisa está ativa
  useEffect(() => {
    if (mostrarResultados && busca.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [mostrarResultados, busca]);

  useEffect(() => {
    fetch(`http://localhost:3000/alunos`)
      .then((res) => res.json())
      .then((data) => setAlunos(data))
      .catch((err) => console.error("Erro ao carregar alunos:", err));
  }, []);

  useEffect(() => {
    if (busca.trim() === "") {
      setResultados([]);
      return;
    }
    const filtrados = alunos.filter((aluno) =>
      aluno.nome.toLowerCase().includes(busca.toLowerCase())
    );
    setResultados(filtrados);
  }, [busca, alunos]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuAberto(false);
      if (buscaRef.current && !buscaRef.current.contains(event.target)) setMostrarResultados(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executarLogout = () => {
    if (onLogout) onLogout();
    setMenuAberto(false);
  };

  return (
    <header className="fixed top-0 right-0 md:left-64 left-0 h-20 bg-white/95 backdrop-blur-md border-b border-gray-100 z-40 flex items-center justify-between px-8 transition-all duration-300">
      
      {/* Lado Esquerdo: Busca */}
      <div className="flex-1 max-w-md relative" ref={buscaRef}>
        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-black transition-colors">
            <FaSearch size={14} />
          </span>
          <input
            type="text"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setMostrarResultados(true);
            }}
            onFocus={() => setMostrarResultados(true)}
            placeholder="Buscar aluno ou treino..."
            className="w-full bg-gray-100/50 border border-transparent py-2.5 pl-11 pr-4 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all duration-300"
          />
        </div>

        {/* Resultados da Busca */}
        {mostrarResultados && busca.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-80 overflow-y-auto overscroll-contain">
              {resultados.length > 0 ? (
                resultados.map((aluno) => (
                  <Link
                    key={aluno._id}
                    to={`/aluno/${aluno._id}`}
                    onClick={() => { setBusca(""); setMostrarResultados(false); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-black group transition-colors border-b border-gray-50 last:border-none"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-white group-hover:text-black transition-colors">
                      <FaUserGraduate size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-800 tracking-tighter group-hover:text-white">{aluno.nome}</p>
                      <p className="text-[10px] text-gray-400 font-bold group-hover:text-gray-300 uppercase">ver ficha completa</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-5 py-6 text-center text-sm text-gray-400 italic">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lado Direito: Ações */}
      <div className="flex items-center gap-5">
        <button className="relative p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
          <FaBell size={19} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setMenuAberto(!menuAberto)}
            className={`flex items-center gap-3 p-1.5 pr-3 rounded-full transition-all border ${
              menuAberto ? 'bg-white border-black shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-50'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white shadow-md">
              <FaUserCircle size={20} />
            </div>

            <div className="text-left hidden sm:block">
              {/* Agora exibe apenas Nome e Sobrenome, sem o "Coach" */}
              <p className="text-xs font-black text-gray-900 leading-tight tracking-tighter uppercase">{nomeExibicao}</p>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Personal Trainer</p>
            </div>
            
            <FaChevronDown size={10} className={`text-gray-400 transition-transform ${menuAberto ? 'rotate-180' : ''}`} />
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="px-4 py-2 border-b border-gray-50 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Minha conta
              </div>
              <Link 
                to="/profile" 
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-black hover:text-white transition-all tracking-tighter"
              >
                <FaUserCog size={14} />
                Meu Perfil
              </Link>
              <div className="h-px bg-gray-100 my-1 mx-4"></div>
              <button 
                onClick={executarLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all tracking-tighter"
              >
                <FaSignOutAlt size={14} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}